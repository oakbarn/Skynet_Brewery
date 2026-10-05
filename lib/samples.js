// Ready-made sample setups (samples/configs/<id>/). Each has sample.json (name, description) and either
//  - config.json (tabs, elements, graphics, devices ...) and a scripts/ folder, or
//  - "brucontrol": a BruControl .brucfg file that is imported with every board on the simulator.
// Loading one replaces the tabs, elements, pipes and devices. The old config is copied to config/backups/ first.
import fs from 'node:fs';
import path from 'node:path';
import { convertBruControl, applyBruControl } from './brucontrol.js';
import { hasGlobals, retireGlobals, reportLines } from './globals.js';

const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));

export function listSamples(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory() && fs.existsSync(path.join(dir, d.name, 'sample.json')))
    .map(d => ({ id: d.name, ...readJson(path.join(dir, d.name, 'sample.json')) }))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name));
}

export function loadSample(dir, id, { store, engine, hw }) {
  const meta = listSamples(dir).find(s => s.id === id);
  if (!meta) throw new Error(`No sample "${id}"`);
  const folder = path.join(dir, id);
  const backup = backupConfig(store);
  engine.stopAll();
  store.rt.clear();                      // a fresh start: no values carried over from the old setup
  let result;
  if (meta.brucontrol) {
    const conv = convertBruControl(fs.readFileSync(path.join(folder, meta.brucontrol), 'utf8'), { mediaFolder: meta.mediaFolder ?? 'Images', simulate: true });
    result = { ...applyBruControl(conv, { store, engine, mode: 'replace', overwriteScripts: true }), warnings: conv.warnings };
  } else {
    let cfg = readJson(path.join(folder, 'config.json'));
    const sdir = path.join(folder, 'scripts');
    let files = (fs.existsSync(sdir) ? fs.readdirSync(sdir).filter(f => f.endsWith('.txt')) : [])
      .map(f => ({ name: f.slice(0, -4), text: fs.readFileSync(path.join(sdir, f), 'utf8') }));
    let globals = [];
    if (hasGlobals(cfg.elements)) {           // a sample made before the Global class was retired
      const r = retireGlobals(cfg, files);
      cfg = { ...cfg, ...r.cfg }; files = r.scripts; globals = reportLines(r.report);
    }
    engine.stopAll();
    store.saveLayout({ workspaces: cfg.workspaces, elements: cfg.elements, graphics: cfg.graphics ?? [], probes: cfg.probes ?? [] });
    const c = store.config;
    c.devices = cfg.devices ?? [];
    c.autostart = cfg.autostart ?? [];
    if (cfg.beerxml) c.beerxml = cfg.beerxml;
    const scripts = { written: [], backedUp: [] };
    for (const { name, text } of files) {
      if (engine.exists(name) && engine.read(name) !== text) { engine.backup(name); scripts.backedUp.push(name); }
      engine.write(name, text); scripts.written.push(name);
    }
    const problems = scripts.written.map(n => ({ script: n, errors: engine.check(engine.read(n)).errors })).filter(p => p.errors.length);
    result = { scripts, problems, warnings: globals };
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

function backupConfig(store) {
  const dir = path.join(path.dirname(store.configPath), 'backups');
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
  const file = path.join(dir, `brewery-${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(store.config, null, 2));
  return path.relative(path.dirname(path.dirname(store.configPath)), file);
}
