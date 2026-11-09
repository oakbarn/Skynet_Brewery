; Skynet Brewer installer for Windows (MIT License, Copyright (c) OakBarn Brewery 2026)
;
; Puts the Skynet Brew Panel in C:\Brewing\BrewPanel (changeable), writes Skynet_Brewer.bat there,
; and adds a "Skynet Brewer" shortcut to the Desktop and the Start menu.
; On an update a page asks what to do (Rule 9.8): 1 Start Fresh (deletes config, data and scripts after a second warning;
; media is kept), 2 update and reset all users (deletes users, passwords, sign-ins and the recovery code after a warning),
; or 3 update and keep everything (the default, the original No). With 2 or 3 you can still replace one of your folders.
;
; Build it with tools/build-release.sh (needs NSIS: "sudo apt install nsis" on Linux), which passes:
;   -DSRC=<the BrewPanel folder of the release (config, media and scripts samples are in its defaults\ folder)>  -DVERSION=<version>  -DOUTFILE=<setup .exe to write>
; and, only when signing is set up (docs/Code_Signing_Setup.md), -DSIGN_SCRIPT=<tools/sign-exe.sh>: the Setup .exe and the
; Uninstall .exe inside it are then signed with Azure Artifact Signing as they are made (needs NSIS 3.08 or newer).

Unicode true
!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh"
!include "WordFunc.nsh"
!include "nsDialogs.nsh"

!ifndef SRC
  !error "Build this with tools/build-release.sh"
!endif
!ifndef VERSION
  !define VERSION "dev"
!endif
!ifndef OUTFILE
  !define OUTFILE "Skynet_Brewer_Setup.exe"
!endif
!ifdef SIGN_SCRIPT
  !uninstfinalize 'bash "${SIGN_SCRIPT}" "%1" "Uninstall Skynet Brewer.exe"'
  !finalize 'bash "${SIGN_SCRIPT}" "%1" "Setup .exe"'
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

; The file's Details (right-click > Properties > Details). Virus scanners trust a Setup more when these are filled in and
; the version is a real number that goes up with each build, so it is the build date and time: 2026.11.9.324 is
; 2026-11-09 03:24 (UTC on the release build). The release name (PR295_Skynet-v...) is the Product version. Rule 9.11
; (%-m and the like have no leading zero: NSIS would read 09 as a broken octal number. The Setup is built on Linux.)
!define /date VI_Y "%Y"
!define /date VI_M "%-m"
!define /date VI_D "%-d"
!define /date VI_H "%-H"
!define /date VI_MIN "%-M"
!define /math VI_H100 ${VI_H} * 100
!define /math VI_HM ${VI_H100} + ${VI_MIN}
!define VI_NUM "${VI_Y}.${VI_M}.${VI_D}.${VI_HM}"
VIProductVersion "${VI_NUM}"
VIFileVersion "${VI_NUM}"
VIAddVersionKey "ProductName" "Skynet Brewer"
VIAddVersionKey "CompanyName" "OakBarn Brewery"
VIAddVersionKey "LegalCopyright" "Copyright (c) OakBarn Brewery 2026, MIT License"
VIAddVersionKey "FileDescription" "Skynet Brewer Setup"
VIAddVersionKey "FileVersion" "${VI_NUM}"
VIAddVersionKey "ProductVersion" "${VERSION}"
VIAddVersionKey "InternalName" "SkynetBrewerSetup"
VIAddVersionKey "OriginalFilename" "Skynet_Brewer_Setup_${VERSION}.exe"
VIAddVersionKey "Comments" "Installs the Skynet Brew Panel (open source, https://github.com/oakbarn/Skynet_Brewery)"

