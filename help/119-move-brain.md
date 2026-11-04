# Move Brain

Skynet runs the same on a **Raspberry Pi** and on a **Windows, Linux or Mac computer** (Skynet Rule 1.7). Many people start with
a computer as the Brain and move to a Pi later. **☰ Menu > Move Brain** (Admins) moves everything in three steps (Skynet Rule 9.9):

1. On the **old** Brain: make a **Brain Move file**.
2. On the **new** Brain: bring the file in. The panel restarts with everything from the old Brain.
3. On the **new** Brain: change the **USB ports** to the new Brain's names.

It works any way round: computer to Pi, Pi to computer, or one computer to another.

## What moves

Everything that is yours:

- **Schemas**: every Schema, its Tabs, Devices, Widgets, Interfaces, pipes and pictures on the Tabs, and the daily Schema backups.
- **Settings**: every panel setting (Settings page, MQTT and voice, password rules, the Menu order, Styles ...), Equipment
  Profiles, Mash, Boil, Water, Tab and Valve Profiles, Recipes, your own Vessel, Fitting, Device and Process Templates.
- **Processes**, and the Processes in the Recycle Bin.
- **Pictures and sounds** in the Brain's media folder.
- **Saved values**: every gGlobal keeps its value (Skynet Rule 1.22), for every Schema.
- **Logins**: every user, password and role, and the recovery code. You sign in on the new Brain with the **old** Brain's user
  name and password.
- **The brew log**: every reading in the database, and the messaging (texts and e-mail) settings.

Not moved: the sign-ins of the browsers (everyone signs in again once), and pictures in **other** media folders you added in
Settings > Media folders. The panel lists those; copy them over with the [File Move](32-file-move) page.

## Make the Brain Move file

On the **old** Brain, open **☰ Menu > Move Brain**:

1. Type a **Move password** twice (at least 6 characters). The file is **locked** with it, because it holds your logins and the
   hidden keys (Skynet Rule 3.10). Nobody can open the file without it, so a copy left on a USB stick is safe.
2. Click **⬇ Make a Brain Move file**. Everything is saved first, then the file downloads to this computer's Downloads folder,
   named like `Skynet_Brain_Move_20261103T162600.skynetmove` (the date and time it was made).

Making the file changes nothing on the old Brain. Keep the old Brain as it is until the new one runs well.

## Bring it in on the new Brain

1. **Install Skynet** on the new Brain the normal way (on a Pi: `bash install-skynet-brewer.sh`, see [Installing](19-installing)),
   do the Admin setup, and sign in.
2. Open **☰ Menu > Move Brain** on the new Brain. Do it from a browser on a computer that has the Brain Move file (the old
   computer is fine: type the Pi's address, for example `http://skynet-pi:8080`), or copy the file over on a USB stick.
3. Under **2. On the NEW Brain**, pick the file, type the **Move password** and click **⬆ Bring in the file**. The panel checks
   the file and says where it came from and how many files it has. A wrong password or a damaged file is refused, and nothing is
   changed.
4. Click **🚚 Move in now** and answer **OK**. Every output turns off and running Processes stop. The panel stops and, as it starts
   again, the old Brain's files take the place of the new Brain's.
   - On a **Pi** (Skynet runs as a service) it starts again by itself after a few seconds. Reload the page after about 15 seconds.
   - On a **computer** the Skynet Brewer window closes: double-click **Skynet Brewer** to start it again, then reload the page.
5. **Sign in with the old Brain's user name and password.** The Processes console says the move is done.

Nothing is deleted: the new Brain's own config, data, scripts and media folders are kept in
`backups/before_brain_move_<date and time>`, with a copy of the Brain Move file.

## USB ports

A board on USB has a different port name on each kind of Brain: **COM3** on Windows, **/dev/ttyACM0** (a Mega or Uno) or
**/dev/ttyUSB0** (many ESP32 and Nano boards) on a Pi or Linux, **/dev/cu.usbmodem14101** on a Mac. After the move, plug the
boards into the new Brain and open **☰ Menu > Move Brain**. Under **3. USB ports**:

- Each old port is listed once, with the Interfaces (and their Schemas) that use it, and what board the old Brain saw on it.
- **Change to** lists the USB ports this Brain sees now. A board the old Brain saw is **found by its serial number and picked
  for you**. When only one board is left, it is picked too. Check each one.
- **Keep** leaves the port as it is (for a board that is not plugged in yet). Click **🔄 Look again** after plugging one in.
- Click **💾 Save USB ports**. Every Schema that uses that port changes at once, and the loaded Schema's boards connect again.

You can use **USB ports** any time, not only after a move, for example after plugging a board into another USB socket.
Interfaces on **Ethernet** or **WiFi** keep their address and need nothing. A board on the **Simulator** keeps its real USB port for
later, and that port is changed too.
