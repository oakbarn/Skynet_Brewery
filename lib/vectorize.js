// Pictures to SVG: makes a traced SVG copy of each PNG / JPG in the media folders, so pictures stay sharp at any size.
// The original file is never changed (BruControl still needs it). The copy sits next to it: Pump_On.png -> Pump_On.svg
// Tracing runs in a background worker so scripts and devices never wait for it.
import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { Worker } from 'node:worker_threads';

const require = createRequire(import.meta.url);
const IMG = /\.(png|jpe?g)$/i;
const MARK = 'data-brewpanel-traced';
export const MAX_PIXELS = 2_000_000;          // bigger pictures (photos, backgrounds) are left as they are
export const DRAWING_SCORE = 0.93;            // "auto" uses the SVG only for drawing-like pictures (few flat colours)
export const MODES = ['auto', 'all', 'off'];  // auto: drawings only, all: every picture that has an SVG, off: originals only

const TRACE = { numberofcolors: 24, colorquantcycles: 3, colorsampling: 2, ltres: 1, qtres: 1, pathomit: 8, roundcoords: 1, blurradius: 0, strokewidth: 1, viewbox: true };

export function decode(file) {
  const buf = fs.readFileSync(file);
  if (/\.png$/i.test(file)) { const p = require('./vendor/pngjs/png.js').PNG.sync.read(buf); return { width: p.width, height: p.height, data: p.data }; }
  const j = require('./vendor/jpeg-decoder.js')(buf, { useTArray: true, formatAsRGBA: true, maxMemoryUsageInMB: 256 });
  return { width: j.width, height: j.height, data: j.data };
}

// Share of the visible pixels covered by the 16 most used colours: near 1 for drawings and icons, lower for photos.
export function drawingScore({ width, height, data }) {
  const count = new Map(); let seen = 0;
  for (let i = 0; i < width * height * 4; i += 4) {
    if (data[i + 3] < 128) continue;
    seen++; const k = (data[i] >> 3) << 10 | (data[i + 1] >> 3) << 5 | data[i + 2] >> 3;
    count.set(k, (count.get(k) ?? 0) + 1);
  }
  if (!seen) return 1;
  return [...count.values()].sort((a, b) => b - a).slice(0, 16).reduce((a, b) => a + b, 0) / seen;
}

