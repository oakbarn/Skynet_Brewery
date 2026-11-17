; Skynet Sample Schemas Setup for Windows (MIT License, Copyright (c) OakBarn Brewery 2026)
;
; The extra Sample Schemas (Rule 9.13, OakBarn Brewery 2026-11-10: "separate the Sample Schemas in a separate exe and only leave
; the 3 vessel as the only Sample Schema as Skynet Panel ships"). The panel ships only the 3 Vessel 1 Pump sample; every other
; sample comes with this Setup, one at a time, into the panel's sample_schemas folder (C:\Brewing\BrewPanel\sample_schemas). For now
; it holds no Schemas, only its ReadMe ("leave the new exe empty of schema because we may fix those before adding and I would do
; that one at a time"); the same folder is where a Schema from another brewer goes. It ONLY ADDS: a sample you already have, by
; that name, is never changed, and nothing is ever deleted (Rule #1, Never Take Away). It has no uninstaller.
;
; Built by tools/build-release.sh, which passes -DSRC=<the sample_schemas folder of the release> -DVERSION=<version> -DOUTFILE=<.exe>
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
  !define OUTFILE "Skynet_Sample_Schemas_Setup.exe"
!endif
!ifdef SIGN_SCRIPT
  !finalize 'bash "${SIGN_SCRIPT}" "%1" "Sample Schemas Setup .exe"'
!endif
!define UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\SkynetBrewer"

Name "Skynet Sample Schemas"
OutFile "${OUTFILE}"
InstallDir "C:\Brewing\BrewPanel"
; where Skynet Brewer Setup put the panel
InstallDirRegKey HKCU "${UNINST_KEY}" "InstallLocation"
RequestExecutionLevel user
SetCompressor /SOLID lzma
BrandingText "Skynet Sample Schemas ${VERSION}"

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
VIAddVersionKey "ProductName" "Skynet Sample Schemas"
VIAddVersionKey "CompanyName" "OakBarn Brewery"
VIAddVersionKey "LegalCopyright" "Copyright (c) OakBarn Brewery 2026, MIT License"
VIAddVersionKey "FileDescription" "Skynet Sample Schemas Setup (ready-made breweries)"
VIAddVersionKey "FileVersion" "${VI_NUM}"
VIAddVersionKey "ProductVersion" "${VERSION}"
VIAddVersionKey "InternalName" "SkynetSampleSchemasSetup"
VIAddVersionKey "OriginalFilename" "Skynet_Sample_Schemas_Setup_${VERSION}.exe"
VIAddVersionKey "Comments" "Adds more Sample Schemas to the Skynet Brew Panel (open source, https://github.com/oakbarn/Skynet_Brewery)"

!define MUI_ICON "skynet.ico"
!define MUI_WELCOMEPAGE_TITLE "Add more Skynet Sample Schemas"
!define MUI_WELCOMEPAGE_TEXT "Version: ${VERSION}$\r$\n$\r$\nThis adds more Sample Schemas (ready-made breweries) to the Skynet Brew Panel. The panel comes with the 3 Vessel sample; more samples come here, one at a time.$\r$\n$\r$\nIt only adds: a sample you already have is never changed, and nothing is deleted. Your own Schemas are never touched.$\r$\n$\r$\nInstall Skynet Brewer first (Skynet Brewer Setup), then run this."
!define MUI_DIRECTORYPAGE_TEXT_TOP "Pick the folder Skynet Brewer is installed in (the one with Skynet_Brewer.bat). C:\Brewing\BrewPanel is the usual one."
!insertmacro MUI_PAGE_WELCOME
!define MUI_PAGE_CUSTOMFUNCTION_LEAVE CheckPanelFolder
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_TEXT "The Sample Schemas are in $INSTDIR\sample_schemas. In the panel they are in the Schema dropdown, under Add a Sample Schema.$\r$\n$\r$\nIf the panel is running, press F5 in its window to see them.$\r$\n$\r$\nThere are none in this version yet: each one is added after it is brought up to the current Skynet Rules. The ReadMe in that folder says how a Schema from another brewer goes there too."
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

; The folder must be a Skynet Brew Panel, so the samples land where the panel looks for them
Function CheckPanelFolder
  ${IfNot} ${FileExists} "$INSTDIR\server.js"
    MessageBox MB_OK|MB_ICONEXCLAMATION "Skynet Brewer is not in $INSTDIR.$\r$\n$\r$\nPick the folder Skynet Brewer is installed in (the one with Skynet_Brewer.bat), or install Skynet Brewer first with Skynet Brewer Setup." /SD IDOK
    Abort
  ${EndIf}
FunctionEnd

Section "Skynet Sample Schemas"
  ; Never Change or Delete (Rule #1): a file that is already there, by that name, is left exactly as it is
  SetOverwrite off
  SetOutPath "$INSTDIR\sample_schemas"
  File /r "${SRC}\*.*"
  DetailPrint "Added the Sample Schemas this panel did not have yet. Nothing you had was changed."
SectionEnd
