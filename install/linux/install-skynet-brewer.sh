#!/usr/bin/env bash
# Skynet Brewer installer for Linux and the Raspberry Pi
# MIT License Granted. Copyright (c) OakBarn Brewery 2026
#
# Run it from a terminal (do NOT put sudo in front; it asks for your password when it needs it):
#   bash install-skynet-brewer.sh
#
# It looks for the panel in this order: the BrewPanel folder this script sits in (BrewPanel/install/linux),
# a Skynet*.zip next to this script, or a BrewPanel folder next to this script.
# The extra Sample Schemas: a Skynet_Sample_Schemas*.zip next to this file (Rule 9.13).
# The Skynet pictures and sounds: a Skynet_Media*.zip next to this script (Rule 9.12).
# It installs to ~/Brewing/BrewPanel, gets Node.js if needed, and adds a "Skynet Brewer" launcher.
# On a Raspberry Pi it also makes the panel start by itself when the Pi starts (a systemd service).
#
# Options:  --dir <folder>   install somewhere else
#           --service        start by itself at boot (the default on a Pi)
#           --no-service     do not (the default on other Linux computers)
#           --yes            take the default answer to every question
set -euo pipefail

PORT=8080
NODE_MIN=22.13.0
SERVICE_NAME=skynet-brewer
DEST="$HOME/Brewing/BrewPanel"
SERVICE=ask
YES=no
while [ $# -gt 0 ]; do
  case "$1" in
    --dir) DEST="$2"; shift ;;
    --service) SERVICE=yes ;;
    --no-service) SERVICE=no ;;
    --yes|-y) YES=yes ;;
    -h|--help) sed -n '2,19p' "$0"; exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
  shift
done

say()  { printf '\n\033[1m%s\033[0m\n' "$*"; }
fail() { printf '\n\033[31m%s\033[0m\n' "$*"; exit 1; }
# ask "Question" Y|N : returns 0 for yes
ask() {
  local def="$2" a
  if [ "$YES" = yes ] || [ ! -t 0 ]; then [ "$def" = Y ]; return; fi
  if [ "$def" = Y ]; then read -r -p "$1 [Y/n] " a; a="${a:-y}"; else read -r -p "$1 [y/N] " a; a="${a:-n}"; fi
  case "$a" in [Yy]*) return 0 ;; *) return 1 ;; esac
}

if [ "$(id -u)" = 0 ]; then
  fail "Please run this without sudo:  bash $0   (it asks for your password when it needs it)"
fi

IS_PI=no
if [ -r /proc/device-tree/model ] && grep -qai "raspberry pi" /proc/device-tree/model; then IS_PI=yes; fi
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

say "Skynet Brewer installer$([ "$IS_PI" = yes ] && echo " (Raspberry Pi)")"

# ---------------------------------------------------------------- Where is the panel?
unzip_to() {   # unzip_to file.zip folder
  if command -v unzip >/dev/null; then unzip -q "$1" -d "$2"
  elif command -v python3 >/dev/null; then python3 -m zipfile -e "$1" "$2"
  else sudo apt-get install -y unzip && unzip -q "$1" -d "$2"; fi
}
SRC=""
if [ -f "$HERE/../../server.js" ]; then
  SRC="$(cd "$HERE/../.." && pwd)"
else
  ZIP="$(ls -t "$HERE"/Skynet*.zip 2>/dev/null | grep -v "Skynet_Media" | grep -v "Skynet_Sample_Schemas" | head -n 1 || true)"
  if [ -n "$ZIP" ]; then
    echo "Unpacking $(basename "$ZIP")"
    unzip_to "$ZIP" "$TMP/zip"
    SRC="$(dirname "$(find "$TMP/zip" -maxdepth 3 -name server.js | head -n 1)")"
  elif [ -f "$HERE/BrewPanel/server.js" ]; then
    SRC="$HERE/BrewPanel"
  fi
fi
[ -n "$SRC" ] && [ -f "$SRC/server.js" ] || fail "Could not find the panel. Put this script next to the Skynet .zip file and run it again."

# ---------------------------------------------------------------- Node.js
node_ok() { command -v node >/dev/null && node -e "const [a,b]=process.versions.node.split('.').map(Number),[c,d]='$NODE_MIN'.split('.').map(Number);process.exit(a>c||(a===c&&b>=d)?0:1)" 2>/dev/null; }
if node_ok; then
  echo "Node.js $(node -v) is installed."
