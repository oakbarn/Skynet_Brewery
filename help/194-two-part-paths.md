# Two-part paths (.path and .file)

Every picture and sound has a path in two parts: the **folder** it is in (**.path** holds the whole path) and its **file name** (**.file**). Most of the time you only need the file name: Skynet adds the folder (Skynet Rule 7.23).

## The four default folders

| Default | Folder | Can it be changed? |
|---|---|---|
| **Skynet Graphic** | `Images/Skynet` | No. The Skynet pictures live here. |
| **Skynet Audio** | `sounds/Skynet` | No. The Skynet sounds live here. |
| **User Graphic** | `Images` | Yes, in **Settings > Panel settings > Default folders**. Your picture groups are folders in it. |
| **User Audio** | `sounds` | Yes, in the same place. |

## In Properties

A picture or sound list shows **only the file name** (a Skynet picture also shows its [number](193-skynet-picture-numbers)). Under the list, **Folder** shows where the file is.

- A Skynet picture or sound: the Folder is greyed out. It can't be changed.
- Your own picture or sound: the Folder can be typed. Normally the folder it is in is used. Type another folder in your media folders to use the same file name from there.

## In a Process

A file name alone is enough:

```
alm_Brew.backpath = "Bell.svg"
alm_Brew.sound = "ding.mp3"
gG_Brew_Day_Picture = "brewery_main.png"
```

Skynet looks for the file in the **User** folder first (and the folders in it), then in the **Skynet** folder (and its groups). A file that is in neither is shown in the Process check, and the path is the User folder with that name.

A whole path goes in **.path**. Only a file name goes in **.file**:

```
alm_Brew.backpath.path = "Images/Hops/Bell.svg"
alm_Brew.backpath.file = "Bell_Red.svg"
if alm_Brew.sound.file == "ding.mp3"
  SoundPlayer_1.file = "song.mp3"
endif
```

- **.path** reads or sets the whole path.
- **.file** reads or sets only the file name. The file stays in the same folder when it is there; if not, Skynet looks for it as above.

**The item's own .path and .file.** On a Device or Widget, `.path` and `.file` are its Image Path 1 (.backpath), `.path_2` and `.file_2` its Image Path 2, and `.path_3` and `.file_3` its Image Path 3. On an Alarm or a Sound Player, `.path` and `.file` are its sound. On a Graphic gGlobal they are its picture.

```
Pump_1.file = "MyPump.png"
Pump_1.path_2 = "Images/Pumps/MyPump_Blue.png"
alm_Brew.file = "ding.mp3"
```

Every picture or sound attribute has the two parts: `.image`, `.backpath`, `.backpath_2`, `.backpath_3`, `.imageon`, `.imageoff`, `.imageoverlay`, `.setgraphic`, an Alarm's `.sound`, a Sound Player's sound (`SoundPlayer_1.path`, `SoundPlayer_1.file`) and a Graphic gGlobal (`gG_Pic.path`, `gG_Pic.file`).

## The technical side

A web link to an MP3 (`https://...`) is kept as it is: it has no folder on the Brain. A word such as `none` is kept as it is too. Inside Skynet each path is kept whole (folder and file together), so everything that worked with a whole path still works. In the **🖼** picture picker of the Process editor, **Insert** puts in only the file name when no other file has the same name. See also [Background pictures](25-picture-paths) and [Media](07-media).
