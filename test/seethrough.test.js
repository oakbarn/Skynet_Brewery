// Rule 7.4 (see-through background): the older BruControl-style pump and motorized ball valve pictures came with a light
// cyan (153,217,234) background baked in, so Pump 1 on the Three Vessel sample showed a cyan box when it was On (Fritz, 2026-11-04).
// Their SVGs must have no cyan background shapes, and the PNGs must be see-through at the corners.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib';

const dir = path.join(import.meta.dirname, '..', 'media', 'Images', 'Skynet');
const files = [...fs.readdirSync(path.join(dir, 'Pumps')).filter(f => /_Rip_(On|Off)\.(svg|png)$/.test(f)).map(f => path.join(dir, 'Pumps', f)),
  ...fs.readdirSync(path.join(dir, 'Valves')).filter(f => /^Motorized_TC15_Ball_Valve_/.test(f)).map(f => path.join(dir, 'Valves', f))];
assert.ok(files.length >= 20, 'found the pictures');
const cyan = (r, g, b) => Math.abs(r - 153) + Math.abs(g - 217) + Math.abs(b - 234) < 30;

// the top-left pixel's alpha of an 8-bit RGBA PNG (filter byte + first pixel of the first row)
function cornerAlpha(file) {
  const buf = fs.readFileSync(file); let i = 8; const idat = []; let ct;
  while (i < buf.length) {
    const len = buf.readUInt32BE(i), type = buf.toString('ascii', i + 4, i + 8), data = buf.subarray(i + 8, i + 8 + len);
    if (type === 'IHDR') ct = data[9];
    if (type === 'IDAT') idat.push(data);
    i += 12 + len;
  }
  assert.equal(ct, 6, `${path.basename(file)} is RGBA`);
  return zlib.inflateSync(Buffer.concat(idat))[4];
}

for (const f of files) {
  if (f.endsWith('.svg')) {
    const bad = [...fs.readFileSync(f, 'utf8').matchAll(/fill="rgb\((\d+),(\d+),(\d+)\)"/g)].filter(m => cyan(+m[1], +m[2], +m[3]));
    assert.equal(bad.length, 0, `${path.basename(f)} has no cyan background shapes`);
  } else assert.equal(cornerAlpha(f), 0, `${path.basename(f)} is see-through at the corner`);
}
console.log('see-through pictures ok');
