// The Process Editor's five command buttons (Panel Update 11, item 1c, OakBarn Brewery 2026-11-23: "Have the Line like I ask.
// {common are all other normal command}"): Insert Line After [n], then Conditionals, Skynet Special, Devices, Widgets and Common.
// A pick goes in as a NEW line after line n, with the same indent as line n; then n moves down one so the next pick goes under it.
// Devices and Widgets reuse the Insert bar's groups (Process sandbox entry 13). This file holds the command lists and the line math,
// so they can be tested without a browser.
import { COMMANDS } from './autofill.js';
import { SKN_GLOBALS } from './boilpoint.js';
import { BREW_TIMERS } from './brewtimers.js';
import { G_DECLARE } from './gkinds.js';

// Conditionals: the tests and jumps of a Process
export const CONDITIONALS = ['if', 'elseif', 'else', 'endif', 'wait', 'goto', 'goLine', 'step'];
// Skynet Special: the commands only Skynet has (Rules 6.15, 16.11, 16.12, 5.42 ...)
export const SKYNET_SPECIAL = ['ask', 'close_all_valves', 'open_all_valves', 'all_pumps_off', 'all_heaters_off', 'wait_boil', 'take_reading',
  'ask_recipe', 'import_recipe', 'start_hop_alerts', 'stop_hop_alerts', 'hop_alert', 'place_Chiller', 'remove_Chiller', 'lock_Equipment', 'unlock_Equipment'];
// Common: every other normal command, worked out from the Process commands, so a command added later lands here by itself.
// "else if" is the same as elseif (Conditionals), so it is left out.
const SAME_AS = new Set(['else if']);
export const COMMON = COMMANDS.map(c => c[0]).filter(c => !CONDITIONALS.includes(c) && !SKYNET_SPECIAL.includes(c) && !SAME_AS.has(c));
// the skn_ names (Rule 3.20): Skynet's own values a Process reads; a pick puts the name at the cursor, it is not a line by itself
export const SKN_NAMES = [...SKN_GLOBALS.map(([n, what]) => [n, what]), ...BREW_TIMERS.map(([n, , what]) => [n, 'a Brew Timer: ' + what])];

// commands that are a whole line by themselves (nothing typed after them)
const BARE = new Set(['else', 'endif', 'close_all_valves', 'open_all_valves', 'all_pumps_off', 'all_heaters_off', 'wait_boil', 'stop_hop_alerts', 'ask_recipe',
  'lock_Equipment', 'unlock_Equipment']);
const NEW_G = Object.fromEntries(Object.values(G_DECLARE).map(d => [`new ${d.long}`, `new ${d.long} ${d.prefix}`]));
// the text a command puts in: the word, then a space when something is typed after it (a gGlobal also gets the start of its name)
export function commandText(cmd) {
  if (NEW_G[cmd]) return NEW_G[cmd];
  return BARE.has(cmd) ? cmd : cmd + ' ';
}
export const commandNote = cmd => COMMANDS.find(c => c[0] === cmd)?.[1] ?? '';
export const CATEGORY_LISTS = { cond: CONDITIONALS, skn: SKYNET_SPECIAL, com: COMMON };

// where a new line goes after line `after` (1 = the first line; 0 = at the very top; past the end = at the end).
// Returns { at, text, caret, line }: put `text` in at `at` (nothing is replaced); the caret goes to `caret`; the new line is `line`.
export function lineAfter(code, after, words) {
  const lines = code.split('\n');
  let n = Math.trunc(Number(after));
  if (!Number.isFinite(n) || n < 0) n = 0;
  if (n > lines.length) n = lines.length;
  if (n === 0) return { at: 0, text: words + '\n', caret: words.length, line: 1 };
  let at = 0;
  for (let i = 0; i < n; i++) at += lines[i].length + (i < n - 1 ? 1 : 0);
  const indent = /^\s*/.exec(lines[n - 1])[0];
  const text = '\n' + indent + words;
  return { at, text, caret: at + text.length, line: n + 1 };
}
// the line number the caret is on (1 = the first line)
export const lineOf = (code, pos) => code.slice(0, pos).split('\n').length;
