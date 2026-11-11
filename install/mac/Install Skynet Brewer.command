#!/bin/bash
# Skynet Brewer installer for Mac
# MIT License Granted. Copyright (c) OakBarn Brewery 2026
#
# Double-click it. The first time, macOS may say it "cannot be opened": right-click it, choose Open, then Open again.
#
# It looks for the panel in this order: the BrewPanel folder this file sits in (BrewPanel/install/mac),
# a Skynet*.zip next to this file, or a BrewPanel folder next to this file (Safari unzips downloads by itself).
# The extra Sample Schemas: a Skynet_Sample_Schemas*.zip next to this file (Rule 9.13).
# The Skynet pictures and sounds: a Skynet_Media*.zip (or the folder Safari unzipped it to) next to this file (Rule 9.12).
# It installs to ~/Brewing/BrewPanel and puts "Skynet Brewer" on the Desktop.
set -eu

PORT=8080
NODE_MIN=22.13.0
DEST="$HOME/Brewing/BrewPanel"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# ask "Question" Y|N : returns 0 for yes
ask() {
  local def="$2" a
  if [ "$def" = Y ]; then read -r -p "$1 [Y/n] " a; a="${a:-y}"; else read -r -p "$1 [y/N] " a; a="${a:-n}"; fi
  case "$a" in [Yy]*) return 0 ;; *) return 1 ;; esac
}
say()  { printf '\n\033[1m%s\033[0m\n' "$*"; }
fail() { printf '\n\033[31m%s\033[0m\n' "$*"; read -r -p "Press Enter to close. " _; exit 1; }

HERE="$(cd "$(dirname "$0")" && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

say "Skynet Brewer installer (Mac)"

# ---------------------------------------------------------------- Where is the panel?
SRC=""
if [ -f "$HERE/../../server.js" ]; then
  SRC="$(cd "$HERE/../.." && pwd)"
else
  ZIP="$(ls -t "$HERE"/Skynet*.zip 2>/dev/null | grep -v "Skynet_Media" | grep -v "Skynet_Sample_Schemas" | head -n 1 || true)"
  if [ -n "$ZIP" ]; then
    echo "Unpacking $(basename "$ZIP")"
    unzip -q "$ZIP" -d "$TMP/zip"
    SRC="$(dirname "$(find "$TMP/zip" -maxdepth 3 -name server.js | head -n 1)")"
  elif [ -f "$HERE/BrewPanel/server.js" ]; then
    SRC="$HERE/BrewPanel"
  fi
fi
[ -n "$SRC" ] && [ -f "$SRC/server.js" ] || fail "Could not find the panel. Put this file next to the Skynet .zip file and open it again."

# ---------------------------------------------------------------- Node.js
node_ok() { command -v node >/dev/null && node -e "const [a,b]=process.versions.node.split('.').map(Number),[c,d]='$NODE_MIN'.split('.').map(Number);process.exit(a>c||(a===c&&b>=d)?0:1)" 2>/dev/null; }
if ! node_ok; then
  if command -v brew >/dev/null; then
    echo "Installing Node.js with Homebrew"
    brew install node || true
  fi
fi
if ! node_ok; then
  open "https://nodejs.org/en/download"
  fail "The panel runs on Node.js (free), and this Mac does not have it (or has an old one).
The download page just opened: get the macOS Installer (.pkg) for the LTS version and install it.
Then open this installer again."
fi
echo "Node.js $(node -v) is installed."

# ---------------------------------------------------------------- Stop a running panel
while lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do
  echo "Something is still running on port $PORT (probably the panel). Stop it (Ctrl+C in its Terminal window), then press Enter."
  read -r _
done

