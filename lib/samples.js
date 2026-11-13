// Ready-made sample setups (samples/configs/<id>/, and sample_schemas/<id>/ from the Sample Schemas Setup, Rule 9.13). Each has sample.json (name, description) and either
//  - config.json (tabs, elements, graphics, devices ...) and a processes/ folder, or
//  - "brucontrol": a BruControl .brucfg file that is imported with every board on the simulator.
// Loading one replaces the tabs, elements, pipes and devices. The old config is copied to config/backups/ first.
// Every Interface of a sample comes in with Connection Simulator, so a sample never switches anything real (Fritz, 2026-10-28).
import fs from 'node:fs';
import path from 'node:path';
import { fileStamp } from './filedate.js';
import { convertBruControl, applyBruControl } from './brucontrol.js';

const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));

// dirs: one folder, or several (Rule 9.13): samples/configs (the 3 Vessel sample, in the panel itself) first, then sample_schemas/
// (added by the Skynet Sample Schemas Setup). A sample id found in an earlier folder wins, so a later folder can never replace it.
export function listSamples(dirs) {
  const seen = new Set(), out = [];
  for (const dir of [dirs].flat()) {
    if (!dir || !fs.existsSync(dir)) continue;
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!d.isDirectory() || seen.has(d.name) || !fs.existsSync(path.join(dir, d.name, 'sample.json'))) continue;
      try { out.push({ id: d.name, ...readJson(path.join(dir, d.name, 'sample.json')) }); seen.add(d.name); } catch { /* a broken sample.json is skipped */ }
    }
  }
  return out.sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name));
}

// the folder a sample is in (the first of dirs that has it)
function sampleFolder(dirs, id) {
  for (const dir of [dirs].flat()) if (dir && fs.existsSync(path.join(dir, id, 'sample.json'))) return path.join(dir, id);
  return null;
}

export function loadSample(dirs, id, { store, engine, hw }) {
  const meta = listSamples(dirs).find(s => s.id === id);
  if (!meta) throw new Error(`No sample "${id}"`);
  const folder = sampleFolder(dirs, id);
  const backup = backupConfig(store);
  engine.stopAll();
  store.rt.clear();                      // a fresh start: no values carried over from the old setup
  let result;
  if (meta.brucontrol) {
    const conv = convertBruControl(fs.readFileSync(path.join(folder, meta.brucontrol), 'utf8'), { mediaFolder: meta.mediaFolder ?? 'Images', simulate: true });
    // extras the BruControl file does not have, like a Start Brew Day button (BruControl starts Processes from its own list)
    for (const el of meta.addElements ?? []) if (!conv.elements.some(e => e.name === el.name)) conv.elements.push({ ...el });
    result = { ...applyBruControl(conv, { store, engine, mode: 'replace', overwriteScripts: true }), warnings: conv.warnings };
  } else {
    const cfg = readJson(path.join(folder, 'config.json'));
    const sdir = path.join(folder, 'processes');
    const files = (fs.existsSync(sdir) ? fs.readdirSync(sdir).filter(f => f.endsWith('.txt')) : [])
      .map(f => ({ name: f.slice(0, -4), text: fs.readFileSync(path.join(sdir, f), 'utf8') }));
    engine.stopAll();
    store.saveLayout({ workspaces: cfg.workspaces, elements: cfg.elements, graphics: cfg.graphics ?? [], probes: cfg.probes ?? [] });
    const c = store.config;
    c.devices = simulated(cfg.devices ?? []);
    c.autostart = cfg.autostart ?? [];
    if (cfg.beerxml) c.beerxml = cfg.beerxml;
    const scripts = { written: [], backedUp: [] };
    for (const { name, text } of files) {
      if (engine.exists(name) && engine.read(name) !== text) { engine.backup(name); scripts.backedUp.push(name); }
      engine.write(name, text); scripts.written.push(name);
    }
    const problems = scripts.written.map(n => ({ script: n, errors: engine.check(engine.read(n)).errors })).filter(p => p.errors.length);
    result = { scripts, problems, warnings: [] };
  }
  const c = store.config;
  c.title = meta.title ?? meta.name;
  c.sample = id;
  c.chooseSample = false;
  store.writeConfig();
  store.emit('config');
  hw.restart();
  for (const n of c.autostart ?? []) { try { engine.start(n, 'autostart'); } catch { /* reported by the Scripts page */ } }
  return { ok: true, sample: meta.name, backup, ...result };
}

// a board a sample names (serial, network) is kept as its real connection, to switch to later, and runs on the simulator
export function simulated(devices) {
  return devices.map(d => { const c = { ...d }; return c.connection && c.connection !== 'simulator' ? { ...c, realConnection: c.realConnection ?? c.connection, connection: 'simulator' } : c; });
}

function backupConfig(store) {
  const dir = path.join(path.dirname(store.configPath), 'backups');
  fs.mkdirSync(dir, { recursive: true });
  const stamp = fileStamp();
  const file = path.join(dir, `brewery-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(store.config, null, 2));
  return path.relative(path.dirname(path.dirname(store.configPath)), file);
}