!define MUI_ICON "skynet.ico"
!define MUI_UNICON "skynet.ico"
!define MUI_WELCOMEPAGE_TITLE "Install Skynet Brewer"
; The opening screen shows the version, so the brewer can see which one this Setup installs (Fritz, 2026-11-07)
!define MUI_WELCOMEPAGE_TEXT "Version: ${VERSION}$\r$\n$\r$\nThis puts the Skynet Brew Panel on this computer and adds a Skynet Brewer shortcut to your Desktop.$\r$\n$\r$\nIf the panel is already running, close its black command window before you click Next.$\r$\n$\r$\nUpdating? The next page lets you pick: keep everything, reset all users, or Start Fresh."
!define MUI_DIRECTORYPAGE_TEXT_TOP "The panel goes in this folder. C:\Brewing\BrewPanel is recommended."
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Start Skynet Brewer now"
!define MUI_FINISHPAGE_RUN_FUNCTION StartPanel
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\install\ReadMe.txt"
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Show the install notes"
!define MUI_FINISHPAGE_SHOWREADME_NOTCHECKED

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
Page custom UpdateChoicePage UpdateChoiceLeave
!insertmacro MUI_PAGE_INSTFILES
; Finish page: "Start the BruControl Importer now" beside "Start Skynet Brewer now", only when the Importer was added.
; Only one of the two can be ticked; Start Skynet Brewer is ticked to begin with (OakBarn Brewery, 2026-11-08)
!define MUI_PAGE_CUSTOMFUNCTION_SHOW FinishShow
!define MUI_PAGE_CUSTOMFUNCTION_LEAVE FinishLeave
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

Var Upgrade
Var Fresh
Var Choice
Var RadioKeep
Var RadioUsers
Var RadioFresh
Var OldPanel
Var Stamp
Var BrewDir
Var ImporterAdded
Var OpenImporter
Var ClearImportBox
Var ClearImport

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

; ---------------------------------------------------------------- Your folders on an update
; Moves one of your folders to backups\ so the panel starts it again from the samples. $R0 = folder, $R1 = what is in it.
Function MoveToBackups
  ${If} ${FileExists} "$INSTDIR\$R0\*.*"
    CreateDirectory "$INSTDIR\backups"
    Rename "$INSTDIR\$R0" "$INSTDIR\backups\$R0_$Stamp"
    DetailPrint "Your $R0 folder ($R1) was moved to backups\$R0_$Stamp. The panel starts it again from the samples."
  ${EndIf}
FunctionEnd

Function AskReplaceFolders
  MessageBox MB_YESNO|MB_ICONQUESTION "Keep all your own folders as they are?$\r$\n$\r$\n   config:   your layout, tabs, devices and settings$\r$\n   data:      brew log, users, passwords and logins$\r$\n   media:    your pictures and sounds$\r$\n   scripts:  your Processes$\r$\n$\r$\nYes (recommended): keep them all.$\r$\nNo: ask me about each one." /SD IDYES IDYES done
  StrCpy $R0 "config"
  StrCpy $R1 "layout, tabs, devices and settings"
  MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Replace your config folder ($R1) with the sample layout?$\r$\n$\r$\nYes moves yours to backups\config_$Stamp first.$\r$\nNo keeps yours." /SD IDNO IDNO +2
    Call MoveToBackups
  StrCpy $R0 "media"
  StrCpy $R1 "pictures and sounds"
  MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Replace your media folder ($R1) with the sample pictures and sounds?$\r$\n$\r$\nYes moves yours to backups\media_$Stamp first.$\r$\nNo keeps yours." /SD IDNO IDNO +2
    Call MoveToBackups
  StrCpy $R0 "scripts"
  StrCpy $R1 "Processes"
  MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Replace your scripts folder ($R1) with the sample Processes?$\r$\n$\r$\nYes moves yours to backups\scripts_$Stamp first.$\r$\nNo keeps yours." /SD IDNO IDNO +2
    Call MoveToBackups
  StrCpy $R0 "data"
  StrCpy $R1 "brew log, users, passwords and logins"
  MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Start the data folder ($R1) fresh?$\r$\n$\r$\nYes moves yours to backups\data_$Stamp first, and you create the admin account again.$\r$\nNo keeps yours." /SD IDNO IDNO +2
    Call MoveToBackups
  done:
