#!/usr/bin/env bash
# Builds a Skynet Brewer release in release/ (MIT License, Copyright (c) OakBarn Brewery 2026):
#   Skynet_BrewPanel_<version>.zip         the panel in a BrewPanel folder, for a first install AND for updates: it has no
#                                          data/, config/, media/ or processes/ (their samples are in defaults/), so it never replaces yours
#   Skynet_Brewer_Setup_<version>.exe     Windows installer (needs NSIS: sudo apt install nsis)
#   Skynet_Brewer_Full_Setup_<version>.exe   the same Windows installer with every Skynet picture and sound inside (Rule 9.20),
#                                          added the Media Setup's add-only way, so a new install needs no separate Media Setup
#   Skynet_Media_<version>.zip / Skynet_Media_Setup_<version>.exe   (only when SKYNET_MEDIA_BUILD is not "no", Rule 9.21)
#                                          every Skynet picture and sound, kept out of the panel zip and
#                                          Setup (OakBarn Brewery, 2026-11-10, Rule 9.12). They only ever ADD files: one you already
#                                          have is never changed or deleted (Rule #1). The zip holds BrewPanel/defaults/media, which
#                                          the panel copies into media/ on its next start, adding only what is missing (lib/seed.js).
#   Skynet_Sample_Schemas_<version>.zip / Skynet_Sample_Schemas_Setup_<version>.exe   the extra Sample Schemas (sample_schemas/),
#                                          kept out of the panel zip and Setup (OakBarn Brewery, 2026-11-10, Rule 9.13): the panel ships
#                                          only the 3 Vessel sample. Add-only, like the Media Setup. No Schemas in it yet, only its ReadMe.
#   Install Skynet Brewer.command, install-skynet-brewer.sh, Skynet_Brewer.bat, ReadMe.txt
#   First_Install_<platform>/              step-by-step first-install ReadMe + first-install file for Windows, Mac, Linux, Pi
# Usage: bash tools/build-release.sh [version]     (version defaults to today's date, e.g. 2026-10-05)
set -euo pipefail
cd "$(dirname "$0")/.."
VERSION="${1:-$(date +%Y-%m-%d)}"
OUT="release"
STAGE="$OUT/stage/BrewPanel"
rm -rf "$OUT/stage"
mkdir -p "$STAGE"

# Only the files git knows about (tracked, or new and not ignored), so data/, node_modules and backups stay out.
# Delete/ (retired files, Rule 15.3) and Sandbox/ (Schemas set aside, Rule 16.8) are never shipped either.
# Nor are the files only used while building the panel, which the panel never opens (they stay on GitHub): the tests (test/),
# the drawings and screenshots in docs/ (docs/*.png, docs/reviews/) and the OakBarn Scripts notes (docs/OakBarn_Scripts/).
# The docs/ text files still ship, because Help points to some of them.
git ls-files -z --cached --others --exclude-standard \
  | grep -zEv '^(release/|\.github/|\.gitignore$|Delete/|Sandbox/|test/|docs/reviews/|docs/OakBarn_Scripts/|docs/.*\.png$)' | while IFS= read -r -d '' f; do
  [ -e "$f" ] || continue
  mkdir -p "$STAGE/$(dirname "$f")"
  cp -p "$f" "$STAGE/$f"
