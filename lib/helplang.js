// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Help in any language by AI translation (Panel Updates entry 45, Rule 11.16; OakBarn Brewery, 2026-11-20: "Could there be a method
// where the Help could be sent to an AI agent external to the Program to Translate to a different langauge and then brought back into
// skynet"; "That way we keep french and then another is user. So there would be 3 choices of Help. English, French, User Language.").
//
//   1. Export: the Help pages, the balloons (Hover Help), the words in the Help pictures, the Override and Stop words and the few notes
//      the Help shows around a page, written as plain text files in parts small enough for an AI chat. Each piece sits under a marker
//      line (===== PAGE 01-getting-started 3f2a9c1b5e7d0a12 =====) that the AI keeps as it is.
//   2. Translate: the user pastes a part into any AI (Claude, ChatGPT ...) and asks for the language they want.
//   3. Import: Skynet reads the parts back, checks each piece against its English (the same headings, links, pictures, code, {0}, ⬢ ⬆,
//      the red warnings) and keeps every good piece. The pieces that fail stay English and are listed in ONE warning.
// The User Language lives in the Brain's data folder (data/help_user/), so a Setup never touches it and Move Brain takes it along.
// A new language replaces the old one; the old one is kept in data/help_user_backups/ (Design Rule #1, Never Take Away).
// Nothing is blocked: right-to-left languages are taken too, but will not show right (the one warning of Add Font to Brain says so).
//
// Fonts (Rule 9.12 point 4, SIL OFL): the Help is drawn by the browser reading it, and phones and PCs have the Chinese, Japanese,
// Korean, Thai and Hindi letters. The add-only Skynet Language Fonts Setup puts Google Noto fonts in fonts/ for a screen that lacks
// them (a screen plugged into the Pi), and an Admin can add any font of their own (data/fonts/). The Brain serves them all as web
// fonts (/fonts/fonts.css), for the Help pages and balloons only.
import fs from 'node:fs';
import path from 'node:path';
import { Help, sourceStamp, headingId } from './help.js';
import { fileStamp } from './filedate.js';

export const USER = 'user';
export const META = '_language.json';
export const BALLOONS = '_balloons.json';
export const PICTURES = '_pictures.json';
export const OWN_KEEP = '_keep_english.txt';
export const PART_KB = 40;                   // about 10,000 words of English: one AI answer can hold it
const MARK = /^\s*={3,}\s*(.+?)\s*={3,}\s*$/;
const HEAD = 'SKYNET HELP TRANSLATION 1';

// the safety words of Rule 11.11 (the same three as public/screenwords.js) and the words around a Help page
export const WORDS = { override: 'Override', stop: 'Stop', 'stop-all': 'Stop all' };
export const ELECTRICAL = '⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.';
export const GAS = '⚠ Gas can explode or kill. OakBarn Brewery and Skynet are not Electricians, Plumbers or HVAC experts. Consult a Licensed Electrician, Plumber or HVAC professional.';
export const NOTES = {
  missing: 'This page is not translated yet: here is the English page.',
  stale: 'The English page changed after this page was translated: it may be out of date.',
  english: 'See the English page',
  back: 'Back to the translated page',
  machine: 'Machine translation of the English page. The buttons, menus and screens stay in English, as in the program. When in doubt, the English page is the one to trust.',
  'notice-title': 'Machine translation',
  'notice-text': 'The Help in this language was translated by a machine, not by a person. It may have mistakes. The buttons, menus and screens stay in English. When in doubt, the English page is the one to trust.',
  // the Keep English words (OakBarn Brewery, 2026-11-20): said under every translated page
  keep: 'Brewing words such as Strike, Sparge and Mash stay in English, as Skynet and its Processes use them. Each one is shown in English with its meaning in this language next to it, in ( ).',
  electrical: ELECTRICAL,
  gas: GAS,
};
const NAME_HINT = 'Write the name of the language here, in that language';
const ENGLISH_HINT = 'Write the name of the language here, in English';