FunctionEnd

; ---------------------------------------------------------------- What this update does (Rule 9.8)
; Shown only when the panel is already in the chosen folder. Three choices (Fritz, 2026-11-06):
;   1 fresh  Start Fresh: everything is deleted, as if the panel was never installed (media and backups are kept)
;   2 users  Update the program and reset all users: users, passwords, sign-ins and the recovery code are deleted
;   3 keep   Update the program and keep everything (the original No: the default, and what a silent /S update does)
; Reset and Start Fresh each have a warning with No as the default; No goes back to this page and nothing is deleted.
; The page only records the choice in $Choice. Nothing is deleted until the panel is stopped (Section SecMain).
Function UpdateChoicePage
  StrCpy $Choice "keep"
  StrCpy $ClearImport 0
  StrCpy $ClearImportBox ""
  ${IfNot} ${FileExists} "$INSTDIR\server.js"
    Abort   ; a new install: nothing to choose
  ${EndIf}
  Call FindBrewDir
  !insertmacro MUI_HEADER_TEXT "Skynet Brewer is already installed" "Pick what this update does. Your choice is used only after you click Install."
  nsDialogs::Create 1018
  Pop $0
  ${If} $0 == error
    Abort
  ${EndIf}
  ${NSD_CreateLabel} 0 0 100% 14u "Found in $INSTDIR. The program files are always updated."
  Pop $0

  ${NSD_CreateRadioButton} 0 18u 100% 12u "&1. Start Fresh: delete everything"
  Pop $RadioFresh
  ${NSD_CreateLabel} 12u 31u 96% 18u "Deletes every Schema, setting, user, password, the brew log and every Process, for good. Kept: pictures and sounds (media) and the backups folder. A warning comes next."
  Pop $0

  ${NSD_CreateRadioButton} 0 52u 100% 12u "&2. Update the program and reset all users"
  Pop $RadioUsers
  ${NSD_CreateLabel} 12u 65u 96% 26u "Deletes every user, password, sign-in and the recovery code. You make the admin account again. Your Schemas, settings, brew log, Processes, pictures and sounds are kept."
  Pop $0

  ${NSD_CreateRadioButton} 0 94u 100% 12u "&3. Update the program and keep everything (recommended)"
  Pop $RadioKeep
  ${NSD_CreateLabel} 12u 107u 96% 18u "Your Schemas, settings, users and passwords, brew log, Processes, pictures and sounds stay as they are. This is the one already picked."
  Pop $0

  ; The BruControl Importer's saved answers (OakBarn Brewery, 2026-11-09: "a Choice on the Installer to remove saved importer data and
  ; start Fresh"): a tick box of its own, unticked, shown only when the Importer has kept answers. It works with any of the three
  ; choices; Start Fresh alone never touches the Import folder.
  ${If} ${FileExists} "$BrewDir\Import\progress.json"
  ${OrIf} ${FileExists} "$BrewDir\Import\build\*.*"
    ${NSD_CreateCheckbox} 0 128u 100% 12u "Also clear the BruControl Importer's saved answers (the Import starts fresh)"
    Pop $ClearImportBox
  ${EndIf}

  ${NSD_Check} $RadioKeep
  nsDialogs::Show
FunctionEnd

; The Brewing folder (C:\Brewing when the panel is in C:\Brewing\BrewPanel): its Import subfolder is the Importer's
Function FindBrewDir
  ${GetFileName} "$INSTDIR" $0
  ${If} $0 == "BrewPanel"
    ${GetParent} "$INSTDIR" $BrewDir
  ${Else}
    StrCpy $BrewDir "$INSTDIR"
  ${EndIf}
FunctionEnd

