# Installing Tailscale on Windows

**Tailscale** lets your Windows computer reach the Brew Panel from anywhere: a friend's house, work, a hotel. It is a free private network between *your own* devices. The computer talks to the Raspberry Pi through an encrypted tunnel, and **your router is never opened to the internet**.

> **Never** add a port forward for the panel on your router. The panel switches heaters, burners and pumps. Tailscale gives you remote access without that risk.

## Before you start

- The Pi must already have Tailscale on it, signed in to **your** Tailscale account (see *Part 2* of `docs/REMOTE_ACCESS.md` in the panel folder). In these steps the Pi is called `brewpi`.
- You need **Windows 10 or Windows 11**, and a Windows account that is allowed to install programs.
- Know which account you used to sign in to Tailscale on the Pi (Google, Microsoft, Apple or GitHub). The Windows computer must use **the same one**.

## Step 1: Download Tailscale

1. On the Windows computer, open a browser and go to <https://tailscale.com/download>.
2. Click **Windows**, then **Download Tailscale for Windows**.
3. The installer (a file whose name starts with `tailscale-setup`) lands in your **Downloads** folder.

## Step 2: Install it

1. Open the **Downloads** folder and double-click the `tailscale-setup` file.
2. Tick that you agree to the license and click **Install**.
3. Windows asks "Do you want to allow this app to make changes to your device?". Click **Yes**.
4. When it says the install is finished, click **Close**.

## Step 3: Sign in

1. Look at the bottom-right corner of the screen, next to the clock. Find the **Tailscale icon** (a small grid of dots). If you can't see it, click the small **^** arrow there to show the hidden icons.
2. Click the Tailscale icon and choose **Log in**.
3. Your browser opens. Sign in with **the same account you used for the Pi**.
4. If it asks you to **Connect** this device, click **Connect**.
5. The browser says you are signed in. You can close that browser tab.

Click the Tailscale icon again: it should say **Connected**, and the Pi (`brewpi`) is listed under your network devices.

> **Tip:** drag the Tailscale icon out of the **^** area onto the taskbar, so you can always see at a glance whether it is connected.

## Step 4: Open the Brew Panel

1. Open any browser (Edge, Chrome, Firefox).
2. Type `http://brewpi:8080` in the address bar and press Enter.
3. Sign in with your **panel** user name and password, the same as at home.

**If `brewpi` doesn't work:** click the Tailscale icon, open the list of network devices, and click `brewpi`. That copies its address. It starts with `100.`. Then type `http://100.x.x.x:8080` with that address, for example `http://100.101.102.103:8080`.

**If you set up the padlock address** (`sudo tailscale serve --bg 8080` on the Pi), use the `https://brewpi.....ts.net` address it gave you instead.

Make it a browser **bookmark** (press Ctrl + D) so next time it is one click.

## Every day after that

- Tailscale starts by itself when Windows starts, and stays signed in. There's nothing to do.
- To switch it off for a while, click the icon and choose **Disconnect**. Choose **Connect** to turn it back on.
- At home on the same WiFi as the Pi, the panel works with or without Tailscale.

## When something doesn't work

| What you see | What to do |
|---|---|
| The page never loads | Click the Tailscale icon. If it does not say **Connected**, click **Connect**. |
| `brewpi` is not in the device list | The Pi is off, or signed in to a different Tailscale account. Check the account on both. |
| `brewpi` is listed but greyed out or "offline" | The Pi is off or has no internet. Check it at home. |
| The panel's sign-in page shows, but your password fails | That's the panel login, not Tailscale. See [Login, users and passwords](10-login). |
| Work or school computer won't install it | Their IT rules may block it. Use your phone with the Tailscale app instead. |

## If the computer is lost or sold

Go to <https://login.tailscale.com/admin/machines>, click the **...** next to that computer and choose **Remove**. Then change your panel password in **Settings > My account**.
