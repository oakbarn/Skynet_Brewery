# Interfaces

An **Interface** is a board (PLC) your Devices are wired to: an Arduino Mega 2560, an ESP32 and the like. Every Device (a pump, a valve, a probe, a heating element) sits on a Port of one Interface.

## Finding them

- **☰ Menu > Devices > ↳ Interfaces (boards)** opens the Devices page at the Interfaces list.
- The **Devices** page has two Tabs: **🔌 Interfaces** (every Interface and **Add Interface**) and **🌡 OneWire Probes** (the 1-Wire circuits, the 1-Wire Indexes and the probes seen, see [Devices and boards](03-devices)).

## The Interfaces list

Rest the mouse on a column name for its Hover Help:

| Column | What it shows |
|---|---|
| **ID** | The Interface ID: it starts the suggested name of every Device on this Interface (MB_25_DO@Pump_Wort_BH). Interface IDs follow Rule 3.2: once saved, it never changes. |
| **Name** | The Interface's Name, the one you gave it when you added it: Hot Side, Fermentation, your brewery name. |
| **Board** | The kind of board: the Arduino Mega (the standard), another Arduino board, an ESP32 or a Raspberry Pi. See [Skynet Boards](206-skynet-boards). |
| **Mode** | Simulator: the panel pretends to be this board, and nothing goes to a real board. Real: the panel talks to the real board. The panel is switched between them on the Simulator bar. |
| **Connection** | How the board is connected to the Brain: USB, Ethernet or WiFi. Rest the mouse on it to see its USB Port or Network address. |
| **Rating** | How safe the Connection is for this board: Best, Good, OK or Poor. USB is the safest; Ethernet and WiFi depend on your network. |
| **Lost Comm** | Lost Comm: if the board hears nothing from the Brain this long, it turns all outputs OFF |
| **Status** | Is the board talking to the Brain: connected, connecting, no answer or disabled. Rest the mouse on it for more (the board's program and version, or what went wrong). |

When something is wrong (no answer, an error from the board), the reason is also written under the Status. The ID box is locked: it shows the ID in plain view but cannot be typed in (Rule 3.2).

## Adding an Interface

There are three ways in, and all three open the same **Add Interface** pop-up:

1. **☰ Menu > Devices > ↳ Add Interface**
2. **Devices page > Add Interface > ➕ Add Interface…**
3. In the **New Device** box on any Tab: open **2. Interface** and pick **➕ Add new Interface…**, the first choice. When you click Add, you are taken back to the New Device box with the new Interface already picked. The New Device box for a RIMS tube or an electric kettle has the same choice.

The pop-up asks (rest the mouse on each name for its Hover Help):

- **Name**: something that means something to you, like *Hot Side*, *Fermentation* or your brewery's name. The Skynet Home Brewery, for example, has 3 Megas: **Main_Brewery_HotSide**, **Valves** and **Fermentor**.
- **Interface ID**: see below.
- **Board**: the Arduino Mega (the standard), another Arduino board, an ESP32 or a Raspberry Pi. A 3.3 V board gets one warning when you put an input, a 0-5 V sensor or a relay on it. See [Skynet Boards](206-skynet-boards).
- **Connection**: the choices follow the Board. An Arduino Mega: USB, Ethernet (with a W5100 or W5500 Shield) or WiFi (through an ESP32 bridge). An ESP32: USB, Ethernet or WiFi. A Raspberry Pi: Ethernet (or the Brain itself) or WiFi. Its Hover Help shows the connection rating (Help: [Connection ratings](69-connection-ratings)).
- **USB Port** (a USB board) or **Network address** (Ethernet or WiFi). See [The USB Port, the technical side](#the-usb-port-the-technical-side) and [The Network address](#the-network-address). While the panel is in 🧪 Simulator mode, the Brain does not talk to any board, so nothing goes over the USB Port: to test the real connection, switch to 🔌 Real, add the Interface, then ⚙ Change it on the Devices page and press 🔌 Test Communication.
- **Board Settings**: **On**, **🔌 Test Communication**, **Answer Wait**, **Lost Comm** and **Diagnostic Logging** (and the **Network Port** for Ethernet or WiFi): see [Board Settings](#board-settings) below.

The **Simulator** is not a Connection: it belongs to the panel, not to a board. It is switched on and off on the Simulator bar.

**The buttons** (✖ Cancel and Add) are frozen at the top, with the title, and there is no row of buttons at the bottom: the model (Rule 2.51). Picking another Connection keeps the suggested Interface ID.

**The keys.** The **Name** and the **USB Port** (or **Network address**) are the boxes the **Enter** key goes to: Enter on the Name goes to the USB Port, and Enter on a filled-in USB Port with a Name adds (or saves) the Interface. The **Tab** key goes round every box of the pop-up, the last back to the first. The **?** Help, **✖ Cancel** and **Add** are for the mouse. The same order as the [Blichmann RipTide Dialog 1](115-pump-device-properties) (Rule 18.39).

## The Interface ID

- The Interface ID **becomes part of the Suggested Name of every Device on this Interface**. It is the start of the name: a pump on pin 25 of the Interface **HS** is suggested as `HS_25_DO@Pump_Wort_HS`.
- Interface IDs follow **Rule 3.2**: see [The ID Rule](46-interface-tab-device-names). Once saved, it never changes, not even by an Admin.

Skynet suggests the ID from the Name as you type it: the first letters of its first two words (*Hot Side* = **HS**). When that ID is taken, 3 letters (**HSI**), and only when every 3 is taken, 4. Its Hover Help is the same as the Pump's Interface Hover Help, with this Interface's own ID (in red) and Name put in.

## Ports (IO Pins)

The Interface has **IO Pins** that provide the Trigger Signal. These are the **Ports**. Each Device sits on one Port of one
Interface, and the **Available Ports** list in the New Device box shows only the free Ports on this board that fit that type of
Device, for example 22, or A5 = 59. Digital Outputs have the most ports, true PWM Ports are much more limited (Help
[Interface, Tab and Device names](46-interface-tab-device-names)). Once a Port is Confirmed and the Device is saved, it is greyed out
and no longer changeable: it is the wiring (Help [Pump Device Properties](115-pump-device-properties)).

## The Trigger Signal

The Brain (Skynet Panel) never powers a pump or a heater itself. If the Brain is on a Computer, the computer cannot supply any
120 VAC power for any connected device. It takes other pieces of Hardware, and not just one. There is a Daisy Chain:

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

Brain -> Arduino IO (Port) -> Trigger (Brain says Turn on Red Pump) -> 5 V or 3.3 V signal sent to -> SSR or Contactor (Hook
the 120 VAC Here) -> Pump Gets Power

The type of trigger signal sent depends on the Brain Control Method and the type of Port selected on the Arduino, as they can
vary. An On/Off Pump such as a Blichmann RipTide on Port 15 is Direct Output (DO): if the State of the Device is true, the power
is on (through the SSR), and if Off the SSR no longer sends power. Similar to a Light Switch.

## Changing an Interface

**⚙ Change** in an Interface's row on the Devices page opens the same pop-up. Use it to give a pretend board its real **USB Port** or network address once it is wired, to pick another USB Port, to change its Board Settings or to **Test Communication**. The name of an Interface that has Devices on it stays as it is, and a saved ID never changes (Rule 3.2).

**The USB Port list.** The USB Port is picked from a list of the ports Skynet finds on this Brain right now. On Windows it is a number (COM3 shows as 3). On a Raspberry Pi or Linux it is a name like /dev/ttyACM0. Not sure which one is the board? Unplug it and pick **🔄 Look again**: the one that is gone is the board. A port saved before that is not on this Brain now stays in the list, in red, marked "not found on this Brain", so it is never lost without you seeing it. While the panel runs the **Simulator**, a grey line shows the real port: it is used when you switch back to Real boards, and you may still change it.

**Changing the Board.** When you pick another Board for an Interface that has Devices on it, 💾 Save first shows one box: how many Devices, Widgets and Processes use it, and the Devices on a Port the new board does not have. Press 💾 Save to go ahead, or Close to go back. Those Devices keep their Ports; give each a new Port in its Properties.

**The suggested Device name.** The Interface ID balloon ends with the **Suggested Device Name** for this Interface, for example BM_Port_Type_Label_TabID, with the ID in red.

## Removing an Interface

Removing an Interface can break your whole brewery: every Device wired to it stops working. Most of the time you want **⚙ Change** instead, to pick another board, USB Port or Network address; the Devices stay on it.

Resting the mouse on **Remove** shows a large warning with how many Devices, Widgets and Processes use this Interface. Nothing is removed by it.

**Remove** (Admins only) opens one Skynet box. Nothing is changed until you press a button in it.

- **Nothing uses it:** the box says so, and **🗑 Delete** removes it.
- **Something uses it:** the box lists what uses it, with how many of each: the **Devices** on it (with their Ports), the **Widgets and pictures** tied to those Devices (a Clone, a Widget that names one), the **Processes** that use them, its **1-Wire Index** slots, and other items on it (a Vessel's parts, a Manifold).
- **▶ Move them** (recommended): pick another Interface, or ➕ Add new Interface, and every Device moves to it with its name and all its settings. A Device whose Port (or 1-Wire Index) is already taken on the new Interface stays where it is, and the box lists it with the reason, so you can fix it and press Move again. When everything has moved, nothing uses the Interface and it can be removed safely.
- **Remove anyway:** one warning. Type the Interface ID (for example BM) to light up **🗑 Delete**.

A backup of the Schema is made first, every time (Rule 9.17), so a removed Interface can be put back from it.

Nothing that used the Interface is deleted (Design Rule #1): the Devices, Widgets and Processes keep every setting. A Device whose Interface was removed shows **⚠ No Interface** in red in its Interface box, and does nothing until it is moved to an Interface. A Process stops at a line that uses one.

## A new empty Schema has no Interface

A new Schema that is **not** a copy of another one (Schema dropdown > Add new Schema > *An empty Schema*) starts with **no Interface**. Add your boards with **Add Interface** on the Devices page, or with **➕ Add new Interface…** in the New Device box. Each Device you add carries its Interface.

A Skynet Schema Template made with no real board still gets a pretend Mega for its Devices ([New Schema from a Skynet Template](157-schema-templates)). It stays pretend until its USB Port or Network address is filled in and saved.

A copy of a Schema keeps the Interfaces it had.

## Your own Device names

The New Device box suggests a name from the Interface ID, the Port, the Device Type, the Label and the Tab ID. You may type your own instead, and the panel then warns you:

- A plain word as a name (for example **Pump**) becomes a reserved word in your Processes and can cause problems in the code.
- The Device name is **only used in Processes** and is **never shown on a Tab** (the Label is). A unique, meaningful name, like the Suggested Name, is the better choice.

Click OK to keep your own name, or Cancel to go back and change it.

## Board Settings

- **On**: the panel talks to this board. **Off**: the panel never opens it, and its Devices show as not connected. When a board is Off, none of its Devices work. A board must be On and in communication with the Brain (the two talking to each other) to do any action.
- **🔌 Test Communication**: a step by step check that the Brain and the board are talking. See [Test Communication](#test-communication).
- **Answer Wait (seconds)**: if the board says nothing for this many seconds, the Devices page shows "no answer". 2 to 600.
- **Lost Comm (s)**: a safety. If the board hears nothing from the Brain for this many seconds, it turns all its outputs OFF, so a heater or a pump is not left on when the Brain, the cable or the network fails. It must be filled in: 3 to 600 seconds (10 to start).

  ⚠ **You are the Safety. Lost Comm is a backup, not your safety: you are responsible for watching your brewery while it runs. You are the primary safety.**
- **Diagnostic Logging**: normally **Off**. Turn it On only to find a problem: every line to and from this board is written, with plain words, to a file a day in the data folder (`logs/boards`). Use it when you know what the log means. Turn it Off after.

  Skynet gives no help with communication problems: the log is only a way for you, or someone helping you, to find the problem.
- **Network Port** (Ethernet or WiFi): the network port the board listens on. Skynet's own programs use 4100.

There is no Baud (USB speed) box: it comes from the board. Every Skynet board program talks at 115200.

## The Network address

If you do not understand Networks and protocols, call a friend to help.

**What it is.** The Network Address (IP Address) is the board's own number on your home network: four numbers with dots, for example 192.168.1.60. The Brain finds the board by it, the way a letter finds a house by its street address.

**Before you add it.** Plug the board in, or power it on (an ESP32 too), before you add it, so it is on your network and
🔌 Test Communication can reach it.

**The suggested address.** Skynet suggests an address on the Brain's own network: the first three numbers are the Brain's, and the
last is one no other Interface uses (60 to start, the address in Skynet's Mega program). It is only a suggestion: the board decides
its own address. Make it a fixed address, so it never changes: write it in the board's Skynet program, or reserve it for the board
in your router (How to find it, below).

**Ethernet (a network cable).**
- No WiFi name (SSID) or password is needed: the cable plugs the board into your router or network switch.
- An Arduino Mega with an Ethernet Shield uses the address written in the Skynet program on the board: 192.168.1.60 to start. Type that same address. If the addresses on your network start with other numbers (for example 10.0.0.), the address in the program is changed to one of yours and the program is loaded on the board again.
- An ESP32 with an Ethernet jack gets its address from your router (How to find it, below).
- A Raspberry Pi that is the Brain itself: 127.0.0.1 (the Brain talking to itself).

**WiFi.**
- Yes, the WiFi name (SSID) and its password are needed, but not in Skynet: they are typed into the Skynet program on the board (the ESP32) before the program is loaded on it, so the board can join your WiFi. Skynet never asks for them and never keeps them.
- A Raspberry Pi board joins your WiFi in its own WiFi settings, set on the Pi when it is set up.
- Your router then gives the board its address. When the board starts, it shows its address in the Arduino program's Serial Monitor (with the USB cable plugged in), and your router lists it too.
- WiFi has to reach the board where it sits. A USB cable or a network cable is safer.

**How to find it.** Open your router's app or its web page and look at its list of connected devices: the board is there with its address. Then, in the router, reserve that address for the board (it may be called a DHCP reservation, a fixed or a static address), so it never changes. Without that, the board can get a new address after a power cut and the Brain can no longer find it.

**Windows, Mac, Linux or a Raspberry Pi.** It is the same on all of them: the address belongs to the board and your router, not to the Brain's computer, and nothing more is installed. The Brain only has to be on the same network (the same router) as the board. The **Network Port** must be the same as the program on the board (Skynet's own programs use 4100).

## Test Communication

**🔌 Test Communication** in the Interface pop-up (⚙ Change on the Devices page) opens a step by step check. Nothing on the board is turned On or Off. An Interface that is being added is tested after it is added.

1. **Is the board On and talking?** It shows what the Brain sees now: *Talking*, *no answer*, *Off* or *Not connected* with the reason.
2. **👋 Say Hello.** Skynet sends `HELLO`. A board with the Skynet program answers with its name and program version within 5 seconds.
3. **Sample answers:**

| The board says | What it means |
|---|---|
| `HELLO MEGA1 0.5` | Good: the board MEGA1 answered, and it runs the Skynet program, version 0.5. |
| `DI 22 0` | Good: the board reports its inputs after Hello (input 22 is Off). |
| `ERR ADS1115 not found on I2C` | The board talks, but one of its parts is not found: check that part's wiring. |
| (nothing) | No answer: see step 4. |
| strange letters (ÿ?¿) | The board runs a program that is not Skynet's: load the Skynet program on it. |

4. **What to check when there is no answer.** A USB board: the USB Port number is the one the board is plugged into; the USB cable carries data (some cables only charge); no other program has the board open (the Arduino program's Serial Monitor, another brewing program); the board has the Skynet program. A network board: it has power and its network light is on; the Network address is the board's own and the Brain is on the same network; the Network Port is the one in its program (4100); it has the Skynet program.

**💬 Board Talk** on the Devices page shows every line to and from the board, in plain words: see [Board settings and Board Talk](177-board-talk).

## The USB Port, the technical side

A USB board shows up on the Brain as a **serial port**. On Windows it is called **COM** and a number (COM3, COM7 ...): type the number alone (7) and Skynet makes it COM7. Windows numbers them 1 to 256 and gives each board its own number the first time it is plugged in; the same board in the same USB socket keeps its number. On a Raspberry Pi or Linux the port is a name like `/dev/ttyACM0` (an Arduino Mega) or `/dev/ttyUSB0` (a board with a USB-to-serial chip); type it as it is.

When the pop-up opens, Skynet looks for the boards plugged in now and suggests the first one no other Interface uses. To find which number is your board: unplug it, open the pop-up and look at the numbers found, plug it back in and open it again. The new number is your board. Only one program at a time can use a port: close the Arduino program's Serial Monitor and any other brewing program before Skynet connects.