; Clears only what the Importer kept for coming back later: its answers (progress.json) and its Build page work (build).
; Your config files, Import Copies and saved Schema files in the Import folder are never deleted.
Function ClearImporterAnswers
  Delete "$BrewDir\Import\progress.json"
  Delete "$BrewDir\Import\progress.json.tmp"
  RMDir /r "$BrewDir\Import\build"
  DetailPrint "The BruControl Importer's saved answers are cleared: the Import starts fresh."
FunctionEnd

Function UpdateChoiceLeave
  StrCpy $ClearImport 0
  ${If} $ClearImportBox != ""
    ${NSD_GetState} $ClearImportBox $0
    ${If} $0 == ${BST_CHECKED}
      MessageBox MB_YESNO|MB_ICONEXCLAMATION|MB_DEFBUTTON2 "Clear the BruControl Importer's saved answers?$\r$\n$\r$\nEvery answer the Importer kept so you could come back later is deleted, with its Build page work. The next Import starts from its first guesses.$\r$\n$\r$\nKept: your config files, Import Copies and saved Schema files in the Import folder.$\r$\n$\r$\nYes: clear them.$\r$\nNo: go back. Nothing is deleted." IDYES +2
        Abort
      StrCpy $ClearImport 1
    ${EndIf}
  ${EndIf}
  ${NSD_GetState} $RadioUsers $0
  ${If} $0 == ${BST_CHECKED}
    MessageBox MB_YESNO|MB_ICONEXCLAMATION|MB_DEFBUTTON2 "Reset all users?$\r$\n$\r$\nThese are deleted for good, with no backup:$\r$\n   - every user and password$\r$\n   - every sign-in, on every computer and phone$\r$\n   - the recovery code$\r$\n   - the user name and password the Skynet window remembers$\r$\n$\r$\nKept: your Schemas and settings (config), brew log and saved values (data), Processes (scripts), pictures and sounds (media).$\r$\n$\r$\nThe panel then asks you to make the admin account again.$\r$\n$\r$\nYes: reset all users.$\r$\nNo: go back. Nothing is deleted." IDYES +2
      Abort
    StrCpy $Choice "users"
    Return
  ${EndIf}
  ${NSD_GetState} $RadioFresh $0
  ${If} $0 == ${BST_CHECKED}
    MessageBox MB_YESNO|MB_ICONSTOP|MB_DEFBUTTON2 "WARNING: ALL EXISTING DATA WILL BE DELETED.$\r$\n$\r$\nThese are deleted for good, with no backup:$\r$\n   - every Schema, Tab, Device, Widget and setting (config)$\r$\n   - every user, password, sign-in and the recovery code (data)$\r$\n   - the brew log and saved values (data)$\r$\n   - every Process (scripts)$\r$\n   - the user name and password the Skynet window remembers$\r$\n$\r$\nKept: your pictures and sounds (media) and the backups folder.$\r$\n$\r$\nThe panel then starts like a new install: you make the admin account again.$\r$\n$\r$\nYes: delete it all and Start Fresh.$\r$\nNo: go back. Nothing is deleted." IDYES +2
      Abort
    StrCpy $Choice "fresh"
    Return
  ${EndIf}
  StrCpy $Choice "keep"
FunctionEnd

; Skynet's own clean window (Rule 2.36) keeps a small browser profile of its own. Its saved user name and password
; would be filled in on the new admin setup, so it goes on a reset or a Start Fresh. It is made again, empty, the next time
; the window opens.
Function ForgetWindowLogin
  RMDir /r "$LOCALAPPDATA\SkynetBrewer\AppWindow"
FunctionEnd

; Choice 2: users.json holds the users, their passwords (hashed), contacts and the recovery code; sessions.json the sign-ins.
Function ResetUsers
  Delete "$INSTDIR\data\users.json"
  Delete "$INSTDIR\data\users.json.tmp"
  Delete "$INSTDIR\data\sessions.json"
  Delete "$INSTDIR\data\sessions.json.tmp"
  Call ForgetWindowLogin
  ${If} ${FileExists} "$INSTDIR\data\users.json"
  ${OrIf} ${FileExists} "$INSTDIR\data\sessions.json"
    MessageBox MB_OK|MB_ICONEXCLAMATION "The users could not be reset (a program still has the files open). Restart the computer and run the installer again." /SD IDOK
    DetailPrint "Reset all users: some files could not be deleted."
  ${Else}
    DetailPrint "Reset all users: every user, password, sign-in and the recovery code deleted. Make the admin account again."
  ${EndIf}