else
  if command -v node >/dev/null; then echo "Node.js $(node -v) is too old. The panel needs $NODE_MIN or newer."; else echo "Node.js is not installed. The panel runs on it (free)."; fi
  if command -v apt-get >/dev/null && ask "Install Node.js (LTS) now?" Y; then
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    hash -r
  fi
  node_ok || fail "Please install Node.js $NODE_MIN or newer from https://nodejs.org (or your system's package manager), then run this again."
  echo "Node.js $(node -v) is installed."
fi
NODE_BIN="$(command -v node)"

# ---------------------------------------------------------------- Stop a running panel
service_exists() { command -v systemctl >/dev/null && systemctl list-unit-files "$SERVICE_NAME.service" 2>/dev/null | grep -q "$SERVICE_NAME"; }
if service_exists && systemctl is-active --quiet "$SERVICE_NAME"; then
  echo "Stopping the running panel service for the update"
  sudo systemctl stop "$SERVICE_NAME"
fi
port_busy() { if command -v ss >/dev/null; then ss -ltn 2>/dev/null | grep -q ":$PORT "; else return 1; fi; }
while port_busy; do
  echo "Something is still running on port $PORT (probably the panel). Stop it (Ctrl+C in its window), then press Enter."
  [ -t 0 ] && [ "$YES" = no ] || fail "Stop the panel and run this again."
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
    if ls "$DEST"/help/fr/*.md >/dev/null 2>&1; then
      mkdir -p "$DEST/help/backups/before_update_$STAMP/fr"
      cp -p "$DEST"/help/fr/* "$DEST/help/backups/before_update_$STAMP/fr/"
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
  # Official Skynet (Rule 9.14): the panel makes its program files Read-only once it has checked them; let this update replace them
  for c in server.js importer.js package.json lib public templates firmware install samples; do
    if [ -e "$DEST/$c" ]; then chmod -R u+w "$DEST/$c"; fi
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
  unzip_to "$MZIP" "$TMP/media"
  mkdir -p "$DEST/media"
  cp -Rn "$TMP/media/BrewPanel/defaults/media/." "$DEST/media/" 2>/dev/null || true
elif [ ! -d "$DEST/media/Images/Skynet" ]; then
  echo "No Skynet pictures and sounds yet. Download Skynet_Media_(version).zip from"
  echo "https://github.com/oakbarn/Skynet_Brewery/releases/latest, put it next to this file and run it again."
fi
# The extra Sample Schemas are their own download too, Skynet_Sample_Schemas_(version).zip (Rule 9.13). One next to this file is
# added to sample_schemas/; a sample you already have is never changed and nothing is deleted (Rule #1, Never Take Away).
SZIP="$(ls -t "$HERE"/Skynet_Sample_Schemas*.zip 2>/dev/null | head -n 1 || true)"
if [ -n "$SZIP" ]; then
  echo "Adding the Sample Schemas from $(basename "$SZIP") (a sample you already have is never changed)"
  unzip_to "$SZIP" "$TMP/samples"
  mkdir -p "$DEST/sample_schemas"
  cp -Rn "$TMP/samples/BrewPanel/sample_schemas/." "$DEST/sample_schemas/" 2>/dev/null || true
fi
chmod +x "$DEST"/install/linux/*.sh "$DEST"/install/mac/*.command 2>/dev/null || true

echo "Getting the USB support package (needs internet)"
( cd "$DEST" && npm install --no-audit --no-fund ) || echo "Could not get it. The panel still works; for USB boards run 'npm install' in $DEST later."

if getent group dialout >/dev/null && ! id -nG "$USER" | grep -qw dialout; then
  echo "Letting $USER use USB boards (dialout group)"
  sudo usermod -aG dialout "$USER" && NEED_RELOGIN=yes
fi

# ---------------------------------------------------------------- Start by itself at boot?
HAS_SYSTEMD=no
[ -d /run/systemd/system ] && command -v systemctl >/dev/null && HAS_SYSTEMD=yes
if [ "$SERVICE" = ask ]; then
  SERVICE=no
  if [ "$HAS_SYSTEMD" = yes ]; then
    if [ "$IS_PI" = yes ]; then ask "Start the panel by itself whenever the Pi starts? (recommended on the brain Pi)" Y && SERVICE=yes
    else ask "Start the panel by itself whenever this computer starts?" N && SERVICE=yes; fi
  fi
fi
if [ "$SERVICE" = yes ]; then
  [ "$HAS_SYSTEMD" = yes ] || fail "This computer has no systemd, so the panel cannot start by itself. Run again with --no-service."
  echo "Setting up the $SERVICE_NAME service"
  sudo tee "/etc/systemd/system/$SERVICE_NAME.service" >/dev/null <<EOF
# Skynet Brew Panel. Made by install-skynet-brewer.sh
[Unit]
Description=Skynet Brew Panel
After=network-online.target
Wants=network-online.target

[Service]
User=$USER
WorkingDirectory=$DEST
ExecStart=$NODE_BIN --no-warnings server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
  sudo systemctl daemon-reload
  sudo systemctl enable "$SERVICE_NAME" >/dev/null 2>&1
  sudo systemctl restart "$SERVICE_NAME"
elif service_exists; then
  echo "Turning off the old $SERVICE_NAME service"
  sudo systemctl disable --now "$SERVICE_NAME" >/dev/null 2>&1 || true
fi

# ---------------------------------------------------------------- Launcher
cat > "$DEST/start-skynet-brewer.sh" <<EOF
#!/usr/bin/env bash
# Starts the Skynet Brew Panel and opens it in your browser. Made by install-skynet-brewer.sh
cd "$DEST"
if systemctl is-active --quiet $SERVICE_NAME 2>/dev/null; then
  xdg-open http://localhost:$PORT >/dev/null 2>&1 &
  exit 0
fi
( sleep 4; xdg-open http://localhost:$PORT >/dev/null 2>&1 ) &
# closed from the panel (Menu > Close Skynet Brewer): this window closes too; stopped by an error: it stays open
npm start || read -r -p "The panel stopped because of an error (see above). Press Enter to close this window. "
EOF
chmod +x "$DEST/start-skynet-brewer.sh"

TERMINAL=true
[ "$SERVICE" = yes ] && TERMINAL=false
DESKTOP_FILE="[Desktop Entry]
Type=Application
Name=Skynet Brewer
Comment=Skynet Brew Panel
Exec=\"$DEST/start-skynet-brewer.sh\"
Icon=$DEST/install/icon.png
Terminal=$TERMINAL
Categories=Utility;
"
mkdir -p "$HOME/.local/share/applications"
printf '%s' "$DESKTOP_FILE" > "$HOME/.local/share/applications/skynet-brewer.desktop"
DESKTOP_DIR="$(xdg-user-dir DESKTOP 2>/dev/null || echo "$HOME/Desktop")"
if [ -d "$DESKTOP_DIR" ]; then
  printf '%s' "$DESKTOP_FILE" > "$DESKTOP_DIR/skynet-brewer.desktop"
  chmod +x "$DESKTOP_DIR/skynet-brewer.desktop"
  command -v gio >/dev/null && gio set "$DESKTOP_DIR/skynet-brewer.desktop" metadata::trusted true 2>/dev/null || true
  echo "Added Skynet Brewer to the Desktop and the applications menu."
else
  echo "Added Skynet Brewer to the applications menu (no Desktop folder found)."
fi

# ---------------------------------------------------------------- Done
IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
say "Skynet Brewer is installed in $DEST"
if [ "$SERVICE" = yes ]; then
  echo "The panel is running now and starts by itself at every boot."
  echo "  Stop it:   sudo systemctl stop $SERVICE_NAME      Start it: sudo systemctl start $SERVICE_NAME"
  echo "  Messages:  journalctl -u $SERVICE_NAME -f"
else
  echo "Start it with Skynet Brewer on the Desktop (or run $DEST/start-skynet-brewer.sh)."
fi
echo "Open it on this computer at http://localhost:$PORT"
[ -n "$IP" ] && echo "From a phone or PC at home:      http://$IP:$PORT"
echo "The first time, create the admin account and save the recovery code."
[ "${NEED_RELOGIN:-no}" = yes ] && echo "For USB boards: log out and back in (or restart) once, so the new USB permission takes effect."
exit 0