# ---------------------------------------------------------------- Copy the files
STAMP="$(date +%Y%m%dT%H%M%S)"
UPDATE=no
[ -f "$DEST/server.js" ] && UPDATE=yes
mkdir -p "$DEST"
DEST="$(cd "$DEST" && pwd)"
# Your folders (config, data, media, scripts) are not in the release (samples are in defaults/, copied by the panel on
# its first start). They are kept unless you choose to replace one. Older releases that still carry them only add new files.
if [ "$SRC" != "$DEST" ]; then
  if [ "$UPDATE" = yes ]; then
    echo "Updating the panel in $DEST"
    echo "Your own folders: config (layout, tabs, devices, settings), data (brew log, users, passwords, logins),"
    echo "media (pictures and sounds) and scripts (Processes)."
    # What this update does (Rule 9.8, Fritz 2026-11-06): 1 Start Fresh, 2 reset all users, 3 keep everything (the original
    # No: the default, and what a non-interactive run does). 1 and 2 each have a warning with No as the default; No backs out.
    FRESH=no
    echo ""
    echo "Skynet Brewer is already installed here. The program files are always updated. Pick what this update does:"
    echo "  1. Start Fresh: delete everything"
    echo "     Deletes every Schema, setting, user, password, the brew log and every Process, for good."
    echo "     Kept: pictures and sounds (media) and the backups folder. A warning comes next."
    echo "  2. Update the program and reset all users"
    echo "     Deletes every user, password, sign-in and the recovery code. You make the admin account again."
    echo "     Your Schemas, settings, brew log, Processes, pictures and sounds are kept."
    echo "  3. Update the program and keep everything (recommended)"
    echo "     Your Schemas, settings, users and passwords, brew log, Processes, pictures and sounds stay as they are."
    CHOICE=3
    if [ "${YES:-no}" != yes ] && [ -t 0 ]; then
      while :; do
        read -r -p "Pick 1, 2 or 3 [3] " CHOICE; CHOICE="${CHOICE:-3}"
        case "$CHOICE" in 1|2|3) break ;; *) echo "Type 1, 2 or 3." ;; esac
      done
    fi
    if [ "$CHOICE" = 2 ]; then
      printf '\n\033[1;33m%s\033[0m\n' "Reset all users? These are deleted for good, with no backup:"
      echo "  - every user and password, every sign-in (on every computer and phone) and the recovery code"
      echo "Kept: Schemas and settings (config), brew log and saved values (data), Processes (scripts), pictures and sounds (media)."
      if ask "Really reset all users? (No backs out; nothing is deleted)" N; then
        rm -f "$DEST/data/users.json" "$DEST/data/users.json.tmp" "$DEST/data/sessions.json" "$DEST/data/sessions.json.tmp"
        echo "Reset all users: every user, password, sign-in and the recovery code deleted. Make the admin account again."
      else
        echo "Backed out. Nothing was deleted."
      fi
    elif [ "$CHOICE" = 1 ]; then
      printf '\n\033[1;31m%s\033[0m\n' "WARNING: ALL EXISTING DATA WILL BE DELETED, for good, with no backup:"
      echo "  - every Schema, Tab, Device, Widget and setting (config)"
      echo "  - every user, password, sign-in and the recovery code, the brew log and saved values (data)"
      echo "  - every Process (scripts)"
      echo "Kept: your pictures and sounds (media) and the backups folder. You make the admin account again."
      if ask "Really delete it all and Start Fresh? (No backs out; nothing is deleted)" N; then
        rm -rf "$DEST/config" "$DEST/data" "$DEST/scripts"
        FRESH=yes
        echo "Start Fresh: users, Schemas, settings, brew log and Processes deleted. The panel starts again from the samples."
      else
        echo "Backed out. Nothing was deleted."
      fi
    fi
    if [ "$FRESH" = no ] && ! ask "Keep all of them as they are? (No asks about each one)" Y; then
      for d in "config:the sample layout" "scripts:the sample Processes" "data:a fresh start (you create the admin account again)"; do
        name="${d%%:*}"
        [ -d "$DEST/$name" ] || continue
        if ask "Replace your $name folder with ${d#*:}? Yours is moved to backups/${name}_$STAMP first." N; then
          mkdir -p "$DEST/backups" && mv "$DEST/$name" "$DEST/backups/${name}_$STAMP"
          echo "Moved $name to backups/${name}_$STAMP. The panel starts it again from the samples."
        fi
      done
    fi
    if ls "$DEST"/help/*.md >/dev/null 2>&1; then
      mkdir -p "$DEST/help/backups/before_update_$STAMP"
      cp -p "$DEST"/help/*.md "$DEST/help/backups/before_update_$STAMP/"
      echo "Help pages are replaced by the new manual. The old ones are in help/backups/before_update_$STAMP"
    fi
  else
    echo "Full install to $DEST"
  fi
  # The panel ships only the 3 Vessel sample (Rule 9.13). The three sample folders older versions put in samples/configs (now in
  # the Sandbox) are MOVED, never deleted, to backups/old_samples_<date>. Nothing else is touched: your own Schemas are in
  # config/schemas, any other folder in samples/configs stays, and sample_schemas/ is never touched here.
  for old in two-vessel-one-pump brewzilla-brew-day oakbarn-brucontrol; do
    if [ -d "$DEST/samples/configs/$old" ]; then
      mkdir -p "$DEST/backups/old_samples_$STAMP"
      mv "$DEST/samples/configs/$old" "$DEST/backups/old_samples_$STAMP/$old"
      echo "The old sample $old was moved to backups/old_samples_$STAMP (the panel ships only the 3 Vessel sample now)."
    fi
  done
  ( cd "$SRC" && find . -type f ! -path './data/*' ! -path './node_modules/*' ) | while IFS= read -r f; do
    case "$f" in
      ./config/*|./media/*|./scripts/*) if [ -e "$DEST/$f" ]; then continue; fi ;;
    esac
    mkdir -p "$DEST/$(dirname "$f")"
    cp -p "$SRC/$f" "$DEST/$f"
  done
fi
# The Skynet pictures and sounds are their own download, Skynet_Media_(version).zip (Rule 9.12). One next to this file is
# added to media/; a picture or sound you already have is never changed and nothing is deleted (Rule #1, Never Take Away).
MZIP="$(ls -t "$HERE"/Skynet_Media*.zip 2>/dev/null | head -n 1 || true)"
if [ -n "$MZIP" ]; then
  echo "Adding the Skynet pictures and sounds from $(basename "$MZIP") (a file you already have is never changed)"
  unzip -q "$MZIP" -d "$TMP/media"
  mkdir -p "$DEST/media"
  cp -Rn "$TMP/media/BrewPanel/defaults/media/." "$DEST/media/" 2>/dev/null || true
elif MDIR="$(for d in "$HERE"/*/; do [ -d "$d/defaults/media" ] && [ ! -f "$d/server.js" ] && echo "$d" && break; done)" && [ -n "$MDIR" ]; then
  # Safari unzips a download by itself: the Media zip then is a folder with only defaults/media in it
  echo "Adding the Skynet pictures and sounds from $(basename "$MDIR") (a file you already have is never changed)"
  mkdir -p "$DEST/media"
  cp -Rn "$MDIR/defaults/media/." "$DEST/media/" 2>/dev/null || true
