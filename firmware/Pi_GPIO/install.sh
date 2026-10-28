#!/bin/bash
# Skynet Pi GPIO installer: makes this Raspberry Pi's own GPIO pins an Interface of the Skynet Brain.
# Run on the Pi:   sudo bash install.sh
# It installs python3-lgpio and python3-spidev, turns on SPI, I2C and 1-Wire (GPIO 4), copies the program to
# /opt/skynet-pi-gpio and starts it as a service that comes back after every restart. Run it again to update.
set -e
if [ "$(id -u)" != "0" ]; then echo "Please run:  sudo bash install.sh"; exit 1; fi
HERE="$(cd "$(dirname "$0")" && pwd)"
DEST=/opt/skynet-pi-gpio

echo "== Installing Python parts (lgpio, spidev)"
apt-get update -qq
apt-get install -y python3-lgpio python3-spidev

if command -v raspi-config >/dev/null; then
  echo "== Turning on SPI (RTD / thermocouple boards), I2C (ADS1115) and 1-Wire on GPIO 4 (DS18B20 probes)"
  raspi-config nonint do_spi 0
  raspi-config nonint do_i2c 0
  raspi-config nonint do_onewire 0
  NEED_REBOOT=1
fi

echo "== Copying the program to $DEST"
mkdir -p "$DEST"
cp "$HERE/skynet_pi_gpio.py" "$DEST/"
[ -f "$DEST/settings.json" ] || cp "$HERE/settings.example.json" "$DEST/settings.json"
cp "$HERE/skynet-pi-gpio.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable skynet-pi-gpio
systemctl restart skynet-pi-gpio

echo
echo "Done. The Pi's pins listen on TCP port 4100."
echo "In the panel: Devices page > Add Interface, Board = Raspberry Pi, Type = Ethernet,"
echo "  address 127.0.0.1 when this Pi is the Brain, or this Pi's address ($(hostname -I | cut -d' ' -f1)) when it is not."
echo "Settings (name, relay boards, load cells): $DEST/settings.json, then:  sudo systemctl restart skynet-pi-gpio"
[ -n "$NEED_REBOOT" ] && echo "Restart the Pi once (sudo reboot) so SPI, I2C and 1-Wire turn on."
exit 0
