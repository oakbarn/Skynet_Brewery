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

### Your recovery code

When you create the admin account, the panel shows a **recovery code** like `K7QM-3XPD-9RTA-WF2H`. Write it down and keep it somewhere safe, away from the Pi (your wallet, a password manager). It is shown only once.

Lost it, or want a new one? An admin can make a new code in **Settings > Recovery code**. The old one stops working.

### Sign in with a code by email or text

Instead of typing a password, you can tap **Email or text me a code** on the sign-in page. The panel sends a 6-digit code that works once, for 10 minutes.

To set it up (once, as admin):
1. **Settings > Sending codes**: tap **Fill in for Gmail** (or Outlook.com), type your email address and an **app password**. For Gmail, turn on 2-Step Verification first, then make the app password at <https://myaccount.google.com/apppasswords>. Use the app password, not your normal Gmail password.
2. **Settings > My account > Sign-in codes**: type your email and/or mobile number and pick your carrier under **Send texts through**. The code is emailed to your carrier's text address and arrives as a text, so nothing extra to pay.
   - Some carriers have stopped email-to-text (AT&T did in 2025). For those, sign up at <https://www.twilio.com>, buy a number (about $1 a month plus about a cent per text) and fill in the Twilio boxes in **Sending codes**, then pick **Twilio** under **Send texts through**.
3. Tap **Send me a test**. You should get an email and/or a text within a minute.

Each user can set their own email and number in **My account**; an admin can set them for anyone. Codes are limited to one a minute and five an hour per user, and five wrong tries lock the code.

### Forgot the password?

**Easiest: use the recovery code.** On the sign-in page tap **Forgot password?**, enter your user name, the recovery code and a new password. You are signed in straight away, and the panel shows you a **new** recovery code (each code works once), so write that one down.
- This only works from your home WiFi or through Tailscale, never from the open internet.
- Five wrong tries and the panel makes you wait before trying again.

**A helper forgot theirs?** An admin sets a new one in **Settings > Users > Set password**.

**No recovery code and no admin can sign in?** On the Pi, in the panel folder:

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
- **API key:** other programs (Node-RED and similar) that change vAPI variables through `/api` need the API key from **Settings**. Reading them without a key only works from your own network (home or Tailscale).
