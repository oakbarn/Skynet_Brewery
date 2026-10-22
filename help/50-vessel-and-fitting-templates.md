# Vessel and Fitting Templates

A **Template** is a ready-made vessel or fitting kept in a library, not on a Tab. **Add to Tab** puts a copy on a Tab. The copy is a **Tab_Vessel** or a **Tab_Fitting**, and it is yours to change or delete. Changing the copy never changes the Template.

There are two kinds of Template:

- **Vessel Templates**: kettles, HLTs, mash tuns and fermenters. Chillers, coils, trub filters and RIMS tubes are Vessel Templates too, shown on their own **Equipment Templates** pane.
- **Bundled Fitting Templates**: up to four fittings joined together (for example a valve, a tee with a thermowell and a 90 degree elbow) that go on a vessel port, or on a Tab by themselves.

## Skynet Templates and User Templates

| | Skynet Template | User Template |
|---|---|---|
| Made by | Skynet (changed only through GitHub) | You, in the panel (Admins) |
| Change it | No (see Building Skynet Templates below) | Yes |
| Delete it | Never | Yes |
| Clone it | Yes: the clone is a User Template | Yes |
| Add to Tab | Yes | Yes |
| Badge | **Skynet** (listed first) | **User** |

The panel checks this on the Brain, so a locked Skynet Template can't be changed or deleted from any screen.

Skynet Templates come with the panel, in its `templates` folder, and an update brings the newest ones. User Templates are kept on the Brain in `config/templates/user`, which an update never touches.

## The Template panes

1. Press **☰ Menu** and pick **Vessel Templates**, **Equipment Templates** (chillers, coils, trub filters, RIMS tubes) or **Fitting Templates**.
2. Each Template shows as a small icon with its name, so many of them fit on one screen.
3. **Double-click** an icon (on a phone, double-tap it) to open its pop-up with the settings.
4. **New Vessel Template ...** (or **New Bundled Fitting Template ...**) makes a blank one (Admins).

The buttons on a Template's pop-up:

- **✕** and **Cancel**: close it without saving.
- **Clone**: asks for a new name (it suggests Copy1_ and the name; change it to what you want), then makes a copy with every setting showing in the pop-up.
- **Add to Tab**: pick the Tab and a name (it suggests bndl1_TemplateName_TabID; change it to what you want), then press **Add**.
- **Add to Vessel** (Bundled Fittings only): puts this fitting on a port of a Vessel Template (Outlet, Tangential Inlet, Steam Slayer or CIP Inlet). The name it suggests is bndl1_FittingName_VesselName.
- **Save**: only on Templates you can change.
- **Delete**: only on User Templates. A Bundled Fitting that a Vessel Template uses can't be deleted until it is taken off that vessel.

A **Template Name** has no spaces (use _ instead) and must be unique.

## Vessel Template settings

- **Template Name**, **Kind** (Vessel, Plate chiller, Chilling coil, HERMS coil, Trub filter) and **Type** (HLT, Brew Kettle, Mash Tun, Fermenter ...).
- **Graphic**: the picture drawn on the Tab.
- **Size**: Units, Size, Dead space and Extra trub loss (a Fermenter has Largest batch, Smallest batch and Trub loss).
- **Heat Source**. The Device that heats it, and its probe, are picked later on the Tab_Vessel, because they belong to a Schema.
- **Connection Standard** and its **Size**: TC, FPT, MPT, BSP Female Rp, BSP Female Rc, BSP Male Rp, BSP Male Rc, MM Female, MM Male (a number, for example 1.5) or DIN (text, for example DN25). It is the default for every port and Bundled Fitting. It goes on the Equipment list and sets the default size of the pictures.
- **Ports**: switch on each port it has and pick its **position**. The **Outlet**, **Tangential Inlet**, **Steam Slayer** and **CIP Inlet** also have a **Bundled Fitting** dropdown:
  - a Skynet or User Bundled Fitting,
  - **New ...**: name it, and its pop-up opens so you can build it. Close it to come back to the vessel.
  - **Clone ...**: pick a Bundled Fitting to copy, and name the copy.

## Equipment Template settings

Chillers, coils and trub filters have the same settings as a vessel, plus how many **Liquid ports** they have to move liquid:

| Kind | Liquid ports |
|---|---|
| Plate chiller | 4: wort in and out, water in and out (the two never mix) |
| Chilling coil, HERMS coil | **2** (1 in, 1 out) or **4** (2 ins, 2 outs, for example a Chillzilla) |
| Trub filter | 2: in and out |
| RIMS tube | 2: Wort In and Wort Out |

With 4, the second circuit is **In 2** and **Out 2**. Liquid in one circuit never flows into the other.

A **RIMS tube** is part of the piping: wort flows in at one end and out at the other. Its **Heating element** (an Electric Element Device) goes in one end and its **Thermowell** (a Temperature Probe) in the other. Both are picked on the Tab_Vessel. Neither one is an IP, so no liquid flows there. A Mash Tun whose Heat Source is **RIMS** picks its RIMS tube from the Equipment Profile.

