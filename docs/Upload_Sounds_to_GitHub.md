# Put sounds on GitHub for free (step by step)

This puts MP3 files on a free GitHub **Release** of the Skynet project. Every file gets its own lasting web link, and a Skynet
sound box can play that link (Skynet Rule 7.20, Help 186). It costs nothing, and there is no download limit for a public project.

A Release has no folders, so the **first word of each file name** says what kind of sound it is:

| Starts with | What it is | Example |
|---|---|---|
| `Song_` | Music | `Song_Brautag_im_Takt.mp3` |
| `Voice_` | Text to Speech (a computer voice) | `Voice_Mash_In.mp3` |

Only put up sounds you have the right to share (Skynet Rule 9.12). Each one also needs a row in `docs/Media_Licenses.csv`.

---

## Part 1: Get the files ready (on your computer)

1. Put all the MP3s you want to upload into one folder, for example `C:\Brewing\Upload_Sounds`.
2. **Rename each file** (right-click it, then pick **Rename**, or click it and press **F2**):
   - Start the name with `Song_` or `Voice_`.
   - Use `_` (underscore) instead of spaces. GitHub turns spaces into dots, which makes the links hard to read.
   - Use only letters, numbers, `_` and `-`. Leave out `'`, `&`, `#`, `ü`, `ß` and other special letters.
   - Keep `.mp3` at the end.
   - Examples: `Brautag im Takt - Malz und Marsch - Treblo.mp3` becomes `Song_Brautag_im_Takt_Malz_und_Marsch.mp3`.
     `Mash in now.mp3` becomes `Voice_Mash_In_Now.mp3`.
3. Each file can be up to 2 GB. An MP3 song is usually 3 to 10 MB, so size is not a problem.

## Part 2: Make the Release (one time only)

1. Open the Skynet project in your browser: <https://github.com/oakbarn/Skynet_Brewery> and sign in.
2. On the right side of the page, click **Releases**.
3. Near the top, click **Draft a new release**.
4. Click **Choose a tag**, type `Skynet-Sounds`, then click **+ Create new tag: Skynet-Sounds on publish**.
5. **Release title:** type `Skynet Sounds`.
6. **Description** (optional): for example *Songs and voice clips for Skynet. Song_ = music, Voice_ = Text to Speech.*
7. Go to Part 3 before you click Publish.

## Part 3: Upload the files

1. Open your `Upload_Sounds` folder in File Explorer.
2. Click one file, then press **Ctrl+A** to select them all.
3. Drag them onto the box near the bottom of the GitHub page that says **Attach binaries by dropping them here**.
4. Wait until every file shows a full green bar. A big song can take a minute.
5. Near the bottom, **untick "Set as the latest release"**. This matters: the Skynet Setup download must stay as the latest release.
6. Click **Publish release**.

## Part 4: Add more sounds later

1. Go to **Releases** and find **Skynet Sounds**.
2. Click the **pencil** (Edit) on it.
3. Drag the new files into the box, wait for the green bars, and click **Update release**.
4. To remove a file, click the trash can next to it while editing. Remember that a Skynet item using its link will then play the
   Missing Alarm Sound (an Alarm) or the Find The File song (a Sound Player) instead.

## Part 5: Get the links

- **The easy way:** tell Claude "the sounds are up", and Claude sends you the list of every file with its link.
- **By hand:** on the Release page, right-click a file name and pick **Copy link**. Every link looks like this:
  `https://github.com/oakbarn/Skynet_Brewery/releases/download/Skynet-Sounds/Song_Brautag_im_Takt.mp3`

## Part 6: Use a link in Skynet

In a sound box (an Alarm's Sound file, a Sound Player, or the sound before a hop alert), pick **Add new ...** and paste the link.
A Process can use it too: `SoundPlayer path = "https://github.com/oakbarn/Skynet_Brewery/releases/download/Skynet-Sounds/Song_Brautag_im_Takt.mp3"`.

A link needs the internet. For Hop and Brew Flow Alarms, a file on the Brain is the safest choice (Help 186).