// what the AI reads first (it stays English: Skynet does not read it back)
export const README = `This file is the Help of Skynet, a program that runs a home brewery.
Translate it into the language you are asked for, and give back the WHOLE file, from the first line to the last.

1. Every line that starts and ends with ===== is a marker. Keep each marker line exactly as it is: never translate, change, join or remove one.
2. Translate only the text between the marker lines. Do not translate the text under READ ME FIRST or KEEP ENGLISH.
3. Under LANGUAGE NAME write the name of the language in that language (Deutsch). Under LANGUAGE ENGLISH NAME write it in English (German).
4. Keep, exactly as they are: Markdown marks (# ## ** * - | > \`\`\`), link and picture addresses in ( ), \`code\`, anything inside \`\`\` blocks,
   {#ids}, {0} {1} {2}, the marks ⬢ ⬆ ⚠ ⟦ ⟧, and anything between ⟪ and ⟫. Keep the same number of headings, in the same order.
5. Names of buttons, boxes, menus and screens stay in English, exactly as they are on the screen (they are often in **bold**).
   So do Device, Widget, Process and file names, and the brewing words under KEEP ENGLISH.
6. A paragraph that starts with ⚠ stays a paragraph that starts with ⚠.
7. A word inside ⁅ ⁆ is a brewing word that stays in English: keep the ⁅ ⁆ and the English word inside them, and translate only
   the copy of it in ( ) right after them. Example in French: ⁅Mash⁆ (Mash) becomes ⁅Mash⁆ (Brassage).
8. Write plain words a brewer can follow. Do not add notes or explanations of your own.`;

// the brewing words that are never translated (OakBarn Brewery fills in the list: help/_keep_english.txt), plus the Brain's own
export function keepEnglish(helpDir, userDir) {
  const read = f => { try { return fs.readFileSync(f, 'utf8'); } catch { return ''; } };
  const words = [read(path.join(helpDir, '_keep_english.txt')), read(path.join(userDir, OWN_KEEP))].join('\n').split(/\r?\n/)
    .map(l => l.replace(/#.*$/, '').trim()).filter(Boolean);
  return [...new Set(words)];
}
export const ownKeep = userDir => { try { return fs.readFileSync(path.join(userDir, OWN_KEEP), 'utf8'); } catch { return ''; } };
export function saveOwnKeep(userDir, text) {
  fs.mkdirSync(userDir, { recursive: true });
  fs.writeFileSync(path.join(userDir, OWN_KEEP), String(text ?? '').slice(0, 64 * 1024));
}

const readJson = (f, dflt = {}) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return dflt; } };
const writeJson = (f, v) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f + '.tmp', JSON.stringify(v, null, 1) + '\n'); fs.renameSync(f + '.tmp', f); };

// the User Language as the browser needs it: its name, the safety words, the notes, and whether it is there at all
export function userLanguage(userDir) {
  const m = readJson(path.join(userDir, META), null);
  if (!m || !m.name) return null;
  return { name: String(m.name), english: String(m.english || ''), rtl: !!m.rtl, scripts: m.scripts || [], imported: m.imported || '',
    words: m.words || {}, notes: { ...NOTES, ...(m.notes || {}) } };
}
export const userBalloons = userDir => readJson(path.join(userDir, BALLOONS));

