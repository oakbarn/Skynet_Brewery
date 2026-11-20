; Skynet Language Fonts Setup for Windows (MIT License, Copyright (c) OakBarn Brewery 2026)
;
; Rule 9.24 (OakBarn Brewery, 2026-11-20: "if you clone the checked install and only add the font package, the second exe has been
; checked already"; "lets do no bold and simplified"): the Google Noto Sans fonts (SIL Open Font License 1.1) for Chinese (Simplified),
; Japanese, Korean, Thai and Hindi, Regular only, for showing a Help language (Rule 11.16). It goes into the fonts folder of the Skynet
; Brew Panel (C:\Brewing\BrewPanel\fonts, or wherever Skynet Brewer is installed) and ONLY ADDS files: a font already there is never
; changed, and nothing is ever deleted (Rule #1, Never Take Away). It has no uninstaller, since it never takes anything away. The main
; Skynet Brewer Setup is not changed by it and stays small.
;
; Built by tools/build-release.sh, which passes -DSRC=<the fonts folder of the release> -DVERSION=<version> -DOUTFILE=<.exe>
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
  !define OUTFILE "Skynet_Language_Fonts_Setup.exe"
!endif
!ifdef SIGN_SCRIPT
  !finalize 'bash "${SIGN_SCRIPT}" "%1" "Language Fonts Setup .exe"'
!endif
!define UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\SkynetBrewer"

Name "Skynet Language Fonts"
OutFile "${OUTFILE}"
InstallDir "C:\Brewing\BrewPanel"
; where Skynet Brewer Setup put the panel
InstallDirRegKey HKCU "${UNINST_KEY}" "InstallLocation"
RequestExecutionLevel user
SetCompressor /SOLID lzma
BrandingText "Skynet Language Fonts ${VERSION}"

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
VIAddVersionKey "ProductName" "Skynet Language Fonts"
VIAddVersionKey "CompanyName" "OakBarn Brewery"
VIAddVersionKey "LegalCopyright" "Setup: Copyright (c) OakBarn Brewery 2026, MIT License. Fonts: Google Noto Sans, SIL Open Font License 1.1"
VIAddVersionKey "FileDescription" "Skynet Language Fonts Setup (Help fonts)"
VIAddVersionKey "FileVersion" "${VI_NUM}"
VIAddVersionKey "ProductVersion" "${VERSION}"
VIAddVersionKey "InternalName" "SkynetLanguageFontsSetup"
VIAddVersionKey "OriginalFilename" "Skynet_Language_Fonts_Setup_${VERSION}.exe"
VIAddVersionKey "Comments" "Adds the Help language fonts to the Skynet Brew Panel (open source, https://github.com/oakbarn/Skynet_Brewery)"

!define MUI_ICON "skynet.ico"
!define MUI_WELCOMEPAGE_TITLE "Install the Skynet Language Fonts"
!define MUI_WELCOMEPAGE_TEXT "Version: ${VERSION}$\r$\n$\r$\nThis adds the fonts for a Help language in Chinese (Simplified), Japanese, Korean, Thai or Hindi to the Skynet Brew Panel's fonts folder. Phones and PCs already have these letters; these fonts are for a screen that shows empty boxes.$\r$\n$\r$\nIt only adds: a font you already have is never changed, and nothing is deleted.$\r$\n$\r$\nInstall Skynet Brewer first (Skynet Brewer Setup), then run this."
!define MUI_DIRECTORYPAGE_TEXT_TOP "Pick the folder Skynet Brewer is installed in (the one with Skynet_Brewer.bat). C:\Brewing\BrewPanel is the usual one."
!insertmacro MUI_PAGE_WELCOME
!define MUI_PAGE_CUSTOMFUNCTION_LEAVE CheckPanelFolder
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_TEXT "The Skynet Language Fonts are in $INSTDIR\fonts.$\r$\n$\r$\nIf the panel is running, press F5 in its window to use them."
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

; The folder must be a Skynet Brew Panel, so the fonts land where the panel looks for them
Function CheckPanelFolder
  ${IfNot} ${FileExists} "$INSTDIR\server.js"
    MessageBox MB_OK|MB_ICONEXCLAMATION "Skynet Brewer is not in $INSTDIR.$\r$\n$\r$\nPick the folder Skynet Brewer is installed in (the one with Skynet_Brewer.bat), or install Skynet Brewer first with Skynet Brewer Setup." /SD IDOK
    Abort
  ${EndIf}
FunctionEnd

Section "Skynet Language Fonts"
  ; Never Change or Delete (Rule #1): a file that is already there, by that name, is left exactly as it is
  SetOverwrite off
  SetOutPath "$INSTDIR\fonts"
  File /r "${SRC}\*.*"
  DetailPrint "Added the Skynet Language Fonts this panel did not have yet. Nothing you had was changed."
SectionEnd
