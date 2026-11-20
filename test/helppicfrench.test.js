// Words in a Help picture are real text, in the Help language (Rule 7.25, OakBarn Brewery, 2026-11-20: "remove all text that is
// part of a graphic and add as text (maybe smaller and always translate"). Every word in a Help picture SVG has its French in
// help/fr/_pictures.json (node tools/helppics-french.js lists the missing ones); the Brain sends the picture in the language picked.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pictureWords, translateSvg, inlineImages, pictureWordsFor, helpPictureSvg, PICTURE_WORDS } from '../lib/helppictext.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PICS = path.join(root, 'media', 'help_pictures');

// ---- the words of a picture, and the picture in another language
{
  const svg = '<svg><text x="1" font-size="20">Red Pump</text><text><tspan>Port 15</tspan> <tspan> Gets Power </tspan></text><text>A &amp; B</text></svg>';
  assert.deepEqual(pictureWords(svg), ['Red Pump', 'Port 15', 'Gets Power', 'A & B']);
  const fr = translateSvg(svg, { 'Gets Power': 'Reçoit le courant de la pompe', 'A & B': 'A et B', 'Port 15': 'Port 15' });
  assert.ok(fr.includes('> Reçoit le courant de la pompe <'), 'the spaces around a word are kept');
  assert.ok(fr.includes('>A et B<') && fr.includes('>Red Pump<'), 'a word with no French stays English');
  assert.ok(/<tspan font-size="0\.\d+em"> Reçoit/.test(fr), 'a much longer word is drawn smaller');
  assert.ok(translateSvg('<text font-size="20">Gets Power</text>', { 'Gets Power': 'Reçoit le courant de la pompe' }).includes('font-size="12"'), 'its own size, never below 60 %');
  assert.ok(translateSvg('<text font-size="20">Gets Power</text>', { 'Gets Power': 'Alimentée' }).includes('font-size="20"'), 'a shorter word keeps its size');
  assert.ok(translateSvg('<text>x &lt; y</text>', { 'x < y': 'x < z & w' }).includes('x &lt; z &amp; w'), 'the French is written as SVG text');
  assert.equal(translateSvg(svg, null), svg);
}

// ---- the picture under the words goes inside the SVG (a browser loads nothing else from an SVG shown as a picture)
{
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'hpt-'));
  fs.writeFileSync(path.join(d, 'A_Art.png'), Buffer.from([1, 2, 3]));
  const svg = '<svg><image href="A_Art.png"/><image href="../secret.png"/><image href="data:image/png;base64,AA"/></svg>';
  const got = inlineImages(svg, d);
  assert.ok(got.includes('href="data:image/png;base64,AQID"'));
  assert.ok(got.includes('href="../secret.png"'), 'never a file outside its folder');
  fs.mkdirSync(path.join(d, 'help', 'fr'), { recursive: true });
  fs.writeFileSync(path.join(d, 'help', 'fr', PICTURE_WORDS), JSON.stringify({ Hi: 'Salut' }));
  fs.writeFileSync(path.join(d, 'A.svg'), '<svg><image href="A_Art.png"/><text>Hi</text></svg>');
  assert.equal(helpPictureSvg(path.join(d, 'A.svg'), path.join(d, 'help'), 'fr'), '<svg><image href="data:image/png;base64,AQID"/><text>Salut</text></svg>');
  assert.equal(helpPictureSvg(path.join(d, 'A.svg'), path.join(d, 'help'), 'en'), '<svg><image href="data:image/png;base64,AQID"/><text>Hi</text></svg>');
  assert.equal(pictureWordsFor(path.join(d, 'help'), '../..'), null, 'only a Help language, never a path');
  fs.rmSync(d, { recursive: true, force: true });
}

// ---- every word in a Help picture has its French; every picture an SVG names is there
{
  const fr = JSON.parse(fs.readFileSync(path.join(root, 'help', 'fr', PICTURE_WORDS), 'utf8'));
  const missing = [];
  for (const f of fs.readdirSync(PICS).filter(f => f.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(PICS, f), 'utf8');
    for (const w of pictureWords(svg)) if (!(w in fr)) missing.push(`${f}: ${JSON.stringify(w)}`);
    for (const m of svg.matchAll(/<image\b[^>]*?\bhref="([^"]+)"/g)) if (!m[1].startsWith('data:')) assert.ok(fs.existsSync(path.join(PICS, m[1])), `${f} names a missing picture ${m[1]}`);
  }
  assert.deepEqual(missing, [], 'Help picture words with no French (node tools/helppics-french.js)');
  for (const [en, w] of Object.entries(fr)) assert.ok(typeof w === 'string' && w.trim(), `no French for ${en}`);
}

// ---- the drawings that had their words in the picture are now SVGs with real text (Rule 7.25)
for (const n of ['Pump_Daisy_Chain', 'Valve_Daisy_Chain', 'Pump_Overlays', 'Pump_Cover', 'Hose_Bib_IP_Spots', 'Manual_Valve_Orientation', 'Hose_Bib_8_IPs']) {
  const svg = fs.readFileSync(path.join(PICS, n + '.svg'), 'utf8');
  assert.ok(svg.includes(`href="${n}_Art.png"`) && pictureWords(svg).length, `${n}.svg: the picture with its words as real text`);
}
console.log('helppicfrench tests passed');
