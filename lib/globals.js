// Retiring the old Global class (Fritz, 2026-10-04). Every Global moves to a newer class by its name:
// Every Global that is kept becomes a gGlobal of the same kind (Fritz, 2026-10-30: one class, so the import is simple) and keeps
// its database setting as .database:
//   gbl...   -> gGlobal, same name (the names still match BruControl for now), .API Off
//   RP_...   -> gGlobal renamed RP_ -> gG_ in the configuration and in every script, .API Get and Put
//   x...     -> deleted (scripts and items still using one are listed with line numbers)
//   glb...   -> a typo for gbl: renamed glb -> gbl, then like the rest of gbl
//   DX_gblV_... -> gGlobal renamed DX_gblV_ -> gG_, .API Get and Put
//   insp_... -> deleted like x (Fritz: an inspector by mistake, not wanted)
//   anything else -> gGlobal with the same name and .API Get and Put (as a Global was), listed so it can be sorted later
// Used by the BruControl importer, and once at start-up for a configuration that still has Globals.
import fs from 'node:fs';
import path from 'node:path';
import { fileStamp } from './filedate.js';
import { toDatabase } from './gstandard.js';

const KINDS = ['value', 'string', 'time', 'datetime', 'bool'];       // a Global's data type = the gGlobal kind
const NAME_CHAR = 'A-Za-z0-9_';
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wordRe = name => new RegExp(`(?<![${NAME_CHAR}])${escRe(name)}(?![${NAME_CHAR}])`);
const RP_RE = new RegExp(`(?<![${NAME_CHAR}])RP_`, 'g');

const RULES = [['gbl', 'gbl'], ['RP_', 'RP_'], ['x', 'x'], ['glb', 'glb'], ['DX_gblV_', 'DX'], ['insp_', 'insp']];
export const ruleFor = name => RULES.find(([p]) => name.startsWith(p))?.[1] ?? 'other';
// new name for the renamed ones
const NEW_NAME = { RP_: n => 'gG_' + n.slice(3), glb: n => 'gbl' + n.slice(3), DX: n => 'gG_' + n.slice(8) };
export const hasGlobals = elements => (elements ?? []).some(e => e.type === 'global');

// Replaces every string in obj (deep) that is exactly an old name
export function renameRefs(obj, map) {
  if (Array.isArray(obj)) return obj.map(v => renameRefs(v, map));
  if (obj && typeof obj === 'object') { for (const k of Object.keys(obj)) obj[k] = renameRefs(obj[k], map); return obj; }
  return typeof obj === 'string' && map.has(obj) ? map.get(obj) : obj;
}
// Paths ("elements > Pump_1 > follow") of every string that is exactly one of the names
function findRefs(obj, names, where, out) {
  if (Array.isArray(obj)) obj.forEach((v, i) => findRefs(v, names, `${where} > ${obj[i]?.name ?? i + 1}`, out));
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) findRefs(v, names, `${where} > ${k}`, out);
  else if (typeof obj === 'string' && names.has(obj)) out.push({ name: obj, where });
  return out;
}

