# Login, users and passwords

Nobody can see or switch anything without signing in. Phones and computers stay signed in for 30 days of not being used.

## First time

The first time the panel opens, it asks you to create the **admin account** (a user name and a password of at least 8 characters). This only works from your home network, so a stranger can never create it.

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

## Testing mode

While the panel is being built, **Testing mode** is on: each time a new version is installed, all users, sign-ins and the recovery code are removed and the panel asks you to create the admin account again. Brew data, logs and settings are kept. When you start using the panel for real, turn it off in **Settings > Testing mode**.

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
