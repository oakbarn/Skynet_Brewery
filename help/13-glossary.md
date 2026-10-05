# Glossary

**Admin, Operator, Viewer**: the three user roles. See [Login](10-login).

**Alarm**: an element that plays a sound file: Hop, Brew Flow, Pre-Hop, General or Sound only. Only one sound plays at a time, by priority. In a Process: `alm_Name = true`. See [Alarms and sound](21-alarms-and-sound).

**Sound Player**: a Widget that plays one sound file (`play SoundPlayer`, `stop SoundPlayer`). It pauses while any alarm sounds.

**API**: the way other programs (Node-RED, Home Assistant) read and set values. See [API](11-api).

**BeerXML**: the recipe file BeerSmith exports. See [Import](08-import).

**Bundle**: a vessel locked together with its IPs so they move as one and can't be edited until you switch **Bundled** off. See [Equipment](14-equipment).

**BruControl**: the Windows brewery program this panel is modelled on. Its configurations and processes can be imported.

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

**Shared variable**: a variable for passing values between processes. Not on screen, not in the API or the database.

**Simulation mode**: every board is replaced by the simulator and time can run faster or skip ahead, to try a brew day without touching hardware. See [Simulation mode](20-simulation).

**Simulator**: a pretend board, so you can try everything without hardware.

**SVG**: a picture format that stays sharp at any size. The panel makes SVG copies of your PNG and JPG pictures.

**Tab**: one brewery screen (BruControl calls it a workspace).

**Tailscale**: a free private network between your own devices, for using the panel away from home safely. See [Installing Tailscale on Windows](00-tailscale-windows).

**vAPI**: a variable for processes, the screen, the API and the database. Names start with `vA`.

**vKonstant**: a variable for processes and the screen only. Names start with `vK`.

**Widget**: an item that lives only in the app, not tied to any board (pictures, labels, timers, IPs, fittings).
