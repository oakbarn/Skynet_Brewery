# Sounds from a web link

A sound does not have to be a file on the Brain. It can be a **web link to an MP3** (Skynet Rule 7.20). The browser that shows the
panel plays it straight from the web, so the file never has to be on your computer. Use it when you don't want the music on the Brain.

## Use one

In any sound box (an Alarm's **Sound file**, a **Sound Player**, an Alarm Chain step, or **Settings > Panel settings: screen, Tabs and alerts > Sound before each hop
alert**), pick **Add new ...** and paste the link, for example:

```
https://github.com/oakbarn/Skynet_Brewery/releases/download/Skynet-Sounds/My.Song.mp3
```

The link must start with `https://` (or `http://`) and point straight at the MP3 file, not at a web page that has a player on it.
A Process can use one too:

```
SoundPlayer path = "https://github.com/oakbarn/Skynet_Brewery/releases/download/Skynet-Sounds/My.Song.mp3"
play SoundPlayer
```

## When the internet is down

A link needs the internet. Without it:

- **An Alarm** plays the **Missing Alarm Sound** from the Brain instead (a voice that says the sound can't be found), and a
  warning says why. If that isn't there either, it plays the Skynet beep. An Alarm is never silent. The same happens when an
  Alarm's sound file on the Brain is missing.
- **A Sound Player** plays OakBarn Brewery's song *Find The File - Connecting* once instead, and shows the same warning.
- **The sound before a hop alert** is skipped, and the alert's voice still speaks.

For **Hop** and **Brew Flow** Alarms, a file on the Brain is the safest choice: it plays with or without the internet.

## A free place to keep your MP3s

A **GitHub Release** is free and gives every file its own lasting link. On GitHub, open your project's **Releases**, click
**Draft a new release**, give it a tag (for example `Skynet-Sounds`), drag the MP3s in, and click **Publish release**. Then
right-click a file in the Release and pick **Copy link**. GitHub changes spaces in a file name to dots, so copy the link instead of
typing it.

Only put up sounds you have the right to share (Skynet Rule 9.12).

## The technical side

- A sound path that starts with `http://` or `https://` is a link (a URL). Anything else is a file in the media folders on the Brain.
- The browser plays the link itself (an HTML `<audio>` element). The Brain never downloads it, so a phone on Tailscale plays it from
  the web too.
- A sound that fails to load (an `error` event: a link, or a missing file) switches an Alarm to `sounds/Skynet/Alarm_Sound_Missing.mp3`,
  then to `sounds/alarm_beep.wav` if that fails too, until the page is opened again.
- A Sound Player switches to `sounds/Skynet/Find_The_File_Connecting.mp3` and plays it once (Repeat is ignored for it).
- **Media > Move** and the missing files list skip links: there is no file to move or find.