// ---------------- The Keep English words ----------------
// OakBarn Brewery, 2026-11-20: "list them in English with the English Translation ... When you get a language import back, put the
// English back and leave the translation as foreign ... Since these are fixed and not dynamic, it would work and the brain would know
// where." On Export every Keep English word in a page or balloon is written twice, ⁅Mash⁆ (Mash): the first in a fixed slot, the second
// for the AI to translate. On Import the k-th slot gets the k-th English word back, whatever the AI did to it, so the page reads
// "Mash (Maische)". Code, link addresses, picture paths, {#ids}, {0} and ⟪ ⟫ parts are never touched.
const PROTECT = /```[\s\S]*?```|`[^`\n]*`|\]\([^)\s]*\)|\{#?[\w-]+\}|⟪[^⟫]*⟫|<https?:[^>\s]*>/g;
const SLOT = /⁅([^⁆\n]*)⁆/g;
const reEsc = w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function markKeep(text, words = []) {
  text = String(text ?? '');
  const list = words.filter(Boolean).sort((a, b) => b.length - a.length);
  if (!list.length) return text;
  const re = new RegExp(`(?<![\\p{L}\\p{N}_-])(${list.map(reEsc).join('|')})(?![\\p{L}\\p{N}_-])`, 'giu');
  const mark = t => t.replace(re, w => `⁅${w}⁆ (${w})`);
  let out = '', last = 0;
  for (const m of text.matchAll(PROTECT)) { out += mark(text.slice(last, m.index)) + m[0]; last = m.index + m[0].length; }
  return out + mark(text.slice(last));
}
// the translation with each slot given its English word back; null when the slots are not all there
export function restoreKeep(marked, tr) {
  const want = [...String(marked).matchAll(SLOT)].map(m => m[1]);
  const got = String(tr).match(SLOT) || [];
  if (got.length !== want.length) return null;
  let k = 0;
  return String(tr).replace(SLOT, () => want[k++]);
}

// ---------------- Export ----------------
// The English pieces: [{ kind, key, en }]. english: the English Help; balloons: the English balloon texts (the keys of
// public/hoverhelp-fr.json, which lists every balloon); pictureWords: the English words of the Help pictures (help/fr/_pictures.json).
// onlyNew: only what the User Language does not have yet or what changed since it was translated.
export function englishPieces({ english, balloons, pictureWords, userDir, onlyNew = false, keep = [] }) {
  const have = onlyNew ? readJson(path.join(userDir, META)) : {};
  const user = english.translation(USER);
  const out = [];
  for (const [k, en] of Object.entries(WORDS)) if (!have.words?.[en]) out.push({ kind: 'WORD', key: k, en });
  for (const [k, en] of Object.entries(NOTES)) if (!have.notes?.[k]) out.push({ kind: 'NOTE', key: k, en });
  const pages = onlyNew ? user.list().filter(p => p.missing || p.stale) : english.list();
  for (const p of pages) { const en = english.read(p.name); out.push({ kind: 'PAGE', key: `${p.name} ${sourceStamp(en)}`, en: markKeep(en, keep) }); }
  const hb = onlyNew ? userBalloons(userDir) : {};
  for (const en of balloons) if (!hb[en]) out.push({ kind: 'BALLOON', key: sourceStamp(en), en: markKeep(en, keep) });
  const hp = onlyNew ? readJson(path.join(userDir, PICTURES)) : {};
  for (const [en, fr] of Object.entries(pictureWords)) if (fr !== en && !hp[en]) out.push({ kind: 'PICTURE', key: sourceStamp(en), en });
  return out;
}

// the pieces cut into parts of about partKB of English each; a page is never cut in two
export function exportParts(pieces, { keep = [], name = '', english = '', partKB = PART_KB } = {}) {
  const max = Math.max(1, Math.min(2000, Number(partKB) || PART_KB)) * 1024;
  const groups = [[]]; let size = 0;
  for (const p of pieces) {
    const n = Buffer.byteLength(p.en);
    if (size && size + n > max) { groups.push([]); size = 0; }
    groups.at(-1).push(p); size += n;
  }
  return groups.map((g, i) => [
    `===== ${HEAD} =====`,
    `===== READ ME FIRST =====`, README, `(Part ${i + 1} of ${groups.length})`,
    `===== LANGUAGE NAME =====`, name || NAME_HINT,
    `===== LANGUAGE ENGLISH NAME =====`, english || ENGLISH_HINT,
    `===== KEEP ENGLISH =====`, keep.join(', ') || '(none)',
    ...g.flatMap(p => [`===== ${p.kind} ${p.key} =====`, p.en.replace(/\r\n?/g, '\n').replace(/\n+$/, '')]),
    `===== END =====`, ''].join('\n'));
}

// ---------------- Import ----------------
// a part as it came back from the AI: { name, english, pieces: [{ kind, key, text }] }
export function parseFile(text) {
  const lines = String(text ?? '').replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n');
  const out = { name: '', english: '', pieces: [], head: false };
  let cur = null;
  const done = () => {
    if (!cur) return;
    const body = cur.lines.join('\n').replace(/^\n+|\n+$/g, '');
    if (cur.kind === 'LANGUAGE NAME') out.name = body.split('\n')[0].trim();
    else if (cur.kind === 'LANGUAGE ENGLISH NAME') out.english = body.split('\n')[0].trim();
    else if (/^(PAGE|BALLOON|PICTURE|WORD|NOTE)$/.test(cur.kind)) out.pieces.push({ kind: cur.kind, key: cur.key, text: body });
    cur = null;
  };
  for (const l of lines) {
    const m = MARK.exec(l);
    if (!m) { if (cur) cur.lines.push(l); continue; }
    done();
    const t = m[1].replace(/\s+/g, ' ');
    if (t === HEAD) { out.head = true; continue; }
    const k = /^(PAGE|BALLOON|PICTURE|WORD|NOTE) (.+)$/.exec(t);
    if (k) cur = { kind: k[1], key: k[2].trim(), lines: [] };
    else if (/^LANGUAGE (ENGLISH )?NAME$/.test(t)) cur = { kind: t, lines: [] };
    else cur = { kind: 'SKIP', lines: [] };              // READ ME FIRST, KEEP ENGLISH, END
  }
  done();
  // an AI that put the whole file in a ``` box: the closing ``` is not part of the last piece
  const last = out.pieces.at(-1);
  if (last) last.text = last.text.replace(/\n```\s*$/, '');
  return out;
}

