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
   **Suggested Name** shows, made from them. The cursor starts in the **Label**. **Enter** goes only between the **Label** and the
   **Port** (Enter in an empty Label stays there). The **Tab** key goes Label, ⬆, ⬢, Label Visible, Interface, Port, Tab and back
   to the Label, and you can click any of them at any time, even before the Label is typed. The ? Help, ✖ Cancel and ➕ Add Device
   are for the mouse (Skynet Rule 18.38). The **Graphic** shows the pump; set its **Orientation**, **Cover**, **X**, **Y**, **Width** and **Height** if you like. If **➕ Add Device** looks faded, press it: it tells you what is still missing. The **Device Type** (Pump) is shown greyed out: it comes from the list you picked.
   Once the **Interface** and **Port** are picked, the **Review** pop-up shows them greyed out with: *You MUST Confirm the
   Interface and Port Number. Once Confirmed, they cannot be changed. If a Change is needed now, Click the Back Button.*
   **✔ Confirm** greys out the **Interface** and **Available Ports** line (it is the wiring; press Cancel to start again). Their
   Hover Help then starts by saying the Interface and Port combination is saved and can not be changed;
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

Every pop-up has **💾 Keep**, **Close** and **✕** frozen at the top (Rule 2.54). Keep in a pop-up puts the changes into the dialog;
nothing is really saved until you press **💾 Save** on the dialog. Close with changes made asks first.

## From the top

Only these belong to a Pump (a Skynet pump drawing or your own User pump):

1. The title is the pump, for example **Blichmann Riptide**, with the **🔓 lock** (locks its place: no drag or resize),
   **Visible** and **Hidden Locked** beside it. Then **Delete · Save · Close · ✕** in the upper right corner (Rule 2.54). The title and these buttons (no ☰ while you build, Rule 2.52) stay
   at the top while the rest of the box scrolls, so the buttons are always in view (there is no second row at the bottom).
2. **1. Label ⬆ ⬢**: what shows on the Tab (see **The Label** below). The ⬆ opens a 2 Line Label Text Dialog; the ⬢ opens
   the **Label Attributes** Dialog: Label, Visible, Font Size, Font, Bold, Fore Color, Back Color and Alignment. Font Size, Font,
   Fore Color and Back Color show what the Label has now (your Tab Style, then ☰ Menu > Default settings), and they go on following
   those defaults until you change them. Its **Cancel** and **Save** are at the top only. Alignment is **Left**, **Centered** or **Right**; a Label starts Centered. A Label is never
   blank: leave it empty and it becomes the Name. **Label Visible** switches it on or off.
3. **2. Interface** and **Available Ports** on one line: greyed out once it is added (the board and pin it is wired to). Both
   Hover Helps start by saying the Interface and Port combination is saved and can not be changed.
4. **3. Tab**: the Tab it is on.
5. **4. Name**: starts as the Suggested Name (from the Label, Interface, Port, Device Type and Tab); you may type your own. It
   must be unique. A Process uses it: `Pump_Name.state = true`. See **The Name** below.
6. **Graphic**: ![A pump with its 8 IPs](help_pictures/Pump_8_IPs.png)
   the Skynet picture of this Device as it will show on the Tab, with its Cover and Orientation. The Skynet Picture is
   set by Skynet and cannot be changed, so a Skynet pump drawing has no Path box. A User pump keeps its **Path** box, so its one
   picture can be changed. The Graphic changes as soon as you pick another Orientation or Cover.
7. **Orientation**: ![Right and Left](help_pictures/Pump_Right_Left.png)
   **Horizontal** is greyed out (a pump is always level), with **Left / Right** beside it, the same look as the Hose Bib
   (Skynet Rule 18.49): **Right** (as drawn) or **Left** (mirrored). The Graphic here and the pump on the Tab turn. Switching the Orientation
   leaves the Inlet IP and the Outlet IP where they are, so the pipes and hoses joined to them stay put; the Hose or Pipe inside
   the pump is drawn again to reach them.
8. **Cover** (Help 111, Skynet pump drawings only) and **Toggle** on one line. ![No Cover and Red Cover](help_pictures/Pump_Cover.png) The Toggle is what happens when the pump is
   clicked on the Tab: **On/Off** (one click turns it on or off, most common), **Push Button** (on only while held), **Dual
   Action** (a click turns it on or off; pressed and held for more than half a second, it is on only while held, handy for topping
   off a vessel by hand) or **None** (the picture does nothing when clicked). Rule 2.50.
   Just below them, **Overlay**: what is drawn on top while the pump is On. ![Every Overlay choice](help_pictures/Pump_Overlays.png)
   On the same line, **Database and .API ⬢**: the hexagon opens its settings (Help 98).
   Below them, **Model** (the Pump Model you choose from Available Common Brewery Pumps; its Properties can be displayed with the
   ⬢, to look at only, with **◀ Back**: Power, Use, Flow, Lift, Hottest Liquid and Self Priming) and **Inlet IP Fitting** and **Outlet IP Fitting**, each on its own line (match YOUR pump fittings). Help 163.
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

