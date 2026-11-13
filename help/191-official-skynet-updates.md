# Official Skynet updates

An **Official Skynet update** is a version of Skynet that **OakBarn Brewery** built and sent out on its own Releases page on GitHub.
Every time Skynet starts, it checks that its program files are still exactly the ones OakBarn Brewery sent. If anything was
changed, it **warns you** (Skynet Rule 9.14).

## Skynet is open source

Skynet is open source, under the **MIT License**. Anyone can read every line of it on GitHub, copy it, and make their own version.
That stays true. What the check adds is that you always know whether the Skynet on **your** Brain is still **Official Skynet**,
exactly as OakBarn Brewery sent it, or whether something in it was changed.

## Where you see it

- **On the Menu Bar**, after the version name:
  - **✓ Official**: every program file is the one OakBarn Brewery sent.
  - **⚠ Changed**: some program files are not the way OakBarn Brewery sent them.
  - **⚠ Not Official**: this Skynet did not come from OakBarn Brewery. It is someone else's copy, or a test copy that was never released.
  - **⚠ Not checked**: Skynet could not find a list to check against.
- **A red bar at the top of every screen** when it is not Official. **Details** opens **☰ Menu > About**, **Help** opens this page,
  and **✕** closes the bar until the next check.
- **☰ Menu > About > Official Skynet** gives the result, the time of the check, and the names of the files that are **Changed**,
  **Missing** or **Added**. **🔍 Check again** checks every file again.

The check **never stops anything**. A brew that is running carries on, whatever it finds.

## How Skynet knows

1. **Every Official update comes with a list.** When OakBarn Brewery releases a version, GitHub writes a list of every program
   file in it, each with its own **fingerprint**. A fingerprint is a long code worked out from every letter in the file (a
   SHA-256 hash). Change one letter and the fingerprint is completely different.
2. **Every start, Skynet works out the fingerprint of each of its program files** and compares it with the list.
3. **It asks OakBarn Brewery's own GitHub for the list of that same version**, so a list that was changed on the Brain can't fool
   it either. Without the internet it uses the list that came with it, and **☰ Menu > About** says so.
4. **Official and unchanged? The program files are made Read-only**, so Notepad and other editors can't save over one by accident.
   The Setup and the installers take Read-only off by themselves when they update Skynet.

## What is checked, and what is yours

**Checked (the program):** `server.js`, `importer.js`, `package.json` and the `lib`, `public`, `templates`, `firmware`, `install`
and `samples` folders.

**Never checked or touched (yours):** your Schemas, Tabs, Devices, Widgets and settings (`config`), users, passwords and brew data
(`data`), pictures and sounds (`media`), Processes (`processes`), the Help pages (an Admin can edit them in the panel), the extra
Sample Schemas (`sample_schemas`) and your own Templates.

## Repair

When **⚠ Changed** shows, an **Admin** can click **🛠 Repair** in **☰ Menu > About > Official Skynet**:

- It gets the official file of this same version for every changed or missing file, straight from OakBarn Brewery's GitHub. It
  needs the internet.
- Every download is checked against the official list before it is used.
- The changed files it replaces, and any file that was added, are **moved** to `backups/changed_files_<date>`. Nothing is deleted.
- Your own files (above) are never touched.
- Then close Skynet Brewer and start it again, so it runs the repaired files.

No internet? Run the Setup (or the installer) of the same version again. It puts back every program file too.

## Why a file might show as Changed

- Someone opened a program file in an editor and saved it.
- A copy was made from a test version that was never released.
- A virus or another program changed a file. This is rare, but it is the reason to look whenever you see **⚠ Changed**.

A changed program could do things OakBarn Brewery never made it do, like switching an element or a pump. If you didn't change it
yourself, **Repair** it before you brew.

## What it can't do

Whoever is the administrator of a computer can change any file on it, this check included. So it **finds and reports** changes; it
can't make them impossible. For your brewery, the safe habits are:

- Get Skynet only from **OakBarn Brewery's Releases page** on GitHub, or from oakbarnbrewery.com.
- Install and update with the **Setup** (or the installer for your computer).
- Look for **✓ Official** on the Menu Bar.

## Virus checks

- **On every Release:** after OakBarn Brewery releases a version, GitHub scans every `.exe` with **Microsoft Defender**. If it finds
  anything, the Release is hidden until OakBarn Brewery has looked at it. A clean scan adds a **Virus check** line to the Release
  notes. Once OakBarn Brewery's free VirusTotal key is set up, about 70 virus scanners look at each `.exe` too, and the Release
  notes give the count.
- **The Setup gets OakBarn Brewery's signature** (Skynet Rule 9.10) once signing is set up, so Windows can show who made it.

### Check a Setup .exe yourself, for free

Anyone can check a file at **virustotal.com**. No account is needed.

1. Open `virustotal.com` in your browser.
2. Click **Choose file** and pick the Setup `.exe` you downloaded (for example `Skynet_Brewer_Setup_<version>.exe`).
3. Wait a minute or two while about 70 virus scanners look at it.
4. Read the result. **0** of about 70 is a clean file. With a brand new installer, one or two scanners sometimes **guess** wrong (a
   false positive). If several flag it, don't run it, and tell OakBarn Brewery.

VirusTotal keeps a copy of every file sent to it. That is fine for Skynet's Setup, which is public anyway. **Never send a file of
your own that holds passwords or other private information.**