// what a Help page keeps in every language (the same checks as test/helpfrench.test.js)
const outside = t => t.replace(/```[\s\S]*?```/g, '');
const sorted = a => a.sort();
function keeps(text) {
  const t = String(text).replace(/\r/g, '');
  return {
    headings: outside(t).split('\n').filter(l => /^#{1,6}\s/.test(l)).map(l => l.match(/^#+/)[0]).join(' '),
    links: sorted([...outside(t).matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)\)/g)].map(m => m[1])),
    pictures: sorted([...outside(t).matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)].map(m => m[1])),
    code: sorted([...outside(t).matchAll(/`([^`\n]+)`/g)].map(m => m[1])),
    'code blocks': [...t.matchAll(/```[\s\S]*?```/g)].map(m => m[0]),
    '⚠ warnings': (outside(t).match(/^\s*(>\s*)?(\*\*)?\s*⚠/gm) || []).length,
  };
}
// what a balloon keeps: {0}, the marks and the ⟪picture⟫ parts
function balloonKeeps(text) {
  const t = String(text);
  return {
    '{0}': sorted(t.match(/\{\d\}/g) || []),
    '⬢ ⬆ ⟦ ⟧ marks': ['⬢', '⬆', '⟦', '⟧'].map(c => t.split(c).length - 1).join(' '),
    '⟪ ⟫ parts': sorted(t.match(/⟪[^⟫]*⟫/g) || []),
    '⚠ lines': (t.match(/^⚠/gm) || []).length,
  };
}
function differ(a, b) {
  return Object.keys(a).filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
}
// a translated page made ready: each heading gets the id of its English heading, so links to a part of a page work (Rule 11.11),
// and each red warning (Rule 6.20) is the language's own warning sentence (or the English one when the AI gave none)
export function fixPage(en, tr, warn = {}) {
  const enHeads = outside(en.replace(/\r/g, '')).split('\n').filter(l => /^#{1,6}\s/.test(l));
  const lines = tr.replace(/\r/g, '').split('\n');
  let inCode = false, k = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```')) inCode = !inCode;
    if (inCode) continue;
    if (/^#{1,6}\s/.test(lines[i]) && enHeads[k] !== undefined) {
      const id = headingId(enHeads[k++]);
      lines[i] = lines[i].replace(/\s*\{#[\w-]+\}\s*$/, '').replace(/\s+$/, '') + ` {#${id}}`;
    }
  }
  // the k-th ⚠ paragraph of the page is the k-th ⚠ paragraph of the English page
  const enWarn = [...outside(en).matchAll(/^\s*(?:>\s*)?(\*\*)?\s*⚠\s*(.*)$/gm)].map(m => m[2]);
  let w = 0; inCode = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```')) inCode = !inCode;
    if (inCode || !/^\s*(>\s*)?(\*\*)?\s*⚠/.test(lines[i])) continue;
    const e = enWarn[w++] || '';
    const which = /^Electricity can kill/i.test(e) ? 'electrical' : /^Gas can explode or kill/i.test(e) ? 'gas' : '';
    if (!which) continue;
    // the whole paragraph (it may go on over the next lines) becomes the warning sentence; a "(Rule 6.20)" after it stays
    const q = /^\s*>\s*/.exec(lines[i])?.[0] || '';      // a warning inside a > box stays in it
    let j = i + 1; while (j < lines.length && lines[j].trim() && (q ? /^\s*>\s*\S/.test(lines[j]) && !/^\s*>\s*(\*\*)?\s*⚠/.test(lines[j]) : !/^(#|\s*[-*]\s|\s*\d+[.)]\s|>|```|\|)/.test(lines[j]))) j++;
    const rule = /\(Rule [\d.]+\)\s*$/.exec(lines.slice(i, j).join(' '));
    lines.splice(i, j - i, q + '**' + (warn[which] || NOTES[which]).replace(/^⚠\s*/, '⚠ ') + '**' + (rule ? ' ' + rule[0] : ''));
  }
  return lines.join('\n').replace(/\n*$/, '\n');
}

