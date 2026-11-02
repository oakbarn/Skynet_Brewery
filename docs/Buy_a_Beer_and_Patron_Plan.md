# Buy a Beer and Patron plan

Plan only, 2026-11-02. Nothing is built until Fritz says go. Thread "Expand Buy a Beer and Patron support".

## Rules this touches

**Rule 12.2:** "The Beer money donation recipient is locked to Fritz's PayPal in one file and can never be
made editable again." Asks 4 and 5 (several PayPal accounts, set by Prime Developers) break this Rule.
Fritz picks: **change Rule 12.2** to "PayPal accounts, percents and amounts live in one Skynet Team file.
Only the Prime Developers, as a group, can change it, on GitHub. It is never editable from the panel." or
**allow this one exception**. The suggested change keeps the spirit of 12.2: nobody can change it from inside the panel.

**Rule 12.1:** "Nothing is posted or announced anywhere without Fritz's word." Patron emails to the
Developer Team are sent only once Fritz says the email setup is ready.

## 1. Can we lock Buy a Beer so nobody can remove it?

Honest answer: **no**. The repo is public, so anyone can copy it and delete any part of it. That includes
encrypted or hidden code, because the code that unlocks it has to ship too. Every open-source project
has this problem. What we can do:

- **A license term.** Add a line to the license: "copies must keep the Buy a Beer button and the Skynet
  Team file, or must not use the Skynet name or pictures." Most people respect this. It also gives Fritz
  a legal leg to stand on.
- **Official builds are signed.** The Skynet Team file is signed with a Prime Developer key. The panel
  shows "Official Skynet Brewer" only when the signature is good. A copy that strips Buy a Beer still runs,
  but loses the Official badge and cannot get official updates.
- **Updates only from the official repo.** The Update button checks the official GitHub Releases, so a
  user of a stripped copy stays on that copy.

## 2. Buy a Beer choices

The pop-up offers: **One Time, Monthly, Every 2 Months, Every Quarter, Every 6 Months, Every Year.**

- One Time uses the PayPal Donate link we have now.
- The repeating choices are **PayPal Subscriptions**. PayPal allows a repeat of any number of days, weeks,
  months or years, so all five fit.
- Needs: a **free PayPal Business account** (a personal account can be upgraded). Each choice and amount
  is a "Plan" made once in the PayPal dashboard. Its Plan ID goes into the Skynet Team file.
- The person who pays can cancel a subscription any time in their own PayPal account.

## 3. Patron level

- One fixed amount, charged **every 6 months** (a PayPal Subscription, as in 2).
- **How the panel knows you are a Patron:** there is no Skynet server, so a Prime Developer sends the
  Patron a signed **Patron code** (name, email, end date). The user pastes it into Settings. The panel
  checks the signature and shows Patron extras until the end date.
- **Patron extra: Request a Feature.** A Patron-only button on the ☰ Menu opens a form (title,
  description, optional picture).
- **Email to the Developer Team.** The request goes to every address on the Developers list. The panel
  already has an email sender (Settings > Messaging, the one used for sign-in codes). It uses the user's
  own email account. If the user has not set it up, the panel opens their mail program with the
  addresses and text filled in.
- More Patron extras can be added later.

## 4. More than one PayPal account, by percent

PayPal does not split one payment between several accounts for ordinary sellers. Its split tools are only
for big approved marketplace partners. Two ways that work:

- **A (recommended): one Skynet account, paid out by percent.** Every Beer and Patron payment goes to one
  Skynet PayPal Business account. Once a month a Prime Developer presses **Pay Out** in the panel. It
  uses PayPal Payouts to send each account its percent and shows a report first. Exact percents. Payouts
  needs PayPal to approve the Business account for it. Until then the same report tells a Prime Developer
  what to send by hand.
- **B: take turns by percent.** Each One Time beer goes straight to one account, picked so that over many
  beers each account gets its percent. No middle account. Subscriptions stay with whichever account was
  picked, so B is only rough.

## 5 and 6. Who can change what: the Skynet Team file

One file in the repo, **skynet/Skynet_Team.json**, holds:

- **Prime Developers** (GitHub user names). Fritz only for now.
- **Skynet Developers** (GitHub user names + email for Patron requests).
- **PayPal accounts and percents** (the percents must add up to 100).
- **Amounts and Plan IDs** (Beer choices and the Patron amount).

Nobody can change it from inside the panel. Every change goes through GitHub:

| Change | Who |
|---|---|
| Beer and Patron **amounts** | Any Skynet Developer can propose, and a Prime Developer approves it. |
| **PayPal accounts and percents** | Prime Developers **as a group**: GitHub needs approvals from every Prime Developer, or a majority, Fritz's pick. |
| **Add or remove a Skynet Developer** | Prime Developers only. |
| **Add or remove a Prime Developer** | Prime Developers as a group. Fritz only for now. |

**Recommended approach: GitHub owners file + required approvals, plus a signature.**

- The owners file (CODEOWNERS) names the Prime Developers as owners of Skynet_Team.json, so a change
  cannot merge without their review.
- A GitHub rule sets how many must approve.
- When a change merges, the release step signs the file. The panel trusts a signed file only (see 1).

One catch today: GitHub never lets you approve your own change. Fritz is the only Prime Developer, so the
"approvals" rule would block him. It is set up now but switched on the day a second Prime Developer joins.
Until then Fritz's own merge is the approval.

## 7. Updates carry it

Skynet_Team.json ships inside every Release zip, Setup .exe and GitHub download. It is not a user setting,
so an update always replaces it (like the Skynet Styles). The panel reads it at start-up.

## What Fritz needs to do (outside the program)

1. Make, or upgrade to, a free PayPal Business account for Skynet.
2. Make the Plans in the PayPal dashboard (5 Beer repeats + Patron), or tell us the amounts and we write
   step-by-step help.
3. Later: ask PayPal to turn on Payouts (only for option 4A).

## Build order (each a PR, each with a Help page)

1. Skynet_Team.json + CODEOWNERS + signing, Rule 12.2 update, license term.
2. Buy a Beer choices (One Time + 5 repeats).
3. Patron: Patron code, Request a Feature, email to Developers.
4. Pay Out by percent (4A) or take turns (4B).

## Questions for Fritz

1. Rule 12.2: change it (wording above) or allow an exception?
2. Item 4: A (one Skynet account + monthly Pay Out) or B (take turns)?
3. Group approval for PayPal changes: every Prime Developer, or a majority?
4. Amounts: Beer suggestion of $5 One Time and $5 for each repeat? Patron amount every 6 months?
5. OK to add the license term?
