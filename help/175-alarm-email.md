# Alarm Email: an Alarm can send you an email

An Alarm can send an email each time it goes off (Skynet Rule 7.17). The email goes out through **your own email account and
the mail server you pick**: Gmail, Outlook.com or any other. Skynet never uses a built-in mail server or the Microsoft one that
Windows picks on its own.

## 1. Pick your mail server (once)

1. Open **Settings** and go to **Sending codes and Alarm emails**.
2. Click **Fill in for Gmail** (or **Fill in for Outlook.com**), or type your own **Mail server**, **Port** and **Security**.
3. Type your **Email account**, your **Password or app password**, and **Send from**.
   - **Gmail:** turn on 2-Step Verification, then make an **app password** at myaccount.google.com/apppasswords and paste it
     in. Your normal Gmail password does not work here.
4. Click **Save sending settings**, then **Send me a test** to check it.

The same settings send sign-in codes, so if those already work, Alarm emails work too.

## 2. Turn it on for an Alarm

1. In Edit layout, double-click the Alarm Widget to open its **Alarm Widget Properties**.
2. Below the Sound boxes, turn **Email Notification** On.
3. **Email to:** type one or more addresses with commas between them. Leave it empty to send to every user who has an email in
   **My account**.
4. Click **Save**.

Each time the Alarm goes off, one email is sent with the Alarm's Label and the time. If an Alarm goes off again and again,
Skynet sends at most one email a minute for it, so your inbox is not flooded.

## In a Process

| Line | What it does |
|---|---|
| `alm_Brew.email = true` | Turns Email Notification On for this Alarm |
| `alm_Brew.email = false` | Turns it Off (until the next start or a Process turns it On) |

## When it does not arrive

The **Process log** says what went wrong in plain words: no mail server set up yet, no address to send to, or the mail server
said no (often a wrong app password). Check the junk mail folder too.
