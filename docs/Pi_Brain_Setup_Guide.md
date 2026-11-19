# Set up a Raspberry Pi 4 as the Brain (with a Mega LED test set)

A step-by-step path from an empty memory card to a Pi 4 Brain running Skynet, with an Arduino Mega on the Pi's USB and a
small LED test set on the Mega, reached from a Windows PC and an iPhone. It uses only what each Skynet release already ships:
the Linux and Pi installer (`install-skynet-brewer.sh`), the panel zip, the Mega firmware (`firmware/Mega_BrewPanel`) and
Tailscale for away from home. For every click in more detail, see `install/pi/ReadMe_Raspberry_Pi.txt` and Help >
[Installing the panel](../help/19-installing.md).

Written for OakBarn Brewery, 2026-11-19. No store links (Rule 11.10): search the part names at any electronics shop.

---

## 1. What you need

| Have it? | Part | Notes |
|---|---|---|
| ✓ | Raspberry Pi 4, 4 GB | 2 GB or more is enough. |
| ✓ check | Power supply | It must say **5.1 V 3 A, USB-C** (the official Pi 4 15 W supply). Phone chargers cause random restarts and a lightning bolt on screen. |
| ☐ | microSD card, **32 GB or bigger, A1 or A2** (SanDisk or Samsung) | "High Endurance" lasts longer; normal cards are fine for testing. |
| ☐ | microSD card reader for the PC | Many laptops have a slot. |
| ☐ | **micro-HDMI to HDMI** cable, a monitor or TV, a USB keyboard and mouse | Only for the first start. After that the Pi runs with no screen. |
| ☐ | Ethernet cable to the router | Best for brewing. WiFi also works. |
| ☐ | USB cable **A to B** (square "printer" plug) | Mega to the Pi. Some cheap cables only charge; use one that carries data. |
| ☐ | A case with a fan or a heat-sink case | Optional for testing; the Pi slows itself down when hot. |

## 2. Write the Pi's system to the card (on the Windows PC)

