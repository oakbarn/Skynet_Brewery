// Help tab: pages are Markdown files in a folder; titles, order, new pages, backups and safe names.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Help, titleOf } from '../lib/help.js';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'help-'));
const help = new Help(dir);
assert.deepEqual(help.list(), [], 'empty or missing folder lists nothing');

fs.writeFileSync(path.join(dir, '10-later.md'), '# Later page\nText');
fs.writeFileSync(path.join(dir, '02-tabs.md'), 'intro\n\n# Tabs\n');
fs.writeFileSync(path.join(dir, 'notes.txt'), 'not a page');
assert.deepEqual(help.list().map(p => [p.name, p.title]), [['02-tabs', 'Tabs'], ['10-later', 'Later page']], 'number order, title from first # line');
assert.equal(titleOf('no heading', 'x'), 'x');

const name = help.create('Mash steps & water!');
assert.equal(name, '11-mash-steps-water');
assert.match(help.read(name), /^# Mash steps & water!/);
assert.equal(help.create('Mash steps & water!'), '12-mash-steps-water', 'a second page with the same title gets its own number');

help.write('02-tabs', '# Tabs\nNew text');
assert.equal(help.read('02-tabs'), '# Tabs\nNew text');
assert.equal(fs.readdirSync(path.join(dir, 'backups')).filter(f => f.startsWith('02-tabs_')).length, 1, 'old copy kept on save');

help.remove('10-later');
assert.throws(() => help.read('10-later'), /No help page/);
assert.equal(help.list().length, 3);

for (const bad of ['../server', 'a/b', '', '.hidden', 'x'.repeat(81)]) assert.throws(() => help.read(bad), /letters, numbers/, `refuses "${bad}"`);
assert.throws(() => help.create('  '), /title/);

// the starter manual that ships with the panel
const shipped = new Help(path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'help')).list();
assert.ok(shipped.length >= 10, 'starter manual is there');
for (const p of shipped) assert.notEqual(p.title, p.name, `${p.name} has a # title`);
const names = new Set(shipped.map(p => p.name));
for (const p of shipped) for (const [, link] of p.text.matchAll(/\]\(([\w-]+)\)/g)) assert.ok(names.has(link), `${p.name} links to missing page ${link}`);

fs.rmSync(dir, { recursive: true, force: true });
console.log('help tests passed');
