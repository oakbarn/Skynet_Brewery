# Editing this manual

Admins can change this manual right here, and it is kept on the Pi with everything else.

- **Edit page** opens the page as text with a live preview beside it (below it on a phone). Press **Save page** when done.
- **New page** asks for a title and adds the page at the end of the list.
- **Delete page** removes it. A copy is kept in `help/backups` on the Pi, and a copy of the old text is kept there every time a page is saved.

## How pages are written

Pages are written in **Markdown**, plain text with a few marks:

| Type this | To get |
|---|---|
| `# Title` | The page title (the first line of every page) |
| `## Heading` | A heading |
| `**bold**` and `*italic*` | **bold** and *italic* |
| `- item` | A bullet list |
| `1. step` | A numbered list |
| A word between back-quotes (the key left of 1) | `code` |
| `> Note` | A highlighted note |
| `[Tailscale](https://tailscale.com)` | A link to a web site |
| `[Scripts](05-scripts)` | A link to another help page |
| `![Red pump](oakbarn/Pump_Red_Rip_On.png)` | A picture from a media folder |
| `---` | A line across the page |

Tables are rows of `|` with a `|---|---|` line under the first row, like the one above. For a picture, first add it on the [Media](07-media) screen, then use **Copy path**.

## The files

Each page is a `.md` text file in the `help` folder of the panel on the Pi. The number at the front of the file name sets the order (`05-scripts.md`). You can also edit them with any text editor; the panel shows the change the next time the page is opened.
