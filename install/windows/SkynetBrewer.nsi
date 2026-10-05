; Skynet Brewer installer for Windows (MIT License, Copyright (c) OakBarn Brewery 2026)
;
; Puts the Skynet Brew Panel in C:\Brewing\BrewPanel (changeable), writes Skynet_Brewer.bat there,
; and adds a "Skynet Brewer" shortcut to the Desktop and the Start menu.
; On an update it keeps the data folder and your layout (config\brewery.json).
;
; Build it with tools/build-release.sh (needs NSIS: "sudo apt install nsis" on Linux), which passes:
;   -DSRC=<folder holding the panel files>  -DVERSION=<version>  -DOUTFILE=<setup .exe to write>

Unicode true
!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh"
!include "WordFunc.nsh"

!ifndef SRC
  !error "Build this with tools/build-release.sh"
!endif
!ifndef VERSION
  !define VERSION "dev"
!endif
!ifndef OUTFILE
  !define OUTFILE "Skynet_Brewer_Setup.exe"
!endif
!define NODE_MIN "22.13.0"
!define PORT "8080"
!define UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\SkynetBrewer"

Name "Skynet Brewer"
OutFile "${OUTFILE}"
InstallDir "C:\Brewing\BrewPanel"
RequestExecutionLevel user
SetCompressor /SOLID lzma
BrandingText "Skynet Brewer ${VERSION}"

VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "Skynet Brewer"
VIAddVersionKey "CompanyName" "OakBarn Brewery"
VIAddVersionKey "LegalCopyright" "Copyright (c) OakBarn Brewery 2026, MIT License"
VIAddVersionKey "FileDescription" "Skynet Brewer installer"
VIAddVersionKey "FileVersion" "${VERSION}"
VIAddVersionKey "ProductVersion" "${VERSION}"

!define MUI_ICON "skynet.ico"
!define MUI_UNICON "skynet.ico"
!define MUI_WELCOMEPAGE_TITLE "Install Skynet Brewer"
!define MUI_WELCOMEPAGE_TEXT "This puts the Skynet Brew Panel on this computer and adds a Skynet Brewer shortcut to your Desktop.$\r$\n$\r$\nIf the panel is already running, close its black command window before you click Next.$\r$\n$\r$\nUpdating? Your brew data and your layout are kept."
!define MUI_DIRECTORYPAGE_TEXT_TOP "The panel goes in this folder. C:\Brewing\BrewPanel is recommended."
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Start Skynet Brewer now"
!define MUI_FINISHPAGE_RUN_FUNCTION StartPanel
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\install\ReadMe.txt"
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Show the install notes"
!define MUI_FINISHPAGE_SHOWREADME_NOTCHECKED

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

Var Upgrade
Var OldPanel
Var Stamp

; ---------------------------------------------------------------- Node.js
; Puts 1 in $R9 when a new enough Node.js is on this computer.
Function FindNode
  StrCpy $R9 0
  nsExec::ExecToStack '"$SYSDIR\cmd.exe" /c "set "PATH=$PROGRAMFILES64\nodejs;%PATH%" & node -v"'
  Pop $0
  Pop $1
  ${If} $0 == 0
    ; "v22.13.0" plus a line break, to "22.13.0"
    StrCpy $1 $1 "" 1
    ${WordFind} "$1" "$\r" "+1" $1
    ${WordFind} "$1" "$\n" "+1" $1
    ${VersionCompare} "$1" "${NODE_MIN}" $2
    ${If} $2 != 2
      StrCpy $R9 1
      DetailPrint "Found Node.js $1"
    ${Else}
      DetailPrint "Node.js $1 is too old (need ${NODE_MIN} or newer)"
    ${EndIf}
  ${Else}
    DetailPrint "Node.js is not installed"
  ${EndIf}
FunctionEnd

Function NeedNode
  Call FindNode
  ${If} $R9 == 1
    Return
  ${EndIf}
  MessageBox MB_YESNOCANCEL|MB_ICONQUESTION "Skynet Brewer runs on Node.js (free), and this computer does not have it, or has an old one.$\r$\n$\r$\nYes: install Node.js now. Windows may ask for permission.$\r$\nNo: open the Node.js download page instead, and carry on.$\r$\nCancel: stop." /SD IDNO IDYES install IDNO page
    Abort "Stopped. Nothing was changed."
  install:
    DetailPrint "Installing Node.js with winget (this can take a few minutes)..."
    nsExec::ExecToLog '"$SYSDIR\cmd.exe" /c "winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements"'
    Pop $0
    Call FindNode
    ${If} $R9 == 1
      Return
    ${EndIf}
    MessageBox MB_OK|MB_ICONEXCLAMATION "Node.js could not be installed automatically. The download page opens next: install the LTS version, then start Skynet Brewer from the Desktop." /SD IDOK
  page:
    ExecShell "open" "https://nodejs.org/en/download"
