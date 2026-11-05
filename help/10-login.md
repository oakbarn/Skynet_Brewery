# Login, users and passwords

Nobody can see or switch anything without signing in. Phones and computers stay signed in for 30 days of not being used.

## First time

The first time the panel opens, it asks you to create the **admin account** (a user name and a password; by default at least 8 characters, see [Password rules](39-password-rules)). This only works from your home network, so a stranger can never create it.

Want the panel to pick a password for you? Tap the **key** in the Password box. It makes a strong password that follows the [Password rules](39-password-rules), puts it in both boxes and shows it. **Write it down** before you tap **Create admin account** (the browser may also offer to save it when you sign in). Tap the eye to hide it. The same key is in **Forgot password?**, **Settings > My account** and **Settings > Users** (Add user).

(Edge used to show its own key here. It needs Edge signed in and syncing, and Skynet's own window never syncs, so Skynet now has its own key.)

## Roles

**Viewer** watches, **Operator** runs a brew day, **Admin** does everything. Admins add and change users in **Settings > Users**; see [Settings](09-settings).

## Your recovery code

Right after the admin account is made, the panel shows a **recovery code** like `K7QM-3XPD-9RTA-WF2H`. It is shown only once, so **Copy**, **Download** or **Print** it, and tick **I saved my recovery code** to go on. Keep it away from the Pi (your wallet or a password manager).

An admin can make a new code in **Settings > Recovery code**. The old one stops working.

## Sign in with a code by email or text

Instead of a password, tap **Email or text me a code** on the sign-in page. The panel sends a 6-digit code that works once, for 10 minutes.

To set it up once, as admin:

1. **Settings > Sending codes**: tap **Fill in for Gmail** (or Outlook.com) and type your email address and an **app password** (for Gmail, turn on 2-Step Verification, then make one at https://myaccount.google.com/apppasswords).
2. **Settings > My account > Sign-in codes**: type your email and/or mobile number and pick your phone carrier under **Send texts through**. If your carrier no longer takes email-to-text, use **Twilio** instead (a paid text service; fill in its boxes in **Sending codes**).
3. Tap **Send me a test**.

Each user can set their own email and number. Codes are limited to one a minute and five an hour, and five wrong tries lock the code.

## Forgot your password?

**Easiest:** on the sign-in page tap **Forgot password?** and enter your user name, the recovery code and a new password. This works only from your home network or through Tailscale. You are signed in, and the panel shows a **new** recovery code (each one works once), so save that one too.

A helper forgot theirs? An admin sets a new one in **Settings > Users**.

## Updates keep your logins

Installing a new version keeps every user, password, sign-in and the recovery code. They are removed only when you answer **Yes** to the installer's **Start Fresh** question and confirm its warning. Then the panel asks you to create the admin account again. (The old Testing mode switch, which cleared logins on every new version, was retired on 2026-11-03.)

## No recovery code and no admin can sign in?

On the Pi, in the panel folder:

```
node tools/reset-password.js            (lists the users)
node tools/reset-password.js Fritz      (asks for a new password for Fritz)
sudo systemctl restart brewpanel
```

## Using the panel away from home

Use **Tailscale**, a free private network between your own devices. Install it on the Pi and on your phone, signed in to the same account, and open `http://brewpi:8080` from anywhere. For a Windows computer, follow [Installing Tailscale on Windows](00-tailscale-windows). The steps for the Pi and phones are in `docs/REMOTE_ACCESS.md` in the panel folder.

> **Never** add a port forward for the panel on your router, and never put it on a public web address. The panel switches heaters, burners and pumps.
