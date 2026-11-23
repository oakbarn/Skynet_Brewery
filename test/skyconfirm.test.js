// The one shared Skynet confirm box (Rule 2.64, Panel Updates entry 29) and the Brain Move USB Port list (Rule 9.9, entry 29 (e)).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitAsk } from '../public/skyconfirm.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

// the question is the heading, the rest is the text under it, word for word
assert.deepEqual(splitAsk('Delete this item?'), { head: 'Delete this item?', text: '' });
assert.deepEqual(splitAsk('Move in now?\n\nEvery output turns off.\n\nSign in with the OLD Brain.'), { head: 'Move in now?', text: 'Every output turns off.\n\nSign in with the OLD Brain.' });
assert.deepEqual(splitAsk(null), { head: '', text: '' });

// the big deletes and changes never use the browser's own box
const app = read('public/app.js'), media = read('public/media.js'), help = read('public/help.js');
const big = [
  [app, "Throw away everything on the Build Tab?"], /* "Delete this item?" is gone: Ctrl+Z brings a delete back (2026-11-23) */ [app, 'and everything on it?'], [app, 'Delete the User Style'],
  [app, 'Process${todo.length === 1'], [app, 'for good?'], [app, 'It goes to the Recycle Bin'], [app, 'A Process that uses it stops at that line'],
  [app, 'Delete the CSV set'], [app, 'They lose their 1-Wire Index'], [app, 'Remove it anyway?'], [app, 'Remove user ${u.name}?'],
  [app, 'It signs out at once and must be approved again'], [app, 'Turn Approved Devices Off?'], [app, 'Remove the Patron code'],
  [app, 'Make a new recovery code?'], [app, 'Switch the whole panel to the Simulator?'], [app, 'Is it OK to proceed?'],
  [app, 'Delete the Schema "${name}"?'], [app, 'Move in now?'], [app, 'Delete the Template ${t.name}?'], [app, 'Delete the User Process Template'],
  [app, 'Delete the Equipment Profile'], [app, 'Tab items made from it stay on their Tabs'], [app, 'Delete the ${K.title}'],
  [app, 'Save the config file?'], [app, 'Put back the config from'],
  [media, 'items from the Brew Panel computer?'], [media, 'Delete ${name} from the Brew Panel computer?'], [help, 'Delete the page'],
];
for (const [src, words] of big) {
  const at = src.indexOf(words);
  assert.ok(at > 0, `still there: ${words}`);
  const before = src.slice(Math.max(0, at - 500), at);
  const ask = Math.max(before.lastIndexOf('skyConfirm('), before.lastIndexOf('confirm('));
  assert.ok(ask >= 0 && before.slice(ask - 3, ask + 11).includes('skyConfirm('), `asks in the Skynet box: ${words}`);
}
assert.ok(/import \{ skyConfirm \} from '\.\/skyconfirm\.js'/.test(media) && /import \{ skyConfirm \} from '\.\/skyconfirm\.js'/.test(help));
assert.ok(/async function okToSwitch/.test(app) && !/[^t] okToSwitch\(/.test(app.replace(/function okToSwitch|await okToSwitch\(/g, '')), 'every Schema switch waits for the box');

// the Brain Move USB ports page uses the Interface pop-up's USB Port list (entry 29 (e))
const bm = app.slice(app.indexOf('function renderBrainMoveTab'), app.indexOf('function showMoving'));
assert.ok(bm.includes('brainMovePortChoices(now, o, win)') && bm.includes('USB_LOOK') && bm.includes('markPortList(sel)'), 'same list, Look again, red when not here');
assert.ok(bm.includes("await skyConfirm('Move in now?"), 'Move in asks in the Skynet box');
assert.ok(!/\bconfirm\(/.test(bm.replace(/skyConfirm\(/g, '')), 'no browser box on the Move Brain page');

console.log('skyconfirm: ok');