FunctionEnd

; ---------------------------------------------------------------- Panel still running?
Function WaitForPanelStopped
  check:
    nsExec::ExecToStack '"$SYSDIR\cmd.exe" /c "netstat -ano -p tcp | findstr /r /c:":${PORT} .*LISTENING""'
    Pop $0
    Pop $1
    ${If} $0 == 0
      MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "The panel (or another program) is still running on port ${PORT}.$\r$\n$\r$\nClick its black command window, press Ctrl+C, then close the window. Then click Retry.$\r$\n$\r$\nStill stuck? See Help > Updating to a new version: end Node.js in Task Manager." /SD IDCANCEL IDRETRY check
      Abort "Stopped. Close the panel and run the installer again."
    ${EndIf}
FunctionEnd

; ---------------------------------------------------------------- Install
Section "Skynet Brew Panel" SecMain
  SectionIn RO
  ${GetTime} "" "L" $0 $1 $2 $3 $4 $5 $6
  StrCpy $Stamp "$2-$1-$0_$4$5$6"

  Call NeedNode
  Call WaitForPanelStopped

  ; An update over an existing panel: keep a copy of the layout and put it back after the new files are in
  StrCpy $Upgrade 0
  ${If} ${FileExists} "$INSTDIR\server.js"
  ${AndIf} ${FileExists} "$INSTDIR\config\brewery.json"
    StrCpy $Upgrade 1
    CreateDirectory "$INSTDIR\config\backups"
    CopyFiles /SILENT "$INSTDIR\config\brewery.json" "$INSTDIR\config\backups\brewery_before_update_$Stamp.json"
    DetailPrint "Updating. Your layout was copied to config\backups\brewery_before_update_$Stamp.json"
  ${EndIf}

  ; The older layout put the panel straight in C:\Brewing. Offer to bring its data along.
  StrCpy $OldPanel ""
  ${GetParent} "$INSTDIR" $0
  ${If} $Upgrade == 0
  ${AndIf} ${FileExists} "$0\server.js"
  ${AndIf} ${FileExists} "$0\config\brewery.json"
    MessageBox MB_YESNO|MB_ICONQUESTION "An older panel was found in $0.$\r$\n$\r$\nCopy its brew data, users, layout, processes, pictures and help pages into $INSTDIR?$\r$\n$\r$\nThe old folder is not changed. You can delete it once the new one works." /SD IDYES IDNO +2
      StrCpy $OldPanel "$0"
  ${EndIf}

  SetOutPath "$INSTDIR"
  File /r "${SRC}\*.*"

  ${If} $Upgrade == 1
    CopyFiles /SILENT "$INSTDIR\config\backups\brewery_before_update_$Stamp.json" "$INSTDIR\config\brewery.json"
  ${EndIf}
  ${If} $OldPanel != ""
    DetailPrint "Copying data from $OldPanel"
    CopyFiles /SILENT "$OldPanel\config\brewery.json" "$INSTDIR\config\brewery.json"
    ${If} ${FileExists} "$OldPanel\data\*.*"
      CopyFiles /SILENT "$OldPanel\data" "$INSTDIR"
    ${EndIf}
    CopyFiles /SILENT "$OldPanel\scripts\*.*" "$INSTDIR\scripts"
    CopyFiles /SILENT "$OldPanel\media\*.*" "$INSTDIR\media"
    CopyFiles /SILENT "$OldPanel\help\*.*" "$INSTDIR\help"
  ${EndIf}

  ; The start file. Same as the sample in install\windows\Skynet_Brewer.bat, with this folder filled in.
  FileOpen $9 "$INSTDIR\Skynet_Brewer.bat" w
  FileWrite $9 ":: MIT License Granted$\r$\n"
  FileWrite $9 ":: Copyright (c) OakBarn Brewery 2026$\r$\n"
  FileWrite $9 ":: Starts the Skynet Brew Panel and opens it in your browser.$\r$\n"
  FileWrite $9 "@echo off$\r$\n"
  FileWrite $9 "title Skynet Brewery Panel$\r$\n"
  FileWrite $9 `cd /d "$INSTDIR"$\r$\n`
  FileWrite $9 `if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"$\r$\n`
  FileWrite $9 `where node >nul 2>nul || (echo Node.js is not installed. Get it from https://nodejs.org and try again. & pause & exit /b)$\r$\n`
  FileWrite $9 ":: Opens the browser after 4 seconds, so the panel has time to start$\r$\n"
  FileWrite $9 `start "" /min cmd /c "timeout /t 4 /nobreak >nul & start "" http://localhost:${PORT}"$\r$\n`
  FileWrite $9 "npm start$\r$\n"
  FileWrite $9 "pause$\r$\n"
  FileClose $9

  ; Shortcuts. "Start in" is the panel folder.
  SetOutPath "$INSTDIR"
  CreateShortCut "$DESKTOP\Skynet Brewer.lnk" "$INSTDIR\Skynet_Brewer.bat" "" "$INSTDIR\install\windows\skynet.ico" 0
  CreateDirectory "$SMPROGRAMS\Skynet Brewer"
  CreateShortCut "$SMPROGRAMS\Skynet Brewer\Skynet Brewer.lnk" "$INSTDIR\Skynet_Brewer.bat" "" "$INSTDIR\install\windows\skynet.ico" 0
  CreateShortCut "$SMPROGRAMS\Skynet Brewer\Panel folder.lnk" "$INSTDIR"
  CreateShortCut "$SMPROGRAMS\Skynet Brewer\Uninstall Skynet Brewer.lnk" "$INSTDIR\Uninstall Skynet Brewer.exe"

  ; USB boards (Arduino Mega and friends) need the serialport package. Not fatal if there is no internet.
  Call FindNode
  ${If} $R9 == 1
    DetailPrint "Getting the USB support package (needs internet)..."
    nsExec::ExecToLog '"$SYSDIR\cmd.exe" /c "set "PATH=$PROGRAMFILES64\nodejs;%PATH%" & cd /d "$INSTDIR" & npm install --no-audit --no-fund"'
    Pop $0
    ${If} $0 != 0
      DetailPrint "Could not get the USB package. The panel still works; run npm install in the panel folder later for USB boards."
    ${EndIf}
  ${EndIf}

  WriteUninstaller "$INSTDIR\Uninstall Skynet Brewer.exe"
  WriteRegStr HKCU "${UNINST_KEY}" "DisplayName" "Skynet Brewer"
  WriteRegStr HKCU "${UNINST_KEY}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "${UNINST_KEY}" "Publisher" "OakBarn Brewery"
  WriteRegStr HKCU "${UNINST_KEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${UNINST_KEY}" "DisplayIcon" "$INSTDIR\install\windows\skynet.ico"
  WriteRegStr HKCU "${UNINST_KEY}" "UninstallString" '"$INSTDIR\Uninstall Skynet Brewer.exe"'
  WriteRegDWORD HKCU "${UNINST_KEY}" "NoModify" 1
  WriteRegDWORD HKCU "${UNINST_KEY}" "NoRepair" 1