## Bundled Fitting Template settings

- **Template Name** and **Connection Standard** (empty = the vessel's).
- **First, Second, Third and Fourth Fitting**, from the vessel port outward. Each is a dropdown:
  - **Valve**: the valve itself (a Device or a manual valve Widget) is picked when it is on a Tab.
  - **Tee**: switch on **Thermowell** if a probe sits in it, and pick its **Position** (Short or Long). A thermowell stops flow, so that side of the tee has no IP. The probe is picked when it is on a Tab.
  - **Reducer**: type the **Small end size**. The big end is the Connection Standard size. Every IP past the reducer gets the small size.
  - **90 Degree Elbow**, **45 Degree Elbow**, **U**, **CIP Ball Valve**, or **None**.
- **Graphic**: a Skynet Bundled Fitting picks one of the Skynet pictures. A User one can have any picture.

The list of fittings is set by Skynet. A new kind of fitting is added through GitHub.

Flow through a Bundled Fitting goes **both ways**. The First Fitting sits on the port, but liquid can run in or out. For example, tap water can be run backwards through a pump to prime it.

The pictures of Skynet Templates are SVG files, and an SVG file can't be deleted, renamed or replaced on the Media page. See [Media](07-media).

## Standard fittings for piping

Skynet comes with single fittings ready to put in the piping, with their IPs where the openings are on the picture:

| Fitting Template | IPs |
|---|---|
| **Elbow_90** | Bottom and Right |
| **Elbow_45** | Left and the Top Right corner |
| **Tee** | Left, Right and Top (flow goes any way through it) |
| **Reducer** | Left (the big end, TC 2) and Right (the small end, TC 1.5) |

Add one to a Tab (**Add to Tab** on its pop-up), drag it to its place and draw pipes to its IPs. To point it another way, open it in Edit layout (switch **Bundled** off first) and pick **Turn**: 90, 180 or 270 degrees clockwise. The picture and its IPs turn together, so one Elbow_90 covers all four directions.

Where two pipes of different sizes meet on one IP, the panel draws a reducer cone by itself (see [Pipes, hoses and reducers](24-pipes-and-hoses)). Use the **Reducer** fitting where it should be on the Equipment list, or on a vessel port that is not the size of its piping.

## Add to Tab

**Add to Tab** opens **Edit layout** on that Tab with the copy on it, **Bundled**:

- A **Tab_Vessel** gets its ports as IPs, and a **Tab_Fitting** joined to each port that has a Bundled Fitting. It all moves as one.
- A **Tab_Fitting** by itself gets a **Start** IP, its **End** IP and one IP for the open side of each tee.

Drag it to its place, then press **Save layout**.

## Tab_Vessel and Tab_Fitting

A Tab_Vessel or Tab_Fitting is not a Device and not a Widget. It is an item on a Tab that can hold both: a heating element and a probe on a Tab_Vessel, a valve on a Tab_Fitting, and IPs on both.

Open it in **Edit layout** (double-click, or hold a finger on it). Switch **Bundled** off first if it is bundled. Everything can be changed, or it can be deleted, even when it came from a Skynet Template. The note at the top says which Template it came from. Its **Label** can stay empty: the Name shows instead.

On a Tab_Fitting you pick:

- **Turn**: 90, 180 or 270 degrees clockwise. The picture and its IPs turn together.

- each **Valve**: **Select Device, Widget or None**. While that valve is closed, nothing flows through the Tab_Fitting.
- each thermowell's **Temperature Probe**: **Select Temperature Probe or None**.

Deleting a Tab_Vessel also deletes the Tab_Fittings joined to it.

## Joining a Tab_Fitting to a vessel

A Bundled Fitting is usually on the Vessel Template already, so it comes joined. When you need another one, or the Tab_Vessel was put on the Tab first:

1. Add the Bundled Fitting to the Tab by itself (**Add to Tab** on its pop-up).
2. In Edit layout, drag the Tab_Fitting (or its **Start** IP) so the Start IP sits on the vessel's port IP, and let go.
3. It joins that port: its Start IP goes away, and flow passes between the vessel and the fitting with no pipe.

To take it off again, open the Tab_Fitting and switch off **Joined to its vessel port**. It gets its own Start IP back.

## Building Skynet Templates

For now Skynet is still building its Templates, so the Skynet Templates can be changed in the panel, and new ones and clones can be Skynet Templates (a switch in the name pop-up; off makes a User Template). The ones made or changed this way are kept in `config/templates/skynet` on the Brain, so an update can't overwrite them. Send that folder in and they go into the panel's `templates` folder on GitHub.

When all of them are done, Skynet locks them. From then on Skynet Templates can't be changed or deleted, and every new Template or clone is a User Template.
