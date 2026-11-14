// French balloons (Rule 11.11, OakBarn Brewery, 2026-11-13: "Ballons and Hover Help French"): every balloon (Hover Help) text of the
// Panel has its French in public/hoverhelp-fr.json. When a balloon changes, its French changes in the same PR; until then this test
// fails and names the text (node tools/hoverhelp-french.js lists them).
// A French text keeps everything that is not words: {0} {1}…, the ⬢ and ⬆, the red ⟦marks⟧, ⟪pictures⟫, the warning lines, and
// the red electrical warning in its fixed French words.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scriptTexts, pageTexts, balloonTexts } from '../lib/hoverstrings.js';
import { compileFrench, frenchOf, LANG_KEY } from '../public/hoverhelp.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---- finding the balloon texts in code
{
  const code = `
    const A_TIP = 'One tip';
    const B_TIPS = { x: 'Two tip', y: \`Three \${n} tip\` };
    h('b', { title: 'Four tip', class: 'x' }, 'Not a tip');
    h('b', { tip: ok ? 'Five tip' : 'Six tip' });
    el.title = 'Seven tip'
    const plain = 'Eight';
    const B_MSG = 'Twelve tip';
    const D_TIP = B_MSG;
    document.title = 'Window title';
    el.dataset.help = 'Nine tip' + 'Ten tip';
    const re = /'x'/g, s = \`\${String(t).replace(/[<&"]/g, '')}\`;
    const C_HELP = ['Eleven tip'];
    function rowTip(n) { return \`Thirteen \${n} tip\`; }
  `;
  const refs = new Set(), got = scriptTexts(code, new Set(), refs).map(t => t.text);
  assert.deepEqual(got, ['One tip', 'Two tip', 'Three {0} tip', 'Four tip', 'Five tip', 'Six tip', 'Seven tip', 'Nine tip', 'Ten tip', 'Eleven tip', 'Thirteen {0} tip']);
  assert.ok(refs.has('B_MSG'), 'a constant a balloon is made from');
  assert.ok(scriptTexts(code, refs).some(t => t.text === 'Twelve tip'), 'its texts are balloon texts too');
  assert.deepEqual(pageTexts('<button title="Print this page" data-help=\'Ab &amp; Cd\'>x</button><b title="x.svg">').map(t => t.text), ['Print this page', 'Ab & Cd']);
}

// ---- turning a text into French
{
  const c = compileFrench({
    'Close': 'Fermer', 'Clone of {0}': 'Clone de {0}', 'The ⬆ opens a {0} Line Label Text Dialog': 'Le ⬆ ouvre une boîte de texte de {0} lignes',
    'Every Interface at once': 'Toutes les Interfaces à la fois', 'top left': 'en haut à gauche', 'Drag the {0} corner': 'Tirez le coin {0}',
  });
  assert.equal(frenchOf('Close', c), 'Fermer');
  assert.equal(frenchOf('Clone of HLT', c), 'Clone de HLT', 'a name put in stays');
  assert.equal(frenchOf('Drag the top left corner', c), 'Tirez le coin en haut à gauche', 'a part put in that has its own French');
  assert.equal(frenchOf('Close\nClone of X', c), 'Fermer\nClone de X', 'line by line');
  assert.equal(frenchOf('Every Interface at once. More', c), 'Toutes les Interfaces à la fois. More', 'a long text inside a bigger one');
  assert.equal(frenchOf('Not known', c), 'Not known', 'no French: English');
  const c2 = compileFrench({ 'A long first paragraph\nwith two lines': 'Un long premier paragraphe\nsur deux lignes', 'Close': 'Fermer' });
  assert.equal(frenchOf('A long first paragraph\nwith two lines\n\nClose', c2), 'Un long premier paragraphe\nsur deux lignes\n\nFermer', 'paragraphs joined together, one over two lines');
  const c3 = compileFrench({ 'Its name, for example {0}.': 'Son nom, par exemple {0}.', 'Close the door now.': 'Fermez la porte maintenant.' });
  assert.equal(frenchOf('Its name, for example HLT.\n\nClose the door now.', c3), 'Son nom, par exemple HLT.\n\nFermez la porte maintenant.',
    'a one-line text with {0} does not swallow the paragraphs after it');
  assert.equal(LANG_KEY, 'skynet-help-lang');
  assert.match(fs.readFileSync(path.join(root, 'public', 'help.js'), 'utf8'), /import \{ LANG_KEY, refreshBalloonLang \} from '\.\/hoverhelp\.js'/, 'the balloons follow the language picked in the Help window');
}

// ---- every balloon text has its French, and it keeps what is not words
const FILE = path.join(root, 'public', 'hoverhelp-fr.json');
const fr = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const en = balloonTexts(root);
const missing = [...en.keys()].filter(t => typeof fr[t] !== 'string' || !fr[t]);
assert.deepEqual(missing.map(t => `${en.get(t)[0]} ${JSON.stringify(t).slice(0, 80)}`), [], 'balloon texts with no French (node tools/hoverhelp-french.js; Rule 11.11)');
// French whose English text is gone does no harm (a balloon of a PR not merged yet may already have its French); the tool lists it
// and --prune takes it out
const WARN_EN = '⚠ Electricity can kill. OakBarn Brewery and Skynet are not electricians and can give no electrical advice. Consult a Licensed Electrician.';
const WARN_FR = "⚠ L'électricité peut tuer. OakBarn Brewery et Skynet ne sont pas électriciens et ne peuvent donner aucun conseil en électricité. Consultez un électricien qualifié.";
const bad = [];
const all = (s, re) => [...s.matchAll(re)].map(m => m[0]).sort().join(' ');
for (const [e, f] of Object.entries(fr)) {
  const why = [];
  if (all(e, /\{\d\}/g) !== all(f, /\{\d\}/g)) why.push('{0} {1}…');
  if (all(e, /[⬢⬆⟦⟧]/g) !== all(f, /[⬢⬆⟦⟧]/g)) why.push('⬢ ⬆ ⟦ ⟧');
  if (all(e, /⟪img:[^⟫]*⟫/g) !== all(f, /⟪img:[^⟫]*⟫/g)) why.push('pictures');
  if (all(e, /⟪b:/g) !== all(f, /⟪b:/g)) why.push('headings');
  if (e.split('\n').filter(l => l.startsWith('⚠')).length !== f.split('\n').filter(l => l.startsWith('⚠')).length) why.push('warning lines');
  if (e.includes(WARN_EN) && !f.includes(WARN_FR)) why.push('the French electrical warning');
  if (e.split('\n').length !== f.split('\n').length) why.push('lines');
  if (/Fritz/.test(f) && !/Fritz/.test(e)) why.push('Fritz');
  if (why.length) bad.push(`${JSON.stringify(e).slice(0, 60)}: ${why.join(', ')}`);
}
assert.deepEqual(bad, [], 'French balloons that lost something that is not words');
console.log(`French balloons ok (${en.size} texts)`);
