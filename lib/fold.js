// BruControl import clean-ups (Fritz, 2026-10-05):
//  1. Alarms get a kind (Hop, Brew Flow, Pre-Hop, General, Sound only) guessed from their names, and Processes
//     say alm_Hops = true / wait alm_Hops == false instead of "alm_Hops" active = true.
//  2. Stacked look-alikes are folded into one: BruControl allows only 3 background pictures per item, so the same
//     message was often built from several copies on top of each other (gblS_Brewery_Top_1, _2, _3).
//     Copies with the same name apart from the number at the end, the same class and kind, on the same tab,
//     at (nearly) the same spot become ONE item with all their pictures. Timers are never folded (Fritz keeps
//     a long mash timer, a short delay timer and a sub-process timer stacked on purpose).
import { renameRefs } from './globals.js';

const ID_RE = /^[A-Za-z_][A-Za-z0-9_.]*$/;
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---------------------------------------------------------------- alarms
export function guessAlarmKind(name) {
  const n = name.toLowerCase();
  if (/music|sound|beep|water_flow|song/.test(n)) return 'sound';
  if (/(hop|moss|aroma)/.test(n) && /(warn|pre|min)/.test(n)) return 'prehop';
  if (/hop|aroma/.test(n)) return 'hop';
  if (/strike|sparge|mash|boil|sanitize|transfer|whirlpool|chill|ferment/.test(n)) return 'brewflow';
  return 'general';
}

// "alm_Hops" active = true  ->  alm_Hops = true    (and in conditions: wait "alm_Hops" active == false -> wait alm_Hops == false)
export function rewriteAlarmLines(text, names) {
  let count = 0;
  for (const n of names) {
    if (!ID_RE.test(n)) continue;             // a name with spaces keeps "name" active
    const re = new RegExp(`"${esc(n)}"\\s+(?:active|state)\\b`, 'gi');
    text = text.replace(re, () => { count++; return n; });
  }
  return { text, count };
}

export function importAlarms(elements, scripts) {
  const alarms = elements.filter(e => e.type === 'alarm');
  const kinds = {};
  for (const a of alarms) { a.kind ??= guessAlarmKind(a.name); (kinds[a.kind] ??= []).push(a.name); }
  const names = alarms.map(a => a.name).sort((a, b) => b.length - a.length);
  let lines = 0;
  const out = scripts.map(s => {
    const r = rewriteAlarmLines(s.text, names);
    lines += r.count;
    return r.count ? { ...s, text: r.text } : s;
  });
  return { scripts: out, report: { kinds, lines } };
}

