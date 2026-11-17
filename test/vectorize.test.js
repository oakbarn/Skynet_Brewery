// PNG/JPG -> SVG pictures:  node test/vectorize.test.js
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import assert from 'node:assert/strict';
import { traceFile, Pictures, DRAWING_SCORE } from '../lib/vectorize.js';
import { createRequire } from 'node:module';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bpv'));
fs.copyFileSync(path.join(ROOT, 'media/Images/Skynet/Alarms/AlarmBitter.png'), path.join(d, 'Bell.png'));
// photo-like and too-big test pictures are made here (the old burner photo and brewery_main.png left the repo, copyright, 2026-11-17)
const { PNG } = createRequire(import.meta.url)('../lib/vendor/pngjs/png.js');
function makePng(file, w, h, px) {
  const p = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4, [r, g, b] = px(x, y); p.data[i] = r; p.data[i + 1] = g; p.data[i + 2] = b; p.data[i + 3] = 255; }
  fs.writeFileSync(file, PNG.sync.write(p));
}
let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
makePng(path.join(d, 'Burner.png'), 400, 400, (x, y) => [x * 0.5 + rnd() * 90, y * 0.4 + rnd() * 90, (x + y) * 0.25 + rnd() * 90]);   // photo-like: soft shading and grain
const bigPng = path.join(os.tmpdir(), `bpv_big_${process.pid}.png`); makePng(bigPng, 1500, 1400, x => [x % 256, 128, 64]);
fs.writeFileSync(path.join(d, 'Mine.png'), fs.readFileSync(path.join(d, 'Bell.png')));
fs.writeFileSync(path.join(d, 'Mine.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"/>');   // hand-made

const bell = traceFile(path.join(d, 'Bell.png'));
assert.ok(bell.score >= DRAWING_SCORE, 'bell is a drawing');
assert.match(bell.svg, /^<svg [^>]*width="600" height="600" viewBox="0 0 600 600" preserveAspectRatio="none"/);
assert.ok(traceFile(path.join(d, 'Burner.png')).score < DRAWING_SCORE, 'burner is photo-like');
assert.match(traceFile(bigPng).skipped, /too big/); fs.rmSync(bigPng, { force: true });

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

// Rule 7.25: Help pictures are never swapped for a traced copy (it smears their words); a hand-made SVG still wins
{
  const h = fs.mkdtempSync(path.join(os.tmpdir(), 'bpvh')), hp = path.join(h, 'help_pictures'); fs.mkdirSync(hp);
  fs.copyFileSync(path.join(ROOT, 'media/Images/Skynet/Alarms/AlarmBitter.png'), path.join(hp, 'Shot.png'));
  fs.writeFileSync(path.join(hp, 'Shot.svg'), traceFile(path.join(hp, 'Shot.png')).svg);          // an old traced copy left on a Brain
  const hs = new Pictures({ config: {}, writeConfig() {} }, () => [h]);
  assert.equal(hs.pick(path.join(hp, 'Shot.png')), path.join(hp, 'Shot.png'), 'Help picture: the picture itself, not the traced copy');
  hs.setMode('all'); assert.equal(hs.pick(path.join(hp, 'Shot.png')), path.join(hp, 'Shot.png'), 'not even with All');
  fs.writeFileSync(path.join(hp, 'Shot.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"/>');
  assert.equal(hs.pick(path.join(hp, 'Shot.png')), path.join(hp, 'Shot.svg'), 'a hand-made SVG is used');
  hs.stop();
  for (const f of ['Pump_8_IPs', 'Pump_Right_Left', 'Red_Pump_Label', 'Label_Visible_Switch', 'IP_Marker', 'Pump_IP_Example_1', 'Pump_IP_Example_2']) {
    const t = fs.readFileSync(path.join(ROOT, 'media/help_pictures', f + '.svg'), 'utf8');
    assert.ok(!t.includes('data-brewpanel-traced') && /<text/.test(t), f + '.svg is hand-made with real words');
  }
}