// letters of a language that is read right to left (Hebrew, Arabic, Syriac, Thaana, N'Ko ...)
export const RTL = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
// the letters a Skynet Language Fonts font is for
export const SCRIPTS = {
  'Chinese': { re: /[一-鿿㐀-䶿]/, font: 'noto-sans-sc' },
  'Japanese': { re: /[぀-ヿ]/, font: 'noto-sans-jp' },
  'Korean': { re: /[가-힯ᄀ-ᇿ]/, font: 'noto-sans-kr' },
  'Thai': { re: /[฀-๿]/, font: 'noto-sans-thai' },
  'Hindi': { re: /[ऀ-ॿ]/, font: 'noto-sans-devanagari' },
};

// Read the parts back and keep every good piece. english: the English Help; balloons and pictureWords as for englishPieces.
// Returns { name, taken: { pages, balloons, pictures, words, notes }, problems: [text], rtl, scripts, fontsMissing, backup }
export function importParts(texts, { english, balloons, pictureWords, userDir, backupsDir, fontDirs = [], keep = [] }) {
  const parts = texts.map(parseFile);
  const problems = [];
  parts.forEach((p, i) => { if (!p.head && !p.pieces.length) problems.push(`File ${i + 1}: this is not a Skynet Help translation file (no ===== marker lines).`); });
  const pieces = parts.flatMap(p => p.pieces);
  const named = parts.find(p => p.name && p.name !== NAME_HINT);
  const name = (named?.name || '').slice(0, 60), englishName = (parts.find(p => p.english && p.english !== ENGLISH_HINT)?.english || '').slice(0, 60);
  if (!pieces.length) return { name, taken: null, problems: problems.length ? problems : ['Nothing to import: the file has no translated pieces.'] };
  if (!name) problems.push('No language name under LANGUAGE NAME: it is called "User Language" for now. Import a part with the name to change it.');

  // a new language replaces the old one: the old one is kept in the backups folder (Rule #1)
  const old = userLanguage(userDir);
  const same = old && (!name || [old.name, old.english].some(n => n && n.toLowerCase() === name.toLowerCase())
    || (englishName && old.english && old.english.toLowerCase() === englishName.toLowerCase()));
  let backup = '';
  if (fs.existsSync(userDir) && fs.readdirSync(userDir).some(f => f !== OWN_KEEP) && !same) {
    backup = path.join(backupsDir, `help_user_${fileStamp()}`);
    fs.mkdirSync(backup, { recursive: true });
    for (const f of fs.readdirSync(userDir)) if (f !== OWN_KEEP && f !== 'backups') fs.renameSync(path.join(userDir, f), path.join(backup, f));
  }
  fs.mkdirSync(userDir, { recursive: true });
  const meta = same ? readJson(path.join(userDir, META)) : {};
  meta.name = name || meta.name || 'User Language';
  if (englishName) meta.english = englishName;
  meta.words ??= {}; meta.notes ??= {};
  const hb = same ? userBalloons(userDir) : {}, hp = same ? readJson(path.join(userDir, PICTURES)) : {};
  const byStamp = list => new Map(list.map(en => [sourceStamp(en), en]));
  const bMap = byStamp(balloons), pMap = byStamp(Object.keys(pictureWords));
  const user = english.translation(USER), src = user.sources();
  const taken = { pages: 0, balloons: 0, pictures: 0, words: 0, notes: 0 };
  const short = t => (t.length > 50 ? t.slice(0, 47) + '...' : t).replace(/\n/g, ' ');
  const all = [];

  // the words and notes first: a page's red warnings use the language's own warning sentence
  for (const p of pieces.filter(p => p.kind === 'WORD' || p.kind === 'NOTE')) {
    const en = p.kind === 'WORD' ? WORDS[p.key] : NOTES[p.key];
    if (en === undefined) { problems.push(`${p.kind} ${p.key}: not a Skynet ${p.kind === 'WORD' ? 'word' : 'note'}; left out.`); continue; }
    const t = p.text.trim();
    if (!t) { problems.push(`${p.kind === 'WORD' ? `The ${en} button` : `The note "${short(en)}"`}: nothing translated; it stays English.`); continue; }
    if (p.kind === 'WORD' && t.includes('\n')) { problems.push(`The ${en} button: more than one line; it stays English.`); continue; }
    if ((p.key === 'electrical' || p.key === 'gas') && !t.startsWith('⚠')) { problems.push(`The ${p.key} warning (Rule 6.20) lost its ⚠; it stays English.`); continue; }
    if (p.kind === 'WORD') meta.words[en] = t.slice(0, 30); else meta.notes[p.key] = t.replace(/\s*\n\s*/g, ' ');
    taken[p.kind === 'WORD' ? 'words' : 'notes']++; all.push(t);
  }
  const warn = { electrical: meta.notes.electrical, gas: meta.notes.gas };
  for (const p of pieces) {
    if (p.kind === 'PAGE') {
      const [page, stamp] = p.key.split(/\s+/);
      let en; try { en = english.read(page); } catch { problems.push(`Page ${page}: there is no such English page any more; left out.`); continue; }
      if (!p.text.trim()) { problems.push(`Page ${page}: nothing translated; it stays English.`); continue; }
      const tr = restoreKeep(markKeep(en, keep), p.text);
      if (tr === null) { problems.push(`Page ${page}: the Keep English words in ⁅ ⁆ are not all there; it stays English.`); continue; }
      const bad = differ(keeps(en), keeps(tr));
      if (bad.length) { problems.push(`Page ${page}: the ${bad.join(', ')} are not the same as in English; it stays English.`); continue; }
      user.write(page, fixPage(en, tr, warn));
      src[page] = /^[0-9a-f]{16}$/.test(stamp || '') ? stamp : sourceStamp(en);     // made from the English as it was exported
      taken.pages++; all.push(p.text);
    } else if (p.kind === 'BALLOON' || p.kind === 'PICTURE') {
      const isB = p.kind === 'BALLOON', en = (isB ? bMap : pMap).get(p.key);
      if (en === undefined) { problems.push(`${isB ? 'Balloon' : 'Picture word'} ${p.key}: its English changed since the Export; left out (Export again for it).`); continue; }
      const t = isB ? restoreKeep(markKeep(en, keep), p.text) : p.text.trim();
      if (t === null) { problems.push(`Balloon "${short(en)}": the Keep English words in ⁅ ⁆ are not all there; it stays English.`); continue; }
      if (!t.trim()) { problems.push(`${isB ? 'Balloon' : 'Picture word'} "${short(en)}": nothing translated; it stays English.`); continue; }
      if (isB) {
        const bad = differ(balloonKeeps(en), balloonKeeps(t));
        if (bad.length) { problems.push(`Balloon "${short(en)}": the ${bad.join(', ')} are not the same as in English; it stays English.`); continue; }
        hb[en] = t; taken.balloons++;
      } else { hp[en] = t.replace(/\s*\n\s*/g, ' '); taken.pictures++; }
      all.push(t);
    }
  }
  // the fingerprints of the pages, sorted as help/fr/_source.json is
  writeJson(path.join(userDir, '_source.json'), Object.fromEntries(Object.entries(src).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))));
  writeJson(path.join(userDir, BALLOONS), hb);
  writeJson(path.join(userDir, PICTURES), hp);
  // what the language is written in: right to left (taken, but it will not show right), and the letters that may need a font
  const sample = [meta.name, ...all].join('\n');
  meta.rtl = RTL.test(sample);
  meta.scripts = Object.entries(SCRIPTS).filter(([, s]) => s.re.test(sample)).map(([k]) => k);
  meta.imported = new Date().toISOString();
  writeJson(path.join(userDir, META), meta);
  const have = new Set(fontDirs.flatMap(d => { try { return fs.readdirSync(d); } catch { return []; } }));
  const fontsMissing = meta.scripts.filter(s => !have.has(SCRIPTS[s].font));
  return { name: meta.name, taken, problems, rtl: meta.rtl, scripts: meta.scripts, fontsMissing, backup: backup ? path.basename(backup) : '' };
}

