# Sleep, Windows Update and restarts

Most brewers start with a Windows PC as the Brain. A PC goes to sleep, Windows restarts it for updates, and sometimes you restart it yourself. This page says what Skynet does in each case, and what to set on the PC so a brew is not cut short.

> **⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.** (Rule 6.20)

After any stop, check your vessels before you turn a heater back On. A heater with no liquid over it can burn out or start a fire.

## What Skynet does for you

- **Closing the browser does not stop a brew.** Processes, Hysteresis, PID and the rest run in Skynet Brewer on the Brain, not in the browser.
- **The PC is kept awake while you brew.** While any Process runs or anything is On (a pump, a heater, a valve, a control), Skynet asks Windows not to sleep. The screen may still go dark; that is fine. When nothing is running, the PC may sleep again as usual.
- **Everything goes Off when Skynet stops.** When the black window is closed, when Windows shuts down or restarts, or from ☰ Menu > Close Skynet Brewer, Skynet turns every output Off before it stops. If Skynet can't (a power cut, a crash), each board turns its own outputs Off by itself after its **Lost link** delay (10 seconds to start, set on the Devices page).
- **After a restart, everything starts Off.** Nothing turns back On by itself, and no Process carries on from where it was. A Process you set to start when the panel starts still starts, from its top.
- **A notice tells you what happened.** If Skynet stopped during a brew, a red notice on every screen says when it stopped, what was On, and which Process was on which step and line. Close it with ✕ (it closes on every screen).
- **Woke from sleep anyway?** (a laptop lid, the power button) The boards already turned everything Off. Skynet turns everything Off on the screen too, stops every Process, and shows a red notice. Nothing comes back On by itself.
- **Windows has an update waiting.** When Windows has installed an update and is waiting to restart, a yellow notice says so. Restart the PC **before** you brew, so Windows does not do it during a brew.

## What to set on a brewing PC

These are Windows settings. Skynet does not change them for you.

1. **Start Skynet when you sign in.** The Skynet Setup asks *"Start Skynet Brewer by itself each time you sign in to Windows?"* Yes puts a shortcut in your Startup folder. Run the Setup again to change your answer.
2. **Come back after an update restart.** Windows 11 and 10: **Settings > Accounts > Sign-in options**, turn on **Use my sign-in info to automatically finish setting up after an update**. Then, after an update restart, Windows signs you in and Skynet starts again by itself. (Not every PC has this setting.)
3. **Keep updates out of your brewing hours.** **Settings > Windows Update > Advanced options > Active hours**: pick **Manually** and set the hours you brew (up to 18 hours, for example 6:00 AM to 12:00 AM). Windows does not restart for updates during Active hours. You can also **Pause updates** for a week before a big brew day.
4. **Laptop lid.** **Control Panel > Power Options > Choose what closing the lid does**: set **When I close the lid** to **Do nothing** (plugged in). Skynet can't stop a lid from putting a laptop to sleep.
5. **After a power cut.** Many PCs have a setting in their start-up screen (BIOS or UEFI) called **Restore on AC Power Loss** or **After Power Failure**: **Power On** makes the PC start by itself when the power comes back. Look in your PC's manual.
6. **Power for the boards.** A small battery backup (UPS) for the PC and the boards keeps a short power blink from stopping a brew.

## The technical side

- Keeping awake: Windows `SetThreadExecutionState` (ES_CONTINUOUS and ES_SYSTEM_REQUIRED), held by a small PowerShell helper only while brewing; a Mac uses `caffeinate`, Linux uses `systemd-inhibit`. A Raspberry Pi does not sleep.
- What was On and where each Process was is written to `data/brewing_now.json` every few seconds while brewing (written safely, so a power cut leaves the last good copy). The next start reads it for the notice.
- Sleep is noticed when Skynet's clock jumps by more than the shortest Lost link delay of your boards (at least 3 seconds).
- "Update waiting" is read from the Windows registry every 30 minutes (no admin rights needed).
- See also: [Closing Skynet Brewer](95-closing-skynet-brewer).