SectionEnd

Function StartPanel
  ExecShell "open" "$INSTDIR\Skynet_Brewer.bat"
FunctionEnd

; ---------------------------------------------------------------- Uninstall
Section "Uninstall"
  Delete "$DESKTOP\Skynet Brewer.lnk"
  RMDir /r "$SMPROGRAMS\Skynet Brewer"
  DeleteRegKey HKCU "${UNINST_KEY}"

  MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Also delete your brew data, users, layout, processes, pictures and help pages?$\r$\n$\r$\nNo (recommended) keeps them in $INSTDIR." /SD IDNO IDYES everything
    ; Program files only
    RMDir /r "$INSTDIR\lib"
    RMDir /r "$INSTDIR\public"
    RMDir /r "$INSTDIR\node_modules"
    RMDir /r "$INSTDIR\firmware"
    RMDir /r "$INSTDIR\docs"
    RMDir /r "$INSTDIR\samples"
    RMDir /r "$INSTDIR\test"
    RMDir /r "$INSTDIR\tools"
    RMDir /r "$INSTDIR\install"
    Delete "$INSTDIR\server.js"
    Delete "$INSTDIR\package.json"
    Delete "$INSTDIR\package-lock.json"
    Delete "$INSTDIR\README.md"
    Delete "$INSTDIR\Skynet_Brewer.bat"
    Delete "$INSTDIR\Uninstall Skynet Brewer.exe"
    Goto done
  everything:
    RMDir /r "$INSTDIR"
  done:
SectionEnd
