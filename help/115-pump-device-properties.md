# Pump Device Properties (the drill-down)

Double-click a Pump in Edit layout to open **Pump Device Properties**. It is the first Device dialog built to the General
Dialog Rules (Skynet Rules section 18), and it is **the standard for every Device**: the others will work the same way.

The idea: the things you set most are on the dialog itself. Everything else is one click away in a small pop-up.

## Adding a pump

1. In Edit layout, click **Pumps > Pump, on / off (relay or SSR)**.
2. **Pick the pump** from the list. Each one has its picture: March 809 and 815, Chugger, Blichmann Riptide, Topsflo TD5 and
   KegLand MKII. The picture you pick is the pump's Picture.
3. The Add box opens with the pump's name as its title. Fill it in order: 1 the **Label** (the ⬢ beside it sets its font
   and colors) and **Label Visible**, 2 the **Interface** (the board), 3 an **Available Port**, 4 the **Tab**. Then 5 the
   **Suggested Name** shows, made from them. The **Graphic** shows the pump; set its **Orientation**, **Cover**, **X**, **Y**, **Width** and **Height** if you like. If **➕ Add Device** looks faded, press it: it tells you what is still missing. The **Device Type** (Pump) is shown greyed out: it comes from the list you picked.
   Once the **Interface** and **Port** are picked, the **Review** pop-up shows them greyed out with: *You MUST Confirm the
   Interface and Port Number. Once Confirmed, they cannot be changed. If a Change is needed now, Click the Back Button.*
   **✔ Confirm** greys out the **Interface** and **Available Ports** line (it is the wiring; press Cancel to start again);
   **◀ Back** goes back to the Port so you can change it. Nothing is set for good until **➕ Add Device** saves the Device.
   Once 1 to 4 are done and Confirmed, the rest of the box opens: the **Label** and **Tab** can still be changed and the
   Suggested Name follows them, and the focus goes to **Orientation**. The **Graphic** is the picture of this Device as it will show on the Tab, with its Cover
   and Orientation; the Picture itself cannot be changed. **User Add** in Cover pops up the Color Picker and shows the
   **Color (RGB)** line just below it (Help 187): pick a color and press Save, or **◀ Back** sets the Cover back to None (no cover).
4. Press **➕ Add Device**. The Properties open. The **Interface** and **Port** are now greyed out and set: they are the wiring, so they stay as they are. To wire it to another board or pin, delete it and add it again. Its Name can still be changed with **✏ Change name**.

## The two icons

| Icon | What it does |
|---|---|
| **⬢** red hexagon | Pops up a **Properties dialog** with more settings for that field |
| **⬆** red up arrow | Pops up a **String dialog**: a bigger box to type the text in (Rich Text codes like `\b` work) |

Every pop-up has **✖ Cancel** and **💾 Save** at the top and the bottom. Save in a pop-up puts the changes into the dialog;
nothing is really saved until you press **💾 Save** on the dialog. Cancel with changes made asks first.

## From the top

Only these belong to a Pump (a Skynet pump drawing or your own User pump):

1. The title is the pump, for example **Blichmann Riptide**, with the **🔓 lock** (locks its place: no drag or resize),
   **Visible** and **Hidden Locked** beside it. Then **Delete**, **Cancel** and **Save**.
2. **1. Label ⬆ ⬢**: what shows on the Tab (see **The Label** below). The ⬆ opens a 2 Line Label Text Dialog; the ⬢ opens
   the **Label Attributes** Dialog: Label, Visible, Font Size, Font, Bold, Fore Color, Back Color and Alignment. Font Size shows
   the size the Label has now. Alignment is **Left**, **Centered** or **Right**; a Label starts Centered. A Label is never
   blank: leave it empty and it becomes the Name. **Label Visible** switches it on or off.
3. **2. Interface** and **Available Ports** on one line: greyed out once it is added (the board and pin it is wired to).
4. **3. Tab**: the Tab it is on.
5. **4. Name**: starts as the Suggested Name (from the Label, Interface, Port, Device Type and Tab); you may type your own. It
   must be unique. A Process uses it: `Pump_Name.state = true`.
6. **Graphic**: the pump's picture as it shows on the Tab. **Path**: greyed out on a Skynet pump drawing (it is set); a User
   pump's one Path can be changed.
7. **Orientation**: **Right** (as drawn) or **Left** (mirrored). The Graphic here and the pump on the Tab turn, and its IPs
   follow.
8. **Cover** (Help 111, Skynet pump drawings only) and **Toggle** on one line: On/Off (one click turns it on or off), Push
   button (on only while held) or None.
   Just below them, **Overlay**: what is drawn on top while the pump is On (the steady lightning bolt, the flashing bolt,
   the Green glow ring, or None). On the same line, **Database and .API ⬢**: the hexagon opens its settings (Help 98).
9. **X (Horizontal)**, **Y (Vertical)**, **Width** and **Height**.
10. The **Device Type** greyed out and filled in for you: **DO@Pump** for an On/Off pump like the Blichmann RipTide (a Pump on a Digital Out, DO), **PWM@Pump** for a pump whose speed is set on a PWM port. The same DO@Pump is the third part of the Suggested Name: `BM_22_DO@Pump_Pump_BH`.