elif [ ! -d "$DEST/media/Images/Skynet" ]; then
  echo "No Skynet pictures and sounds yet. Download Skynet_Media_(version).zip from"
  echo "https://github.com/oakbarn/Skynet_Brewery/releases/latest, put it next to this file and run it again."
fi
# The extra Sample Schemas are their own download too, Skynet_Sample_Schemas_(version).zip (Rule 9.13). One next to this file is
# added to sample_schemas/; a sample you already have is never changed and nothing is deleted (Rule #1, Never Take Away).
SZIP="$(ls -t "$HERE"/Skynet_Sample_Schemas*.zip 2>/dev/null | head -n 1 || true)"
if [ -n "$SZIP" ]; then
  echo "Adding the Sample Schemas from $(basename "$SZIP") (a sample you already have is never changed)"
  unzip -q "$SZIP" -d "$TMP/samples"
  mkdir -p "$DEST/sample_schemas"
  cp -Rn "$TMP/samples/BrewPanel/sample_schemas/." "$DEST/sample_schemas/" 2>/dev/null || true
elif SDIR="$(for d in "$HERE"/*/; do [ -d "$d/sample_schemas" ] && [ ! -f "$d/server.js" ] && echo "$d" && break; done)" && [ -n "$SDIR" ]; then
  # Safari unzips a download by itself: the Sample Schemas zip then is a folder with only sample_schemas in it
  echo "Adding the Sample Schemas from $(basename "$SDIR") (a sample you already have is never changed)"
  mkdir -p "$DEST/sample_schemas"
  cp -Rn "$SDIR/sample_schemas/." "$DEST/sample_schemas/" 2>/dev/null || true
fi
# Files copied from a download are marked "from the internet"; clear that so they open without warnings
xattr -dr com.apple.quarantine "$DEST" 2>/dev/null || true

echo "Getting the USB support package (needs internet)"
( cd "$DEST" && npm install --no-audit --no-fund ) || echo "Could not get it. The panel still works; for USB boards run 'npm install' in $DEST later."

# ---------------------------------------------------------------- Desktop launcher
LAUNCHER="$HOME/Desktop/Skynet Brewer.command"
cat > "$LAUNCHER" <<EOF
#!/bin/bash
# MIT License Granted. Copyright (c) OakBarn Brewery 2026
# Starts the Skynet Brew Panel and opens it in your browser. Made by the Skynet Brewer installer.
export PATH="/opt/homebrew/bin:/usr/local/bin:\$PATH"
cd "$DEST"
( sleep 4; open http://localhost:$PORT ) &
npm start
EOF
chmod +x "$LAUNCHER"

say "Skynet Brewer is installed in $DEST"
echo "Start it with Skynet Brewer on the Desktop. Your browser opens the panel at http://localhost:$PORT"
IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
[ -n "$IP" ] && echo "From a phone or PC at home: http://$IP:$PORT"
echo "To stop it, press Ctrl+C in its Terminal window."
echo "The first time, create the admin account and save the recovery code."
read -r -p "Press Enter to close. " _
