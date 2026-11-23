# Help in any language

Besides **English** and **Français**, the Help can be read in one more language of your own: the **User Language**. You bring it in yourself, with any AI (Claude, ChatGPT ...): Skynet saves the Help as text files, the AI translates them, and Skynet takes the translation back. No internet, key or cost is needed inside Skynet.

Only the Help is translated, as in French: the Help pages, the balloons (Hover Help) and the words in the Help pictures. The screens, buttons, labels and menus stay English. The one exception is the safety buttons: **Override** and **Stop** show in the Help language picked, as in French.

## Three choices

**🌐 Help language**, at the top of the Help page list, then has three choices: **🌐 English**, **🌐 Français** and the User Language (**🌐 Deutsch**, for example). The **☰ Menu** has the same choices in a row, one click each; until a User Language is added, an Admin sees **➕ Add a Language** there, which opens **🌐 Languages**. The User Language stays on your own Brain: every screen that uses that Brain can pick it.

## Step by step

1. Open Help. Admins have **🌐 Languages** under the page list.
2. **⬇ Export.** Skynet makes the Help into parts (**⬇ Part 1 of 35** ...). Save each part.
3. Paste one part at a time into an AI and ask: "Translate this file into German. Give back the whole file." Save each answer as a text file.
4. **⬆ Import.** Pick every translated part at once. After you supply Skynet the files, no other user input is needed. The action takes place in the background.
5. Pick the new language in **🌐 Help language**.

**Only new and changed** exports only what the User Language does not have yet, or what changed since it was translated, so a later update is small. **Part size** sets how much English goes in each part: make it smaller if the AI stops part way through a part.

## What Skynet checks

Each page and balloon is checked against its English before it is taken: the same headings, links, pictures, code, {0} parts and marks (⬢ ⬆ ⚠). A piece that fails stays English, and **one** warning lists every piece that stayed English. Everything good is kept. Import the part again after a new try with the AI.

The red electrical warning (Rule 6.20) is always there: a translated page uses the language's own warning sentence, or the English one if the AI gave none.

## Keep English words

Some brewing words are never translated: **Strike**, **Sparge**, **Mash**, **Wort**, **Vorlauf** and the others in the list under **Keep English**. A translated page shows each one in English, with its meaning in that language next to it: **Mash (Maische)**. Skynet does this in the Background and needs no user input: whatever the AI does to the English word, Skynet puts it back.

Admins can add their own words in **Your own words on this Brain** (one per line), then **Save**. They are used on the next Export.

## A new language

Importing a different language replaces the User Language. The old one is kept in the Brain's `data/help_user_backups` folder, never deleted. Importing more parts of the same language adds to it.

Any language can be imported. Languages read right to left (Arabic, Hebrew, Persian, Urdu ...) are taken, but will not show right: the page would have to be mirrored.

## Fonts

The Help is drawn by the browser on your phone or PC, and phones, PCs and Macs have the letters of most languages. A screen plugged into the Raspberry Pi Brain may show empty boxes for Chinese, Japanese, Korean, Thai or Hindi. For those, the **Skynet Language Fonts Setup** (Windows) or **Skynet Language Fonts zip** on the Releases page, next to Skynet Brewer Setup, adds Google Noto fonts to the Brain. It only adds, and the main Setup stays small. The Brain then gives these fonts to every screen reading the Help.

**🔤 Add Font to Brain** adds a font file of your own (.woff2, .woff, .ttf or .otf). Its first screen is a warning, with **▶ Next** to go on and **Abandon** to stop: fonts added this way are not tested and may not work, and right-to-left languages will not work. **Delete** takes a font off the Brain again (it is moved to `data/help_user_backups/fonts`).

## The technical side

- The User Language is in the Brain's `data/help_user` folder: the pages, `_balloons.json`, `_pictures.json`, `_language.json` (its name, the Override and Stop words, the notes) and `_source.json` (which English each page was made from, so a page whose English changed later shows a note). A Setup never touches it, and **Move Brain** takes it along.
- The Skynet Keep English list is `help/_keep_english.txt`; your own words are in `data/help_user/_keep_english.txt`.
- On Export each Keep English word is written twice, as ⁅Mash⁆ (Mash): the AI translates only the copy in ( ). On Import the word in ⁅ ⁆ is put back in English at its place.
- The Skynet Language Fonts go in the panel's `fonts` folder; fonts added with **🔤 Add Font to Brain** go in `data/fonts`. They are used only for the Help pages and balloons, and only for letters the screen's own font lacks.
- Machine translation: a note under each page and a notice when the language is picked say so, as in French ([Help in French](192-help-in-french)).
