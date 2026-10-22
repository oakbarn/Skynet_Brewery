# Media (pictures and sounds)

Pictures and sounds live in **media folders** on the Pi. Everywhere in the panel, a picture or sound is given by its **path** inside a media folder, for example `Images/Skynet/Pumps/Pump_Red_Rip_On.png`. The media folders are listed in **Settings > Panel settings**.

**Every picture lives in `media/Images`**, sorted into **picture groups** (a folder for Pumps, Valves, Vessels ...), with the Skynet pictures kept apart in `Images/Skynet` (see [Picture groups](57-picture-groups)), backgrounds too. The picture lists in the properties dialogs only show pictures from there. **Every sound lives in `media/sounds`.** Old paths still work: `oakbarn/...` (the old name of Images), a bare picture name like `brewery_main.png`, the sample drawings `samples/...`, and sounds imported from BruControl as `Images/wave/...`.

On a real brewery all of this is on the Brain (the Pi), in the panel folder: `media/Images` and `media/sounds`. Phones and PCs never hold the pictures; they get them from the Brain. To copy pictures from a PC to the Brain use **File Move** (whole folders at once) or this Media screen.

## The Media screen

It looks like Windows File Explorer: folders on the left, files on the right.

- **Add pictures / sounds**: pick files, or drag them onto the page. A `.zip` is unpacked with its folders, which is handy for a whole BruControl Media folder.
- **New folder**, **Up**, and **Large icons** or **Details** view.
- Drag a file onto a folder on the left to move it (on a phone use **Move**).
- Pick several files with **Ctrl+click** or **Shift+click** (on a phone tick **Select many**), then drag them or press **Move picked** or **Delete picked**.
- **Images/Skynet** holds the pictures that come with Skynet and is **read only**: nothing in it can be added, renamed, moved or deleted. The 🔒 standard picture groups in Images (for your pictures), and the Images and sounds folders themselves, can't be deleted, renamed or moved.
- Click a file to preview it, play it, **copy its path**, rename or delete it.
- **SVG pictures (.svg) can't be deleted, renamed, moved or replaced**, not even one you added yourself. The Skynet Templates and the panel are drawn with them, and a missing one would break every Tab that uses it. A folder with an SVG in it can't be renamed or moved either. To change an SVG, add a new one under a name of its own and pick that one instead.

Pictures: png, jpg, gif, svg, webp, bmp. Sounds: wav, mp3, ogg, m4a.

## Sharp SVG pictures

Every PNG or JPG gets an SVG copy next to it, so it stays sharp at any size. The original is never changed (BruControl can still use it), and you keep typing the `.png` path. **Settings > Pictures** shows each original beside its SVG and lets you pick which one is used. Photo-like pictures look better as the original.
