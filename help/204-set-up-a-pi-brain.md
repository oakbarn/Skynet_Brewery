# Set Up a Pi Brain

A Raspberry Pi 4 (or newer) can be the **Brain**: it runs Skynet, keeps every file, and starts by itself whenever it has
power. Your boards plug into the Pi's USB sockets, and you open the panel from any browser: a Windows PC, a Mac, an iPhone
or an Android phone. Do the steps in order. It takes about an hour, most of it waiting.

## Step 1. What you need

| Part | Notes |
|---|---|
| Raspberry Pi 4 (2 GB or more) or Pi 5 | 4 GB is plenty. |
| Its power supply | Pi 4: **5.1 V 3 A, USB-C** (the official 15 W supply). Phone chargers cause random restarts. |
| microSD card, **32 GB or bigger, A1 or A2** | SanDisk or Samsung. "High Endurance" lasts longer. |
| A card reader for your PC | Many laptops have a slot. |
| **micro-HDMI to HDMI** cable, a screen, a USB keyboard and mouse | Only for the first start. |
| Ethernet cable to the router | Best on brew day. WiFi works too. |
| USB cable **A to B** (square "printer" plug) | Arduino Mega to the Pi. Use one that carries data, not a charge-only cable. |

## Step 2. Write the Pi's system to the card (on your PC)

1. Install **Raspberry Pi Imager** (from `raspberrypi.com/software`).
2. **Device:** your Pi. **Operating System:** **Raspberry Pi OS (64-bit)**, the one with a desktop. **Storage:** the card. Check its size, so you don't wipe another drive.
3. **Next > Edit Settings:** Hostname **`skynet`**, a user name and password (write them down), WiFi only if you don't use Ethernet, your time zone. On the Services tab, **Enable SSH** (optional).
4. **Save > Yes > Yes**, and wait for **Write Successful**.

## Step 3. First start (on the Pi)

1. Card in the slot under the Pi. Screen in the HDMI socket nearest the power socket, then keyboard, mouse and Ethernet.
2. Plug the power in **last**. The first start takes a few minutes and may restart once.
3. Follow the Welcome window and let it update.

**The terminal:** the black screen icon at the top, or **Ctrl + Alt + T**. Type a line and press **Enter**. A password shows
nothing while you type; that is normal.

## Step 4. Install Skynet

1. On the Pi's browser, open the Skynet download page (see [Installing the panel](19-installing)) and save these three in **Downloads**: `Skynet_BrewPanel_<date>.zip`, `install-skynet-brewer.sh` and `Skynet_Media_<date>.zip`.
2. In the terminal:
   ```
   cd ~/Downloads
   bash install-skynet-brewer.sh
   ```
   No `sudo` in front: it asks for the Pi's password when it needs it.
3. **Install Node.js (LTS) now?** **Yes.** **Start by itself at boot:** **Yes.**
4. Restart the Pi once: `sudo reboot`. From then on Skynet starts by itself every time the Pi gets power.

## Step 5. First time in the panel

1. Open `http://skynet.local:8080` (on the Pi: **Skynet Brewer** on its desktop).
2. Make the **admin account** and write down the **recovery code**. See [Login, users and passwords](10-login).
3. Pick a sample Schema to start from.

**Two Brains:** a Windows Skynet and a Pi Skynet are two separate Brains. That is fine while each one drives **its own**
boards. Never plug one board into both. To bring Schemas, Processes and pictures from the computer to the Pi, use
[Move Brain](119-move-brain).

## Step 6. Open it from a PC or a phone

- **At home:** any browser, `http://skynet.local:8080`. iPhone: Safari, then **Share > Add to Home Screen**.
- **The name doesn't open?** Type `hostname -I` in the Pi's terminal. The first number (for example `192.168.1.80`) gives `http://192.168.1.80:8080`. A **DHCP reservation** in your router keeps that number from changing.
- **Away from home:** Tailscale. Never open a port on your router. On the Pi type `curl -fsSL https://tailscale.com/install.sh | sh`, then `sudo tailscale up`, and sign in with the **same** Tailscale account your phone and PC use. Then open `http://skynet:8080`. See [Installing Tailscale on Windows](00-tailscale-windows).