done
chmod +x "$STAGE"/install/linux/*.sh "$STAGE"/install/pi/*.sh "$STAGE"/install/mac/*.command

# Your folders (config, media, processes) are NOT in the zip. Their samples go in defaults/, and the panel copies them
# into place on its first start (lib/seed.js). So unzipping a new version over a panel can never replace yours.
# data/ is never in a release at all.
mkdir -p "$STAGE/defaults"
for d in config processes; do [ -d "$STAGE/$d" ] && mv "$STAGE/$d" "$STAGE/defaults/$d"; done
# The pictures and sounds (media/) are not in the panel zip or Setup: they are the Skynet Media zip and Setup (Rule 9.12)
MSTAGE="$OUT/stage/media/BrewPanel/defaults"
mkdir -p "$MSTAGE"
[ -d "$STAGE/media" ] && mv "$STAGE/media" "$MSTAGE/media"
# Except the three fallback sounds (OakBarn Brewery, 2026-11-10, "Keep the Beep", "Song and clip also with the brain"; Rule 9.12):
# they stay in the panel zip and Setup, in defaults/media, so every Brain can always sound an Alarm or a Sound Player. The panel copies
# them in only if they are missing (lib/seed.js).
for f in sounds/alarm_beep.wav sounds/Skynet/Songs/Alarm_Sound_Missing.mp3 sounds/Skynet/Songs/Find_The_File_Connecting.mp3; do
  [ -f "$MSTAGE/media/$f" ] || continue
  mkdir -p "$STAGE/defaults/media/$(dirname "$f")"
  cp -p "$MSTAGE/media/$f" "$STAGE/defaults/media/$f"
done

# The extra Sample Schemas (sample_schemas/) are not in the panel zip or Setup either: they are the Sample Schemas zip and Setup (Rule 9.13)
SSTAGE="$OUT/stage/samples/BrewPanel"
mkdir -p "$SSTAGE"
[ -d "$STAGE/sample_schemas" ] && mv "$STAGE/sample_schemas" "$SSTAGE/sample_schemas"

# The Update Setup (and the panel zip) also brings the Skynet pictures, sounds and Sample Schemas added since the last Update Setup
# (OakBarn Brewery, 2026-11-17: "If there are new skynet Media files since the last Update exe, can they be included in the update
# and added to the media on the brain"; "Add New Skynet Schema same as media"; Rule 9.22). SKYNET_UPDATE_SINCE is that Release's tag
# (the release workflow sets it). Pictures and sounds: only files ADDED to media/ since then (Skynet's own, already in
# docs/Media_Licenses.csv, Rule 9.12); they go in defaults/media like the three sounds above (the panel copies in only what is
# missing, lib/seed.js). Sample Schemas: files ADDED or CHANGED in sample_schemas/ since then (OakBarn Brewery, 2026-11-17: a
# Skynet sample or Template "only used on a New Schema" never affects a user's Schema); they go in sample_schemas/, where the
# Windows Setup replaces the older copy of that Skynet sample. A Schema made from it is the user's own copy and is never touched.
if [ -n "${SKYNET_UPDATE_SINCE:-}" ] && git rev-parse -q --verify "refs/tags/$SKYNET_UPDATE_SINCE^{commit}" >/dev/null; then
  nm=0; ns=0
  while IFS= read -r f; do
    case "$f" in
      media/*) g="${f#media/}"; [ -f "$MSTAGE/media/$g" ] || continue
        mkdir -p "$STAGE/defaults/media/$(dirname "$g")"; cp -p "$MSTAGE/media/$g" "$STAGE/defaults/media/$g"; nm=$((nm+1)) ;;
      sample_schemas/*) g="${f#sample_schemas/}"; [ -f "$SSTAGE/sample_schemas/$g" ] || continue
        mkdir -p "$STAGE/sample_schemas/$(dirname "$g")"; cp -p "$SSTAGE/sample_schemas/$g" "$STAGE/sample_schemas/$g"; ns=$((ns+1)) ;;
    esac
  done < <(git diff --no-renames --name-only --diff-filter=A "$SKYNET_UPDATE_SINCE" HEAD -- media; git diff --name-only --diff-filter=AM "$SKYNET_UPDATE_SINCE" HEAD -- sample_schemas)
  echo "Added since $SKYNET_UPDATE_SINCE, in the Update Setup and panel zip: $nm pictures and sounds, $ns new or changed Sample Schema files"
fi

ZIP="Skynet_BrewPanel_$VERSION.zip"
rm -f "$OUT"/Skynet_BrewPanel_*.zip
( cd "$OUT/stage" && zip -qr -X "../$ZIP" BrewPanel )
echo "Built $OUT/$ZIP"
# The Media zip and Media Setup are made new only when the Skynet pictures or sounds changed (Rule 9.21). The release workflow
# sets SKYNET_MEDIA_BUILD=no when nothing in media/ changed since the last Media Setup, and puts that one on the Release instead.
# The pictures and sounds are still staged above, because the Full Setup always carries them (Rule 9.20).
MEDIA_BUILD="${SKYNET_MEDIA_BUILD:-yes}"
if [ "$MEDIA_BUILD" != no ]; then
  MZIP="Skynet_Media_$VERSION.zip"
  rm -f "$OUT"/Skynet_Media_*.zip
  ( cd "$OUT/stage/media" && zip -qr -X "../../$MZIP" BrewPanel )
  echo "Built $OUT/$MZIP"
else
  echo "No new Skynet pictures or sounds: the Media zip and Media Setup are not made again (Rule 9.21)."
fi
SZIP="Skynet_Sample_Schemas_$VERSION.zip"
rm -f "$OUT"/Skynet_Sample_Schemas_*.zip
( cd "$OUT/stage/samples" && zip -qr -X "../../$SZIP" BrewPanel )
echo "Built $OUT/$SZIP"

# The Skynet Language Fonts (OakBarn Brewery, 2026-11-20: "if you clone the checked install and only add the font package, the second
# exe has been checked already"; "lets do no bold and simplified"; Rules 9.12 point 4 and 9.24): Google Noto Sans (SIL Open Font
# License 1.1) for Chinese (Simplified), Japanese, Korean, Thai and Hindi, Regular only, as WOFF2 web fonts cut into small pieces, so
# a browser loads only the pieces a page uses. They are NOT in the panel zip or the Setups (the main Setup stays small): they are
# their own add-only zip and Setup. Fetched from npm (Fontsource) at these exact versions; no internet or npm: they are not made.
FONT_PACKAGES="noto-sans-sc@5.3.1 noto-sans-jp@5.3.1 noto-sans-kr@5.3.1 noto-sans-thai@5.3.0 noto-sans-devanagari@5.3.0"
FSTAGE="$OUT/stage/fonts/BrewPanel/fonts"
FONTS_OK=no
if [ "${SKYNET_FONTS_BUILD:-yes}" != no ] && command -v npm >/dev/null; then
  mkdir -p "$FSTAGE"; FTMP="$(mktemp -d)"; FONTS_OK=yes
  for p in $FONT_PACKAGES; do
    name="${p%@*}"
    if ! ( cd "$FTMP" && npm pack -q "@fontsource/$p" >/dev/null 2>&1 ); then FONTS_OK=no; echo "Could not get @fontsource/$p, so the Language Fonts are not made."; break; fi
    mkdir -p "$FTMP/$name" "$FSTAGE/$name"
    tar xzf "$FTMP/fontsource-$name-${p#*@}.tgz" -C "$FTMP/$name"
    cp -p "$FTMP/$name"/package/files/*-400-normal.woff2 "$FSTAGE/$name/"
    cp -p "$FTMP/$name/package/LICENSE" "$FSTAGE/$name/OFL.txt"
    # the Brain serves the pieces next to font.css (lib/helplang.js): WOFF2 only, from the same folder
    sed -E "s#url\(\./files/([^)]+\.woff2)\) format\('woff2'\), url\(\./files/[^)]+\.woff\) format\('woff'\)#url(./\1) format('woff2')#" \
      "$FTMP/$name/package/400.css" > "$FSTAGE/$name/font.css"
  done
  rm -rf "$FTMP"
  if [ "$FONTS_OK" = yes ]; then
    cp -p install/Language_Fonts_ReadMe.txt "$FSTAGE/ReadMe.txt"
    FZIP="Skynet_Language_Fonts_$VERSION.zip"
    rm -f "$OUT"/Skynet_Language_Fonts_*.zip
    ( cd "$OUT/stage/fonts" && zip -qr -X "../../$FZIP" BrewPanel )
    echo "Built $OUT/$FZIP ($(du -sh "$FSTAGE" | cut -f1))"
  fi
fi

cp -p install/ReadMe.txt install/windows/Skynet_Brewer.bat install/linux/install-skynet-brewer.sh "install/mac/Install Skynet Brewer.command" "$OUT/"
# First-time install by hand: one ReadMe and one first-install file per platform
for d in windows mac linux pi; do mkdir -p "$OUT/First_Install_$d"; done
cp -p install/windows/ReadMe_Windows.txt install/windows/Skynet_First_Install.bat install/windows/Skynet_Brewer.bat "$OUT/First_Install_windows/"
cp -p install/mac/ReadMe_Mac.txt "install/mac/Skynet First Install.command" "$OUT/First_Install_mac/"
cp -p install/linux/ReadMe_Linux.txt install/linux/skynet-first-install.sh "$OUT/First_Install_linux/"
cp -p install/pi/ReadMe_Raspberry_Pi.txt install/pi/skynet-first-install-pi.sh "$OUT/First_Install_pi/"
cp -p help/27-minimum-equipment.md "$OUT/Minimum_Equipment_and_Limitations.txt"

if command -v makensis >/dev/null; then
  EXE="Skynet_Brewer_Setup_$VERSION.exe"
  # Signing (docs/Code_Signing_Setup.md): only when the release workflow has set everything tools/sign-exe.sh needs.
  # Otherwise the Setup .exe is built unsigned, as before.
  SIGN=()
  rm -f "$OUT/signing.log"
  if [ -n "${SKYNET_SIGN_JAR:-}" ] && [ -n "${SKYNET_SIGN_ENDPOINT:-}" ] && [ -n "${SKYNET_SIGN_ACCOUNT:-}" ] \
     && [ -n "${SKYNET_SIGN_PROFILE:-}" ] && [ -n "${SKYNET_SIGN_TOKEN:-}" ]; then
    export SKYNET_SIGN_LOG="$(pwd)/$OUT/signing.log"
    : > "$SKYNET_SIGN_LOG"
    SIGN=(-DSIGN_SCRIPT="$(pwd)/tools/sign-exe.sh")
    echo "Signing is set up: the Setup .exe and its Uninstall .exe will be signed."
  else
    echo "Signing is not set up, so the Setup .exe is not signed (see docs/Code_Signing_Setup.md)."
  fi
  makensis -V2 -DSRC="$(pwd)/$STAGE" -DVERSION="$VERSION" -DOUTFILE="$(pwd)/$OUT/$EXE" "${SIGN[@]}" install/windows/SkynetBrewer.nsi
  echo "Built $OUT/$EXE"
  # The Full Setup (OakBarn Brewery, 2026-11-14, Rule 9.20): the same Setup with every Skynet picture and sound inside, so a new
  # install needs no separate Media Setup. The plain Setup and the Media Setup stay as they are (Rule #1, Never Take Away).
  FEXE="Skynet_Brewer_Full_Setup_$VERSION.exe"
  makensis -V2 -DSRC="$(pwd)/$STAGE" -DMEDIA_SRC="$(pwd)/$MSTAGE/media" -DSAMPLES_SRC="$(pwd)/$SSTAGE/sample_schemas" -DVERSION="$VERSION" -DOUTFILE="$(pwd)/$OUT/$FEXE" "${SIGN[@]}" install/windows/SkynetBrewer.nsi
  echo "Built $OUT/$FEXE"
  # The Skynet Language Fonts Setup (Rule 9.24): add-only, into the fonts folder of the panel. The main Setup is not changed.
  if [ "$FONTS_OK" = yes ]; then
    LEXE="Skynet_Language_Fonts_Setup_$VERSION.exe"
    makensis -V2 -DSRC="$(pwd)/$FSTAGE" -DVERSION="$VERSION" -DOUTFILE="$(pwd)/$OUT/$LEXE" "${SIGN[@]}" install/windows/SkynetLanguageFonts.nsi
    echo "Built $OUT/$LEXE"
  fi
  # The Skynet Media Setup and Sample Schemas Setup .exe are retired (OakBarn Brewery, 2026-11-17: "WE could get rid of both the
  # Schema Uodate and the Media updates"; Rule 9.22): the Update Setup brings what is new, the Full Setup has everything. Their
  # scripts (install/windows/SkynetMedia.nsi, SkynetSampleSchemas.nsi) are kept in Delete/. The zips stay for Mac, Linux and Pi.
  [ -f "$OUT/signing.log" ] && cat "$OUT/signing.log"
else
  echo "NSIS (makensis) is not installed, so no Windows installer was built. On Linux: sudo apt install nsis"
fi
rm -rf "$OUT/stage"
ls -la "$OUT"
