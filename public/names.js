// What a Device, Widget, file or folder may be called (Fritz, 2026-10-23). Used by the browser (app.js) and the server.
// Each check gives back '' when the name is fine, or a plain sentence that says what is wrong.
//
// Device, Widget and Interface names, not allowed: control characters, leading or trailing spaces, a leading dot, emoji,
//   < > : " / \ | ? *  (Fritz, 2026-10-29) and the Windows names CON, PRN, AUX, NUL, COM1-COM9, LPT1-LPT9.
//   Device, Widget and item names are plain too (PLAIN_NAME below, 2026-11-11).
// File and folder names: all of that, and a period only before the file ending (Mash.txt),
//   so a folder or a Process name has no period at all.
// Older names with < > : " / \ | ? * in them are changed once to a ~ for each (lib/namechars.js, Skynet Rule 15.2).

import { isSkynetConstantName } from './skconst.js';

export const FILE_CHARS = '< > : " / \\ | ? *';
export const BAD_NAME_CHARS = /[<>:"/\\|?*]/;
const CONTROL = /\p{Cc}/u;
const RESERVED = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
// Emoji: the colour pictures (😀 🍺 ✅), flags, skin tones and the joiners they are built with.
// © ® and ™ are left alone (they are old typewriter signs, not emoji).
const PICTO = /\p{Extended_Pictographic}/u;
const EMOJI_PART = /[\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}‍️⃣]/u;
export function hasEmoji(s) {
  for (const ch of String(s ?? '')) if (EMOJI_PART.test(ch) || (PICTO.test(ch) && ch.codePointAt(0) >= 0x2190)) return true;
  return false;
}

// the rules both kinds of name share
function common(n, what) {
  if (!n.trim()) return `Give the ${what} a name`;
  if (CONTROL.test(n)) return `The ${what} name has a hidden control character (from a copy and paste?). Type the name again.`;
  if (n !== n.trim()) return `The ${what} name "${n}" can't start or end with a space`;
  if (n.startsWith('.')) return `The ${what} name "${n}" can't start with a dot (.)`;
  if (hasEmoji(n)) return `The ${what} name "${n}" can't have emoji in it`;
  const bad = [...new Set(n.match(new RegExp(BAD_NAME_CHARS.source, 'g')) ?? [])];
  if (bad.length) return `The ${what} name "${n}" can't have ${bad.join(' ')} in it (not allowed: ${FILE_CHARS})`;
  return '';
}
const reservedMsg = (n, what) => `"${n}" is a name Windows keeps for itself (CON, PRN, AUX, NUL, COM1-COM9, LPT1-LPT9). Pick another ${what} name.`;

// Plain names (OakBarn Brewery, 2026-11-11: the marks that are "Allowed in a name you type, but trouble are No No also"): a Device,
// Widget, gGlobal or other item a Process uses by name has only letters, numbers, _ ~ @ and ° (OakBarn Brewery, 2026-11-11: the degree mark "does no interference"), and starts with a letter or _, so it
// works everywhere with no quotes. Tab and Interface names are shown names (Brew House, Brewery Mega); their IDs (BH, BM) are plain.
export const PLAIN_NAME = /^[A-Za-z_][A-Za-z0-9_~@°]*$/;
const SHOWN_NAMES = ['Tab', 'Interface'];
// any other mark (a space, - + = ! # ' % ^ & ( ) [ ] { } ; , . $ `, an accent ...) becomes ~; © ® ™ are dropped; an accent is dropped first (Würze -> Wurze)
export const plainName = n => {
  let s = String(n ?? '').replace(/[©®™]/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9_~@°]/g, '~');
  if (s && !/^[A-Za-z_]/.test(s)) s = '_' + s;
  return s;
};

// The Process language's own words (Help 22, Reserved words): none can be a name. test/null.test.js checks this matches lib/engine.js.
export const PROCESS_WORDS = new Set(('if elseif else endif goto sleep wait start stop reset print clear show send_db send_db_group start_db_group stop_db_group new ' +
  'play step restart lock_equipment unlock_equipment ask close_all_valves open_all_valves open_valve close_valve all_pumps_off import_recipe ' +
  'start_hop_alerts stop_hop_alerts take_reading declare and or not visible hidden countdown countup none custom default hiddenlocked on off null ' +
  'value string bool time datetime now true false tab workspace').split(' '));

// Device and Widget names
export function elementNameError(name, what = 'Device or Widget') {
  const n = String(name ?? '');
  const e = common(n, what); if (e) return e;
  if (!SHOWN_NAMES.includes(what) && !PLAIN_NAME.test(n)) {
    if (!/^[A-Za-z_]/.test(n)) return `The ${what} name "${n}" must start with a letter or _`;
    const bad = [...new Set([...n].filter(ch => !/[A-Za-z0-9_~@°]/.test(ch)))].map(ch => ch === ' ' ? 'a space' : ch);
    return `The ${what} name "${n}" can't have ${bad.join(' ')} in it. A name has only letters, numbers, _ ~ @ and °, so a Process can use it with no quotes.`;
  }
  if (RESERVED.test(n)) return reservedMsg(n, what);
  if (PROCESS_WORDS.has(n.toLowerCase())) return `"${n}" is a word of the Process language (such as NULL, true, if or wait), so it can't be a ${what} name. Add to it, for example ${n}_1.`;
  if (isSkynetConstantName(n)) return `The ${what} name "${n}" can't start with skc_: those names are kept for Skynet Constants`;
  return '';
}

// A name typed by hand (OakBarn Brewery, 2026-11-11: @ and ~ are "reserved for Suggested Name Use Only"): the same rules, and @ or ~ only
// when the name is the program's Suggested Name (suggestion), or is the item's name already (was)
export function typedNameError(name, { suggestion = '', was = '', what = 'Device or Widget' } = {}) {
  const n = String(name ?? ''), bad = elementNameError(n, what); if (bad) return bad;
  if (/[@~]/.test(n) && n !== suggestion && n !== was && !SHOWN_NAMES.includes(what))
    return `The ${what} name "${n}" can't have @ or ~ in it: they are kept for the Suggested Name${suggestion ? ` (${suggestion})` : ''}. Use _ instead, or pick the Suggested Name.`;
  return '';
}

// File and folder names. ext: true = a file ending is needed (pic.png), false = no period at all (a folder, a Process name)
export function fileNameError(name, { ext = true, what = 'file' } = {}) {
  const n = String(name ?? '');
  const e = common(n, what); if (e) return e;
  const dots = n.split('.').length - 1;
  if (!ext && dots) return `The ${what} name "${n}" can't have a period (.) in it`;
  if (ext && (dots > 1 || (dots === 1 && !/\.[^.]+$/.test(n)))) return `The ${what} name "${n}" can have a period (.) only before its file ending, like Mash.txt`;
  if (RESERVED.test(n.split('.')[0])) return reservedMsg(n.split('.')[0], what);
  return '';
}

// the same checks, as an error to throw
export function checkFileName(name, opts) { const e = fileNameError(name, opts); if (e) throw new Error(e); return name; }