A PWM Port marked **Best for True PWM: see Help** works, but keep it for a Device that needs PWM.

BM_**15**_DO@Pump_Red~Pump_BH

Suggested Name Format: INTERFACEid_Port_Type_Label_TABid
From the above BM_15_DO@Pump_Red~Pump_BH OakBarn Brewmeister knows that the Device Red Pump is connected to Interface BM
(Brewery Mega {Arduino}), on Port 15, Pump Type, labeled as Red Pump, and finally on Tab BH (Brew House Tab).

## The Interface

The Arduino board this Pump Device is connected to. An Interface has a Name and an ID. The ID is supplied by you when an
Interface is connected. The Interface is the part of the Bridge between the "Brain" and your Red Pump. If the "Brain" cannot
supply 120 VAC power for any connected device but only a trigger signal. It takes other pieces of Hardware, and not just one.
There is a Daisy Chain:

![The Daisy Chain: Brain, Arduino, SSR, Red Pump](help_pictures/Pump_Daisy_Chain.png)

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
free form Field that you can Edit. Interface IDs follow Rule 3.2 ([The ID Rule](46-interface-tab-device-names)). Our
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

If you need to add a new Interface, select **➕ Add new Interface** in the List Box (First Choice). Create the Interface and Save
it. You will return to this Dialog. The New Interface will be in the List Box and set as your choice.

## The Tab

The Tab this Device (or a new Widget) goes to when the Move to Tab Button is clicked when you are finished building.

A Normal Tab is like The Bridge on a Star Ship of your design. It is where you set up the controls to open a Worm Hole, destroy a
Black Hole, or whatever you can do. You lay out the design so the Captain (Brewmeister) can control the Star Ship (Brewery).
And like a Star Ship, there is an Alternate Bridge and other Compartments of decks.
There can be a Navigation Compartment where all the Star Navigators are housed, but the Captain might want to have some of his
Controls in that Room, so he can build a Clone of his Worm Hole Control in this room that is connected and acts like the one on the
Bridge.

Besides all the normal Compartments needed on a Star Ship (and you as a Builder decide how many and Names, and what controls or items
are available on that Tab), there are also Special Skynet Tabs (like this Build Tab) that you can access but are not used for you to
control things, but only a workshop to build something to be placed on a Normal User Tab.

When a Tab is added to the Brain, it has an ID. The ID is a Skynet required field, and while a suggestion is made, it is a free form
Field that you can Edit. Tab IDs follow Rule 3.2 ([The ID Rule](46-interface-tab-device-names)). Our example Tab
is: BH: Brew House
The ID is important as it is Part of the Suggested Name.
BM_15_DO@Pump_Red~Pump_**BH**
Suggested Name Format: INTERFACEid_Port_Type_Label_TABid

From the above BM_15_DO@Pump_Red~Pump_BH OakBarn Brewmeister knows that the Device Red Pump is connected to Interface BM
(Brewery Mega {Arduino}), on Port 15, Pump Type, labeled as Red Pump, and finally on Tab BH (Brew House Tab).

And do not worry about such a convoluted name when coding a Process as it will be selectable in a choice in a List Box. You will
quickly find it useful. Because of Predictive Text, if you use the Suggested name, type in BM in the List Box and your choices are
limited only to those devices assigned a Port on the BM: Brewery Mega Arduino will be a choice (among all the other BM_ Devices)
in the Predictive Text List Box.

You always send select Builds like a Vessel Template to the Special Skynet Tab: Templates.
**➕ Add new Tab…** makes a new Tab and comes back here and sets it as the default for the Build Tab (Skynet Rule 4.6).

## The Device Type

Its Device Type: DO@Pump, a Pump (Pump) on a Digital Out, On/Off (DO) port. The General Type comes first, then an @, then the
Device Type.
The Type is always supplied by Skynet and you cannot change it. All of the Skynet Devices have a set Type.

The same DO@Pump is the third part of the Suggested Name: DO@Pump. It comes from the Device you added and is set for you.
BM_15_**DO@Pump**_Red~Pump_BH
Suggested Name Format: INTERFACEid_Port_Type_Label_TABid

From the above BM_15_DO@Pump_Red~Pump_BH OakBarn Brewmeister knows that the Device Red Pump is connected to Interface BM
(Brewery Mega {Arduino}), on Port 15, Pump Type, labeled as Red Pump, and finally on Tab BH (Brew House Tab).