FunctionEnd

; Choice 1: delete all users, Schemas and Processes and start as if the panel was never installed. $Fresh = 1 when done.
Function StartFresh
  RMDir /r "$INSTDIR\config"
  RMDir /r "$INSTDIR\data"
  RMDir /r "$INSTDIR\scripts"
  Call ForgetWindowLogin
  ${If} ${FileExists} "$INSTDIR\config\*.*"
  ${OrIf} ${FileExists} "$INSTDIR\data\*.*"
  ${OrIf} ${FileExists} "$INSTDIR\scripts\*.*"
    MessageBox MB_OK|MB_ICONEXCLAMATION "Some files could not be deleted (a program still has them open). What is left is kept. Restart the computer and run the installer again to finish the Start Fresh." /SD IDOK
    DetailPrint "Start Fresh: some files could not be deleted."
  ${Else}
    DetailPrint "Start Fresh: users, Schemas, settings, brew log and Processes deleted. The panel starts again from the samples."
  ${EndIf}
  StrCpy $Fresh 1
FunctionEnd

; ---------------------------------------------------------------- Install
Section "Skynet Brew Panel" SecMain
  SectionIn RO
  ${GetTime} "" "L" $0 $1 $2 $3 $4 $5 $6
  StrCpy $Stamp "$2$1$0T$4$5$6"   ; ISO 8601, for example 20261023T113005

  Call NeedNode
  Call WaitForPanelStopped

  ; An update over an existing panel. The release has no config, data, media or scripts folders (their samples are in
  ; defaults\), so yours are kept unless you ask to replace one. A copy of the layout goes to config\backups just in case.
  StrCpy $Upgrade 0
  ${If} ${FileExists} "$INSTDIR\server.js"
    StrCpy $Upgrade 1
    StrCpy $Fresh 0
    ${If} $ClearImport == 1
      Call ClearImporterAnswers
    ${EndIf}
    ${If} $Choice == "fresh"
      Call StartFresh
    ${ElseIf} $Choice == "users"
      Call ResetUsers
      DetailPrint "Updating. Kept as they are: layout and settings (config), brew data and log (data), pictures and sounds (media), processes (scripts)."
    ${Else}
      DetailPrint "Updating. Kept as they are: layout and settings (config), brew data, log, users and passwords (data), pictures and sounds (media), processes (scripts)."
    ${EndIf}
    ${If} $Fresh == 0
    ${AndIf} ${FileExists} "$INSTDIR\config\brewery.json"
      CreateDirectory "$INSTDIR\config\backups"
      CopyFiles /SILENT "$INSTDIR\config\brewery.json" "$INSTDIR\config\backups\brewery_before_update_$Stamp.json"
    ${EndIf}
    ; The manual is replaced by the new one; the old pages are kept
    ${If} ${FileExists} "$INSTDIR\help\*.md"
      CreateDirectory "$INSTDIR\help\backups\before_update_$Stamp"
      CopyFiles /SILENT "$INSTDIR\help\*.md" "$INSTDIR\help\backups\before_update_$Stamp"
      DetailPrint "Old help pages copied to help\backups\before_update_$Stamp"
    ${EndIf}
    ${If} $Fresh == 0
      Call AskReplaceFolders
    ${EndIf}
  ${Else}
    DetailPrint "Full install to $INSTDIR"
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

  ; Program files are always replaced. The panel copies the samples in defaults\ into any folder you don't have on its first start.
  SetOutPath "$INSTDIR"
  File /r "${SRC}\*.*"
  ${If} $OldPanel != ""
    DetailPrint "Copying data from $OldPanel"
    CreateDirectory "$INSTDIR\config"
    CreateDirectory "$INSTDIR\scripts"
    CreateDirectory "$INSTDIR\media"
    CopyFiles /SILENT "$OldPanel\config\brewery.json" "$INSTDIR\config\brewery.json"
    ${If} ${FileExists} "$OldPanel\data\*.*"
      CopyFiles /SILENT "$OldPanel\data" "$INSTDIR"
    ${EndIf}
    CopyFiles /SILENT "$OldPanel\scripts\*.*" "$INSTDIR\scripts"
    CopyFiles /SILENT "$OldPanel\media\*.*" "$INSTDIR\media"
    CopyFiles /SILENT "$OldPanel\help\*.*" "$INSTDIR\help"
  ${EndIf}

  ; The start file. It finds this folder by itself, and installs Node.js if it is ever missing.
  CopyFiles /SILENT "$INSTDIR\install\windows\Skynet_Brewer.bat" "$INSTDIR\Skynet_Brewer.bat"
  ; The Import folder, always made (Fritz, 2026-11-06): the Brewing folder's Import subfolder (C:\Brewing\Import when the
  ; panel is in C:\Brewing\BrewPanel). The BruControl Importer saves its Schema files there, and later BeerSmith or other
  ; programs can save their files there too. Never deleted by an uninstall: it holds your files.
  Call FindBrewDir
  CreateDirectory "$BrewDir\Import"
  DetailPrint "Import folder: $BrewDir\Import"

  ; Shortcuts. "Start in" is the panel folder.
  SetOutPath "$INSTDIR"
  CreateShortCut "$DESKTOP\Skynet Brewer.lnk" "$INSTDIR\Skynet_Brewer.bat" "" "$INSTDIR\install\windows\skynet.ico" 0
  CreateDirectory "$SMPROGRAMS\Skynet Brewer"
  CreateShortCut "$SMPROGRAMS\Skynet Brewer\Skynet Brewer.lnk" "$INSTDIR\Skynet_Brewer.bat" "" "$INSTDIR\install\windows\skynet.ico" 0
  Call AskImporter
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

