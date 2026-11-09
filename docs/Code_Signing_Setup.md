# Signing the Skynet Setup .exe (Azure Artifact Signing)

Windows **Smart App Control** blocks programs that are not signed. Signing puts a digital "seal" on
`Skynet_Brewer_Setup_<version>.exe` (and on the **Uninstall Skynet Brewer.exe** inside it) that says who made it and
that nobody changed it since. We use **Microsoft Artifact Signing** (it used to be called *Trusted Signing*), which
costs about **$10 a month** (the Basic plan; check the price Azure shows you).

Once the six settings at the end of this page are in GitHub, every merge builds a **signed** Setup .exe by itself.
Until then the Setup .exe is built **unsigned**, exactly as today, so nothing breaks while you set this up.

You do these steps once. Do them in order. Each step says what to copy for later: keep a small note open
(Notepad is fine) and paste each value into it as you go. **None of these values is a password**, but keep the
note private anyway.

> **Good to know before you start**
> - Signing as a **person** (Individual) is allowed only for people who live in the **US or Canada**.
> - The name on the signature is the **legal name on your ID** (Windows will show it as the "Publisher").
>   To show "OakBarn Brewery" instead, the brewery would have to be a registered business and be checked as an
>   Organization. You can switch later; the GitHub settings stay the same.
> - Microsoft checks your identity by hand. It takes **1 to 20 business days**.

---

## Part A: Azure (the Microsoft side)

### Step 1. Make the Azure account
1. Go to <https://azure.microsoft.com/free> and sign up (or sign in) with your Microsoft account.
2. When it asks for the account type, pick **Individual** (not Company).
3. Type your **legal name and home address exactly as they are on your driver's license or passport**. The identity
   check later compares them, letter for letter.
4. Finish the sign-up with a credit card. When it's done you land on the **Azure portal** (<https://portal.azure.com>).

