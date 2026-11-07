// PNG/JPG -> SVG pictures:  node test/vectorize.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { traceFile, Pictures, DRAWING_SCORE } from '../lib/vectorize.js';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpv'));
fs.copyFileSync(path.join(ROOT, 'media/Images/Skynet/Alarms/AlarmBitter.png'), path.join(d, 'Bell.png'));
fs.copyFileSync(path.join(ROOT, 'media/Images/Skynet/Other_Equipment/Burner No Flame.png'), path.join(d, 'Burner.png'));
fs.writeFileSync(path.join(d, 'Mine.png'), fs.readFileSync(path.join(d, 'Bell.png')));
fs.writeFileSync(path.join(d, 'Mine.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"/>');   // hand-made

const bell = traceFile(path.join(d, 'Bell.png'));
assert.ok(bell.score >= DRAWING_SCORE, 'bell is a drawing');
assert.match(bell.svg, /^<svg [^>]*width="600" height="600" viewBox="0 0 600 600" preserveAspectRatio="none"/);
assert.ok(traceFile(path.join(d, 'Burner.png')).score < DRAWING_SCORE, 'burner is photo-like');
assert.match(traceFile(path.join(ROOT, 'media/Images/Skynet/Miscellaneous/brewery_main.png')).skipped, /too big/);

const store = { config: {}, writeConfig() {} };
const pics = new Pictures(store, () => [d]);
await new Promise(res => { pics.on('changed', res); pics.convertAll(false); });
const bellPng = path.join(d, 'Bell.png'), burnerPng = path.join(d, 'Burner.png');
assert.ok(fs.existsSync(path.join(d, 'Bell.svg')) && fs.existsSync(path.join(d, 'Burner.svg')));
assert.equal(fs.readFileSync(path.join(d, 'Mine.svg'), 'utf8').length < 80, true, 'hand-made SVG never overwritten');
assert.equal(pics.pick(bellPng), path.join(d, 'Bell.svg'), 'auto: drawing uses SVG');
assert.equal(pics.pick(burnerPng), burnerPng, 'auto: photo keeps original');
assert.equal(pics.pick(path.join(d, 'Mine.png')), path.join(d, 'Mine.svg'), 'hand-made SVG is used');
pics.setChoice('Burner.png', 'svg'); assert.equal(pics.pick(burnerPng), path.join(d, 'Burner.svg'));
pics.setChoice('Burner.png', 'auto'); assert.equal(store.config.svgChoices, undefined);
pics.setMode('all'); assert.equal(pics.pick(burnerPng), path.join(d, 'Burner.svg'));
pics.setMode('off'); assert.equal(pics.pick(bellPng), bellPng);
assert.equal(pics.pick(bellPng, 'svg'), path.join(d, 'Bell.svg'));
pics.stop();

// A picture in another media folder (like C:\BruControl\Media): its SVG copy goes with the Brain, in the hidden media/.svg folder
const brain = fs.mkdtempSync(path.join(os.tmpdir(), 'bpvb')), bru = fs.mkdtempSync(path.join(os.tmpdir(), 'bpvo'));
fs.mkdirSync(path.join(bru, 'Pumps')); fs.copyFileSync(path.join(d, 'Bell.png'), path.join(bru, 'Pumps', 'Bell.png'));
fs.copyFileSync(path.join(d, 'Bell.png'), path.join(bru, 'Mine.png')); fs.copyFileSync(path.join(d, 'Mine.svg'), path.join(bru, 'Mine.svg'));
const two = new Pictures({ config: {}, writeConfig() {} }, () => [brain, bru]);
await new Promise(res => { two.on('changed', res); two.convertAll(false); });
const outside = path.join(bru, 'Pumps', 'Bell.png'), copy = two.svgPath(outside);
assert.ok(copy.startsWith(path.join(brain, '.svg') + path.sep) && copy.endsWith(path.join('Pumps', 'Bell.svg')), 'copy is with the Brain: ' + copy);
assert.ok(fs.existsSync(copy), 'copy was made with the Brain');
assert.equal(fs.existsSync(path.join(bru, 'Pumps', 'Bell.svg')), false, 'nothing written into the other folder');
assert.equal(two.pick(outside), copy, 'the Brain copy is shown');
assert.equal(two.svgPath(path.join(bru, 'Mine.png')), path.join(bru, 'Mine.svg'), 'a hand-made SVG next to it is still used');
assert.ok(two.status().pictures.find(p => p.path === 'Pumps/Bell.png').svg.startsWith('.svg/'));
two.forget(outside); assert.equal(fs.existsSync(copy), false, 'copy removed when the picture goes');
two.stop();
console.log('vectorize tests passed');
