# File Move (copy files from your computer to the Brain)

**File Move** copies files, or whole folders, from the computer you are sitting at (Windows, Mac or Linux) to the Brain (the Raspberry Pi). There is nothing to install: it works in the browser you already use to open the panel. Only an admin sees it.

Each kind of file has one home on the Brain, so nothing lands in the wrong place:

| Kind | Goes to on the Brain | Notes |
|---|---|---|
| Pictures (png, jpg, gif, svg, webp, bmp) | `media/Images` | Folders inside the one you pick are kept, so `Media\Pumps\a.png` becomes `Images/Pumps/a.png`. |
| Sounds (wav, mp3, ogg, m4a) | `media/sounds` | Always straight into `sounds`, so BruControl's `wave` folder is not needed. |
| Processes (.txt) | `scripts` | Pick **Processes** in *Put them in* first. |
| Help pages (.md) | `help` | Pick **Help pages** in *Put them in* first. |

## Copying your BruControl pictures and sounds

1. Open the panel on the Windows PC that has BruControl, sign in as admin and click **File Move**.
2. At the top it says how many pictures and sounds the loaded Schema uses that are **not on the Brain yet** (**Show the list** shows them).
3. Leave *Put them in* on **Pictures and sounds (sorted for you)**.
4. Click **Pick a folder** and choose `C:\BruControl\Media` (or drag that folder from File Explorer onto the dashed box). The browser may ask "Upload all files?": click **Upload**. Nothing is copied yet.
5. The list shows every file, where it goes, and what will happen: **New**, **Already on the Brain** (skipped), or why it cannot be copied. Tick **Only the ones this Schema is missing** to copy just those.
6. Click **Copy ... to the Brain**. When it is done, the count of missing files at the top goes down.

A file that is already on the Brain is never replaced unless you tick **Replace files already on the Brain**. An SVG picture (.svg) that is already there is never replaced, even then: see [Media](07-media).

## Good to know

- Files up to 300 MB each.
- For a single picture or a .zip you can also use the **Media** screen ([Media](07-media)).
- Copying from the Brain back to a computer (a backup) is not on this page yet.
