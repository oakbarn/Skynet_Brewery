// What a Device, Widget, file or folder may be called (Fritz, 2026-10-23). Used by the browser (app.js) and the server.
// Each check gives back '' when the name is fine, or a plain sentence that says what is wrong.
//
// Device, Widget and Interface names, not allowed: control characters, leading or trailing spaces, a leading dot, emoji,
//   < > : " / \ | ? *  (Fritz, 2026-10-29) and the Windows names CON, PRN, AUX, NUL, COM1-COM9, LPT1-LPT9.
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

// Device and Widget names
export function elementNameError(name, what = 'Device or Widget') {
  const n = String(name ?? '');
  const e = common(n, what); if (e) return e;
  if (RESERVED.test(n)) return reservedMsg(n, what);
  if (isSkynetConstantName(n)) return `The ${what} name "${n}" can't start with skc_: those names are kept for Skynet Constants`;
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
export function checkElementName(name, what) { const e = elementNameError(name, what); if (e) throw new Error(e); return name; }
export function checkFileName(name, opts) { const e = fileNameError(name, opts); if (e) throw new Error(e); return name; }
