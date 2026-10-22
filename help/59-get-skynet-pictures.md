# Get Skynet pictures

Skynet adds new pictures (pumps, valves, vessels ...) to GitHub from time to time. **☰ Menu > Get Skynet pictures** copies the new and changed ones onto your Brain, into `media/Images/Skynet` (see [Picture groups](57-picture-groups)).

- It works the same on a Raspberry Pi, Windows, Mac or Linux. Nothing to install: the Brain does the downloading.
- **No GitHub account is needed.** The Brain only has to be on the internet.
- Only Skynet pictures are copied. **Your own pictures are never touched, and nothing is ever deleted.**
- Admins only.

## How to use it

1. Open **☰ Menu > Get Skynet pictures**. It asks GitHub straight away.
2. You see how many Skynet pictures GitHub has, and a list of the ones this Brain needs: **New** (not here yet) or **Newer on GitHub** (Skynet redrew it). Each shows a small picture and its size.
3. Press **Get N pictures**. When it is done, the new pictures are in every picture list and in the Alt+P picker.

Press **Check GitHub** to ask again. If everything is already here, it says **Nothing to get**.

## Good to know

- Each picture is checked against GitHub's own fingerprint before it is saved, so a broken download never replaces a good picture. If one fails, it is listed with the reason; press **Check GitHub** and get it again.
- A picture that Skynet changed replaces the old Skynet copy. Pictures in `Images/Skynet` can't be changed in the panel anyway, so nothing of yours is lost. To keep an old one, copy it into one of your own groups first.
- If GitHub says **too many requests**, wait an hour: GitHub lets each internet address ask about 60 times an hour without an account.
- A whole new panel version (program files, not just pictures) still comes through **Updating** (see [Updating](18-updating)).
