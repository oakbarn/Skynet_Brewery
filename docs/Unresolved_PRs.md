# Unresolved PRs

Every pull request (PR) on GitHub that is still open (not merged and not closed), and what each one
is waiting on. This page is rewritten every time Fritz closes a chat (Skynet Rule 9.7).

**Snapshot taken:** 2026-10-27T17:00Z (UTC)
**Repo:** [oakbarn/Skynet_Brewery](https://github.com/oakbarn/Skynet_Brewery/pulls)
**Main (default) branch:** `claude/project-thread-vzxi0a`
**Open PRs right now:** 4 (#110, #111, #112, #113)

---

## The open PRs

| PR | What it is | What it does | Waiting on |
|---|---|---|---|
| [#110](https://github.com/oakbarn/Skynet_Brewery/pull/110) | RTD CS pins, pin D10 and SD cards on the Mega | Rules 6.9-6.11: an RTD on a Mega may only use D14-D17, D22-D39, D41-D43, D47-D49 or D53 for its CS pin; no Device on D10 on an Ethernet Mega; a warning on D4 and when an SD card is inserted. Tests pass. | Fritz's merge. One clean-up first (see note below). |
| [#111](https://github.com/oakbarn/Skynet_Brewery/pull/111) | Summary 1 of the project chat | Adds the Summary 1 document to docs/ and to the document list. | Fritz's merge. |
| [#112](https://github.com/oakbarn/Skynet_Brewery/pull/112) | Skynet Rules: Rule 0 and Rule 0a | Rule 0: a new chat opens the Rules first. Rule 0a: never read a Summary_N document without Fritz's OK. | Fritz's merge. |
| [#113](https://github.com/oakbarn/Skynet_Brewery/pull/113) | This page (Unresolved PRs) and Rule 9.7 | Adds this document, lists it in docs/README.md, and adds Rule 9.7: when Fritz closes a chat, this page is rewritten. | Fritz's merge. |

## Merge order and conflicts

- All four PRs start from the same main branch, and none of them is built on another PR.
- **They touch the same documents**: #110, #112 and #113 all add lines to `docs/Skynet_Rules.md`
  (the Change log at the bottom), and #111 and #113 both add a line to `docs/README.md`. Whichever
  merges first goes in clean; the others may then show a small conflict that Claude fixes in a
  minute. Just say "merge" and it is handled.
- Suggested order: **#112, #110, #111, #113** (smallest first, this page last so it can be
  refreshed with the final state).
- **Note on #110:** it also carries some files that look like left-overs from a test run of the
  panel: `config/brewery.json.bak` and two daily backup files under `config/schemas/backups/`, plus
  changes to `config/brewery.json` and `config/schemas/skynet-brew-panel.json`. These are your own
  working files and should not ship in a PR (Rule 9.3). Ask for them to be taken out before
  merging #110.

## Questions waiting on Fritz tied to these PRs

From #110 (RTD CS pins on the Mega):
1. Should **thermocouples** use the same CS pin list as RTDs?
2. Should the **Mega firmware** take its RTD CS pins from the panel instead of a hand-typed list?
3. The Ethernet Mega sketch already refuses D4 and D10 as outputs, so a Device on D4 won't work on
   an Ethernet Mega even though Rule 6.11 only warns. Is that OK, or should D4 be blocked there?
4. Should the left-over config/backup files be removed from #110 before it merges? (recommended:
   yes)

No open questions on #111, #112 or #113 beyond the merge itself.

## Recently finished (for reference)

Closed since the last big merge, so they no longer need anything: #104-#109 all **merged**
(2026-10-26 to 2026-10-27). The older PRs #42, #44 and #45 that were long listed as open are
**closed** (their work went in through combined PRs) and need nothing.

---

## How this page is kept

- Rule 9.7: when Fritz closes a chat ("close this chat", "goodbye" and the like), Claude checks
  GitHub for every open PR and rewrites this page: number and link, plain title, one line on what it
  does, what it waits on, merge-order notes, open questions, and the snapshot date and time
  (ISO 8601).
- The master copy is in the project folder `docs/Unresolved_PRs.md`; the copy in the repo `docs/`
  folder is updated by PR, and the reply carries a direct link.
- This page is **not** a Summary_N document, so any chat may read it.
