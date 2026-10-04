# Glossary

**Admin, Operator, Viewer**: the three user roles. See [Login](10-login).

**Alarm**: an element that plays a sound file. Press **Enable sound** once on each screen that should play it.

**API**: the way other programs (Node-RED, Home Assistant) read and set values. See [API](11-api).

**BeerXML**: the recipe file BeerSmith exports. See [Import](08-import).

**BruControl**: the Windows brewery program this panel is modelled on. Its configurations and scripts can be imported.

**Device**: an element tied to a port or pin on a board, such as a pump relay or a probe. See [Devices](03-devices).

**Element**: anything placed on a tab: an output, a reading, a variable, a timer, a picture.

**Fitting**: a pipe part (tee, elbow, cross, cap, manual valve) placed as an IP type.

**Global**: a variable every script can use, that can be logged and sent through the API.

**IP (Initial Point)**: a small round marker where a flow starts or ends (a pump outlet, a vessel port, a drain). Pipes start and end on IPs.

**Media folder**: a folder on the Pi that holds pictures and sounds. See [Media](07-media).

**PLC**: in this project, a hobby board: Arduino-compatible (such as the Mega), ESP32 or Raspberry Pi.

**Raspberry Pi**: the small computer that runs the panel and keeps all its files: the brain of the brewery.

**Script**: a text file of brew steps the panel runs by itself. See [Scripts](05-scripts).

**Shared variable**: a variable for passing values between scripts. Not on screen, not in the API or the database.

**Simulator**: a pretend board, so you can try everything without hardware.

**SVG**: a picture format that stays sharp at any size. The panel makes SVG copies of your PNG and JPG pictures.

**Tab**: one brewery screen (BruControl calls it a workspace).

**Tailscale**: a free private network between your own devices, for using the panel away from home safely.

**vAPI**: a variable for scripts, the screen, the API and the database. Names start with `vA`.

**vKonstant**: a variable for scripts and the screen only. Names start with `vK`.

**Widget**: an item that lives only in the app, not tied to any board (pictures, labels, timers, IPs, fittings).
