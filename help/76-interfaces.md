# Interfaces

An **Interface** is a board (PLC) your Devices are wired to: an Arduino Mega 2560, an ESP32 and the like. Every Device (a pump, a valve, a probe, a heating element) sits on a Port of one Interface.

## Finding them

- **☰ Menu > 🔌 Interfaces (boards)** opens the Devices page at the Interfaces list.
- The **Devices** page lists every Interface: its ID, name, board, connection, rating, lost link delay and status.

## Adding an Interface

There are three ways in, and all three open the same **Add Interface** pop-up:

1. **☰ Menu > ➕ Add Interface…**
2. **Devices page > Add Interface > ➕ Add Interface…** (the row of boxes under it still works too)
3. In the **New Device** box on any Tab: open **1. Interface (board)** and pick **➕ Add new Interface…** at the bottom. When you click Add, you are taken back to the New Device box with the new Interface already picked. The New Device box for a RIMS tube or an electric kettle has the same choice.

The pop-up asks:

- **Name**: something that means something to you, like *Hot Side*, *Fermentation* or your brewery's name. The Skynet Home Brewery, for example, has 3 Megas: **Main_Brewery_HotSide**, **Valves** and **Fermentor**.
- **Interface ID**: see below.
- **Board**: Arduino Mega, ESP32 or another Arduino-type board.
- **Connection**: USB, Ethernet, WiFi, or **Simulator** (no board yet: everything on it is pretend). It shows the connection rating (Help: [Connection ratings](69-connection-ratings)).
- **USB port** or **Network address**, for a USB or a network board.

## The Interface ID

- The Interface ID (1 to 4 letters) **becomes part of the Suggested Name of every Device on this Interface**. It is the start of the name: a pump on pin 25 of the Interface **HS** is suggested as `HS_25_Pump_Wort__HS`.
- It **must be unique**: no two Interfaces may have the same ID.
- **Only an Admin can change it.** For everyone else the ID box on the Devices page is greyed out.
- **Set it once and leave it.** Devices made before a change keep the old ID in their names, so a change leaves a mix of names. The panel asks before it changes the ID of an Interface that already has Devices.

Left empty, the ID is the first letters of the Name (*Hot Side* = HS).

## Changing an Interface

**⚙ Change** in an Interface's row on the Devices page opens the same pop-up. Use it to move a board from **Simulator** to its real **USB** port or network address once it is wired, to pick another USB port, or to set the ID. The name of an Interface that has Devices on it stays as it is.

## A new Schema starts with a pretend Mega

When you make a new Schema that is **not** a copy of another one (Schema dropdown > Add new Schema > *An empty Schema*):

1. It starts with one Interface, a pretend (Simulator) Arduino Mega 2560 called **New_Mega_2560_1**. If a New_Mega_2560_1 already exists in any of your Schemas, it is New_Mega_2560_2, and so on.
2. The whole panel switches to **Simulator mode**, and a message tells you so (Help: [Simulator or Real boards](77-simulator-or-real-boards)).
3. The Interface pop-up opens so you can give it a name that means something to you and set its Interface ID.

A copy of a Schema keeps the Interfaces it had.

## Your own Device names

The New Device box suggests a name from the Interface ID, the Port, the Device Type, the Label and the Tab ID. You may type your own instead, and the panel then warns you:

- A plain word as a name (for example **Pump**) becomes a reserved word in your Processes and can cause problems in the code.
- The Device name is **only used in Processes** and is **never shown on a Tab** (the Label is). A unique, meaningful name, like the Suggested Name, is the better choice.

Click OK to keep your own name, or Cancel to go back and change it.