; The BruControl Importer, the second door of the same program (Rule 15.4), is a choice (Fritz, 2026-11-06). Its program
; files are always there (they are the Panel's own); Yes adds its start file and shortcuts, No leaves them out (and takes
; away the shortcuts of an earlier install). On an update, the answer you gave last time is the default.
Function AskImporter
  ${If} ${FileExists} "$INSTDIR\Skynet_Importer.bat"
    MessageBox MB_YESNO|MB_ICONQUESTION "Will you import a BruControl configuration on this computer?$\r$\n$\r$\nIf you are a BruControl Brewer and want to import a BruControl .brucfg Configuration File, answer Yes. If you are not a BruControl Brewer, answer No.$\r$\n$\r$\nYes: add the Skynet BruControl Importer (a Desktop and Start menu shortcut). It turns a BruControl config file into a Skynet Schema and saves it in $BrewDir\Import.$\r$\nNo: leave it out. You can run this Setup again to add it later." /SD IDYES IDYES add IDNO leave
  ${Else}
    MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON2 "Will you import a BruControl configuration on this computer?$\r$\n$\r$\nIf you are a BruControl Brewer and want to import a BruControl .brucfg Configuration File, answer Yes. If you are not a BruControl Brewer, answer No.$\r$\n$\r$\nYes: add the Skynet BruControl Importer (a Desktop and Start menu shortcut). It turns a BruControl config file into a Skynet Schema and saves it in $BrewDir\Import.$\r$\nNo: leave it out. You can run this Setup again to add it later." /SD IDNO IDYES add IDNO leave
  ${EndIf}
  add:
    CopyFiles /SILENT "$INSTDIR\install\windows\Skynet_Importer.bat" "$INSTDIR\Skynet_Importer.bat"
    CreateShortCut "$SMPROGRAMS\Skynet Brewer\Skynet BruControl Importer.lnk" "$INSTDIR\Skynet_Importer.bat" "" "$INSTDIR\install\windows\importer.ico" 0
    CreateShortCut "$DESKTOP\Skynet BruControl Importer.lnk" "$INSTDIR\Skynet_Importer.bat" "" "$INSTDIR\install\windows\importer.ico" 0
    ; and one in the Import folder, where its Schema files go (Fritz, 2026-11-06)
    CreateShortCut "$BrewDir\Import\Skynet BruControl Importer.lnk" "$INSTDIR\Skynet_Importer.bat" "" "$INSTDIR\install\windows\importer.ico" 0
    DetailPrint "Added the Skynet BruControl Importer"
    StrCpy $ImporterAdded 1
    Return
  leave:
    Delete "$INSTDIR\Skynet_Importer.bat"
    Delete "$SMPROGRAMS\Skynet Brewer\Skynet BruControl Importer.lnk"
    Delete "$DESKTOP\Skynet BruControl Importer.lnk"
    Delete "$BrewDir\Import\Skynet BruControl Importer.lnk"