// Returns the SVG text for one picture (used by the worker; also handy in tests).
export function traceFile(file) {
  const img = decode(file);
  if (img.width * img.height > MAX_PIXELS) return { skipped: `too big to trace (${img.width} x ${img.height})` };
  const score = drawingScore(img);
  const body = require('./vendor/imagetracer.js').imagedataToSVG(img, TRACE).replace(/^<svg[^>]*>/, '');
  const { width: w, height: h } = img;
  const head = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" ${MARK}="${path.basename(file).replace(/[&"<>]/g, '')}" data-score="${score.toFixed(3)}">` +
    `<!-- Made by Brew Panel from ${path.basename(file).replace(/--/g, '-')}. The original is unchanged. Delete this file and it is made again. -->`;
  return { svg: head + body, score };
}

// Name of the picture an SVG was traced from, or null for any other file.
export const tracedFrom = svgFile => { const m = readMark(svgFile); return m && !m.handMade ? m.source : null; };

function readMark(svgFile) {
  try {
    const fd = fs.openSync(svgFile, 'r'); const b = Buffer.alloc(800); fs.readSync(fd, b, 0, 800, 0); fs.closeSync(fd);
    const t = b.toString('utf8'); if (!t.includes(MARK)) return { handMade: true };
    return { source: new RegExp(MARK + '="([^"]*)"').exec(t)?.[1], score: Number(/data-score="([\d.]+)"/.exec(t)?.[1] ?? NaN) };
  } catch { return null; }
}

export class Pictures extends EventEmitter {
  constructor(store, roots) {
    super();
    this.store = store; this.roots = roots;     // roots(): absolute media folders
    this.queue = []; this.queued = new Set(); this.busy = null; this.worker = null;
    this.problems = new Map();                  // file -> why it has no SVG
    this.watchers = [];
  }
  get mode() { return MODES.includes(this.store.config.svgPictures) ? this.store.config.svgPictures : 'auto'; }
  rel(file) {
    for (const r of this.roots()) if (file.startsWith(r + path.sep)) return path.relative(r, file).split(path.sep).join('/');
    return file;
  }
  choice(file) { return this.store.config.svgChoices?.[this.rel(file)] ?? 'auto'; }

  // Where the SVG copy of a picture lives (null if a different picture already owns that name).
  svgPath(file) {
    const plain = file.replace(IMG, '.svg');
    const m = fs.existsSync(plain) ? readMark(plain) : null;
    if (!m || m.handMade || m.source === path.basename(file)) return plain;
    return file + '.svg';
  }
  info(file) {
    const svg = this.svgPath(file), m = fs.existsSync(svg) ? readMark(svg) : null;
    const fresh = m && (m.handMade || fs.statSync(svg).mtimeMs >= fs.statSync(file).mtimeMs);
    return { svg, exists: !!m, handMade: !!m?.handMade, score: m?.score, fresh: !!fresh };
  }

  // The file to send to the browser for a picture request.
  pick(file, want) {
    if (!IMG.test(file) || !fs.existsSync(file)) return file;
    if (want === 'original') return file;
    const i = this.info(file);
    if (this.mode !== 'off' && !i.fresh && !i.handMade && !this.problems.has(file)) this.add(file);
    if (!i.exists) return file;
    if (want === 'svg') return i.svg;
    return this.usesSvg(file, i) ? i.svg : file;
  }
  usesSvg(file, i = this.info(file)) {
    if (!i.exists || this.mode === 'off') return false;
    const c = this.choice(file);
    if (c !== 'auto') return c === 'svg';
    return i.handMade || this.mode === 'all' || (i.score ?? 0) >= DRAWING_SCORE;
  }

  // ---- conversion queue (one worker, one picture at a time) ----
  add(file, force) {
    if (!IMG.test(file) || this.queued.has(file) || this.busy === file) return;
    const i = this.info(file);
    if (i.handMade || (!force && i.exists && i.fresh)) return;     // never overwrite an SVG someone made by hand
    this.problems.delete(file); this.queued.add(file); this.queue.push(file); this.next();
  }
  next() {
    if (this.busy || !this.queue.length) return;
    const file = this.queue.shift(); this.queued.delete(file); this.busy = file;
    if (!this.worker) {
      this.worker = new Worker(new URL('./vectorize-worker.js', import.meta.url));
      this.worker.unref();
      this.worker.on('message', r => this.done(r));
      this.worker.on('error', e => { const f = this.busy; this.worker = null; this.done({ file: f, error: e.message }); });
    }
    this.worker.postMessage({ file, out: this.svgPath(file) });
  }
  done({ file, error, skipped }) {
    if (error || skipped) this.problems.set(file, skipped ?? 'could not trace: ' + error);
    this.busy = null;
    clearTimeout(this._t); this._t = setTimeout(() => this.emit('changed'), 1500);   // one refresh per batch
    this.next();
  }

  // ---- folders ----
  list() {
    const out = [], walk = (dir, depth) => {
      let ents = []; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const e of ents) {
        if (e.name.startsWith('.') || e.name === 'node_modules') continue;
        const f = path.join(dir, e.name);
        if (e.isDirectory() && depth < 6) walk(f, depth + 1); else if (e.isFile() && IMG.test(e.name)) out.push(f);
      }
    };
    for (const r of this.roots()) walk(r, 0);
    return out;
  }
  // A picture was renamed or deleted: remove the SVG copy made from it (never a hand-made one).
  forget(file) {
    if (!IMG.test(file)) return;
    for (const svg of [file.replace(IMG, '.svg'), file + '.svg']) {
      const m = fs.existsSync(svg) ? readMark(svg) : null;
      if (m && !m.handMade && m.source === path.basename(file)) fs.rmSync(svg, { force: true });
    }
  }
  convertAll(force) { const all = this.list(); for (const f of all) this.add(f, force); return all.length; }
  status() {
    return {
      mode: this.mode, modes: MODES, drawingScore: DRAWING_SCORE, working: this.busy ? this.rel(this.busy) : null, waiting: this.queue.length,
      pictures: this.list().map(f => {
        const i = this.info(f);
        return { path: this.rel(f), svg: i.exists ? this.rel(i.svg) : null, handMade: i.handMade, score: i.score ?? null, fresh: i.fresh,
          choice: this.choice(f), usingSvg: this.usesSvg(f, i), problem: this.problems.get(f) ?? null, waiting: this.queued.has(f) || this.busy === f };
      }),
    };
  }
  setChoice(rel, choice) {
    const c = this.store.config, all = (c.svgChoices ??= {});
    if (choice === 'auto') delete all[rel]; else all[rel] = choice === 'svg' ? 'svg' : 'original';
    if (!Object.keys(all).length) delete c.svgChoices;
    this.store.writeConfig();
  }
  setMode(mode) { if (!MODES.includes(mode)) throw new Error('Mode must be one of ' + MODES.join(', ')); this.store.config.svgPictures = mode; this.store.writeConfig(); }

  // Convert anything missing at start, then watch the media folders for new or changed pictures.
  start() {
    if (this.mode !== 'off') this.convertAll(false);
    this.watch();
  }
  watch() {
    for (const w of this.watchers) w.close();
    this.watchers = [];
    const seen = new Map();
    for (const r of this.roots()) {
      try {
        this.watchers.push(fs.watch(r, { recursive: true }, (ev, name) => {
          if (!name || !IMG.test(name) || name.split(/[\\/]/).some(p => p.startsWith('.'))) return;
          const f = path.join(r, name);
          clearTimeout(seen.get(f)); seen.set(f, setTimeout(() => {    // wait until the copy has finished
            seen.delete(f); if (this.mode !== 'off' && fs.existsSync(f)) this.add(f);
          }, 1500));
        }));
      } catch { /* folder missing or watching not supported: pictures are still converted when first shown */ }
    }
  }
  stop() { for (const w of this.watchers) w.close(); this.worker?.terminate(); }
}
