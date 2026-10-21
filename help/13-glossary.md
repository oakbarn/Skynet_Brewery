# Glossary

**Admin, Operator, Viewer**: the three user roles. See [Login](10-login).

**Alarm**: an element that plays a sound file: Hop, Brew Flow, Pre-Hop, General or Sound only. Only one sound plays at a time, by priority. In a Process: `alm_Name = true`. See [Alarms and sound](21-alarms-and-sound).

**Sound Player**: a Widget that plays one sound file (`play SoundPlayer`, `stop SoundPlayer`). It pauses while any alarm sounds.

**API**: the way other programs (Node-RED, Home Assistant) read and set values. See [API](11-api).

**Background (of a tab)**: the picture and color behind everything on a tab. Set in **⚙ Tab settings** with Edit layout on. See [Tab background picture and color](26-tab-background).

**Interface**: a board (PLC) Devices are wired to. Its **Interface ID** (1-4 letters, like `MB_`) starts the names of its Devices. See [Interface, Tab and Device names](46-interface-tab-device-names).

**Tab ID**: the 2 letters (like `SP`) that end the names of new Devices on a tab. See [Interface, Tab and Device names](46-interface-tab-device-names).

**BeerXML**: the recipe file BeerSmith exports. See [Import](08-import).

**Bundle**: a vessel locked together with its IPs so they move as one and can't be edited until you switch **Bundled** off. See [Equipment](14-equipment).

**BruControl**: the Windows brewery program this panel is modelled on. Its Schemas (BruControl calls them configuration files) and processes can be imported.

**Color selector**: every color setting is the same dropdown. **Default** (first) keeps the item's normal color, **None** (second) means no color at all (see-through), then colors by name with a swatch, and **Custom (add new) ...** for any other color, which is kept in the list for next time.

**Device**: an element tied to a port or pin on a board, such as a pump relay or a probe. See [Devices](03-devices).

**Element**: anything placed on a tab: an output, a reading, a variable, a timer, a picture.

**Fitting**: a pipe part (tee, elbow, cross, coupling, cap, manual valve) placed as an IP type.

**Hose**: a flexible pipe that bends in curves, with an IP (a coupling) at both ends. See [Pipes, hoses and reducers](24-pipes-and-hoses).

**Global**: BruControl's variable class. The panel turns Globals into vKonstant or vAPI variables when they are imported.

**imagePath_1, _2, _3**: the three picture paths of an item. `background = 1, 2 or 3` picks one; `name.image = "path"` changes imagePath_1. See [Pictures on items](25-picture-paths).

**IP (Initial Point)**: a small round marker where a flow starts or ends (a pump outlet, a vessel port, a drain). Pipes start and end on IPs. IPs only show in Edit layout.

**Media folder**: a folder on the Pi that holds pictures and sounds. See [Media](07-media).

**PLC**: in this project, a hobby board: Arduino-compatible (such as the Mega), ESP32 or Raspberry Pi.

**Raspberry Pi**: the small computer that runs the panel and keeps all its files: the brain of the brewery.

**Process**: a text file of brew steps the panel runs by itself. See [Processes](05-scripts).

**Process class**: Flow, Sub, Repeat or Looper: what a Process is for. See [Process language and steps](22-process-language).

**Step**: a `step "name"` line in a Process. Steps are numbered by themselves (1.00000, 1.00001 ...). See [Process language and steps](22-process-language).

**Schema**: the whole setup of your brewery in the panel: Tabs, elements, pipes, Devices and settings (other programs call it a setup or configuration). The samples are ready-made Schemas, and a BruControl configuration file is imported as a Schema. It is saved in the `config` folder.

**Shared variable**: a variable for passing values between processes. Not on screen, not in the API or the database.

**Simulation mode**: every board is replaced by the simulator and time can run faster or skip ahead, to try a brew day without touching hardware. See [Simulation mode](20-simulation).

**Simulator**: a pretend board, so you can try everything without hardware.

**SVG**: a picture format that stays sharp at any size. The panel makes SVG copies of your PNG and JPG pictures.

**Tab**: one brewery screen (BruControl calls it a workspace).

**Tailscale**: a free private network between your own devices, for using the panel away from home safely. See [Installing Tailscale on Windows](00-tailscale-windows).

**vAPI**: a variable for processes, the screen, the API and the database. Names start with `vA`.

**vKonstant**: a variable for processes and the screen only. Names start with `vK`.

**Widget**: an item that lives only in the app, not tied to any board (pictures, labels, timers, IPs, fittings).

**Schema**: one whole brewery setup (tabs, devices, elements, pipes and its Equipment Profile), kept in its own file and picked from the Schema dropdown at the top. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

**Equipment Profile**: the losses, vessels and piping of a brewery, made on the Equipment Profile tab of the ☰ Menu. Any Schema can use any profile: unique to one Schema, or shared by several. See [Schemas and Equipment Profiles](28-schemas-and-equipment-profiles).

**☰ Menu**: the button at the top right of the Tabs page. Edit layout is its first choice; the rest open Menu tabs. See [The ☰ Menu](33-menu).

**Menu tab**: a page opened from the ☰ Menu (Default, Equipment Profile, Vessel, Default Layout, Mash Profile, Boil Profile). It shows next to the screen tabs, with a ✕ to close it, and has an Order number.

**Default Layout**: the vessels, IPs, pipes and hoses stored in an Equipment Profile. A Schema follows it, or keeps its own layout.

**Mash Profile**: up to 4 mash steps (temperature and time) and the sparge. See [Mash and Boil Profiles](35-mash-and-boil-profiles).

**Boil Profile**: the total boil time and the boil off per hour.

**Tab Background Profile**: a tab's background color and the look (colors, placement, LED / Text / Gauge) new devices and widgets on it start with. See [Tab Background and Valve Profiles](36-tab-and-valve-profiles).

**Valve Profile**: the graphics and orientation (Horizontal, Vertical, 45 degrees Left or Right) a new valve starts with, picked only when the valve is made.

**Heat Source**: how a vessel is heated: Gas, Electric, RIMS, HERMS, Other or Unheated. See [The Vessel tab](34-vessel-tab).

**Service**: what a valve carries: Gas, Room Temperature Liquid, or High Temperature Liquid (Stainless Steel). A gas valve can be a vessel's heat source.

**Template**: a ready-made vessel (Vessel Template) or set of up to four fittings (Bundled Fitting Template), kept in a library. Skynet Templates come with the panel and are only cloned; User Templates are your own. See [Vessel and Fitting Templates](50-vessel-and-fitting-templates).

**Tab_Vessel, Tab_Fitting**: the copy of a Template on a Tab. Not a Device and not a Widget, but it can hold both. Fully editable. See [Vessel and Fitting Templates](50-vessel-and-fitting-templates).