## Step 7. An Arduino Mega on the Pi

1. On your PC, install the **Arduino IDE** and, in **Tools > Manage Libraries**, **OneWire** and **DallasTemperature**.
2. Open `BrewPanel\firmware\Mega_BrewPanel\Mega_BrewPanel.ino`. Change nothing for a first test.
3. Plug the Mega into the PC. **Tools > Board:** Arduino Mega or Mega 2560. **Tools > Port:** its COM port. Click **Upload**.
4. Unplug it and plug it into the **Pi**. The Pi needs no driver.
5. **Devices > Add Interface:** Board **Arduino Mega**, Type **USB**, port `/dev/ttyACM0` (genuine board) or `/dev/ttyUSB0` (clone).

A Mega that still has another program's firmware on it won't talk to Skynet until Skynet's firmware is loaded. Use a spare
Mega for testing, not one your brewery needs today.

## Step 8. An LED test set

LEDs stand in for Pumps, Valves and Heating Elements, so a Process can be tried at the desk with nothing wet and nothing on
mains power. These pins are already in the Skynet Mega program, so nothing needs changing.

| Use | LED | Mega pins |
|---|---|---|
| Pumps | red, 5 mm | D22, D23, D24, D25 |
| Valves | green, 5 mm | D2 to D6 |
| Heating Elements (On/Off), Fan, Light | yellow, 5 mm | D7 to D12 |
| PWM Devices (Heating Element on PWM, pump speed) | **RGB, common cathode, diffused** | D44 red leg, D45 green leg, D46 blue leg |
| Push buttons | 6 mm tactile | D30 to D33 |
| A knob (analog input) | 10K potentiometer | A0 |
| Temperature probes | DS18B20 | D40 |

**Wiring:**

- **Plain LED:** **5V** → 330 ohm resistor → LED **long** leg. LED **short** leg → the pin. Skynet turns an output **On by
  pulling the pin LOW** (like a relay board), so wired this way the LED lights when the Device is **On**.
- **RGB LED:** longest leg → **GND**. Each color leg → its own 220 ohm resistor → its PWM pin. 0 % = dark, 100 % = full bright.
- **Push button:** one leg → the pin, the other → GND. No resistor.
- **Potentiometer:** outer legs → 5V and GND, middle leg → A0.
- **DS18B20:** red → 5V, black → GND, yellow → D40, and one 4.7K resistor between D40 and 5V.

Not for Skynet: **WS2812 / NeoPixel** LED strips (Skynet has no code for them) and **common-anode** RGB LEDs (they would be
bright at 0 %). Never wire an LED without its resistor.

## The technical side

- The installer adds the service `skynet-brewer`. In the terminal: `systemctl status skynet-brewer` (is it running?),
  `sudo systemctl restart skynet-brewer`, `journalctl -u skynet-brewer -f` (its messages).
- Several boards of the same kind: use the board's permanent name from `ls /dev/serial/by-id/` as its port, so it can't swap
  places after a restart.
- Each plain LED draws about 9 mA; all 15 at once is about 135 mA, inside the Mega's safe total of about 200 mA.
- More LEDs later: add pins to the lists at the top of `Mega_BrewPanel.ino` and upload it again.
- Switch the Pi off with `sudo shutdown -h now`, wait for the green light to stop, then unplug it.
- The Pi's own pins can also be an Interface (3.3 V, never 5 V): see [Raspberry Pi GPIO pins](78-raspberry-pi-gpio-pins).
- The same steps, with a parts list: `docs/Pi_Brain_Setup_Guide.md` in the panel folder.
