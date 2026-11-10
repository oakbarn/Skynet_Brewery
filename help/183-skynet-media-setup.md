# The Skynet Media Setup

The Skynet pictures and sounds (pumps, valves, vessels, alarm sounds ...) are **not** inside the panel's installer or zip. They come as their own download, so the panel stays small, and new pictures can be added without a new panel version.

**It only ever adds.** A picture or sound you already have, by that name, is never changed. Nothing is ever deleted. Your own pictures and sounds are never touched.

## Where to get it

On the same download page as the panel: **https://github.com/oakbarn/Skynet_Brewery/releases/latest**

| File | For |
|---|---|
| `Skynet_Media_Setup_<date>.exe` | Windows |
| `Skynet_Media_<date>.zip` | Mac, Linux, Raspberry Pi, or Windows by hand |

## How to use it

- **Windows:** install the panel first (Skynet Brewer Setup), then double-click `Skynet_Media_Setup_<date>.exe`. Keep the folder it shows (`C:\Brewing\BrewPanel`, where the panel is) and click Install. If the panel is running, press F5 in its window to see the new pictures.
- **Mac, Linux, Raspberry Pi with the installer:** put `Skynet_Media_<date>.zip` next to the installer before you run it. The installer adds the pictures and sounds you do not have yet.
- **By hand:** unzip `Skynet_Media_<date>.zip` into the folder that holds `BrewPanel` (on Mac, Linux and Pi use `unzip -n`, which never replaces a file). It adds `BrewPanel/defaults/media`. The next time the panel starts, it copies in only the pictures and sounds you do not have yet.

Run it again whenever new Skynet pictures come out. It is safe to run as often as you like.

## Good to know

- When a Skynet drawing is redone, it comes as a **new picture with a new name**. The old one stays, so every Schema that uses it looks the same as before.
- A Brain on the internet can also get new pictures one at a time with **☰ Menu > Get Skynet pictures** (see [Get Skynet pictures](59-get-skynet-pictures)).
- Skynet only ships pictures and sounds it is free to share: its own drawings, or ones in the public domain or under a free license such as CC0, with credit kept where the license asks for it.
