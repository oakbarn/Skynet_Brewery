# Password rules

An admin decides what a new password may look like, in **Settings > Password rules**.

## Today's rules (the defaults)

- **Allowed characters**: any character (letters, numbers, symbols and spaces).
- **Min length**: 8 characters.
- **Max length**: 200 characters.

User names are separate and do not change: letters, numbers, spaces and `. _ @ -`, up to 40.

## Changing the rules

1. Open **Settings** and scroll to **Password rules** (admins only).
2. Pick **Allowed characters**:
   - **Any character (letters, numbers, symbols and spaces)**
   - **Letters, numbers and keyboard symbols (no spaces)**
   - **Letters and numbers only**
   - **Numbers only (like a PIN)**
   - **Only the characters I list**: a box opens; type every character a password may use.
3. Set **Min length** (4 or more) and **Max length** (up to 200, and not below the min). Make them the same for an exact length, for example 4 and 4 for a 4-digit PIN.
4. Tap **Save password rules**.

## Where the rules apply

They are checked every time a password is **made or changed**: the first admin setup, **Change password**, **Add user**, **Set password**, and **Forgot password?** on the sign-in page. The rules are shown in plain words next to each of those password boxes, and a password that breaks them is refused with a message that says which characters are not allowed.

Passwords made before you change the rules keep working. A user only meets the new rules the next time their password is changed.

## Testing mode

While **Testing mode** is on, each new version wipes all logins (see [Login, users and passwords](10-login)), but the password rules are kept, because they are a setting, not a login.

The emergency tool `node tools/reset-password.js` on the Brain always uses the default rules, so you can get back in even if the rules were set too strict.
