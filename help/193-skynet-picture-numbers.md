# Skynet Picture numbers

Every picture that comes with Skynet has its own **number**. The number never changes and is never given to another picture, even if the picture is renamed (Skynet Rule 7.22).

## Where you see the numbers

- **Every picture list** in Properties shows a Skynet picture with its number in front of the file name, for example **24 · Overlay_Bolt.svg**. Your own pictures show only their file name.
- **🖼 Pick from icons:** each Skynet picture's tile shows its number. Type a number in the search box to find that picture.
- **Media page:** the pictures in **Images/Skynet** show their numbers.
- **The printable list:** Media page > **🔢 Skynet Picture numbers** opens every Skynet picture with its number, file name and group. Pick a group or search, then press **🖨 Print**.

## In a Process

Give a picture by its number or by its file name. These two lines do the same thing:

```
alm_Brew.setgraphic = 24
alm_Brew.setgraphic = "Overlay_Bolt.svg"
```

A number works wherever a picture goes: `.image`, `.backpath`, `.backpath_2`, `.backpath_3`, `.imageon`, `.imageoff`, `.imageoverlay`, `.setgraphic` and a Graphic gGlobal. A number that is not a Skynet picture stops the Process with a message that says so.

## The technical side

The numbers are kept in `lib/skynetpicids.json`, one row for each picture in `media/Images/Skynet`. A new Skynet picture gets the next number. A picture that is taken away keeps its row, marked retired, so its number is never used again. The same list is on GitHub as `docs/Skynet_Picture_IDs.md`. See also [Two-part paths](194-two-part-paths).
