# Security scanning on GitHub

What GitHub checks in the Skynet code, and the few switches only the owner (oakbarn) can turn on.
Written 2026-11-12.

## What is already On

Checked 2026-11-12 in the repo settings:

- **Secret scanning: On.** GitHub warns if a password or key is ever saved in the code.
- **Push protection: On.** GitHub blocks a save that holds a password or key.

## What the pull request adds

- **Code scanning (CodeQL)**, file `.github/workflows/codeql.yml`. GitHub reads the code looking for
  security holes. It runs on every pull request, after every merge, and every Monday. It checks the
  JavaScript (Panel and Importer), the Python (Pi firmware) and the GitHub workflows. It never changes
  code. Findings show under the **Security** tab > **Code scanning**.
  The Arduino and ESP32 sketches are not scanned (they need a full build first).
- **Dependabot**, file `.github/dependabot.yml`. Watches the free add-on programs Skynet uses and
  opens a pull request only when one has a known security hole, all fixes in one pull request. It does
  not open "newer version" pull requests, so the merge queue stays short.

- **Virus check** (Rule 9.11), added to `.github/workflows/panel-version.yml`. After each Release is
  made, a Windows computer at GitHub scans every .exe on it with Microsoft Defender. It first proves the
  scanner works by scanning the harmless EICAR test file (the standard file every antivirus is built to
  catch). Clean: a "Virus check ... nothing found" line goes at the top of the Release notes. Anything found:
  the Release goes back to a Draft (hidden from the public), the check turns red and GitHub emails you.
  Nothing is deleted. Not added: VirusTotal (70 scanners at once). It needs a free API key, and every file
  sent there is kept by VirusTotal and can be downloaded by its paying members.

## Switches to turn on (click by click)

### 1. Dependabot alerts and security updates

1. Open https://github.com/oakbarn/Skynet_Brewery/settings/security_analysis
   (or: the repo page > **Settings** > left side **Advanced Security** or **Code security**).
2. **Dependabot alerts**: click **Enable**.
3. **Dependabot security updates**: click **Enable**.
4. **Grouped security updates** (if shown): click **Enable**.
5. **Private vulnerability reporting**: click **Enable**. People who find a security hole can then
   tell you privately instead of posting it for everyone to see.
6. **Code scanning**: leave it alone. Do **not** pick "Default setup"; the file in the pull request
   does this job, and GitHub allows only one of the two.

### 2. Make outside pull requests wait for you

So a stranger's pull request cannot run its own code on GitHub before you look at it:

1. Open https://github.com/oakbarn/Skynet_Brewery/settings/actions
2. Under **Approval for running fork pull request workflows from contributors**, pick
   **Require approval for all external contributors**.
3. Click **Save**.

### 3. Protect the main branch

1. Open https://github.com/oakbarn/Skynet_Brewery/settings/branches
2. Click **Add classic branch protection rule**.
3. **Branch name pattern**: `claude/project-thread-vzxi0a`
4. Leave **Require a pull request before merging** OFF for now (see below).
5. Leave **Allow force pushes** and **Allow deletions** OFF (they are off by default). This stops
   anyone, even by accident, from wiping out or rewriting the Skynet history.
6. Click **Create**.

**Why not "Require a review" yet:** two things would break.
- The Panel version workflow saves `version.json` straight to the main branch after every merge. A
  "pull request required" rule would block it, so no new version, Release or Setup .exe would be made.
- GitHub never lets you approve your own pull request, and the pull requests in this project are
  opened under your name. A "1 approval required" rule would lock you out of merging.

You are still protected without it: only you can merge, so any change someone else sends comes in as a
pull request that waits for you. If more people ever get write access, we can add a review rule that
leaves the version workflow out.

## Where to look later

- **Security** tab on the repo: Code scanning findings, Dependabot alerts, Secret scanning alerts.
- GitHub emails you about new alerts (your GitHub **Settings** > **Notifications** > **Security alerts**).
