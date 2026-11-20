// Help in any language by AI translation (Rule 11.16, lib/helplang.js): Export in parts, Import with checks, the Keep English words
// put back in their fixed places, the red warnings, right to left taken, fonts. Run from test/helpfrench.test.js.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Help } from '../lib/help.js';
import { englishPieces, exportParts, parseFile, importParts, markKeep, restoreKeep, userLanguage, userBalloons, userStatus, keepEnglish,
  addUserFont, userFonts, removeUserFont, fontsCss, fontFileName, FONT_TYPES, NOTES } from '../lib/helplang.js';
import { pictureWordsFor } from '../lib/helppictext.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'helplang-'));
const help = path.join(d, 'help'), user = path.join(d, 'data', 'help_user'), backups = path.join(d, 'data', 'help_user_backups');
fs.mkdirSync(help, { recursive: true });
fs.writeFileSync(path.join(help, '01-start.md'), '# Start\n\n## Strike water\nHeat the strike water, then mash in. See [Tabs](02-tabs) and `HLT_Temp`.\n\n⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.\n');
fs.writeFileSync(path.join(help, '02-tabs.md'), '# Tabs\n\n![Tab](help_pictures/Tab.svg)\n\nA Tab holds your Mash Tun.\n');
fs.writeFileSync(path.join(help, '_keep_english.txt'), '# notes\nStrike\nStrike Water\nMash\nMash In\n');
const en = new Help(help, null, 'en', user);
const balloons = ['Pick the {0} to heat.', '⬢ The Mash Tun heats here.'];
const pictureWords = { 'Hot Liquor Tank': 'Cuve d’eau chaude', 'MEGA 2560': 'MEGA 2560' };
const keep = keepEnglish(help, user);
assert.deepEqual(keep, ['Strike', 'Strike Water', 'Mash', 'Mash In'], 'the Skynet list, notes left out');

// ---- the Keep English words: written twice, the first slot gets its English back whatever the AI did
assert.equal(markKeep('Heat the strike water, then mash in. `Mash_Temp` [Mash](13-mash)', keep),
  'Heat the ⁅strike water⁆ (strike water), then ⁅mash in⁆ (mash in). `Mash_Temp` [⁅Mash⁆ (Mash)](13-mash)', 'longest first; code and link addresses untouched');
assert.equal(restoreKeep('⁅Mash⁆ (Mash) here', '⁅Maische⁆ (Maische) hier'), 'Mash (Maische) hier', 'red red -> rouge rouge -> Red rouge');
assert.equal(restoreKeep('⁅Mash⁆ (Mash)', 'Maische (Maische)'), null, 'a slot lost: not taken');

// ---- Export: parts with marker lines, the AI instructions, the Keep English list; a page is never cut in two
const pieces = englishPieces({ english: en, balloons, pictureWords, userDir: user, keep });
assert.ok(pieces.some(p => p.kind === 'WORD' && p.en === 'Override') && pieces.some(p => p.kind === 'NOTE' && p.key === 'electrical'));
assert.ok(!pieces.some(p => p.kind === 'PICTURE' && p.en === 'MEGA 2560'), 'a word printed on a real item stays as it is');
assert.match(pieces.find(p => p.kind === 'PAGE').en, /⁅strike water⁆ \(strike water\)/);
const parts = exportParts(pieces, { keep, partKB: 1 });
assert.ok(parts.length >= 2, 'small parts');
assert.ok(parts.every(t => t.includes('===== READ ME FIRST =====') && t.includes('===== KEEP ENGLISH =====') && t.trim().endsWith('===== END =====')));
const all = parts.map(parseFile).flatMap(p => p.pieces);
assert.equal(all.length, pieces.length, 'every piece comes back');

