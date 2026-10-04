# Login, users and passwords

Nobody can see or switch anything without signing in. Phones and computers stay signed in for 30 days of not being used.

## First time

The first time the panel opens, it asks you to create the **admin account** (a user name and a password of at least 8 characters). This only works from your home network, so a stranger can never create it.

## Roles

**Viewer** watches, **Operator** runs a brew day, **Admin** does everything. Admins add and change users in **Settings > Users**; see [Settings](09-settings).

## Forgot your password?

On the Pi, in the panel folder:

```
node tools/reset-password.js            (lists the users)
node tools/reset-password.js Fritz      (asks for a new password for Fritz)
sudo systemctl restart brewpanel
```

## Using the panel away from home

Use **Tailscale**, a free private network between your own devices. Install it on the Pi and on your phone, signed in to the same account, and open `http://brewpi:8080` from anywhere. The full steps are in `docs/REMOTE_ACCESS.md` in the panel folder.

> **Never** add a port forward for the panel on your router, and never put it on a public web address. The panel switches heaters, burners and pumps.
