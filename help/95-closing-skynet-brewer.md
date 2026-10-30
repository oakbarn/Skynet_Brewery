# Closing Skynet Brewer

On Windows, Skynet Brewer runs in a black **Command Prompt** window on the Brain. Your browser only shows the panel.

To stop the panel **and** close that window in one go (Fritz, 2026-10-30):

1. Open **☰ Menu**. At the bottom, pick **⏻ Close Skynet Brewer** (Admins only).
2. The panel asks first, and says how many Processes are running. They stop.
3. The panel stops and the Command Prompt window closes by itself. Every phone and computer showing the panel says **Skynet Brewer is closed**.

To start it again, double-click **Skynet Brewer** on the Desktop.

## Why closing the browser does not stop it

Closing a browser tab never stops the panel. Your phone, another PC or a running Process may still be using it, and a brew must not stop because a tab was closed.

## When the window stays open

- **The panel stopped because of an error**: the window stays open so you can read why. Press a key to close it.
- **A Raspberry Pi set up as a service** (it starts by itself with the Pi): there is no window, so ☰ Menu has no Close Skynet Brewer. Use `sudo systemctl stop skynet-brewer` (see [Installing](19-installing)).
- **An older `Skynet_Brewer.bat`**: copy the new one from `C:\Brewing\BrewPanel\install\windows` (the installer does this for you).

Closing the black window with its **X**, or **Ctrl + C** in it, still stops the panel as before.