// ---- Translate (a pretend AI: German, with one balloon and one page broken)
const de = parts.map(t => t
  .replace('Write the name of the language here, in that language', 'Deutsch').replace('Write the name of the language here, in English', 'German')
  .replace(/^(===== WORD override =====\n)Override/m, '$1Übergehen').replace(/^(===== WORD stop =====\n)Stop$/m, '$1Halt')
  .replace(/^(===== NOTE electrical =====\n).*$/m, '$1⚠ Strom kann töten. OakBarn Brewery und Skynet sind keine Elektriker. Fragen Sie einen Elektriker.')
  .replace('# Start', '# Anfang').replace('## ⁅Strike water⁆ (Strike water)', '## ⁅Einmaischwasser⁆ (Einmaischwasser)')
  .replace('Heat the ⁅strike water⁆ (strike water), then ⁅mash in⁆ (mash in).', 'Erhitzen Sie das ⁅Einmaischwasser⁆ (Einmaischwasser), dann ⁅einmaischen⁆ (einmaischen).')
  .replace('See [Tabs](02-tabs)', 'Siehe [Tabs](02-tabs)')
  .replace(/⚠ Electricity can kill[^\n]*/, '⚠ Strom kann töten, sagt die KI anders.')
  .replace('Pick the {0} to heat.', 'Wählen Sie, was geheizt wird.')                 // {0} lost: stays English
  .replace('⬢ The ⁅Mash⁆ (Mash) Tun heats here.', '⬢ Der ⁅Maische⁆ (Maische)bottich heizt hier.')
  .replace('![Tab](help_pictures/Tab.svg)', '![Tab](help_pictures/Other.svg)')       // picture changed: stays English
  .replace(/^(===== PICTURE \w+ =====\n)Hot Liquor Tank/m, '$1Heißwassertank'));