The On / Off text is shown with an Overlay (the green On overlay of the Skynet pump drawings).

## The Label

How do you refer to this Pump? Brewing Pump, Mash Pump, HLT Pump ...? Use your name for the Pump as the Label. OakBarn
Brewery Sample Schema has several Pumps and they are Color Coded with a Cover. When OakBarn is brewing, he might yell out,
"Shut off the Red Pump" to stop the flow. The Fermenters are in a different Room and when visually full, the Brewmeister yells
to "Turn off the Red Pump" to his comely assistant, who then clicks the Red Pump Off.

![Label Visible](help_pictures/Label_Visible_Switch.png)

The Label may be shown on the Tab, for example Red Pump above the Pump Device.

![Red Pump: the Label above the Pump](help_pictures/Red_Pump_Label.png)

This is the Plain Text Part of the Suggested Name. Spaces become ~.
BM_15_DO@Pump_**Red~Pump**_BH

Suggested Name Format: INTERFACEid_Port_Type_Label_TABid
From the above BM_15_DO@Pump_Red~Pump_BH OakBarn Brewmeister knows that the Device Red Pump is connected to Interface BM
(Brewery Mega {Arduino}), on Port 15, Pump Type, labeled as Red Pump, and finally on Tab BH (Brew House Tab).

And do not worry about such a convoluted name when coding a Process as it will be selectable in a choice in a List Box. You
will quickly find it useful. Because of Predictive Text, if you use the Suggested name, type in BM in the List Box and your
choices are limited only to those devices on the BM: Brewery Mega Arduino.

The **⬆** opens a 2 Line Label Text Dialog

The **⬢** opens a Label Attributes Dialog where you can set its font, size and colors.

© ® ™: Reserved for copyright and trademark notices of the Skynet MIT License. Skynet is Open Source. Not Allowed in a name or a Label to avoid confusion with the Skynet MIT License.
@ ~: Kept for the Suggested Name. Not typed in a name or a Label.

## The Port

Pick a Port. (Available Port) A Port needs to be chosen from the list before proceeding.

Click the small Gray Down Triangle to expand the List of Available Ports.

**Available Ports**: only the free Ports (pins) on this board that fit this type of Device, for example 22, or A5 = 59. Digital
Outputs have the most ports, true PWM Ports are much more limited. Once it is added it is greyed out and no longer changeable.

Click to choose the Port.

A PWM Port marked Save for PWM works, but keep it for a Device that needs PWM.

## The Interface

The Arduino board this Pump Device is connected to. An Interface has a Name and an ID. The ID is supplied by you when an
Interface is connected. The Interface is the part of the Bridge between the "Brain" (Skynet Panel) and your Red Pump. If the
"Brain" is on a Computer, the computer cannot supply any 120 VAC power for any connected device. It takes other pieces of
Hardware, and not just one. There is a Daisy Chain:

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

Brain -> Arduino IO (Port) -> Trigger (Brain says Turn on Red Pump) -> 5 V or 3.3 V signal sent to -> SSR or Contactor (Hook
the 120 VAC Here) -> Pump Gets Power

The Arduino must be connected (WiFi, Ethernet, USB) to the Brain and On. It must be wired properly to the SSR. An electrician
wired the SSR and set up the Red Pump Circuit. If there is an On/Off switch on the Pump, it must be left On.

The Interface has IO Pins that provide the Trigger Signal. These are the Ports. The type of trigger signal sent depends on the
Brain Control Method and the type of Port selected on the Arduino, as they can vary. For our example the Interface is an Arduino
Mega 2560 and the Port chosen is 15. The Method of Control is On/Off (Direct Output or DO). The pump selected is a Blichmann
RipTide and it is an On/Off type of hardware. The Hardware Type is DO@Pump: for the Devices in the Brain and the control method
is Direct Output. If the State of the Device is true, the power is on (through the SSR), and if Off the SSR no longer sends
power. Similar to a Light Switch.

When an Interface is added to the Brain, it has an ID. The ID is a Skynet required field, and while a suggestion is made, it is a
free form Field that you can Edit, but it must be unique, and once saved can never be changed. It is from 1 to 4 Characters. Our
example Interface is: BM: Brewery Mega

The ID is important as it is Part of the Suggested Name.
**BM**_15_DO@Pump_Red~Pump_BH

Suggested Name Format: INTERFACEid_Port_Type_Label_TABid
From the above BM_15_DO@Pump_Red~Pump_BH OakBarn Brewmeister knows that the Device Red Pump is connected to Interface BM
(Brewery Mega {Arduino}), on Port 15, Pump Type, labeled as Red Pump, and finally on Tab BH (Brew House Tab).

And do not worry about such a convoluted name when coding a Process as it will be selectable in a choice in a List Box. You will
quickly find it useful. Because of Predictive Text, if you use the Suggested name, type in BM in the List Box and your choices are
limited only to those devices assigned a Port on the BM: Brewery Mega Arduino will be a choice (among all the other BM_ Devices)
in the Predictive Text List Box.

If you need to add a new Interface, select **➕ Add new Interface** in the List Box (Bottom Choice). Create the Interface and Save
it. You will return to this Dialog. The New Interface will be in the List Box and set as your choice.

Every dialog's titles and field names are in Title Case (Fore Color, Font Size).
