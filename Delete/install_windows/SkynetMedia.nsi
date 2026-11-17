; Skynet Media Setup for Windows (MIT License, Copyright (c) OakBarn Brewery 2026)
;
; Every Skynet picture and sound (Rule 9.12, OakBarn Brewery 2026-11-10: "remove all the graphics and have separate exe loader
; for them ... we might only want to add more graphics (Never Change or Delete!)"). It goes into the media folder of the Skynet
; Brew Panel (C:\Brewing\BrewPanel\media, or wherever Skynet Brewer is installed) and ONLY ADDS files: a picture or sound you
; already have, by that name, is never changed, and nothing is ever deleted (Rule #1, Never Take Away). It has no uninstaller,
; since it never takes anything away. Run it after Skynet Brewer Setup on a new computer, and again when new pictures come out.
;
; Built by tools/build-release.sh, which passes -DSRC=<the media folder of the release> -DVERSION=<version> -DOUTFILE=<.exe>
; and, only when signing is set up (docs/Code_Signing_Setup.md), -DSIGN_SCRIPT=<tools/sign-exe.sh>.

Unicode true
!include "MUI2.nsh"
!include "LogicLib.nsh"

!ifndef SRC
  !error "Build this with tools/build-release.sh"
!endif
!ifndef VERSION
  !define VERSION "dev"
!endif
!ifndef OUTFILE
  !define OUTFILE "Skynet_Media_Setup.exe"
!endif
!ifdef SIGN_SCRIPT
  !finalize 'bash "${SIGN_SCRIPT}" "%1" "Media Setup .exe"'
!endif
!define UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\SkynetBrewer"

Name "Skynet Media"
OutFile "${OUTFILE}"
InstallDir "C:\Brewing\BrewPanel"
; where Skynet Brewer Setup put the panel
InstallDirRegKey HKCU "${UNINST_KEY}" "InstallLocation"
RequestExecutionLevel user
SetCompressor /SOLID lzma
BrandingText "Skynet Media ${VERSION}"

; The file's Details, the same way as the Skynet Brewer Setup (Rule 9.11)
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
VIAddVersionKey "ProductName" "Skynet Media"
VIAddVersionKey "CompanyName" "OakBarn Brewery"
VIAddVersionKey "LegalCopyright" "Copyright (c) OakBarn Brewery 2026, MIT License"
VIAddVersionKey "FileDescription" "Skynet Media Setup (pictures and sounds)"
VIAddVersionKey "FileVersion" "${VI_NUM}"
VIAddVersionKey "ProductVersion" "${VERSION}"
VIAddVersionKey "InternalName" "SkynetMediaSetup"
VIAddVersionKey "OriginalFilename" "Skynet_Media_Setup_${VERSION}.exe"
VIAddVersionKey "Comments" "Adds the Skynet pictures and sounds to the Skynet Brew Panel (open source, https://github.com/oakbarn/Skynet_Brewery)"

!define MUI_ICON "skynet.ico"
!define MUI_WELCOMEPAGE_TITLE "Install the Skynet pictures and sounds"
!define MUI_WELCOMEPAGE_TEXT "Version: ${VERSION}$\r$\n$\r$\nThis adds every Skynet picture and sound to the Skynet Brew Panel's media folder.$\r$\n$\r$\nIt only adds: a picture or sound you already have is never changed, and nothing is deleted. Your own pictures and sounds are never touched.$\r$\n$\r$\nInstall Skynet Brewer first (Skynet Brewer Setup), then run this."
!define MUI_DIRECTORYPAGE_TEXT_TOP "Pick the folder Skynet Brewer is installed in (the one with Skynet_Brewer.bat). C:\Brewing\BrewPanel is the usual one."
!insertmacro MUI_PAGE_WELCOME
!define MUI_PAGE_CUSTOMFUNCTION_LEAVE CheckPanelFolder
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_TEXT "The Skynet pictures and sounds are in $INSTDIR\media.$\r$\n$\r$\nIf the panel is running, press F5 in its window (or close and start it again) to see them."
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

; The folder must be a Skynet Brew Panel, so the pictures land where the panel looks for them
Function CheckPanelFolder
  ${IfNot} ${FileExists} "$INSTDIR\server.js"
    MessageBox MB_OK|MB_ICONEXCLAMATION "Skynet Brewer is not in $INSTDIR.$\r$\n$\r$\nPick the folder Skynet Brewer is installed in (the one with Skynet_Brewer.bat), or install Skynet Brewer first with Skynet Brewer Setup." /SD IDOK
    Abort
  ${EndIf}
FunctionEnd

Section "Skynet pictures and sounds"
  ; Never Change or Delete (Rule #1): a file that is already there, by that name, is left exactly as it is
  SetOverwrite off
  SetOutPath "$INSTDIR\media"
  File /r "${SRC}\*.*"
  DetailPrint "Added the Skynet pictures and sounds this panel did not have yet. Nothing you had was changed."
SectionEnd
