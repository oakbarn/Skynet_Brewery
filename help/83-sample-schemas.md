# Add a Sample Schema

The Schema dropdown (on the Menu Bar, the ☰ Menu > Schema tab and the About tab) has a section at the bottom called **Add a Sample Schema**. It lists the ready-made sample breweries that come with Skynet, for example:

- **OakBarn (my BruControl setup)**
- **Two vessels, one pump**
- **Three vessels, one pump**
- **BrewZilla brew day (no board)**

Only an Admin sees this section.

The same samples are on the **Schema** Menu tab: press **☰ Menu > 🗂 Schema** (at the top of the ☰ Menu), then **➕ Add** beside the sample under **Add a Sample Schema**.

## Adding one

1. Open the Schema dropdown.
2. Under **Add a Sample Schema**, pick the sample you want (each one starts with ➕).
3. The panel asks if it is OK to go on. If Processes are running it lists them, because switching Schemas stops them and switches every output off.
4. Press **OK**. A copy of the sample is added as a **new Schema** and loaded.

The new Schema is named after the sample. If you already have a Schema with that name, a number is added (for example "Two vessels, one pump 2"), so you can add the same sample more than once.

## Your own Schemas are never written over

A sample always comes in as a Schema of its own. The Schema you were using is saved just as it was and stays in the Schema list: pick it to go back. You can rename, clone or delete the sample copy like any other Schema.

## Nothing real is switched

- Every Interface (board) in a Sample Schema has **Connection Simulator**, so it talks to a pretend board, never a real one.
- The whole panel also goes to **Simulator mode** (🧪 beside ☰ Menu), the same as a new empty Schema. A pop-up tells you when this happens.

To run a sample on your own boards later: open each Interface (☰ Menu > 🔌 Interfaces), set its real connection (USB or network) and port, then press **🔌 Real** beside ☰ Menu. See [Simulator or Real boards](77-simulator-or-real-boards).

## Also in Settings

Settings > **Start from a sample Schema** shows the same samples as cards. Loading one there also adds it as a new Schema and goes to Simulator mode.
