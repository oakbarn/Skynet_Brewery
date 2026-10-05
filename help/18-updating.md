# Updating to a new version (Windows)

A new version of the Brew Panel comes as a `.zip` file. You unzip it over your panel folder (for example `C:\Brewing`). This page shows how to do that without errors and without losing your brew data.

> **The panel must be stopped first.** While it runs, Windows keeps some of its files open (the **data** folder: the brew log database, users and saved values). Unzipping over open files fails with errors like "The action can't be completed because the file is open in Node.js" or "Access denied".

## Step 1: Stop the panel

The panel runs in a black **command window** (opened by your `.bat` file or by `npm start`).

1. Click that command window.
2. Press **Ctrl + C**. If it asks `Terminate batch job (Y/N)?`, type **Y** and press Enter.
3. Close the window with the **X** in its corner.

Closing the window with the **X** on its own also stops the panel.

## Step 2: If files are still locked

Sometimes Node.js keeps running in the background after the window is gone, and the data folder stays locked. To end it:

1. Press **Ctrl + Shift + Esc** to open **Task Manager**. If it looks small, click **More details**.
2. On the **Processes** tab (Windows 11: the first icon on the left), find **Node.js JavaScript Runtime** (or `node.exe`).
3. Click it, then click **End task**. Do this for each Node.js line.
4. Close Task Manager.

> If you're not sure which Node.js is the panel, it's fine to end them all, as long as you don't have another Node program open that you care about.

Still locked? Restart the computer, and don't start the panel until the update is done.

## Step 3: Make a copy first

Right-click your panel folder (for example `C:\Brewing`), choose **Copy**, then **Paste** it in the same place. Windows makes `C:\Brewing - Copy`. If anything goes wrong, you still have everything.

## Step 4: Unzip the new version

1. Right-click the new `.zip` and choose **Extract All…**, or open it and drag its contents out.
2. Put the files into your panel folder (`C:\Brewing`).
3. When Windows asks about files with the same name, choose **Replace the files in the destination**.

## What to keep

| Folder or file | What it is | On an update |
|---|---|---|
| `data` | Brew log database, saved values, users and sign-ins | **Keep it.** The zip doesn't have a data folder, so unzipping never touches it. Never delete it. |
| `config\brewery.json` | Your tabs, elements, devices and settings | The zip has one too. If you changed your layout, copy yours back from the copy you made in step 3. |
| `scripts` | Your processes | Copy back any you made or changed. |
| `media` | Your pictures and sounds | Copy back any you added. |
| `help` | This manual | Copy back pages you wrote yourself. |

## Step 5: Start the panel again

Double-click your `.bat` file (or run `npm start` in the folder) and open the panel in your browser as usual.

While **Testing mode** is on, a new version clears every sign-in, so the panel asks you to create the admin account again. Write down the new **recovery code**. See [Login, users and passwords](10-login).

## On the Raspberry Pi

It's the same idea: stop the panel with `sudo systemctl stop brewpanel`, copy the new files over the panel folder (keep `data`), then run `sudo systemctl start brewpanel`.
