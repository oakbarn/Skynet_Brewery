#!/bin/bash
# MIT License Granted. Copyright (c) OakBarn Brewery 2026
#
# Skynet Brewery - FIRST TIME INSTALL for Mac.
# Run it once, after you have installed Node.js and unzipped the panel into ~/Brewing/BrewPanel
# (the Brewing folder in your home folder). It checks Node.js, gets the USB board support,
# puts "Skynet Brewer" on your Desktop and starts the panel.
# After this, start the panel every day with "Skynet Brewer" on the Desktop.

PANEL="$HOME/Brewing/BrewPanel"
PORT=8080
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

bold() { printf '\n\033[1m%s\033[0m\n' "$*"; }
stop() { printf '\n\033[31m%s\033[0m\n\n' "$*"; read -r -p "Press Enter to close this window. " _; exit 1; }

bold "=========================================="
bold " Skynet Brewery - first time install (Mac)"
bold "=========================================="

# 1. Is the panel where it should be?
[ -f "$PANEL/server.js" ] || stop "The panel is not in $PANEL
Unzip Skynet_BrewPanel_(date).zip so you get the folder Brewing/BrewPanel in your home
folder, with server.js inside it. See step 5 of ReadMe_Mac.txt"
cd "$PANEL" || exit 1
echo "[1/5] Found the panel in $PANEL"

# 2. Is Node.js installed, and new enough?
if ! command -v node >/dev/null; then
  open "https://nodejs.org/en/download"
  stop "Node.js is not installed. The panel cannot run without it.
The Node.js download page just opened. Install the LTS version (step 3 of ReadMe_Mac.txt),
then open this file again."
fi
if ! node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)"; then
  open "https://nodejs.org/en/download"
  stop "Node.js $(node -v) is too old. The panel needs version 22.13 or newer.
The Node.js download page just opened. Install the LTS version (step 3 of ReadMe_Mac.txt),
then open this file again."
fi
echo "[2/5] Node.js $(node -v) is installed. Good."

# 3. USB board support (the serialport package). Needs the internet.
echo "[3/5] Getting the USB board support. This needs the internet and can take a minute..."
if ! { npm install --no-audit --no-fund && node -e "import('serialport').catch(()=>process.exit(1))"; }; then
  echo
  echo "      Could not get the USB board support. The panel still works with the simulator."
  echo "      Check the internet, then open this file again to get it."
fi

# 4. The everyday start file on the Desktop
START="$HOME/Desktop/Skynet Brewer.command"
cat > "$START" <<EOF
#!/bin/bash
# MIT License Granted. Copyright (c) OakBarn Brewery 2026
# Starts the Skynet Brew Panel and opens it in your browser. Keep this window open while you brew.
export PATH="/usr/local/bin:/opt/homebrew/bin:\$PATH"
cd "$PANEL" || { echo "The panel is not in $PANEL"; read -r -p "Press Enter to close. " _; exit 1; }
command -v node >/dev/null || { echo "Node.js is not installed. Get it from https://nodejs.org"; read -r -p "Press Enter to close. " _; exit 1; }
( sleep 4; open "http://localhost:$PORT" ) &
# caffeinate keeps the Mac from falling asleep while the panel runs
caffeinate -i npm start
read -r -p "The panel has stopped. Press Enter to close this window. " _
EOF
chmod +x "$START"
echo "[4/5] Put \"Skynet Brewer\" on your Desktop."

# 5. Start the panel and open the browser
bold "[5/5] Starting the panel. Your browser opens it in a few seconds."
echo "If the Mac asks whether \"node\" may accept incoming network connections, click Allow."
echo "KEEP THIS WINDOW OPEN while you brew. Closing it stops the panel."
echo
( sleep 5; open "http://localhost:$PORT" ) &
caffeinate -i npm start
read -r -p "The panel has stopped. Press Enter to close this window. " _