const r = importParts(de, { english: en, balloons, pictureWords, userDir: user, backupsDir: backups, keep });
assert.equal(r.name, 'Deutsch');
assert.equal(r.taken.pages, 1); assert.equal(r.taken.balloons, 1); assert.equal(r.taken.pictures, 1); assert.equal(r.taken.words, 3);
assert.equal(r.problems.length, 2, 'ONE warning with the two problems:\n' + r.problems.join('\n'));
assert.ok(r.problems.some(p => /Page 02-tabs: the pictures/.test(p)) && r.problems.some(p => /Balloon "Pick the \{0\}.*\{0\}/.test(p)));
assert.equal(r.rtl, false); assert.deepEqual(r.scripts, []);
const page = en.translation('user').read('01-start');
assert.match(page, /^# Anfang \{#start\}/, 'the English heading id');
assert.match(page, /## Strike water \(Einmaischwasser\) \{#strike-water\}/, 'the English word put back in its slot');
assert.match(page, /Erhitzen Sie das strike water \(Einmaischwasser\), dann mash in \(einmaischen\)\./);
assert.match(page, /\*\*⚠ Strom kann töten\. OakBarn Brewery und Skynet sind keine Elektriker\. Fragen Sie einen Elektriker\.\*\*/, 'the red warning is the language\'s own sentence');
assert.equal(en.translation('user').read('02-tabs'), fs.readFileSync(path.join(help, '02-tabs.md'), 'utf8'), 'a page not taken reads in English');
assert.equal(userBalloons(user)['⬢ The Mash Tun heats here.'], '⬢ Der Mash (Maische)bottich heizt hier.');
assert.equal(pictureWordsFor(help, 'user', user)['Hot Liquor Tank'], 'Heißwassertank', 'the picture words of the User Language');
const L = userLanguage(user);
assert.equal(L.words.Override, 'Übergehen'); assert.equal(L.words.Stop, 'Halt'); assert.equal(L.notes.missing, NOTES.missing, 'a note not translated stays English');
const st = userStatus(en, user, balloons);
assert.equal(st.pages, 1); assert.equal(st.total, 2); assert.equal(st.balloons, 1);
assert.equal(en.translation('user').list()[0].stale, false, 'made from the English as exported');

// ---- Only new and changed: the page and balloon taken are not sent again
const more = englishPieces({ english: en, balloons, pictureWords, userDir: user, onlyNew: true, keep });
assert.ok(!more.some(p => p.kind === 'PAGE' && p.key.startsWith('01-start')) && more.some(p => p.kind === 'PAGE' && p.key.startsWith('02-tabs')));
assert.ok(!more.some(p => p.kind === 'WORD' && p.key === 'override'));

// ---- a different language replaces it; the old one is kept (Rule #1). Right to left is taken; Chinese letters say which font.
const he = exportParts(englishPieces({ english: en, balloons, pictureWords, userDir: user, keep }), { keep })
  .map(t => t.replace('Write the name of the language here, in that language', 'עברית').replace('Write the name of the language here, in English', 'Hebrew').replace(/^(===== WORD stop =====\n)Stop$/m, '$1עצור'));
const r2 = importParts(he, { english: en, balloons, pictureWords, userDir: user, backupsDir: backups, keep, fontDirs: [path.join(d, 'fonts')] });
assert.equal(r2.name, 'עברית'); assert.equal(r2.rtl, true, 'right to left found, and still taken'); assert.ok(r2.backup);
assert.ok(fs.existsSync(path.join(backups, r2.backup, '_language.json')), 'the German is kept in the backups');
const zh = exportParts(englishPieces({ english: en, balloons, pictureWords, userDir: user, keep }), { keep: [] }).map(t => t.replace(/^(===== WORD stop =====\n)Stop$/m, '$1停止'));
const r3 = importParts(zh, { english: en, balloons, pictureWords, userDir: user, backupsDir: backups, fontDirs: [path.join(d, 'fonts')] });
assert.deepEqual(r3.scripts, ['Chinese']); assert.deepEqual(r3.fontsMissing, ['Chinese'], 'the Language Fonts Setup is named');
assert.ok(r3.problems.some(p => /No language name/.test(p)), 'no name: User Language');
assert.ok(importParts(['hello'], { english: en, balloons, pictureWords, userDir: user, backupsDir: backups }).problems[0].match(/not a Skynet Help translation file/));

// ---- fonts: added, served, taken away (moved, never deleted)
const fonts = path.join(d, 'data', 'fonts'), pkg = path.join(d, 'fonts');
assert.equal(fontFileName('Noto Sans Arabic.ttf'), 'Noto Sans Arabic.ttf'); assert.equal(fontFileName('../x.exe'), '');
assert.equal(fontFileName('Straße.woff2'), 'Strasse.woff2', 'Rule 3.4');
assert.throws(() => addUserFont(fonts, 'x.exe', Buffer.from('x')), /font file/);
assert.equal(addUserFont(fonts, 'Mine.ttf', Buffer.from('x')), 'Mine.ttf');
assert.equal(addUserFont(fonts, 'Mine.ttf', Buffer.from('y')), 'Mine_2.ttf', 'never over one already there');
fs.mkdirSync(path.join(pkg, 'noto-sans-thai'), { recursive: true });
fs.writeFileSync(path.join(pkg, 'noto-sans-thai', 'font.css'), "@font-face { font-family: 'Noto Sans Thai'; src: url(./noto-sans-thai-thai-400-normal.woff2) format('woff2'); unicode-range: U+0E01-0E5B; }");
const css = fontsCss(pkg, fonts);
assert.match(css, /url\(\/fonts\/pkg\/noto-sans-thai\/noto-sans-thai-thai-400-normal\.woff2\)/);
assert.match(css, /--helpLangFonts: 'Noto Sans Thai', 'Skynet User Font 1', 'Skynet User Font 2'/);
removeUserFont(fonts, backups, 'Mine.ttf');
assert.deepEqual(userFonts(fonts).map(f => f.file), ['Mine_2.ttf']);
assert.equal(fs.readdirSync(path.join(backups, 'fonts')).length, 1);
assert.equal(FONT_TYPES['.woff2'], 'font/woff2');

// ---- the shipped Keep English list
const shipped = keepEnglish(path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'help'), user);
for (const w of ['Strike', 'Sparge', 'Mash', 'Wort']) assert.ok(shipped.includes(w), w);
assert.ok(!shipped.includes('Override') && !shipped.includes('Stop'), 'Override and Stop follow the Help language (Rule 11.11)');

fs.rmSync(d, { recursive: true, force: true });
console.log('Help in any language ok');