// ---------------------------------------------------------------- stacked items
const FOLD_TYPES = ['vKonstant', 'vAPI'];
const NEAR = 40;          // px: "the same spot"
const baseOf = n => n.replace(/_?\d+$/, '');
// Lines that end a straight run of a Process: a label, if / else / endif, goto, wait, sleep, start / stop
const BREAK_RE = /^\s*(\[|(if|elseif|else|endif|goto|wait|sleep|start|stop)\b)/i;

export function foldStacked(cfg, scripts) {
  const elements = cfg.elements;
  const taken = new Set(elements.map(e => e.name));
  const groups = new Map();
  for (const e of elements) {
    if (!FOLD_TYPES.includes(e.type) || !/\d$/.test(e.name)) continue;
    const key = [e.workspace, e.type, e.kind, baseOf(e.name)].join('|');
    (groups.get(key) ?? groups.set(key, []).get(key)).push(e);
  }
  const folds = [];
  for (const list of groups.values()) {
    const first = list[0];
    const members = list.filter(e => Math.abs(e.x - first.x) <= NEAR && Math.abs(e.y - first.y) <= NEAR);
    if (members.length < 2) continue;
    members.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    const base = baseOf(first.name);
    const into = base && !taken.has(base) ? base : members[0].name;
    taken.add(into);
    folds.push({ into, members });
  }
  if (!folds.length) return { cfg, scripts, report: [] };

  const rename = new Map(), report = [], gone = new Set();
  for (const f of folds) {
    const lead = f.members.find(m => m.visibility !== 'hidden') ?? f.members[0];
    const anyImages = f.members.some(m => m.images?.some(Boolean));
    const offsets = new Map();
    const images = [];
    for (const m of f.members) {
      offsets.set(m.name, images.length);
      const own = m.images ?? [];
      for (let i = 0; i < Math.max(3, own.length); i++) images.push(own[i] ?? '');
    }
    const x = Math.min(...f.members.map(m => m.x)), y = Math.min(...f.members.map(m => m.y));
    const el = {
      ...structuredClone(lead), name: f.into, x, y,
      w: Math.max(...f.members.map(m => m.x + m.w)) - x, h: Math.max(...f.members.map(m => m.y + m.h)) - y,
      visibility: f.members.some(m => m.visibility !== 'hidden') ? 'visible' : 'hidden',
    };
    if (anyImages) { el.images = images; el.background = offsets.get(lead.name) + (+lead.background || 1); }
    el.bru = { ...(lead.bru ?? {}) };
    f.el = el; f.offsets = anyImages ? offsets : null;
    for (const m of f.members) { rename.set(m.name, f.into); gone.add(m); }
    report.push({ into: f.into, from: f.members.map(m => m.name), pictures: anyImages ? images.length : 0, lines: 0, hidesDropped: 0 });
  }
  // the folded item takes the place of its first copy
  const outEls = [];
  for (const e of elements) {
    const f = folds.find(f => f.members[0] === e);
    if (f) outEls.push(f.el);
    else if (!gone.has(e)) outEls.push(e);
  }
  renameRefs(outEls, rename);
  // which copy became which pictures (after the rename, so these old names stay as they were)
  for (const f of folds) f.el.bru.foldedFrom = f.members.map(m => ({ name: m.name, firstPicture: (f.offsets?.get(m.name) ?? 0) + 1 }));
  const graphics = renameRefs(structuredClone(cfg.graphics ?? []), rename);

  const outScripts = scripts.map(s => {
    let changed = false;
    const lines = s.text.split('\n');
    // runs of lines between breaks: inside one run, "hide copy 1, show copy 2" becomes just "show"
    let start = 0;
    const runs = [];
    lines.forEach((l, i) => { if (BREAK_RE.test(l)) { runs.push([start, i]); start = i + 1; } });
    runs.push([start, lines.length]);
    for (const f of folds) {
      const names = f.members.map(m => esc(m.name)).sort((a, b) => b.length - a.length).join('|');
      const any = new RegExp(`"(${names})"`, 'g');
      const vis = new RegExp(`^\\s*"(${names})"\\s+visibility\\s*=\\s*(\\w+)`, 'i');
      const bg = new RegExp(`^(\\s*)"(${names})"(\\s+)background(\\s*)=\\s*(.+?)\\s*$`, 'i');
      const rep = report.find(r => r.into === f.into);
      for (const [a, b] of runs) {
        let shows = false;
        for (let i = a; i < b; i++) { const m = vis.exec(lines[i]); if (m && /^visible$/i.test(m[2]) && !lines[i].trim().startsWith('//')) shows = true; }
        for (let i = a; i < b; i++) {
          const line = lines[i];
          if (!any.test(line)) continue;
          any.lastIndex = 0;
          let nl;
          const v = vis.exec(line), g = bg.exec(line);
          if (shows && v && /^hidden/i.test(v[2])) { nl = line.replace(/^(\s*)/, `$1// folded into "${f.into}": `); rep.hidesDropped++; }
          else if (g && f.offsets) {
            const off = f.offsets.get(f.members.find(m => m.name === g[2]).name);
            const rhs = g[5].replace(/\s*\/\/.*$/, '');
            const val = /^\d+$/.test(rhs) ? String(+rhs + off) : off ? `(${rhs}) + ${off}` : rhs;
            nl = `${g[1]}"${f.into}"${g[3]}background${g[4]}= ${val}`;
          } else nl = line.replace(any, `"${f.into}"`);
          if (nl !== line) { lines[i] = nl; changed = true; rep.lines++; }
        }
      }
    }
    return changed ? { ...s, text: lines.join('\n') } : s;
  });
  return { cfg: { ...cfg, elements: outEls, graphics }, scripts: outScripts, report };
}

// Same-spot items that were NOT folded (different names): listed so they can be sorted by hand
export function stackedLeft(elements) {
  const out = [], seen = new Set();
  const vars = elements.filter(e => FOLD_TYPES.includes(e.type));
  for (const a of vars) {
    if (seen.has(a)) continue;
    const grp = vars.filter(b => b.workspace === a.workspace && b.type === a.type && b.kind === a.kind && Math.abs(b.x - a.x) <= NEAR && Math.abs(b.y - a.y) <= NEAR);
    grp.forEach(g => seen.add(g));
    if (grp.length > 1) out.push(grp.map(g => g.name));
  }
  return out;
}

export function foldLines(fold, alarms, left = []) {
  const lines = [];
  for (const r of fold) lines.push(`Folded ${r.from.join(', ')} into one "${r.into}"${r.pictures ? ` with all ${r.pictures} background pictures` : ''} (${r.lines} process lines changed, ${r.hidesDropped} "hide the other copy" lines no longer needed)`);
  for (const g of left) lines.push(`Still stacked at one spot (names differ, so not folded): ${g.join(', ')}`);
  const K = { hop: 'Hop', brewflow: 'Brew Flow', prehop: 'Pre-Hop', general: 'General', sound: 'Sound only' };
  if (alarms) {
    const parts = Object.entries(alarms.kinds).map(([k, v]) => `${K[k] ?? k}: ${v.join(', ')}`);
    if (parts.length) lines.push(`Alarm kinds guessed from their names (change any on the alarm's settings): ${parts.join('; ')}`);
    if (alarms.lines) lines.push(`${alarms.lines} process lines now say alm_Name = true / false instead of "alm_Name" active = true / false`);
  }
  return lines;
}