FunctionEnd

Function StartPanel
  ExecShell "open" "$INSTDIR\Skynet_Brewer.bat"
FunctionEnd

; The Finish page's "Start the BruControl Importer now" tick box. It sits under "Show the install notes" (130u = the
; Modern UI's 110u for that box + 20u) and is only there when you answered Yes to the BruControl question.
; It and "Start Skynet Brewer now" are one or the other: ticking one unticks the other, so only one program starts.
Function FinishShow
  StrCpy $OpenImporter ""
  ${If} $ImporterAdded == 1
    ${NSD_CreateCheckbox} 120u 130u 195u 10u "Start the BruControl Importer now"
    Pop $OpenImporter
    SetCtlColors $OpenImporter "${MUI_TEXTCOLOR}" "${MUI_BGCOLOR}"
    ${NSD_OnClick} $OpenImporter FinishImporterClick
    ${NSD_OnClick} $mui.FinishPage.Run FinishRunClick
  ${EndIf}
FunctionEnd

Function FinishImporterClick
  Pop $0
  ${NSD_GetState} $OpenImporter $0
  ${If} $0 == ${BST_CHECKED}
    ${NSD_Uncheck} $mui.FinishPage.Run
  ${EndIf}
FunctionEnd

Function FinishRunClick
  Pop $0
  ${NSD_GetState} $mui.FinishPage.Run $0
  ${If} $0 == ${BST_CHECKED}
  ${AndIf} $OpenImporter != ""
    ${NSD_Uncheck} $OpenImporter
  ${EndIf}
FunctionEnd

Function FinishLeave
  ${If} $OpenImporter != ""
    ${NSD_GetState} $OpenImporter $0
    ${If} $0 == ${BST_CHECKED}
      ; the Importer only: make sure Skynet Brewer does not start too
      ${NSD_Uncheck} $mui.FinishPage.Run
      ExecShell "open" "$INSTDIR\Skynet_Importer.bat"
    ${EndIf}
  ${EndIf}
FunctionEnd

; ---------------------------------------------------------------- Uninstall
Section "Uninstall"
  Delete "$DESKTOP\Skynet Brewer.lnk"
  Delete "$DESKTOP\Skynet BruControl Importer.lnk"
  ; the Importer shortcut in the Import folder (the folder and your files in it are kept)
  Delete "$INSTDIR\..\Import\Skynet BruControl Importer.lnk"
  Delete "$INSTDIR\Import\Skynet BruControl Importer.lnk"
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
    RMDir /r "$INSTDIR\defaults"
    Delete "$INSTDIR\server.js"
    Delete "$INSTDIR\importer.js"
    Delete "$INSTDIR\Skynet_Importer.bat"
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