// cfg: { elements, graphics, beerxml }   scripts: [{ name, text }]
// Returns a new cfg and scripts (the inputs are not changed) and a report.
export function retireGlobals(cfg, scripts = []) {
  const report = { gGlobal: [], api: [], renamed: [], deleted: [], other: [], notRenamed: [], scriptsChanged: [], brokenScripts: [], brokenItems: [] };
  const out = JSON.parse(JSON.stringify({ elements: cfg.elements ?? [], graphics: cfg.graphics ?? [], beerxml: cfg.beerxml ?? null }));
  const taken = new Set(out.elements.map(e => e.name));
  const rename = new Map(), deleted = new Set();
  const elements = [];
  for (const el of out.elements) {
    if (el.type !== 'global') { elements.push(el); continue; }
    const rule = ruleFor(el.name);
    if (rule === 'x' || rule === 'insp') { deleted.add(el.name); report.deleted.push(el.name); continue; }
    if (NEW_NAME[rule]) {
      const to = NEW_NAME[rule](el.name);
      if (taken.has(to)) report.notRenamed.push({ name: el.name, to });
      else { rename.set(el.name, to); taken.add(to); report.renamed.push({ from: el.name, to, rule }); el.name = to; }
    }
    const kind = KINDS.includes(el.dataType) ? el.dataType : 'value';
    delete el.dataType;
    el.kind = kind;
    el.type = 'gGlobal';
    if ('log' in el) { const d = toDatabase(el.log); delete el.log; if (d) el.database = d; }
    if (rule !== 'gbl' && rule !== 'glb') {          // reached from outside programs, as a Global was
      el.api = 'getput';
      if (rule === 'other') report.other.push(el.name);
      report.api.push(el.name);
    }
    report.gGlobal.push(el.name);
    elements.push(el);
  }
  out.elements = elements;
  // renamed names in every setting that points to them (follow, input, tap target, pipes, BeerXML mapping, logging ...)
  if (rename.size) {
    renameRefs(out.elements, rename); renameRefs(out.graphics, rename);
    // the BeerXML mapping also has name patterns like "RP_v_Hop{n}_Oz"
    if (out.beerxml) out.beerxml = renameRefs(JSON.parse(JSON.stringify(out.beerxml).replace(/"RP_/g, '"gG_')), rename);
  }
  if (deleted.size) {
    findRefs(out.elements, deleted, 'elements', report.brokenItems);
    findRefs(out.graphics, deleted, 'pictures and pipes', report.brokenItems);
    if (out.beerxml) findRefs(out.beerxml, deleted, 'BeerXML mapping', report.brokenItems);
  }
  // scripts: RP_ -> gG_ everywhere, the glb and DX_gblV_ names renamed, and a list of every line that still uses a deleted Global
  const delRes = [...deleted].map(n => [n, wordRe(n)]);
  const nameRes = report.renamed.filter(r => r.rule !== 'RP_').map(r => [new RegExp(wordRe(r.from).source, 'g'), r.to]);
  const newScripts = scripts.map(s => {
    let text = s.text.replace(RP_RE, 'gG_');
    for (const [re, to] of nameRes) text = text.replace(re, to);
    if (text !== s.text) report.scriptsChanged.push(s.name);
    if (delRes.length) text.split(/\r?\n/).forEach((line, i) => {
      for (const [n, re] of delRes) if (re.test(line)) report.brokenScripts.push({ script: s.name, line: i + 1, name: n, text: line.trim() });
    });
    return text === s.text ? s : { ...s, text };
  });
  return { cfg: out, scripts: newScripts, report };
}

// Plain-English lines for the importer warnings and the start-up note
export function reportLines(r) {
  const lines = [];
  const n = r.gGlobal.length + r.deleted.length;
  if (!n) return lines;
  const by = rule => r.renamed.filter(x => x.rule === rule);
  lines.push(`Globals retired: ${r.gGlobal.length} → gGlobal (${by('RP_').length} RP_ renamed gG_, ${r.api.length} with .API Get and Put), ${r.deleted.length} deleted (x and insp_)`);
  for (const x of by('glb')) lines.push(`Typo fixed: "${x.from}" → "${x.to}" (gGlobal)`);
  for (const x of by('DX')) lines.push(`"${x.from}" → "${x.to}" (gGlobal)`);
  if (r.scriptsChanged.length) lines.push(`Names changed in ${r.scriptsChanged.length} process(es): ${r.scriptsChanged.join(', ')}`);
  if (r.other.length) lines.push(`These Globals fit none of the rules, so they are gGlobals with the same name and .API Get and Put until you decide: ${r.other.join(', ')}`);
  for (const x of r.notRenamed) lines.push(`"${x.name}" was not renamed: "${x.to}" already exists`);
  for (const b of r.brokenScripts) lines.push(`Process "${b.script}" line ${b.line} uses deleted "${b.name}": ${b.text}`);
  for (const b of r.brokenItems) lines.push(`${b.where} uses deleted "${b.name}"`);
  return lines;
}

// Start-up: a saved configuration that still has Globals is converted once. The old config and every changed
// script are backed up first, saved values follow the RP_ -> gG_ renames, and the report goes to data/globals-retired.txt.
export function retireGlobalsOnDisk({ configPath, scriptsDir, dataDir }) {
  const c = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!hasGlobals(c.elements)) return null;
  const stamp = fileStamp();
  const bdir = path.join(path.dirname(configPath), 'backups');
  fs.mkdirSync(bdir, { recursive: true });
  fs.writeFileSync(path.join(bdir, `brewery-before-globals-${stamp}.json`), JSON.stringify(c, null, 2));
  const files = fs.existsSync(scriptsDir) ? fs.readdirSync(scriptsDir).filter(f => f.endsWith('.txt')) : [];
  const scripts = files.map(f => ({ name: f.slice(0, -4), text: fs.readFileSync(path.join(scriptsDir, f), 'utf8') }));
  const { cfg, scripts: out, report } = retireGlobals(c, scripts);
  c.elements = cfg.elements; c.graphics = cfg.graphics; if (cfg.beerxml) c.beerxml = cfg.beerxml;
  out.forEach((s, i) => {
    if (s === scripts[i]) return;
    const f = path.join(scriptsDir, s.name + '.txt');
    fs.copyFileSync(f, f + '.before-globals.bak');
    fs.writeFileSync(f, s.text);
  });
  fs.writeFileSync(configPath, JSON.stringify(c, null, 2));
  const state = path.join(dataDir, 'state.json');
  if (report.renamed.length && fs.existsSync(state)) {
    try {
      const v = JSON.parse(fs.readFileSync(state, 'utf8'));
      for (const { from, to } of report.renamed) if (from in v) { v[to] = v[from]; delete v[from]; }
      fs.writeFileSync(state, JSON.stringify(v));
    } catch { /* values start fresh */ }
  }
  const lines = reportLines(report);
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'globals-retired.txt'), lines.join('\n') + '\n');
  return { report, lines };
}
