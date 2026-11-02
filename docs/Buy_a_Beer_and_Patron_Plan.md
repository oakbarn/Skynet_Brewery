# Buy a Beer and Patron plan

Plan only, 2026-11-02. Nothing is built until Fritz says go. Thread "Expand Buy a Beer and Patron support".

## Rules this touches

**Rule 12.2 (new, Fritz 2026-11-02):** "Beer money donations can go to at most 2 PayPal accounts. It is
locked now with only Fritz's PayPal account. It is unlocked only when Fritz gives the second PayPal account
(that may never happen); once that account is added it is locked again." So the PayPal accounts are
**not** in the Skynet Team file and nobody can add, change or delete them, from the panel or by the Prime
Developers. They stay in lib/donation.js, owned by @oakbarn.

**Rule 12.3 (new, Fritz 2026-11-02):** "Patron payments are not Beer money. They are split by percent
between several PayPal accounts (Option A, section 4). Rule 12.2 covers Buy a Beer only."

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

**Fritz picked Option A, for Patron payments only (2026-11-02).** Buy a Beer follows Rule 12.2: today it
goes straight to Fritz's PayPal, and a second Beer account only comes if Fritz gives one.

PayPal does not split one payment between several accounts for ordinary sellers. Its split tools are only
for big approved marketplace partners. Two ways that work:

- **A (picked, Patrons only): one Skynet account, paid out by percent.** Every Patron payment goes to one
  Skynet PayPal Business account. Once a month a Prime Developer presses **Pay Out** in the panel. It
  uses PayPal Payouts to send each account its percent and shows a report first. Exact percents. Payouts
  needs PayPal to approve the Business account for it. Until then the same report tells a Prime Developer
  what to send by hand.
- **B (not used): take turns by percent.** Each One Time beer goes straight to one account, picked so that over many
  beers each account gets its percent. No middle account. Subscriptions stay with whichever account was
  picked, so B is only rough.

## 5 and 6. Who can change what: the Skynet Team file

One file in the repo, **skynet/Skynet_Team.json**, holds:

- **Prime Developers** (GitHub user names). Fritz only for now.
- **Skynet Developers** (GitHub user names + email for Patron requests).
- **Patron PayPal accounts and percents** (the percents must add up to 100; Rule 12.3). The Beer accounts are not here (Rule 12.2).
- **Amounts and Plan IDs** (Beer choices and the Patron amount).

Nobody can change it from inside the panel. Every change goes through GitHub:

| Change | Who |
|---|---|
| Beer and Patron **amounts** | Any Skynet Developer can propose, and a Prime Developer approves it. |
| **Buy a Beer PayPal accounts** | Nobody. Locked by Rule 12.2; only Fritz adds the one possible second account. |
| **Patron PayPal accounts and percents** | Prime Developers **as a group**: every Prime Developer must approve (100%, Fritz 2026-11-02). |
| **Add or remove a Skynet Developer** | Prime Developers only. |
| **Add or remove a Prime Developer** | Prime Developers as a group, every one must approve (100%). Fritz only for now. |

**Recommended approach: GitHub owners file + required approvals, plus a signature.**

- The owners file (CODEOWNERS) names the Prime Developers as owners of Skynet_Team.json, so a change
  cannot merge without their review.
- A GitHub rule requires **every** Prime Developer to approve (100%, Fritz 2026-11-02).
- When a change merges, the release step signs the file. The panel trusts a signed file only (see 1).

One catch today: GitHub never lets you approve your own change. Fritz is the only Prime Developer, so the
"approvals" rule would block him. It is set up now but switched on the day a second Prime Developer joins.
Until then Fritz's own merge is the approval.

## 7. Updates carry it

Skynet_Team.json ships inside every Release zip, Setup .exe and GitHub download. It is not a user setting,
so an update always replaces it (like the Skynet Styles). The panel reads it at start-up.

## 8. A step in the new-install setup (Fritz, 2026-11-02)

A new install already walks through: **1) make the admin and save the recovery code, 2) pick a sample
Schema.** We add **3) Support Skynet**, a step shown once that the admin goes through:

- A short "Skynet is free; here is how to help" note.
- The Buy a Beer choices (One Time and the 5 repeats) with their amounts.
- The Patron level: what it costs, the extras, and a box to paste a Patron code if you already have one.
- Buttons: **Buy a Beer**, **Become a Patron**, **Not now**. "Not now" finishes setup; the regular Buy a
  Beer pop-up then follows its usual timing.
- Like the recovery code step, it cannot be skipped by clicking outside it, but "Not now" is always there,
  so nobody is forced to pay.

This step goes into build step 2 (and the Patron part into step 3).

## What Fritz needs to do (outside the program)

1. Make, or upgrade to, a free PayPal Business account for Skynet.
2. Make the Plans in the PayPal dashboard (5 Beer repeats + Patron), or tell us the amounts and we write
   step-by-step help.
3. Ask PayPal to turn on Payouts on the account that collects Patron payments (Option A). Until PayPal says yes, the Pay Out report tells a Prime Developer what to send by hand.

## Build order (each a PR, each with a Help page)

1. Skynet_Team.json (Developers, Prime Developers, amounts) + CODEOWNERS + signing, license term.
2. Buy a Beer choices (One Time + 5 repeats) + the Support Skynet setup step.
3. Patron: Patron code, Request a Feature, email to Developers, Patron part of the setup step.
4. Patron Pay Out by percent (Option A).

## Questions for Fritz

1. ~~Rule 12.2~~ Answered 2026-11-02: new Rule 12.2 (at most 2 accounts, locked with Fritz's only).
2. ~~Item 4: A or B?~~ Answered 2026-11-02: Option A, Patron payments only.
6. Which PayPal account collects the Patron payments before the Pay Out? Suggested: Fritz's, upgraded to Business.
3. ~~Group approval: every Prime Developer, or a majority?~~ Answered 2026-11-02: every Prime Developer (100%).
4. Amounts: Beer suggestion of $5 One Time and $5 for each repeat? Patron amount every 6 months?
5. OK to add the license term?