1. Download and install **Raspberry Pi Imager** from <https://www.raspberrypi.com/software/>.
2. Put the card in the reader and open the Imager.
3. **Device:** Raspberry Pi 4. **Operating System:** **Raspberry Pi OS (64-bit)**, the one with a desktop (not Lite, not 32-bit). **Storage:** the card (check the size so you don't wipe another drive).
4. Click **Next**, then **Edit Settings**:
   - Hostname: **`skynet`** (this gives the address `http://skynet.local:8080`).
   - User name and password: pick them and **write them down**.
   - WiFi: only if you are not using Ethernet.
   - Time zone and keyboard.
   - Services tab: **Enable SSH** (optional, handy later).
5. **Save**, **Yes**, **Yes**. Wait for "Write Successful" (5 to 15 minutes).

## 3. First start (on the Pi)

1. Card in the slot under the Pi. Monitor in the HDMI socket nearest the power socket, keyboard, mouse, Ethernet.
2. Plug the power in **last**. The first start takes a few minutes and may restart once.
3. Follow the Welcome window if it shows, and let it update. Restart when it asks.

**The terminal:** the black screen icon at the top, or **Ctrl + Alt + T**. Type a line, press **Enter**. Passwords show nothing
while you type; that is normal. Paste with **Ctrl + Shift + V**.

## 4. Install Skynet on the Pi

1. On the Pi, open the web browser and go to <https://github.com/oakbarn/skynet_brewery/releases/latest>.
2. Under **Assets**, download these three into **Downloads**:
   - `Skynet_BrewPanel_<date>.zip`
   - `install-skynet-brewer.sh`
   - `Skynet_Media_<date>.zip` (the Skynet pictures and sounds)
3. In the terminal type, one line at a time:
   ```
   cd ~/Downloads
   bash install-skynet-brewer.sh
   ```
   (No `sudo` in front; it asks for the Pi's password when it needs it.)
4. Answer the questions:
   - **Install Node.js (LTS) now?** **Yes.** (The Node.js that comes with the Pi is too old.)
   - **Start by itself at boot**: **Yes** (the default on a Pi).
   - It also lets the panel use USB boards (the "dialout" group).
5. At the end it shows the Pi's address. Restart the Pi once: `sudo reboot`.

From now on the panel starts by itself every time the Pi gets power. No window has to stay open.

## 5. The first time you open it

1. Open **`http://skynet.local:8080`** (on the Pi, double-click **Skynet Brewer** on its desktop).
2. Make the **admin account**.
3. Write down the **recovery code**. It is the only way back in if you forget the password.
4. Pick a sample Schema to start from.

**Two Brains:** your Windows panel and this Pi are two separate Brains. That is fine while each drives **its own** boards. Never
plug one board into both. To bring your Windows Schemas, Processes and pictures over later, use **☰ Menu > Move Brain**
(Help > [Move Brain](../help/119-move-brain.md)).

## 6. Reach it from the Windows PC and the iPhone

**At home (same network):**

- Windows: any browser, **`http://skynet.local:8080`**. Press Ctrl + D to bookmark it.
- iPhone: Safari, **`http://skynet.local:8080`**, then **Share > Add to Home Screen**.
- If the name doesn't open, use the number: type `hostname -I` in the Pi's terminal; the first number (for example
  `192.168.1.80`) gives `http://192.168.1.80:8080`. A **DHCP reservation** in your router keeps that number from changing.

**Away from home: Tailscale** (never open a port on the router):

1. On the Pi:
   ```
   curl -fsSL https://tailscale.com/install.sh | sh
   sudo tailscale up
   ```
   Open the link it prints and sign in with **the same Tailscale account** your iPhone and Windows PC already use.
2. Type `tailscale ip -4` on the Pi to see its `100.x.x.x` address.
3. With Tailscale connected on the phone or PC, open `http://skynet:8080` (or `http://100.x.x.x:8080`).

Details: `docs/REMOTE_ACCESS.md` and Help > [Installing Tailscale on Windows](../help/00-tailscale-windows.md).

## 7. Put Skynet's firmware on the Mega (once, on the Windows PC)

A Mega that still has **BruControl** firmware won't talk to Skynet. Use a **spare** Mega for testing, not the one your
brewing PC needs.

1. Install the **Arduino IDE** from <https://www.arduino.cc/en/software>.
2. **Tools > Manage Libraries**: install **OneWire** and **DallasTemperature**.
3. Open `BrewPanel\firmware\Mega_BrewPanel\Mega_BrewPanel.ino` from the panel folder.
4. **Change nothing.** The LED test set below uses the sketch's own pin lists.
5. Plug the Mega into the PC. **Tools > Board:** Arduino Mega or Mega 2560. **Tools > Port:** its COM port. Click **Upload** (→).
   A clone (CH340 chip) needs the CH340 driver on Windows only (see `install/windows/ReadMe_Windows.txt`, step 4).
6. Unplug it from the PC and plug it into one of the **Pi's** USB sockets. The Pi needs no driver.
7. In the panel: **Devices > Add Interface**, Board **Arduino Mega**, Type **USB**, and pick its port
   (`/dev/ttyACM0` for a genuine board, `/dev/ttyUSB0` for a clone).

## 8. The LED test set (on the Mega)

### Which LEDs

- **Plain 5 mm LEDs** (red, green, yellow) for On/Off Devices: Pumps, Valves, Heating Elements on On/Off.
- **5 mm RGB LEDs, common cathode, diffused** (4 legs, the longest leg is the − leg) for PWM Devices: a Heating Element on
  PWM, a PWM Pump's speed, a Proportional Valve. Each color leg is its own Device. Brighter = more power.
- **Not WS2812 / NeoPixel strips.** Skynet's firmware has no code for them (they need a timed data signal, not plain pins).
- **Not common-anode RGB LEDs.** On Skynet's PWM pins they would be backwards (bright at 0 %).

### Parts

| # | Part | How many | For |
|---|---|---|---|
| 1 | Solderless breadboard, 830 points | 2 | The LEDs and resistors |
| 2 | Jumper wires (Dupont), male to male, 20 cm | 1 pack of 40 | Mega pins to the breadboard |
| 3 | 5 mm LEDs: **red** | 4 | Pumps |
| 4 | 5 mm LEDs: **green** | 5 | Valves |
| 5 | 5 mm LEDs: **yellow** | 6 | Heating Elements (On/Off), Fan, Light |
| 6 | 5 mm **RGB LED, common cathode, diffused** | 2 (1 spare) | PWM Devices |
| 7 | **330 ohm** resistors, 1/4 W | 15 | One per plain LED |
| 8 | **220 ohm** resistors, 1/4 W | 3 | One per RGB color leg |
| 9 | Tactile push buttons, 6 mm | 4 | Float switch, Push Button, Interlock |
| 10 | 10K potentiometer (knob), breadboard type | 1 | An analog input you turn by hand |
| 11 | **DS18B20 waterproof probes** | 2 or 3 | Real temperatures (warm one in your hand) |
| 12 | **4.7K** resistor | 1 | The probes' pull-up (one for all of them) |

An **LED assortment kit** and a **resistor assortment kit** cover items 3 to 8 and 12.

### Pins (the sketch's own lists, nothing to edit)

| Use | Mega pins |
|---|---|
| Red LEDs (Pumps) | D22, D23, D24, D25 |
| Green LEDs (Valves) | D2, D3, D4, D5, D6 |
| Yellow LEDs (Heating Elements, other On/Off) | D7, D8, D9, D10, D11, D12 |
| RGB LED (PWM) | D44 red leg, D45 green leg, D46 blue leg |
| Push buttons | D30, D31, D32, D33 |
| Potentiometer | A0 |
| DS18B20 probes | D40 |

Leave free: D0 and D1 (the USB link to the Pi), D20 and D21 (I2C), D50 to D53 (SPI). More LEDs or RGB LEDs later means
adding pins to the lists at the top of the sketch and uploading it again.

### How to wire it

- **Plain LED (On/Off):** **5V** → 330 ohm → LED **long** leg. LED **short** leg → the Mega pin.
  Why this way round: the Skynet sketch switches an output **On by pulling the pin LOW**, the same as most relay boards
  (`RELAY_ACTIVE_LOW = true`). Wired this way, the LED lights when Skynet says **On**, and the same settings work on the
  real relay boards later. (Wired pin → LED → GND, it would light when the Device is Off.)
- **RGB LED (PWM):** longest leg → **GND**. Each color leg → its own 220 ohm → its PWM pin (D44, D45, D46). PWM is not
  turned around, so 0 % = dark, 100 % = full bright.
- **Push button:** one leg → the pin, the other → GND. No resistor (the sketch turns on the pin's own pull-up).
- **Potentiometer:** outer legs → 5V and GND, middle leg → A0.
- **DS18B20:** red → 5V, black → GND, yellow → D40, and one 4.7K between D40 and 5V. In Skynet each probe gets its own
  number (Port 700, 701, ...).

**Current:** each plain LED draws about 9 mA, so all 15 on at once is about 135 mA, inside the Mega's safe total (about
200 mA). Never wire an LED without its resistor.

### In Skynet

Make each LED a normal Device on the Mega's Interface, for example an On/Off Pump on Port 22: its red LED lights when the
Pump is On. A PWM Heating Element on Port 44 glows brighter as its power goes up. When the test is done, the same Schema
works on the real brewery: move each Device to its real Port.

## 9. Later: the Pi's own pins

The Pi's own GPIO pins can also be an Interface (Help > [Raspberry Pi GPIO pins](../help/78-raspberry-pi-gpio-pins.md)):
in the terminal run `sudo bash install.sh` in `~/Brewing/BrewPanel/firmware/Pi_GPIO`, restart, then **Add Interface**,
Board **Raspberry Pi**, Type **Ethernet**, address **127.0.0.1**. Pi pins are **3.3 V**: wire plain LEDs from **3.3V** →
330 ohm → LED → pin (On is LOW there too), and RGB LEDs common cathode as above. Never put 5 V on a Pi pin.
