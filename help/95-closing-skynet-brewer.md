# Closing Skynet Brewer and Standby

The **Brain** is the computer (or Raspberry Pi) that runs Skynet. On a Windows PC, the Brain runs **in the Background**, with no window of its own (Skynet Rule 6.32). The panel window, and every phone or other computer, is just a browser showing the Brain.

## Closing the panel window

Closing the panel window with its **X**, or closing a browser tab, **never stops the Brain**. Your phone, another computer or a running Process may still be using it, and a brew must not stop because a window was closed. To open the panel window again, double-click **Skynet Brewer** on the Desktop.

## ☰ Menu > ⏻ Close Skynet Panel and the Brain

On the Brain's own computer (Admins only):

1. Open **☰ Menu**. At the bottom, pick **⏻ Close Skynet Panel and the Brain**.
2. A box lists what happens, each with a tick box: everything turns Off and every Process stops; **if you are brewing**, what is On and which Processes run; **if other screens have the panel open**, who they are (for example *Dana (iPhone)*). Tick each one to say you have read it. **Back** changes nothing.
3. Click **⏻ Close the panel and the Brain**. Every output is turned Off, the Brain stops and the panel window closes. Every other screen says **Skynet Brewer is closed**.

To start it again, double-click **Skynet Brewer** on that computer.

This choice is only on the Brain's own computer. On a phone, a tablet or another computer you get Standby instead.

## ☰ Menu > 💤 Put the Brain in Standby

On any other screen (and on a Raspberry Pi Brain), Admins only:

1. Open **☰ Menu**. At the bottom, pick **💤 Put the Brain in Standby**.
2. The same box with its tick boxes, and **Back** to change nothing.
3. Click **💤 Put the Brain in Standby**. Every output is turned Off, every Process stops and the Brain lets go of the boards. Every screen shows only **The Brain is in Standby**, with who put it there and when.

**Starting it again:** on the Standby page an Admin clicks **▶ Start the Brain**, from any screen, at home or away (for example over Tailscale). Someone who is not an Admin sees **Sign in as an Admin**. The Brain starts again the normal way, with everything Off. If it was put in Standby during a brew, the red notice says what was On and offers **▶ Resume** for 15 minutes (see [Sleep, Windows Update and restarts](190-sleep-updates-and-restarts)).

The Brain stays in Standby, even after a restart or a power cut, until an Admin starts it.

## Start menu > Skynet Brewer > Stop the Skynet Brain

On a Windows Brain, this stops the Brain running in the Background, with every output Off first, even when no panel window is open.

## When something goes wrong

- **The Brain did not start**: the black window that **Skynet Brewer** opens stays open and shows the last lines Skynet wrote, so you can read why. Press a key to close it. Everything the Brain writes goes in `data\brain.log` in the panel folder.
- **A Raspberry Pi set up as a service** starts by itself with the Pi. Use Standby from the panel. Skynet can also be stopped with `sudo systemctl stop skynet-brewer` (see [Installing](19-installing)).

However Skynet stops, it turns every output Off first. What happens when the PC sleeps or restarts during a brew: [Sleep, Windows Update and restarts](190-sleep-updates-and-restarts).