### Step 2. Turn on code signing for your subscription
1. In the search box at the top of the portal, type **Subscriptions** and open it.
2. Click your subscription (it's usually called *Azure subscription 1* or *Pay-As-You-Go*).
3. **Copy the Subscription ID** into your note. (Label it: *Subscription ID*.)
4. In the left list, open **Settings > Resource providers**.
5. Search for **Microsoft.CodeSigning**, tick it, and click **Register**. Wait until it says *Registered* (a minute or two;
   click **Refresh**).

### Step 3. Make the signing account
1. In the top search box, type **Artifact Signing Accounts** and open it. Click **+ Create**.
2. Fill in:
   - **Subscription**: yours.
   - **Resource group**: click **Create new** and type `skynet-signing`.
   - **Account name**: letters and numbers only, starting with a letter, for example `OakBarnSigning`
     (it must be unique in the world; if it's taken, add a number).
   - **Region**: **East US** (any US region works; East US matches the example below).
   - **Pricing tier**: **Basic**.
3. Click **Review + create**, then **Create**. When it's done, click **Go to resource**.
4. **Copy the Account name** into your note (label it: *Signing account*).
5. On the account's **Overview** page, **copy the Account URI** (it looks like `https://eus.codesigning.azure.net/`)
   into your note (label it: *Signing endpoint*).

### Step 4. Give yourself permission to do the identity check
1. Still in your signing account, open **Access control (IAM)** in the left list.
2. Click **+ Add > Add role assignment**.
3. Search for and pick **Artifact Signing Identity Verifier**. Click **Next**.
4. Click **+ Select members**, pick **yourself**, click **Select**, then **Review + assign** (twice).

### Step 5. The identity check (Microsoft checks it's really you)
1. In your signing account, open **Objects > Identity validations**.
2. Click **+ New identity**, pick **Public**, then **Individual**.
3. Check that your name and address match your ID, fill in anything it asks, and click **Create**.
4. Microsoft emails you a link to prove who you are (usually a photo of your ID and a selfie on your phone).
   Follow it.
5. **Wait** until the status says **Completed** (1 to 20 business days). You can do Steps 7 to 10 while you wait.

### Step 6. Make the certificate profile (after Step 5 says Completed)
1. In your signing account, open **Objects > Certificate profiles** and click **+ Create**.
2. Pick **Public Trust**.
3. **Certificate profile name**: for example `SkynetSetup` (letters and numbers, at least 5 characters).
4. **Identity validation**: pick the one from Step 5.
5. Click **Create**.
6. **Copy the profile name** into your note (label it: *Certificate profile*).

### Step 7. Make a "robot login" for GitHub (an App registration)
GitHub needs its own login to ask Azure to sign. It never gets a password: Azure just trusts builds that come
from your Skynet repository.
1. In the top search box, type **App registrations** and open it. Click **+ New registration**.
2. **Name**: `Skynet GitHub Signing`. Leave everything else as it is and click **Register**.
3. On its **Overview** page, copy two values into your note:
   - **Application (client) ID** (label it: *Client ID*)
   - **Directory (tenant) ID** (label it: *Tenant ID*)

### Step 8. Tell Azure to trust Skynet's builds on GitHub
1. In the same App registration, open **Manage > Certificates & secrets**.
2. Click the **Federated credentials** tab, then **+ Add credential**.
3. **Federated credential scenario**: **GitHub Actions deploying Azure resources**.
4. Fill in, **exactly** like this (capitals matter):
   - **Organization**: `oakbarn`
   - **Repository**: `Skynet_Brewery`
   - **Entity type**: **Branch**
   - **GitHub branch name**: `claude/project-thread-vzxi0a`
   - **Name**: `skynet-release`
5. Click **Add**.

### Step 9. Let the robot login sign
1. Go back to your signing account (top search box: **Artifact Signing Accounts**, then click it).
2. Open **Objects > Certificate profiles** and click your profile (from Step 6). (If Step 6 isn't done yet, you can do
   this on the **signing account** itself instead; it works the same.)
3. Open **Access control (IAM)** > **+ Add > Add role assignment**.
4. Pick **Artifact Signing Certificate Profile Signer**, click **Next**.
5. Click **+ Select members**, type `Skynet GitHub Signing`, pick it, click **Select**, then **Review + assign** (twice).

---

## Part B: GitHub (the six settings)

### Step 10. Put the values in GitHub
1. Open <https://github.com/oakbarn/Skynet_Brewery/settings/secrets/actions>
   (GitHub > the Skynet_Brewery repository > **Settings** > **Secrets and variables** > **Actions**).
2. On the **Secrets** tab, click **New repository secret** three times, once for each:

   | Name (type it exactly) | Value (from your note) |
   |---|---|
   | `AZURE_CLIENT_ID` | Client ID (Step 7) |
   | `AZURE_TENANT_ID` | Tenant ID (Step 7) |
   | `AZURE_SUBSCRIPTION_ID` | Subscription ID (Step 2) |

3. Click the **Variables** tab, then **New repository variable** three times:

   | Name (type it exactly) | Value (from your note) |
   |---|---|
   | `SIGNING_ENDPOINT` | Signing endpoint (Step 3), for example `https://eus.codesigning.azure.net` |
   | `SIGNING_ACCOUNT` | Signing account (Step 3), for example `OakBarnSigning` |
   | `SIGNING_PROFILE` | Certificate profile (Step 6), for example `SkynetSetup` |

That's all. The **next merge** builds a signed Setup .exe.

---

## Part C: Check that it worked

1. After the next merge, open the newest release on <https://github.com/oakbarn/Skynet_Brewery/releases>. Its notes say
   **"This installer is signed (Microsoft Artifact Signing)."** If they still say *not signed*, tell Claude; the build log
   says what went wrong (and the release was still made, just unsigned).
2. Download the Setup .exe, **right-click it > Properties**. A **Digital Signatures** tab shows your name. Click it,
   then **Details**: it should say *This digital signature is OK*.

### Why Windows may still warn for a little while
Smart App Control and SmartScreen also look at how many people have run a program. A brand-new signature has no
history yet, so for the first days or weeks Windows may still show *Windows protected your PC*. Click **More info**,
then **Run anyway**. Because every Setup is signed with the **same** certificate profile, the trust builds up and the
warning goes away. Smart App Control itself should stop *blocking* the signed Setup straight away.

---

## For Claude (how the build does it)
- `.github/workflows/panel-version.yml`: the step **Is signing set up?** checks all six settings. Only if all are there, it
  signs in to Azure with `azure/login@v2` (OIDC, so no stored password; the workflow has `id-token: write`), downloads
  Jsign 7.6 (checked against its SHA-256), and gets a short-lived pass with
  `az account get-access-token --resource https://codesigning.azure.net`. Any failure there leaves signing off and the
  release is still made.
- `tools/build-release.sh` passes `-DSIGN_SCRIPT=tools/sign-exe.sh` to NSIS only when everything is ready.
  `install/windows/SkynetBrewer.nsi` then signs the Uninstall .exe (`!uninstfinalize`, before it is packed inside) and the
  Setup .exe (`!finalize`). `tools/sign-exe.sh` never stops the build; it writes `release/signing.log`, which the release
  notes read.
- Jsign is used (not `azure/trusted-signing-action`) because that action only runs on Windows, and Skynet's Setup is built on
  Linux. Both use the same Azure service and settings.
- If the default branch is ever renamed, Step 8's branch name must be changed to match, or Azure refuses the sign-in.