And do not worry about such a convoluted name when coding a Process as it will be selectable in a choice in a List Box. You will
quickly find it useful. Because of Predictive Text, if you use the Suggested name, type in BM in the List Box and your choices are
limited only to those devices assigned a Port on the BM: Brewery Mega Arduino will be a choice (among all the other BM_ Devices)
in the Predictive Text List Box.

## The Name

This is how the Device (or a Widget) is referred to as the unique identifier for the Skynet Panel to access and use the Red Pump you
just built.
In Skynet, there are some standards such as Prohibited Characters such as :, " and others that could interfere with the Computer's
Operating System or Skynet's own background code. No spaces are allowed in Skynet names.

Skynet always provides a Suggested Name which is the Skynet preferred naming convention. That convention tells you a lot about the
Device (or Widget) just by the name alone.

Suggested Name Format: INTERFACEid_Port_Type_Label_TABid

| Part | In the name |
|---|---|
| Interfaceid | **BM**_15_DO@Pump_Red~Pump_BH |
| Port | BM_**15**_DO@Pump_Red~Pump_BH |
| Type | BM_15_**DO@Pump**_Red~Pump_BH |
| Label | BM_15_DO@Pump_**Red~Pump**_BH |
| TABid | BM_15_DO@Pump_Red~Pump_**BH** |

From the above BM_15_DO@Pump_Red~Pump_BH OakBarn Brewmeister knows that the Device Red Pump is connected to Interface BM (Brewery
Mega {Arduino}), on Port 15, Pump Type, labeled as Red Pump, and finally on Tab BH (Brew House Tab).

And do not worry about such a convoluted name when coding a Process as it will be selectable in a choice in a List Box. You will
quickly find it useful. Because of Predictive Text, if you use the Suggested name, type in BM in the List Box and your choices are
limited only to those devices on the BM: Brewery Mega Arduino.

In Skynet a name can be changed quite easily. Besides a normal edit Field where you can use your own free form name, there is a
Button where all Names can be converted to a Suggested Name, if you have not chosen to use Suggested Name earlier. **Important:**
Clicking the **🏷 Suggested Names** > **💾 Convert** Button will change all the names to the Suggested Name. Names can still be
edited individually (**💾 Update to Suggested** changes one name). It is highly recommended to use the Skynet Suggested Name as certain features work best as they were set up to use
that format. The features still exist, but may be worthless if the Names vary from the Suggested Name Format.

In Edit layout, **🏷 Suggested Names** lists every Device and Widget whose Name is not
its Suggested Name; tick the ones to change and press **💾 Convert**, then **Save layout** (Rule 3.18). One name at a time: **💾 Update
to Suggested** in its Name Change box (Rule 3.16).

## The Inlet IP, Outlet IP and Hose or Pipe

![A pump with its 8 IPs](help_pictures/Pump_8_IPs.png)

Every pump has 8 IPs: the 4 corners of its box and the middle of each side, the same on every pump, so another pump can take its
place and stay joined to its pipes.

The pipes and hoses set its Inlet (IN) and Outlet (OUT), as seen on the Tab (OakBarn Brewery: "Pipe and hose changes are always
auto"; "nearest where the user places it"): draw or drop a pipe or hose end on or near the pump and it joins the nearest of the 8
IPs, and the pump's free end (its IN or OUT with nothing joined yet) moves there. With both ends free, the one nearer that spot
moves. A spot the other end is on is never taken. There is no Inlet IP or Outlet IP box to pick.

Example 1:

![Example 1: Right, Inlet Right Middle, Outlet Top Right](help_pictures/Pump_IP_Example_1.png)

Example 2:

![Example 2: Left, Inlet Bottom Right, Outlet Top Left](help_pictures/Pump_IP_Example_2.png)

Pipes or Hose snap connect to the nearest IP when the end is put on or near the pump; an end within 10 px of an
![IP](help_pictures/IP_Marker.png) joins that IP.

Switching the Orientation leaves them where they are (see Orientation above): Example 2 switched to Right keeps its Inlet on the
Bottom Right and its Outlet on the Top Left, and the Hose or Pipe inside the pump is drawn again to reach them.

**Hose or Pipe**: What is drawn from the pump's own inlet and outlet to its Inlet IP and Outlet IP: a White Hose, or a stainless
Pipe. A pipe or hose joined to the IP sets this too. It is drawn over the pump and its Cover under the On overlay.

## The ➕ Add Device button

While something is still missing, **➕ Add Device** looks faded. Its Hover Help says what to do first ("Type a Label first", "Pick the
Port first" ...), then, after a blank line, the same Hover Help as that box. Press it and it tells you what is missing.

Every dialog's titles and field names are in Title Case (Fore Color, Font Size).
