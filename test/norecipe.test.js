// No Recipe Found (OakBarn Brewery, 2026-11-25, Rule 16.14): ask_recipe, the Brewer Type, and Save this Recipe dated with the Actual AAU at 0 (Rule 17.21)
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js'; import { Engine, compile, KEYWORDS } from '../lib/engine.js';
import { PROCESS_WORDS } from '../public/names.js';
import { COMMANDS } from '../public/colorize.js';
import { SKYNET_SPECIAL, commandText } from '../public/procinsert.js';
import { datedName, datedCopy, RecipeStore } from '../lib/recipe.js';
import { BREWER_TYPES, brewerTypeOf } from '../public/recipecalc.js';

// the command
assert.ok(compile('ask_recipe').stmts.some(s => s.op === 'askrecipe'), 'ask_recipe is a command');
assert.match(compile('ask_recipe now').errors[0]?.msg ?? '', /takes nothing after it/);
assert.ok(KEYWORDS.has('ask_recipe') && PROCESS_WORDS.has('ask_recipe') && COMMANDS.includes('ask_recipe'), 'a reserved word, colored');
assert.ok(SKYNET_SPECIAL.includes('ask_recipe') && commandText('ask_recipe') === 'ask_recipe', 'Skynet Special, a whole line');
for (const f of ['templates/process/PreBrew/Skynet_PreBrew.txt', 'processes/BrewDay_Flow.txt', 'samples/configs/three-vessel-one-pump/processes/BrewDay_Flow.txt'])
  assert.match(fs.readFileSync(f, 'utf8'), /^ask_recipe$/m, `${f} starts the Brew Day with ask_recipe`);

// the Brewer Type: his four kinds, All Grain unless changed
assert.deepEqual(BREWER_TYPES.map(t => t.name), ['Extract Can Kit', 'Extract Partial Grain and Hops', 'All Grain', 'All Grain (own Grain Mill)']);
assert.equal(brewerTypeOf({}).key, 'allgrain'); assert.equal(brewerTypeOf({ brewerType: 'cankit' }).level, 1);

// Save this Recipe: "Name yyyy:mm:dd", then (2), (3) ... on the same date; a date already on the name is taken off; Actual AAU 0
const day = new Date(2026, 10, 25), have = new Set();
const has = n => have.has(n);
assert.equal(datedName('Pale Ale', has, day), 'Pale Ale 2026:11:25');
have.add('Pale Ale 2026:11:25'); assert.equal(datedName('Pale Ale', has, day), 'Pale Ale 2026:11:25 (2)');
have.add('Pale Ale 2026:11:25 (2)'); assert.equal(datedName('Pale Ale 2026:11:20 (4)', has, day), 'Pale Ale 2026:11:25 (3)');
const d0 = fs.mkdtempSync(path.join(os.tmpdir(), 'skr-')), rs = new RecipeStore(path.join(d0, 'recipes'));
const rc = { name: 'IPA', ingredients: { hops: [{ name: 'Cascade', alpha: 5.5, alphaActual: 6.1, kg: 0.03 }] } };
const c1 = rs.save(datedCopy(rc, rs, day)), c2 = rs.save(datedCopy(rc, rs, day));
assert.equal(c1.name, 'IPA 2026:11:25'); assert.equal(c2.name, 'IPA 2026:11:25 (2)'); assert.notEqual(c1.id, c2.id, 'two saved Recipes');
assert.equal(c1.ingredients.hops[0].alphaActual, 0, 'the saved Actual AAU is 0'); assert.equal(rc.ingredients.hops[0].alphaActual, 6.1, 'the open Recipe keeps it');

// the Process: with no Recipe it waits; a NEW one alone does not end it; a Recipe that comes in does. With one loaded it goes straight on.
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'skr-'));
fs.writeFileSync(path.join(d, 'c.json'), JSON.stringify({ elements: [] }));
const store = new Store(path.join(d, 'c.json'), path.join(d, 'data')); store.load();
const eng = new Engine(store, path.join(d, 'scripts'), { logNow() {} });
fs.mkdirSync(path.join(d, 'scripts'), { recursive: true });
const out = []; let lastAsks = [];
eng.on('print', p => out.push(String(p.text))); eng.on('valves', l => { lastAsks = l; });
fs.writeFileSync(path.join(d, 'scripts', 'pb.txt'), 'ask_recipe\nprint "after"\n');
eng.start('pb');
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(300);
assert.ok(lastAsks.some(a => a.recipe && a.process === 'pb'), 'the No Recipe Found pop-up is asked for');
assert.ok(!out.includes('after'), 'it waits');
store.config.recipe = { name: '' }; await wait(300);
assert.ok(!out.includes('after'), 'a NEW Recipe alone does not end it');
eng.recipeIn(); await wait(300);
assert.ok(out.includes('after'), 'a Recipe saved, opened or imported: it goes on');
assert.ok(!lastAsks.some(a => a.recipe), 'the pop-up is gone');
out.length = 0; eng.start('pb'); await wait(300);
assert.ok(out.includes('after'), 'a Recipe loaded: straight on');
console.log('No Recipe Found tests passed');
process.exit(0);
