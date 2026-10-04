// Retiring the old Global class (Fritz, 2026-10-04). Every Global moves to a newer class by its name:
//   gbl...   -> vKonstant of the same kind, same name (the names still match BruControl for now)
//   RP_...   -> vAPI of the same kind, renamed RP_ -> vA_ in the configuration and in every script
//   x...     -> deleted (scripts and items still using one are listed with line numbers)
//   glb...   -> a typo for gbl: renamed glb -> gbl, then a vKonstant like the rest
//   DX_gblV_... -> vAPI, renamed DX_gblV_ -> vA_
//   insp_... -> was meant to be an inspector: a picture element (its pictures and background are kept)
//   anything else -> vAPI with the same name (a vAPI works exactly like a Global did), listed so it can be sorted later
// Used by the BruControl importer, and once at start-up for a configuration that still has Globals.
import fs from 'node:fs';
import path from 'node:path';

const KINDS = ['value', 'string', 'time', 'datetime', 'bool'];       // a Global's data type = the kind in both new classes
const NAME_CHAR = 'A-Za-z0-9_';
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wordRe = name => new RegExp(`(?<![${NAME_CHAR}])${escRe(name)}(?![${NAME_CHAR}])`);
const RP_RE = new RegExp(`(?<![${NAME_CHAR}])RP_`, 'g');

const RULES = [['gbl', 'gbl'], ['RP_', 'RP_'], ['x', 'x'], ['glb', 'glb'], ['DX_gblV_', 'DX'], ['insp_', 'insp']];
export const ruleFor = name => RULES.find(([p]) => name.startsWith(p))?.[1] ?? 'other';
// new name for the renamed ones
const NEW_NAME = { RP_: n => 'vA_' + n.slice(3), glb: n => 'gbl' + n.slice(3), DX: n => 'vA_' + n.slice(8) };
export const hasGlobals = elements => (elements ?? []).some(e => e.type === 'global');

// Replaces every string in obj (deep) that is exactly an old name
function renameRefs(obj, map) {
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
  const report = { vKonstant: [], vAPI: [], picture: [], renamed: [], deleted: [], other: [], lostLog: [], notRenamed: [], scriptsChanged: [], brokenScripts: [], brokenItems: [] };
  const out = JSON.parse(JSON.stringify({ elements: cfg.elements ?? [], graphics: cfg.graphics ?? [], beerxml: cfg.beerxml ?? null }));
  const taken = new Set(out.elements.map(e => e.name));
  const rename = new Map(), deleted = new Set();
  const elements = [];
  for (const el of out.elements) {
    if (el.type !== 'global') { elements.push(el); continue; }
    const rule = ruleFor(el.name);
    if (rule === 'x') { deleted.add(el.name); report.deleted.push(el.name); continue; }
    if (NEW_NAME[rule]) {
      const to = NEW_NAME[rule](el.name);
      if (taken.has(to)) report.notRenamed.push({ name: el.name, to });
      else { rename.set(el.name, to); taken.add(to); report.renamed.push({ from: el.name, to, rule }); el.name = to; }
    }
    if (rule === 'insp') {
      el.type = 'picture';
      for (const k of ['dataType', 'initial', 'precision', 'format', 'units', 'step', 'min', 'max', 'retain', 'readOnly', 'log']) delete el[k];
      report.picture.push(el.name);
      elements.push(el); continue;
    }
    const kind = KINDS.includes(el.dataType) ? el.dataType : 'value';
    delete el.dataType;
    el.kind = kind;
    if (rule === 'gbl' || rule === 'glb') {
      el.type = 'vKonstant';
      if (el.log && el.log.mode && el.log.mode !== 'none') report.lostLog.push(el.name);
      delete el.log;                                      // vKonstants never go to the database
      report.vKonstant.push(el.name);
    } else {
      el.type = 'vAPI';
      if (rule === 'other') report.other.push(el.name);
      report.vAPI.push(el.name);
    }
    elements.push(el);
  }
  out.elements = elements;
  // renamed names in every setting that points to them (follow, input, tap target, pipes, BeerXML mapping, logging ...)
  if (rename.size) {
    renameRefs(out.elements, rename); renameRefs(out.graphics, rename);
    // the BeerXML mapping also has name patterns like "RP_v_Hop{n}_Oz"
    if (out.beerxml) out.beerxml = renameRefs(JSON.parse(JSON.stringify(out.beerxml).replace(/"RP_/g, '"vA_')), rename);
  }
  if (deleted.size) {
    findRefs(out.elements, deleted, 'elements', report.brokenItems);
    findRefs(out.graphics, deleted, 'pictures and pipes', report.brokenItems);
    if (out.beerxml) findRefs(out.beerxml, deleted, 'BeerXML mapping', report.brokenItems);
  }
  // scripts: RP_ -> vA_ everywhere, the glb and DX_gblV_ names renamed, and a list of every line that still uses a deleted x Global
  const delRes = [...deleted].map(n => [n, wordRe(n)]);
  const nameRes = report.renamed.filter(r => r.rule !== 'RP_').map(r => [new RegExp(wordRe(r.from).source, 'g'), r.to]);
  const newScripts = scripts.map(s => {
    let text = s.text.replace(RP_RE, 'vA_');
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
  const n = r.vKonstant.length + r.vAPI.length + r.deleted.length + r.picture.length;
  if (!n) return lines;
  const by = rule => r.renamed.filter(x => x.rule === rule);
  lines.push(`Globals retired: ${r.vKonstant.length - by('glb').length} gbl → vKonstant (same names), ${by('RP_').length} RP_ → vAPI renamed vA_, ${r.deleted.length} x deleted`);
  for (const x of by('glb')) lines.push(`Typo fixed: "${x.from}" → "${x.to}" (vKonstant)`);
  for (const x of by('DX')) lines.push(`"${x.from}" → "${x.to}" (vAPI)`);
  for (const n of r.picture) lines.push(`"${n}" is now a picture (inspector)`);
  if (r.scriptsChanged.length) lines.push(`Names changed in ${r.scriptsChanged.length} script(s): ${r.scriptsChanged.join(', ')}`);
  if (r.other.length) lines.push(`These Globals fit none of the rules, so they are vAPI with the same name until you decide: ${r.other.join(', ')}`);
  if (r.lostLog.length) lines.push(`These were logged to the database; as vKonstants they no longer are: ${r.lostLog.join(', ')}`);
  for (const x of r.notRenamed) lines.push(`"${x.name}" was not renamed: "${x.to}" already exists`);
  for (const b of r.brokenScripts) lines.push(`Script "${b.script}" line ${b.line} uses deleted "${b.name}": ${b.text}`);
  for (const b of r.brokenItems) lines.push(`${b.where} uses deleted "${b.name}"`);
  return lines;
}

// Start-up: a saved configuration that still has Globals is converted once. The old config and every changed
// script are backed up first, saved values follow the RP_ -> vA_ renames, and the report goes to data/globals-retired.txt.
export function retireGlobalsOnDisk({ configPath, scriptsDir, dataDir }) {
  const c = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!hasGlobals(c.elements)) return null;
  const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
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
