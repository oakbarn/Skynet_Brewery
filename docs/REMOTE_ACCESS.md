# Using the Brew Panel away from home (safely)

Two things keep the panel safe when you use it from outside the house:

1. **A password login.** Nobody can see or switch anything without signing in.
2. **Tailscale**, a free private network between *your own* devices. Your phone talks to the Pi through an encrypted tunnel, and **your router is never opened to the internet**.

> **Never** add a "port forward" for the panel on your router, and never put it on a public web address. A brewery controller switches heaters, burners and pumps. Tailscale gives you remote access without that risk.

---

## Part 1: Create your admin account (do this at home first)

1. Start the panel on the Pi as usual (`sudo systemctl restart brewpanel`, or `npm start`).
2. On a phone or computer **on your home WiFi**, open `http://<Pi's address>:8080`.
3. The first time, the panel asks you to **create the admin account**. Pick a user name and a password of at least 8 characters.
   - First-time setup only works from your own network, so a stranger can never create the first account.
4. You are signed in. Phones and computers stay signed in for 30 days of not being used, so you will not have to type the password every brew day.

### Adding other people

Go to **Settings > Users** and add a user with one of three roles:

| Role | Can do |
|---|---|
| **Viewer** | Watch everything (temperatures, timers, pumps). Cannot change anything. Good for a friend who wants to follow the brew. |
| **Operator** | Brew-day use: switch pumps and valves, set values, start and stop processes, import a recipe. Cannot change the layout, processes, devices, settings or users. |
| **Admin** | Everything. |

You can change someone's role, set a new password, or remove them at any time. They are signed out on every device straight away.

### Changing your own password

**Settings > My account**. Every other phone or computer signed in as you is signed out.

### Forgot the password?

On the Pi, in the panel folder:

```
node tools/reset-password.js            (lists the users)
node tools/reset-password.js Fritz      (asks for a new password for Fritz)
sudo systemctl restart brewpanel
```

---

## Part 2: Tailscale (reach the Pi from anywhere)

You install Tailscale on the Pi **and** on each phone or computer you want to use away from home, all signed in to the same Tailscale account. Then those devices can find each other wherever they are.

### On the Raspberry Pi

1. Open a terminal on the Pi (or SSH in) and run:
   ```
   curl -fsSL https://tailscale.com/install.sh | sh
   sudo tailscale up
   ```
2. The second command prints a web link. Open it on any computer and sign in (a Google, Microsoft or Apple account works). The Pi now shows up in your Tailscale account.
3. Give the Pi an easy name. In the Tailscale admin page (<https://login.tailscale.com/admin/machines>) click the Pi's **...** menu > **Edit machine name** and call it `brewpi`.
4. Tailscale starts by itself when the Pi boots. Nothing else to do.

### On your iPhone or Android phone

1. Install **Tailscale** from the App Store or Google Play.
2. Open it and sign in with **the same account** you used for the Pi.
3. Turn the switch to **Connected**.

### On a Windows, Mac or Linux computer

1. Download Tailscale from <https://tailscale.com/download> and install it.
2. Sign in with the same account.

### Open the panel from anywhere

With Tailscale connected on your phone, open:

```
http://brewpi:8080
```

(If that name does not work, open the Tailscale app, tap the Pi, and use the address that starts with `100.`, for example `http://100.101.102.103:8080`.)

Sign in with your panel user name and password, the same as at home.

### Optional: a padlock (https) address

Tailscale can also give the Pi a proper https address with a certificate. On the Pi run:

```
sudo tailscale serve --bg 8080
```

It prints an address like `https://brewpi.tail1234.ts.net`. That address works on every device in your Tailscale account, and browsers show the padlock. It is still private: only your Tailscale devices can reach it.

(If it asks you to turn on HTTPS for your account, follow the link it shows and click **Enable**.)

---

## Good habits

- Keep the hard-wired safety devices (flame safety, float switches, emergency stop). Remote control is a convenience, not a safety system.
- Give helpers the **Viewer** or **Operator** role, not Admin.
- If a phone is lost, remove it from your Tailscale account (admin page > the phone > **Remove**) and change your panel password.
- **API key:** other programs (Node-RED and similar) that change Globals through `/api` need the API key from **Settings**. Reading Globals without a key only works from your own network (home or Tailscale).