// how much of the Help the User Language has
export function userStatus(english, userDir, balloons) {
  const lang = userLanguage(userDir);
  if (!lang) return null;
  const list = english.translation(USER).list();
  const hb = userBalloons(userDir);
  return { ...lang, pages: list.filter(p => !p.missing).length, stale: list.filter(p => p.stale).length, total: list.length,
    balloons: balloons.filter(b => hb[b]).length, balloonsTotal: balloons.length };
}

// ---------------- Fonts ----------------
export const FONT_TYPES = { '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const FONT_NAME = /^[\w][\w .()-]{0,100}\.(woff2|woff|ttf|otf)$/i;
// a font file name made safe (letters with accents become plain letters, Rule 3.4)
export function fontFileName(name) {
  const base = path.basename(String(name ?? '')).normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss').replace(/[æÆ]/g, 'ae').replace(/[øØ]/g, 'o').replace(/[^\w .()-]/g, '_').replace(/^[^\w]+/, '');
  return FONT_NAME.test(base) ? base : '';
}
// the fonts the user added (data/fonts/)
export function userFonts(dir) {
  try { return fs.readdirSync(dir).filter(f => FONT_NAME.test(f)).sort().map(f => ({ file: f, size: fs.statSync(path.join(dir, f)).size })); } catch { return []; }
}
export function addUserFont(dir, name, bytes) {
  const file = fontFileName(name);
  if (!file) throw new Error('A font file is a .woff2, .woff, .ttf or .otf file');
  if (!bytes?.length) throw new Error('The font file is empty');
  fs.mkdirSync(dir, { recursive: true });
  let f = file;
  for (let i = 2; fs.existsSync(path.join(dir, f)); i++) f = file.replace(/(\.\w+)$/, `_${i}$1`);      // never over one already there
  fs.writeFileSync(path.join(dir, f), bytes);
  return f;
}
// a user's font taken away: moved to the backups folder, never deleted (Rule #1)
export function removeUserFont(dir, backupsDir, file) {
  if (!FONT_NAME.test(String(file)) || path.basename(file) !== file) throw new Error('No such font');
  const f = path.join(dir, file);
  if (!fs.existsSync(f)) throw Object.assign(new Error('No such font'), { code: 404 });
  const to = path.join(backupsDir, 'fonts'); fs.mkdirSync(to, { recursive: true });
  fs.renameSync(f, path.join(to, `${fileStamp()}_${file}`));
}
// the Skynet Language Fonts in fonts/ (each in a folder of its own, with its font.css)
export function packageFonts(dir) {
  try { return fs.readdirSync(dir).filter(f => /^[a-z0-9-]+$/.test(f) && fs.existsSync(path.join(dir, f, 'font.css'))).sort(); } catch { return []; }
}
// the web fonts for the Help: every package font (its pieces load only for the letters a page uses), then the user's own
export function fontsCss(pkgDir, userDir) {
  const out = ['/* Skynet Help fonts (lib/helplang.js) */'], fams = [];
  for (const d of packageFonts(pkgDir)) {
    const css = fs.readFileSync(path.join(pkgDir, d, 'font.css'), 'utf8').replace(/url\((['"]?)\.\/([\w.-]+)\1\)/g, (_, q, f) => `url(/fonts/pkg/${d}/${f})`);
    out.push(css);
    for (const m of css.matchAll(/font-family:\s*['"]([^'"]+)['"]/g)) if (!fams.includes(m[1])) fams.push(m[1]);
  }
  userFonts(userDir).forEach((f, i) => {
    const fam = `Skynet User Font ${i + 1}`, ext = path.extname(f.file).toLowerCase();
    const fmt = { '.woff2': 'woff2', '.woff': 'woff', '.ttf': 'truetype', '.otf': 'opentype' }[ext];
    out.push(`@font-face { font-family: '${fam}'; font-display: swap; src: url(/fonts/user/${encodeURIComponent(f.file)}) format('${fmt}'); }`);
    fams.push(fam);
  });
  // only the Help pages and the balloons: after the screen's own font, so a font here is used only for letters it lacks
  const list = fams.map(f => `'${f}'`).join(', ');
  if (list) out.push(`:root { --helpLangFonts: ${list}; }`);
  return out.join('\n');
}
export { Help };
