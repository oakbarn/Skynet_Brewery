# Step by Step: Share a Schema with another brewer

A Schema can be sent to another brewer, who adds it to their own Skynet. **Skynet does not send any file for you:** pictures and sounds may hold copyrighted material, so what you send, and any copyright on it, is between the brewers.

> **⚠ Both brewers should be on the latest version of Skynet.** Things are added to Skynet all the time, and an older Skynet may not know something in a newer Schema file.

## Step 1. Know the kinds of files

| File | What it is | Where it comes from |
|---|---|---|
| **The Schema file** (.json) | The Tabs, boards, Devices, Widgets, pipes and Equipment Profile drawings. No logins, passwords or panel settings. | **📤 Export to share** |
| **Your own pictures and sounds** (.png, .jpg, .svg, .wav, .mp3 ...) | The Schema file only names them. Skynet's own pictures and sounds come with every Skynet, so they are never sent. | The list under **Share with other brewers** |
| **Processes** (.txt) | They are kept in the `processes` folder, not in the Schema file. | The `processes` folder in the panel folder (for example `C:\Brewing\BrewPanel\processes`) |

## Step 2. Save the Schema file

Press **☰ Menu > Schema**, then **📤 Export to share** under **Share with other brewers**. Pick the Schema and press **Save**. The file goes to the **Downloads** folder of this computer. More: [Schema.json](44-schema-json).

## Step 3. Save your own pictures and sounds

Under **Share with other brewers**, Skynet lists the pictures and sounds of your own that the loaded Schema uses (Skynet's own are left out). **Click each one** to save it on this computer, in Downloads. Send only the ones you may share.

## Step 4. Send the files

Put the files in one folder, and send them the way you like: an email with the files attached, a USB stick, or a shared folder (OneDrive, Google Drive, Dropbox ...). For many files, a .zip of the folder is easiest (in Windows: right-click the folder > **Send to > Compressed (zipped) folder**).

## Step 5. The other brewer adds them

1. **Pictures and sounds first**: on the Brain, **File Move** (a whole folder, see [File Move](32-file-move)) or the **Media** screen (a .zip is unpacked with its folders, see [Media](07-media)).
2. **Processes**: **File Move**, with **Processes** in *Put them in*.
3. **The Schema file**: put it in the **Import folder** (`C:\Brewing\Import`), then **☰ Menu > Schema > 📥 Import a brewer's Schema**. It always comes in as a new Schema: none of theirs is written over.

A picture or sound that did not come shows as missing until it is added.
