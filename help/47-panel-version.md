# Panel version

The panel has two version codes:

- The **Panel version** is the version of the program itself. GitHub makes a new one every time code is merged.
- The **Schema version** is the version of your setup. You make it yourself (see **About and Schema versions**).

## Where you see it

- On the **Menu Bar**, in small grey letters after the panel name, for example `Skynet-v.20261021_16_30`.
- In **☰ Menu > About**, next to **Panel version**, with the date and time it was merged and a line that says whether it is the latest:
  - **Up to date: this is the latest merged version.** (green)
  - **A newer version is on GitHub: ...** (yellow). Download and install the new version (see **Updating**).
  - **These files were changed after ...**: you are running a copy of a pull request that is not merged yet, or someone edited the program files by hand. The version shown is the last merge it was built on, with **+ changes** after it.
  - **Could not check GitHub**: the Brain has no internet, or the repository is private. The Panel version itself is still right.
  - **Not stamped**: this copy did not come from a GitHub merge (for example an older zip). The next merged version fixes it.

The **Versions on GitHub** link opens the list of every version (GitHub Releases), with what changed in each one.

## How the name is made

`Skynet-v.yyyymmdd_hh_mm`, the year, month, day, hour and minute of the merge, for example `Skynet-v.20261021_16_30` is 21 October 2026 at 16:30. The time is **UTC** (GMT), the same everywhere in the world. If two merges land in the same minute, the second one ends in `_2`.

## How it works

When a pull request is merged into the main branch, GitHub runs **Panel version** (the file `.github/workflows/panel-version.yml`). It:

1. Writes the file `version.json` at the top of the panel folder, with the version name, the merge time and a fingerprint of the program files.
2. Saves that file into the branch, so every download of the code has it.
3. Makes a GitHub tag and a **Release** with the same name. On the Release page, **Source code (zip)** downloads exactly that version.

Never edit `version.json` by hand or in a pull request. GitHub owns it.

The About tab asks GitHub for the newest `version.json` (at most every 10 minutes). Nothing about your brewery is sent, only a plain download of that one file.

## GitHub settings

Nothing has to be changed for a normal personal repository. If the **Panel version** run fails (a red ✗ on the **Actions** tab on GitHub):

- **Settings > Actions > General > Actions permissions**: pick **Allow all actions and reusable workflows**.
- **Settings > Actions > General > Workflow permissions**: pick **Read and write permissions**, then **Save**.
- If you turn on branch protection or a ruleset for the main branch that blocks direct pushes, GitHub's own robot cannot save `version.json` either. Ask for the workflow to be changed before turning that on.

You can also run it by hand: **Actions > Panel version > Run workflow**.
