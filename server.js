// Skynet Brew Panel - server
// Run:  node --no-warnings server.js   then open http://<this computer>:8080 in any browser
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { closeLauncherWindow } from './lib/closewindow.js';
import { openAppWindow, closeAppWindow, openInDefaultBrowser } from './lib/appwindow.js';
import { DONATE_LINK } from './lib/donation.js';
import { ProcessTemplates, MAJOR_STEPS, FIELDS, RECIPE_FIELDS, brewSetup, buildBrewDay, recipeValues, brewNames, isBrewName, SKIP } from './lib/brewprocess.js';
import { checkControlled } from './public/semi.js';
import { isCodeValue } from './public/codevalue.js';
import { controlMethods, offsetSigns } from './public/heatmethod.js';
import { Store, fixValveLists, cleanName, ELEMENT_TYPES, G_KINDS, API_MODES, INPUT_PROPS, mainProp, attrsOf, boolAttrs } from './lib/store.js';
import { modernize } from './lib/modernize.js';
import { CLASSES, addSteps } from './lib/scaffold.js';
import { Engine } from './lib/engine.js';
import { Logger, LOG_MODES } from './lib/logger.js';
import { cleanDatabase, ApiGuard, apiList, apiItem, apiPut } from './lib/itemapi.js';
import { apiNameListError } from './public/apiname.js';
import { buildCsv, csvFileName, cleanLogSets } from './lib/logcsv.js';
import { Hardware } from './lib/hardware.js';
import { parseWifiReport, hydroFor, decodeBle, hydroForBle } from './public/hydrometer.js';
import { importBeerXml } from './lib/beerxml.js';
import { convertBruControl, applyBruControl } from './lib/brucontrol.js';
import { Control } from './lib/control.js';
import { listSamples, loadSample } from './lib/samples.js';
import { Schemas } from './lib/schemas.js';
import { importFolder, listSchemaFiles, readSchemaFile } from './lib/importer.js';
import { THEME_KEYS, forceLookOnTabs, restoreTabs } from './public/themes.js';
import { EquipmentProfiles, withVolumes, lockedMsg as lockedMsgFor } from './lib/equipment.js';
import { ProfileStore, PROFILE_KINDS } from './lib/profiles.js';
import { readRecipeFile, cleanRecipe, RecipeStore, HopAlerts, recipeView } from './lib/recipe.js';
import { blankRecipe } from './public/recipecalc.js';
import { Templates } from './lib/templates.js';
import { seedDefaults } from './lib/seed.js';
import { setupPictureGroups, listGroups } from './lib/picgroups.js';
import { SkynetPictures } from './lib/skynetpics.js';
import { backupConfigFile, listBackups, readBackup, checkConfigText, applyConfigText } from './lib/configfile.js';
import { Pictures } from './lib/vectorize.js';
import { MediaFiles } from './lib/mediafiles.js';
import { FileMove, KINDS as MOVE_KINDS, missingMedia } from './lib/filemove.js';
import { MqttBridge, isShared, itemRule, cleanItems } from './lib/mqtt.js';
import { plain } from './lib/values.js';
import { Help } from './lib/help.js';
import { clock } from './lib/simclock.js';
import { Simulation, SPEEDS, JUMP_WHEN } from './lib/simulation.js';
import { timeline } from './lib/timeline.js';
import { Messaging, CARRIERS } from './lib/messaging.js';
import { watchAlarmEmails } from './lib/alarmemail.js';
import { cleanTalkLine } from './public/boardtalk.js';      // Board Talk (Rule 6.27)
import { watchAlarmOutputs } from './lib/alarmoutputs.js';      // Alarm Digital Outputs (Rule 7.19)
import { checkIds, rtdPinError, ethernetPinError, tidyLabel } from './public/naming.js';
import { elementNameError, checkFileName } from './public/names.js';
import { applyDeviceTemplate } from './public/templates.js';
import { addGroup, groupById, checkGroupName, renameGroupInText } from './lib/dbgroups.js';
import { renameInProcesses, renameElementRefs, renameGraphicRefs } from './lib/renames.js';
import { cleanUserStyles } from './public/styles.js';
import { kindChangeError } from './public/gkinds.js';
import { useKeySecret, keyReplacer, dropKeys, claimKeys, keyRenames, followClones, stripKeysText, keepKeysByName } from './lib/keys.js';
import { readVersion, VersionCheck } from './lib/version.js';
import { moveHoseEnd, isQdHose, connectChoices } from './lib/qdhose.js';
import { followProcessRename } from './public/processwidget.js';
import { applyPendingMove, makeMoveFile, unlock, saveChecked, stageMove, checkedFile, lastMove, usbInterfaces, remapConfig, remapSchemaFiles, suggestPorts, MAX_MOVE, MIN_MOVE_PASSWORD } from './lib/brainmove.js';
import { Auth, cleanPasswordRules, describePasswordRules, PW_CHARSETS, PW_LIMITS, COOKIE, ROLES, ROLE_INFO, roleAtLeast, isPrivateAddress, parseCookies } from './lib/auth.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CONFIG = path.resolve(process.env.BREWPANEL_CONFIG ?? path.join(ROOT, 'config', 'brewery.json'));
const DATA = path.resolve(process.env.BREWPANEL_DATA ?? path.join(ROOT, 'data'));
const SCRIPTS = path.resolve(process.env.BREWPANEL_SCRIPTS ?? path.join(ROOT, 'scripts'));
const PUBLIC = path.join(ROOT, 'public');
// The 3 Vessel sample ships in the panel (samples/configs); every other Sample Schema comes with the add-only Skynet Sample Schemas
// Setup into sample_schemas/ (Rule 9.13). Both are listed together.
const SAMPLES = [path.join(ROOT, 'samples', 'configs'), path.join(ROOT, 'sample_schemas')];
const HELP = path.resolve(process.env.BREWPANEL_HELP ?? path.join(ROOT, 'help'));
// The BruControl Importer's Build page (OakBarn Brewery, 2026-11-08: "Connect to your Brewery will use the same Build page as in
// Skynet Panel"; "The Only thing I see is the Process Icon needs to be greyed Out"). The Importer starts this same Panel with
// SKYNET_IMPORT_BUILD=1 on its own folder in Brewing\Import\build: no board is connected, no Brain Move or first-start copies, and
// Processes greyed out. Signing in: the Importer makes a random one-time key (SKYNET_IMPORT_KEY, at least 32 characters) and opens
// the page with it once; the page then keeps it in its own cookie. Without that key nobody is signed in.
const IMPORT_BUILD = process.env.SKYNET_IMPORT_BUILD === '1';
const IMPORT_KEY = IMPORT_BUILD && String(process.env.SKYNET_IMPORT_KEY ?? '').length >= 32 ? String(process.env.SKYNET_IMPORT_KEY) : '';
const IMPORT_COOKIE = 'skynet_import_build';

// Move Brain (Rule 9.9, lib/brainmove.js): a Brain Move file brought in from the old Brain is put in place first, before anything
// is read. This Brain's own config, data, scripts and media go to backups/before_brain_move_<date>.
const MOVE_DIRS = { config: path.dirname(CONFIG), data: DATA, scripts: SCRIPTS, media: path.join(path.dirname(CONFIG), '..', 'media') };
let moved = null;
if (!IMPORT_BUILD) try { moved = applyPendingMove(ROOT, MOVE_DIRS); } catch (e) { moved = { lines: [`Brain Move failed: ${e.message}`], failed: true }; }
if (moved) for (const l of moved.lines) console.log(l);
// A release has its samples in defaults/: a folder you don't have yet (first start) gets a copy; yours are never touched
const seeded = IMPORT_BUILD ? [] : seedDefaults(ROOT);
if (seeded.length) console.log(`First start: copied the samples into ${seeded.join(', ')}`);
useKeySecret(DATA);           // hidden keys: the browser only ever gets stand-ins for them (lib/keys.js)
const store = new Store(CONFIG, DATA);
store.load();
// Picture groups: the eleven Skynet folders in media/Images are made (lib/picgroups.js)
setupPictureGroups(store._findMedia('Images'));
const logger = new Logger(store, path.join(DATA, 'brewlog.db'));
const engine = new Engine(store, SCRIPTS, logger);
// Device names given their General Type@ when a Schema loads (Rule 3.1, lib/store.js): every Process follows
const typeAtProcesses = map => { const r = renameInProcesses(engine, map); if (r.length) console.log(`Processes following the General Type@ names: ${r.map(x => x.name).join(', ')}`); };
if (store.loadRenames?.size) typeAtProcesses(store.loadRenames);
store.on('loadRenames', typeAtProcesses);
engine.giveKeys();            // every Process has its hidden key (lib/keys.js)
const hw = new Hardware(store, { off: IMPORT_BUILD });      // the Importer's Build page never connects a board
hw.logDir = path.join(DATA, 'logs', 'boards');      // Board settings: Diagnostic logging (Rule 6.27)
const auth = new Auth(DATA);
auth.passwordRules = () => store.config.passwordRules;    // Settings > Password rules
const passwordRulesView = () => ({ ...auth.rules(), text: describePasswordRules(auth.rules()), choices: Object.fromEntries(Object.entries(PW_CHARSETS).map(([k, v]) => [k, v.text])), limits: PW_LIMITS });
const messaging = new Messaging(DATA);
// Panel version (version.json, stamped by GitHub on every merge): Menu Bar and ☰ Menu > About
const PANEL_VERSION = readVersion(ROOT);
const versionCheck = new VersionCheck(PANEL_VERSION);
const sim = new Simulation({ store, engine, hw });          // Settings > Simulation: no real boards, faster time
sim.apply();
hw.start();
const control = new Control(store);
control.start();
hw.onSimStep = t => control.tick(t);                         // a skip ahead runs the controls between simulator steps
const timerDt = clock.stepper();
setInterval(() => store.tickTimers(timerDt() / 1000), 100);   // timers follow the clock (faster in simulation mode)
setInterval(() => store.pollFiles(), 1000);            // Long String gGlobals follow their text files
store.on('warn', m => engine.print('system', m));
store.on('sdcard', m => { engine.print('system', m); broadcast('alert', { text: m }); });   // an SD card in an Ethernet Mega's shield (Skynet Rule 6.11)
const pictures = new Pictures(store, () => store.mediaRoots());     // PNG/JPG pictures get a sharp SVG copy (lib/vectorize.js)
const mediaFiles = new MediaFiles(() => store.mediaRoots());
const skynetPics = new SkynetPictures(() => store._findMedia('Images'), { source: store.config.skynetPictures });   // ☰ Menu > Get Skynet pictures        // Media page: add / rename / delete pictures and sounds
const fileMove = new FileMove(() => ({ root: ROOT, media: store.mediaRoots()[0], scripts: SCRIPTS, help: HELP }));   // File Move page
const help = new Help(HELP);                                        // Help tab: the manual, one Markdown file per page
engine.on('started', n => logger.scriptStarted(n));
if (moved) for (const l of moved.lines) engine.print('system', l);
const mqtt = new MqttBridge(store, engine);
mqtt.start();
// Schemas (the Schema dropdown at the top) and Equipment Profiles (☰ Menu > Equipment Profile)
const profiles = new EquipmentProfiles(path.join(path.dirname(CONFIG), 'equipment'));
const schemas = new Schemas(store, { engine, hw, profiles });
// Mash and Boil Profiles (Menu > Mash Profile / Boil Profile), shared by every Schema
const brewProfiles = Object.fromEntries(Object.keys(PROFILE_KINDS).map(k => [k, new ProfileStore(path.join(path.dirname(CONFIG), 'profiles', k), k)]));
// Tap Water (Rule 17.12): every Brain has one; a Recipe or the Default tab with no Water Profile picked uses it
try { brewProfiles.water.ensureTap(store.config.brewDefaults?.units); } catch (e) { console.log('Tap Water profile: ' + e.message); }
// Vessel and Bundled Fitting Templates: Skynet ones ship in templates/, the ones made here live in config/templates
const templates = new Templates(path.join(ROOT, 'templates'), path.join(path.dirname(CONFIG), 'templates'));
// The Standard Skynet Brew Process (☰ Menu > Brew Process): Skynet Process Templates ship in templates/process, User ones live
// in config/process_templates. rcp_ Recipe values use the Default tab's Mash and Boil Profiles while no Recipe is loaded.
const processTemplates = new ProcessTemplates(path.join(ROOT, 'templates', 'process'), path.join(path.dirname(CONFIG), 'process_templates'));
engine.recipe = () => recipeValues(store.config, { mash: brewProfiles.mash.list(), boil: brewProfiles.boil.list(), water: brewProfiles.water.list() });
engine.onLock = (what, on, by) => schemas.lock(on, `Process ${by}`);      // lock_Equipment / unlock_Equipment
// The Recipe (☰ Menu > Recipe): the one in use is config.recipe, saved ones are in config/recipes. Hop alerts run in the background.
const recipes = new RecipeStore(path.join(path.dirname(CONFIG), 'recipes'));
const currentRecipe = () => store.config.recipe ?? null;
const hopAlerts = new HopAlerts({ store, clock: () => clock.now(), send: a => broadcast('hopAlert', a), defaults: () => store.config.brewDefaults ?? {}, recipe: currentRecipe });
function useRecipe(rc) { store.config.recipe = cleanRecipe(rc); store.writeConfig(); broadcast('recipe', {}); return store.config.recipe; }
// a recipe file on the Brain: a path inside the Brain's folder (or a media folder), .bsmx or .xml only
function recipeFile(p) {
  const rel = String(p ?? '').trim().replace(/\\/g, '/');
  if (!/\.(bsmx|xml)$/i.test(rel)) throw new Error('The recipe file must be a .bsmx or .xml file');
  const tries = [path.resolve(ROOT, rel), ...store.mediaRoots().map(r => path.resolve(r, rel))];
  const f = tries.find(x => fs.existsSync(x) && fs.statSync(x).isFile());
  if (!f) throw new Error(`No recipe file "${rel}" on the Brain (looked in ${[ROOT, ...store.mediaRoots()].join(', ')})`);
  return f;
}
// import_recipe "Recipes/My IPA.bsmx"   import_recipe "Recipes/All.bsmx", "Zombie Dust"
engine.onRecipe = (cmd, args, by) => {
  if (cmd === 'import') {
    const f = recipeFile(args[0]), got = readRecipeFile(fs.readFileSync(f), f, args[1]);
    const rc = useRecipe(got.recipe);
    return `Recipe "${rc.name}" imported from ${path.basename(f)} (${rc.ingredients.fermentables.length} fermentables, ${rc.ingredients.hops.length} hops, ${rc.ingredients.yeasts.length} yeasts, ${rc.ingredients.miscs.length} misc)`;
  }
  if (cmd === 'start') return hopAlerts.start(args[0], `Process ${by}`);
  if (cmd === 'stop') return hopAlerts.stop() ? 'Hop alerts stopped' : 'Hop alerts were not running';
};
if (schemas.ensure()) console.log(`Your setup is now the Schema "${store.config.schema.name}" (config/schemas)`);
const dailyBackups = () => { try { schemas.dailyBackups(); } catch (e) { console.log('Schema backup failed: ' + e.message); } };
dailyBackups(); setInterval(dailyBackups, 3600 * 1000);       // every Schema gets one backup a day (config/schemas/backups)

// ---------------- live updates to browsers (Server-Sent Events) ----------------
const clients = new Map();       // response -> session token (closed when the session ends)
let pending = {};
// A browser that stops reading (a phone asleep, a laptop lid closed, WiFi gone without a goodbye) would make the Brain keep
// every update for it in memory. Once more than 2 MB waits for one browser it is let go; it joins again by itself when it
// wakes up and loads everything fresh.
const SSE_BACKLOG = 2 * 1024 * 1024;
function sse(res, msg) {
  if (res.writableLength > SSE_BACKLOG) { clients.delete(res); res.destroy(); return; }
  res.write(msg);
}
function broadcast(type, data) {
  const msg = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of [...clients.keys()]) sse(res, msg);
}
function flush() { if (Object.keys(pending).length) { broadcast('values', pending); pending = {}; } }
store.on('change', (name, prop, v) => {
  // a Momentary button's short "true" is sent at once so every screen sees the flash
  if (v === false && pending[name]?.[prop] === true) flush();
  (pending[name] ??= {})[prop] = plain(v);
});
setInterval(flush, 150);

// Code Value Widget (OakBarn Brewery, 2026-11-08, Rule 1.27): a person set its Value (a tap and Set, or the .API), so its Code
// runs once with {value} = that Value. A Process setting the Value does not run it (no endless loops).
function runWidgetCode(name, prop, by) {
  const el = store.get(name);
  if (!isCodeValue(el) || String(prop ?? 'value').toLowerCase() !== 'value') return;
  try { engine.runWidgetCode(el.name, by); } catch (e) { engine.print(`${el.name} (code)`, 'NOT RUN - ' + e.message); }
}
const codeAfterApi = r => { if (r?.attribute) runWidgetCode(r.name, r.attribute, 'api'); else if (r?.set && 'value' in r.set) runWidgetCode(r.name, 'value', 'api'); return r; };

// Push Buttons (gGlobal) are on only while a finger or mouse holds them. The browser repeats "down"
// every 0.5 s while held; if it goes quiet (closed tab, lost WiFi) the button lets go by itself.
// A Valve or Heating Element set to Push Button (OakBarn Brewery, 2026-11-09, Rule 2.46) is On only while its picture is held; if it was
// already On when pressed, the push is reversed: Off while held, back On when let go. A Process ignores the Push Button choice.
const holds = new Map();     // name -> { t: the let-go timer, rest: what it goes back to when let go }
function hold(name, down) {
  const el = store.get(name), out = el?.type === 'digitalOut', prop = out ? 'state' : 'value';
  const was = holds.get(name); clearTimeout(was?.t); holds.delete(name);
  const rest = was ? was.rest : out ? !!store.getProp(name, 'state') : false;
  if (down) holds.set(name, { rest, t: setTimeout(() => { holds.delete(name); store.setProp(name, prop, rest, 'ui'); }, 1500) });
  store.setProp(name, prop, down ? !rest : rest, 'ui');
}
engine.on('scripts', () => { clearTimeout(engine._bt); engine._bt = setTimeout(() => broadcast('scripts', engine.list()), 100); });
engine.on('print', e => broadcast('print', e));
// Alarm Email Notification (Rule 7.17): through the mail server picked in Settings > Sending codes; what happened shows in the Console
watchAlarmEmails(store, {
  send: (to, subject, text) => { if (!messaging.emailReady()) throw new Error('no mail server is set up (Settings > Sending codes)'); return messaging.sendEmail(to, subject, text); },
  users: () => auth.listUsers(), title: () => store.config.title || 'Skynet',
  log: text => { console.log(text); broadcast('print', { script: 'Alarm Email', text, ts: Date.now() }); },
});
// Alarm Digital Outputs (Rule 7.19): up to 2 Devices go ON and OFF with their Alarm
watchAlarmOutputs(store, { log: text => { console.log(text); broadcast('print', { script: 'Alarm', text, ts: Date.now() }); } });
engine.on('show', ws => broadcast('show', ws));
engine.on('alert', a => broadcast('alert', a));
engine.on('flow', f => broadcast('flow', f));           // flow colors a Process set (Rule 5.21)
engine.on('config', () => { store.writeConfig(); broadcast('config', {}); });     // a Process moved a Quick Disconnect hose (Rule 5.34)
engine.on('valves', v => broadcast('valves', v));          // Manual valves waiting for someone to turn them by hand            // a Process that kept failing and was not restarted again
store.on('config', () => broadcast('config', {}));
store.on('devices', () => broadcast('devices', hw.list()));
pictures.on('changed', () => broadcast('config', {}));
mqtt.on('status', () => broadcast('mqtt', mqtt.status()));
sim.on('status', () => { clearTimeout(sim._bt); sim._bt = setTimeout(() => broadcast('sim', sim.status()), 100); });
function dropEndedSessions() { for (const [res, token] of clients) if (!auth.check(token)) { res.end(); clients.delete(res); } }
setInterval(() => { dropEndedSessions(); for (const res of [...clients.keys()]) sse(res, ': ping\n\n'); }, 20000);

// ---------------- helpers ----------------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.bmp': 'image/bmp', '.ico': 'image/x-icon',
  '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4',
};
function send(res, code, body, type = 'application/json') {
  const data = type === 'application/json' ? JSON.stringify(body, keyReplacer) : body;     // hidden keys never leave the Brain (lib/keys.js)
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' });
  res.end(data);
}
const ok = (res, body = { ok: true }) => send(res, 200, body);
const fail = (res, code, msg) => send(res, code, { ok: false, error: msg });
function readBody(req, limit = 10 * 1024 * 1024, raw = false) {      // raw: the bytes (a .bsmx file may not be UTF-8)
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit) { reject(new Error('Body too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(raw ? Buffer.concat(chunks) : Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
// a hidden key sent in from outside is thrown away; only Save layout may send the stand-ins it was given (lib/keys.js)
async function jsonBody(req, keepRefs = false) { const t = await readBody(req); return t ? dropKeys(JSON.parse(t), keepRefs) : {}; }

function sendFile(req, res, file) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return fail(res, 404, 'File not found: ' + file);
    const type = MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
    const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '');      // Safari needs ranges for audio
    if (range) {
      const start = range[1] ? +range[1] : 0, end = range[2] ? Math.min(+range[2], st.size - 1) : st.size - 1;
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
      fs.createReadStream(file, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
      fs.createReadStream(file).pipe(res);
    }
  });
}

// Images, sounds and text files are given by PATH. Only files inside the folders listed in config "mediaRoots" are served.
const resolveMedia = p => store.resolveMedia(p);

// BruControl ran on Windows, where file names ignore upper/lower case. Find "Wave/X.WAV" as "wave/x.wav" too
// (and the old picture folder name oakbarn/ as Images/), see Store.findMedia
const findMedia = p => store.findMedia(p);

function apiKeyOk(req, url) {
  const key = store.config.apiKey;
  return !!key && (req.headers['x-api-key'] === key || url.searchParams.get('key') === key);
}
// Keeps a bot from guessing the API key (Fritz, 2026-10-30: safeguards so a bot can't take over): too many wrong keys from one
// address and it is shut out for a while (lib/itemapi.js)
const apiGuard = new ApiGuard();
// every change an outside program makes is written in the Processes console, so you can see what it did
function apiSaid(r, ip) {
  const what = r.set ? Object.entries(r.set).map(([a, v]) => `${r.name}.${a} = ${v}`).join(', ') : `${r.name}.${r.attribute} = ${r.value}`;
  engine.print('system', `API (${ip}): ${what}`);
  return r;
}

// ---------------- login ----------------
// Who may do what. viewer < operator < admin. New routes default to viewer for GET and admin for changes.
// Beer money pop-up settings (Settings > Beer money pop-up). The PayPal address is fixed in lib/donation.js.
function cleanDonation(d = {}) {
  const days = (v, def) => { const n = Math.round(Number(v)); return n >= 1 && n <= 3650 ? n : def; };
  return {
    enabled: d.enabled !== false,
    message: String(d.message ?? '').slice(0, 1000), button: String(d.button ?? '').slice(0, 60),
    everyDays: days(d.everyDays, 30), donatedDays: days(d.donatedDays, 180),
  };
}

// Predictive text in the Process editor: every Device, Widget and Process name, each with its attributes, and the Tab names.
// Only names go out: never a hidden key (Rule 3.10). Clones are graphics, not elements, so they are never offered (Rule 4.4).
function processWords() {
  return {
    elements: [...[...store.list(), ...store.manualValves(), ...store.textWidgets()].map(el => ({ name: el.name, type: el.type, main: mainProp(el), attrs: attrsOf(el), bools: boolAttrs(el), ...(controlMethods(el) ? { methods: controlMethods(el) } : {}), ...(offsetSigns(el) ? { signs: offsetSigns(el) } : {}) })),
      // pipes and hoses have one Process attribute, .flow_Color; tab.flow_Color is the Tab on the screen (Rule 5.21)
      ...(store.config?.graphics ?? []).filter(g => (g.kind === 'pipe' || (g.kind === 'ip' && (!g.fitting || g.fitting === 'point'))) && g.name).map(g => isQdHose(g)
        // a Quick Disconnect hose also has .connect (Rule 5.34): after "Hose_1.connect =" the list shows where it can go
        ? { name: g.name, type: 'QD hose', attrs: ['connect', 'flow_Color'], bools: [], connect: connectChoices(store.config, g) }
        : { name: g.name, type: g.kind === 'ip' ? 'ip' : g.hose ? 'hose' : 'pipe', main: 'flow_Color', attrs: ['flow_Color'], bools: [] }),
      { name: 'tab', type: 'tab', main: 'flow_Color', attrs: ['flow_Color'], bools: [] }],
    processes: engine.names(),
    tabs: (store.config?.workspaces ?? []).map(w => w.name).filter(Boolean),
  };
}

function needRole(p, m) {
  if (p === '/ui/set' || p === '/ui/sound/finished' || p === '/ui/hose' || p === '/ui/hold' || p === '/ui/valve/confirm' || p === '/ui/reading' || p === '/ui/override' || p === '/ui/brewprocess/start' || p === '/ui/stopall' || p === '/ui/import/beerxml' || p.startsWith('/ui/recipe') || p === '/ui/log/sets' || /^\/ui\/log\/now\//.test(p) || /^\/ui\/scripts\/[^/]+\/(start|stop|restart)$/.test(p)) return 'operator';
  if (p === '/ui/openlink') return 'viewer';      // an outside link opens in the default browser (anyone who can read Help)
  if (p === '/ui/ports') return 'admin';
  if (p === '/ui/boardtalk') return 'admin';      // Board Talk (Rule 6.27): sending lines to a board is for admins
  if (/^\/ui\/equipment\/[a-z0-9-]+\/lock$/.test(p)) return 'operator';      // brewers lock and unlock the Equipment Profile
  if (p === '/ui/mqtt') return m === 'GET' ? 'viewer' : 'admin';     // MQTT and voice settings: everyone sees the list, admins change it
  if (p.startsWith('/ui/config')) return 'admin';      // Config Editor: the whole config, API key included
  if (/^\/ui\/schemas\/[a-z0-9-]+\/export$/.test(p)) return 'admin';   // Schema.json: Save as .json file
  if (p.startsWith('/ui/schemas/import')) return 'admin';   // Schema.json: Open a Schema file (Brewing\\Import)
  if (p.startsWith('/ui/filemove/')) return 'admin';   // File Move: copies files onto the Brain
  if (p.startsWith('/ui/skynetpics/')) return 'admin';
  if (p.startsWith('/ui/brainmove')) return 'admin';   // Move Brain: every file, logins included, and the USB ports   // Get Skynet pictures: copies pictures from GitHub onto the Brain
  return m === 'GET' ? 'viewer' : 'admin';
}
const PUBLIC_FILES = new Set(['/login.html', '/login.js', '/eye.js', '/genpw.js', '/style.css', '/favicon.ico', '/favicon.svg', '/themeboot.js']);
const clientIp = req => req.socket.remoteAddress ?? '';
// HTTPS through a proxy on this computer (for example "tailscale serve")
const viaHttps = req => req.headers['x-forwarded-proto'] === 'https' && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(clientIp(req));
// Changes must come from a page served by this panel, not from another web site (stops cross-site tricks)
function sameOrigin(req) {
  const o = req.headers.origin;
  if (!o || o === 'null') return !o;
  try { const h = new URL(o).host; return h === req.headers.host || h === req.headers['x-forwarded-host']; } catch { return false; }
}

// The MQTT password never goes to the browser; Settings shows whether one is saved.
function browserConfig() {
  const c = store.config;
  if (!c.mqtt) return c;
  const { password, ...m } = c.mqtt;
  return { ...c, mqtt: { ...m, hasPassword: !!password } };
}
function mqttView() {
  return { status: mqtt.status(), items: store.list().filter(isShared).map(e => ({ name: e.name, type: e.type, label: e.label ?? '', ...itemRule(store, e), fixed: ['digitalIn', 'temperature', 'analogIn'].includes(e.type) })) };
}


function csv(rows) {
  const q = s => `"${String(s ?? '').replaceAll('"', '""')}"`;
  return 'time,name,value,reason\n' + rows.map(r => [new Date(r.ts).toISOString(), q(r.name), q(r.value), r.reason].join(',')).join('\n');
}

// ---------------- routes ----------------
async function route(req, res) {
  const url = new URL(req.url, 'http://x');
  const p = decodeURIComponent(url.pathname);
  const m = req.method;
  if (m === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE', 'Access-Control-Allow-Headers': 'Content-Type,X-API-Key' }); return res.end(); }

  const token = parseCookies(req.headers.cookie)[COOKIE];
  // the Importer's Build page: signed in only with the Importer's one-time key (compared in constant time), never with a password
  const importMe = () => { const k = parseCookies(req.headers.cookie)[IMPORT_COOKIE]; return IMPORT_KEY && k && k.length === IMPORT_KEY.length && crypto.timingSafeEqual(Buffer.from(k), Buffer.from(IMPORT_KEY)) ? { name: 'Importer', role: 'admin' } : null; };
  if (IMPORT_BUILD && req.url.startsWith('/import-build?key=')) {
    const k = new URL(req.url, 'http://x').searchParams.get('key') ?? '';
    if (!IMPORT_KEY || k.length !== IMPORT_KEY.length || !crypto.timingSafeEqual(Buffer.from(k), Buffer.from(IMPORT_KEY))) { res.writeHead(403); return res.end('Forbidden'); }
    const q = new URL(req.url, 'http://x').searchParams, tab = q.get('tab') ?? '', vb = q.get('vb') ?? '';      // the Importer's Build Tab page for one Tab, or the Vessel Device Builder for one vessel
    res.writeHead(302, { 'Set-Cookie': `${IMPORT_COOKIE}=${k}; Path=/; HttpOnly; SameSite=Strict`, Location: vb ? `/#vb=${encodeURIComponent(vb.slice(0, 4000))}` : tab ? `/#tab=${encodeURIComponent(tab)}` : '/' }); return res.end();
  }
  const me = IMPORT_BUILD ? importMe() : auth.check(token);
  const ip = clientIp(req);

  // ===== Sign in / out, first-time setup, users =====
  if (p.startsWith('/auth/')) {
    if (m !== 'GET' && !sameOrigin(req)) return fail(res, 403, 'Request came from another web site');
    const login = (tok, extra = {}) => { res.setHeader('Set-Cookie', auth.cookie(tok, viaHttps(req))); return send(res, 200, { ok: true, ...extra }); };
    if (p === '/auth/status' && m === 'GET') return ok(res, { ok: true, user: me, setup: auth.needsSetup(), setupAllowed: isPrivateAddress(ip), roles: ROLE_INFO, title: store.config.title || 'Skynet Brew Panel', codeSignIn: messaging.emailReady() || messaging.twilioReady(), passwordRules: passwordRulesView() });
    if (p === '/auth/setup' && m === 'POST') {
      if (!auth.needsSetup()) return fail(res, 400, 'Setup is already done. Sign in instead.');
      if (!isPrivateAddress(ip)) return fail(res, 403, 'First-time setup only works from your own network');
      const { name, password } = await jsonBody(req);
      auth.addUser(name, password, 'admin');
      return login(auth.newSession(auth.findUser(name).name), { recoveryCode: auth.makeRecoveryCode() });
    }
    if (p === '/auth/recover' && m === 'POST') {
      if (!isPrivateAddress(ip)) return fail(res, 403, 'Password recovery only works from your own network (home WiFi or Tailscale)');
      const { name, code, password } = await jsonBody(req);
      const r = auth.recover(name, code, password, ip); dropEndedSessions();
      return login(auth.newSession(r.name), { recoveryCode: r.code });
    }
    // sign in with a code sent by email or text. The answer is the same whether or not the user exists.
    if (p === '/auth/code/send' && m === 'POST') {
      const wait = auth.blockedFor(ip);
      if (wait) return fail(res, 429, `Too many wrong tries. Wait ${wait} seconds and try again.`);
      const { name } = await jsonBody(req);
      const said = { ok: true, message: 'If that user has an email or mobile number set up, a code is on its way. It works for 10 minutes.' };
      const made = auth.makeSignInCode(name);
      if (made) {
        const contact = auth.getContact(made.name);
        if (messaging.targets(contact).length) {
          const title = store.config.title || 'Skynet Brew Panel';
          messaging.deliver(contact, `${title} sign-in code`, `${made.code} is your ${title} sign-in code. It works once, for 10 minutes. If you did not ask for it, change your password.`)
            .catch(e => console.error(`Sign-in code for ${made.name} not sent: ${e.message}`));
        }
      }
      return ok(res, said);
    }
    if (p === '/auth/code/login' && m === 'POST') { const { name, code } = await jsonBody(req); return login(auth.loginWithCode(name, code, ip)); }
    if (p === '/auth/login' && m === 'POST') { const { name, password } = await jsonBody(req); return login(auth.login(name, password, ip)); }
    if (p === '/auth/logout' && m === 'POST') { auth.logout(token); dropEndedSessions(); res.setHeader('Set-Cookie', auth.clearCookie()); return ok(res); }
    if (!me) return fail(res, 401, 'Please sign in');
    if (p === '/auth/password' && m === 'POST') {
      const { current, password } = await jsonBody(req);
      try { auth.login(me.name, current, ip); } catch { return fail(res, 400, 'Your current password is wrong'); }
      auth.setPassword(me.name, password); auth.endSessionsFor(me.name); dropEndedSessions();
      return login(auth.newSession(me.name));
    }
    // contact details for sign-in codes: your own, or anyone's for an admin
    if (p === '/auth/contact') {
      const who = url.searchParams.get('user') || me.name;
      if (who.toLowerCase() !== me.name.toLowerCase() && me.role !== 'admin') return fail(res, 403, 'Only an admin can change other users');
      if (m === 'GET') return ok(res, { ...auth.getContact(who), carriers: Object.fromEntries(Object.entries(CARRIERS).map(([k, v]) => [k, v.name])), twilio: messaging.twilioReady(), email: messaging.emailReady() });
      if (m === 'PUT') { auth.setContact(who, await jsonBody(req), CARRIERS); return ok(res); }
    }
    if (me.role !== 'admin') return fail(res, 403, 'Only an admin can manage users');
    if (p === '/auth/messaging' && m === 'GET') return ok(res, messaging.publicSettings());
    if (p === '/auth/messaging' && m === 'PUT') { messaging.save(await jsonBody(req)); return ok(res); }
    if (p === '/auth/messaging/test' && m === 'POST') {
      const sent = await messaging.deliver(auth.getContact(me.name), 'Brew Panel test message', 'This is a test from your Brew Panel. Sign-in codes will arrive like this.');
      return ok(res, { ok: true, sent: sent.map(t => `${t.kind} to ${t.to}`) });
    }
    if (p === '/auth/users' && m === 'GET') return ok(res, auth.listUsers());
    if (p === '/auth/recovery' && m === 'GET') return ok(res, auth.recoveryInfo());
    if (p === '/auth/recovery' && m === 'POST') return ok(res, { ok: true, code: auth.makeRecoveryCode() });
    if (p === '/auth/users' && m === 'POST') { const { name, password, role } = await jsonBody(req); auth.addUser(name, password, role); return ok(res); }
    const u = /^\/auth\/users\/(.+)$/.exec(p);
    if (u && m === 'PUT') {
      const { role, password } = await jsonBody(req);
      if (role) auth.setRole(u[1], role);
      if (password) auth.setPassword(u[1], password);
      auth.endSessionsFor(u[1]); dropEndedSessions();      // they sign in again with the new role / password
      if (u[1].toLowerCase() === me.name.toLowerCase()) return login(auth.newSession(me.name));
      return ok(res);
    }
    if (u && m === 'DELETE') { auth.removeUser(u[1]); dropEndedSessions(); return ok(res); }
    return fail(res, 404, 'Unknown route');
  }

  // ===== Hydrometers over Wi-Fi (OakBarn Brewery, 2026-11-09, Rule 6.25): an iSpindel, GravityMon, Floaty or BrewBrain Float sends its
  // readings here (its HTTP setting: this Brain's address, port and /api/hydrometer). It can't sign in, so from your own network it needs
  // nothing; from anywhere else it needs the API key (?key=...). Its Name or ID picks the Hydrometer Device; it can't change anything else.
  if (p === '/api/hydrometer' && m === 'POST') {
    if (!apiKeyOk(req, url) && !isPrivateAddress(ip)) return fail(res, 401, 'Missing or wrong API key (?key=...)');
    let rep; try { rep = parseWifiReport(await jsonBody(req)); } catch (x) { return fail(res, 400, x.message); }
    const el = hydroFor(store.list('hydrometer'), rep, 'wifi') ?? hydroFor(store.list('hydrometer'), rep, 'cloud');
    if (!el) { hw.hydroHeardAdd(rep, 'wifi'); return fail(res, 404, `No Hydrometer has the Hardware ID "${rep.name || rep.id}" with the Connection Wi-Fi yet. Pick it in the Hydrometer's Properties.`); }
    return ok(res, { ok: true, hydrometer: el.name, ...hw.hydroReport(el, rep, undefined, true) });
  }

  // ===== Hydrometers over Bluetooth (OakBarn Brewery, 2026-11-09, Rule 6.25, PR 2): a listener (an ESP32 near the fermenter, or the
  // Raspberry Pi's own Bluetooth, firmware/) sends what it heard: { from, ads: [{ address, rssi, mfg: { company: hex } }] }. The Brain
  // reads each advert (public/hydrometer.js decodeBle): a Tilt by its Color, a RAPT Pill by its Hardware ID. Same rules as Wi-Fi: from
  // your own network it needs nothing, from anywhere else the API key. It can't change anything but the Hydrometers' readings.
  if (p === '/api/hydrometer/bluetooth' && m === 'POST') {
    if (!apiKeyOk(req, url) && !isPrivateAddress(ip)) return fail(res, 401, 'Missing or wrong API key (?key=...)');
    let body; try { body = await jsonBody(req); } catch (x) { return fail(res, 400, x.message); }
    const ads = Array.isArray(body?.ads) ? body.ads.slice(0, 200) : [];
    const read = [], unknown = [];
    for (const ad of ads) for (const rep of decodeBle(ad)) {
      const el = hydroForBle(store.list('hydrometer'), rep);
      if (!el) { if (rep.kind === 'tilt') unknown.push(`${rep.color} Tilt`); else { hw.hydroHeardAdd(rep, 'bluetooth'); unknown.push(rep.id); } continue; }
      hw.hydroReport(el, rep, undefined, true); read.push(el.name);
    }
    return ok(res, { ok: true, from: String(body?.from ?? ''), read: [...new Set(read)], notSetUp: [...new Set(unknown)] });
  }

  // ===== Public API (Fritz, 2026-10-30): any Device or Widget whose .API is Get only (read) or Get and Put (read and change) =====
  // Allowed with the API key, or when signed in. Reading without either only works from your own network.
  if (p.startsWith('/api/')) {
    if (apiGuard.blocked(ip)) return fail(res, 429, 'Too many wrong API keys from this address. Try again later.');
    const sentKey = req.headers['x-api-key'] ?? url.searchParams.get('key');
    if (!apiKeyOk(req, url)) {
      if (sentKey) apiGuard.wrong(ip);                     // a wrong key counts, even when the caller is signed in
      if (me) {
        if (m !== 'GET' && !sameOrigin(req)) return fail(res, 403, 'Request came from another web site');
        if (!roleAtLeast(me.role, m === 'GET' ? 'viewer' : 'operator')) return fail(res, 403, 'Your account is view only');
      } else if (!(m === 'GET' && isPrivateAddress(ip))) return fail(res, 401, 'Missing or wrong X-API-Key');
    }
    if (p === '/api/items' && m === 'GET') return ok(res, apiList(store));
    if (p === '/api/items' && (m === 'POST' || m === 'PUT')) {      // { name: value, ... }: several at once
      const body = await jsonBody(req); const done = [], errors = [];
      for (const [n, v] of Object.entries(body)) { try { apiSaid(codeAfterApi(apiPut(store, n, null, v)), ip); done.push(n); } catch (e) { errors.push(`${n}: ${e.message}`); } }
      return ok(res, { ok: !errors.length, set: done, errors });
    }
    let g = /^\/api\/items\/([^/]+)(?:\/([^/]+))?$/.exec(p);
    if (g) {
      if (m === 'GET') { const r = apiItem(store, g[1], g[2]); return r ? ok(res, r) : fail(res, 404, `No item named "${cleanName(g[1])}" that outside programs may read`); }
      if (m === 'PUT' || m === 'POST') {
        const t = await readBody(req); let v = t;
        try { const j = JSON.parse(t); v = (j && typeof j === 'object' && !Array.isArray(j) && !g[2]) ? j : (j && typeof j === 'object' && 'value' in j) ? j.value : j; } catch { }
        try { return ok(res, apiSaid(codeAfterApi(apiPut(store, g[1], g[2], v)), ip)); } catch (e) { return fail(res, e.status ?? 400, e.message); }
      }
    }
    g = /^\/api\/log\/(.+)$/.exec(p);         // send its reading to the database now
    if (g && m === 'POST') { const it = apiItem(store, g[1]); if (!it) return fail(res, 404, `No item named "${cleanName(g[1])}" that outside programs may read`); logger.logNow(it.name, 'api'); return ok(res); }
    if ((p === '/api/log' || p === '/api/log.csv') && m === 'GET') {
      const rows = logger.query(Object.fromEntries(url.searchParams));
      return p.endsWith('.csv') ? send(res, 200, csv(rows), 'text/csv; charset=utf-8') : ok(res, rows);
    }
    // Node-RED and other programs: POST a .bsmx or BeerXML file to /api/import/recipe?file=MyBeer.bsmx and it becomes the Recipe
    if (p === '/api/import/recipe' && m === 'POST') {
      const got = readRecipeFile(await readBody(req, 32 * 1024 * 1024, true), url.searchParams.get('file') ?? '', url.searchParams.get('pick') ?? undefined);
      const rc = useRecipe(got.recipe); return ok(res, { ok: true, name: rc.name, names: got.names });
    }
    if (p === '/api/import/beerxml' && m === 'POST') {
      const xml = await readBody(req);
      return ok(res, { ok: true, ...importBeerXml(xml, store, store.config.beerxml) });
    }
    return fail(res, 404, 'Unknown API route');
  }

  // ===== Everything below needs a signed-in user =====
  if (m === 'GET' && PUBLIC_FILES.has(p)) return sendFile(req, res, path.join(PUBLIC, p));
  if (!me) {
    if (m === 'GET' && (p === '/' || p === '/index.html' || p === '/help.html')) { res.writeHead(302, { Location: '/login.html' }); return res.end(); }
    return fail(res, 401, 'Please sign in');
  }
  const need = needRole(p, m);
  if (!roleAtLeast(me.role, need)) return fail(res, 403, need === 'admin' ? 'Only an admin can do that' : 'Your account is view only');
  if (m !== 'GET' && !sameOrigin(req)) return fail(res, 403, 'Request came from another web site');

  // ===== Browser UI =====
  if (p === '/ui/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 2000\n\n');
    clients.set(res, token); req.on('close', () => clients.delete(res));
    return;
  }
  if (p === '/ui/state' && m === 'GET') {
    const config = me.role === 'admin' ? browserConfig() : { ...browserConfig(), apiKey: undefined };
    return ok(res, { me, importBuild: IMPORT_BUILD, roles: ROLES, config, mqtt: mqttView(), donateLink: DONATE_LINK, panelVersion: PANEL_VERSION, passwordRules: passwordRulesView(), values: store.snapshot(), scripts: engine.list(), devices: hw.list(), types: ELEMENT_TYPES, gKinds: G_KINDS, apiModes: API_MODES, processClasses: CLASSES, words: processWords(), valves: engine.valveList(), flow: engine.flowView(), logModes: LOG_MODES, sim: sim.status(), closable: CLOSABLE, simSpeeds: SPEEDS, jumpWhen: JUMP_WHEN, console: engine.console.slice(-300) });
  }
  if (p === '/ui/version/latest' && m === 'GET') return ok(res, await versionCheck.latest());
  // a screen played an Alarm's sound to its end (Rule 7.18): one that does not repeat lets the next Alarm in line play
  if (p === '/ui/sound/finished' && m === 'POST') {
    const { name } = await jsonBody(req);
    const el = store.get(name);
    if (el?.type !== 'alarm') return fail(res, 404, `No Alarm "${name}"`);
    if (store.getProp(name, 'active') && !store.getProp(name, 'loop')) store.setProp(name, 'finished', true, 'sound');
    return ok(res);
  }
  if (p === '/ui/set' && m === 'POST') {
    const { name, prop, value } = await jsonBody(req);
    const el = store.get(name);
    if (!el) return fail(res, 404, `No element "${name}"`);
    if (INPUT_PROPS[el.type]?.includes(String(prop).toLowerCase()) && el.device && hw.devices.get(el.device)?.connection !== 'simulator') return fail(res, 400, `"${name}" is a hardware input`);
    store.setProp(name, prop, value, 'ui');
    runWidgetCode(name, prop, 'user');      // a Code Value Widget runs its Code (Rule 1.27)
    logger.clicked(name, prop);      // "When Clicked" (Rule 6.14): set on its Tab, so it goes to the database now
    return ok(res);
  }
  // the free end of a Quick Disconnect hose, moved on a Tab outside Edit layout (Fritz, 2026-11-05, Rule 5.28): operators may
  if (p === '/ui/hose' && m === 'POST') {
    const r = moveHoseEnd(store.config, await jsonBody(req));
    if (r.error) return fail(res, 400, r.error);
    store.writeConfig(); broadcast('config', {});
    return ok(res, r);
  }
  if (p === '/ui/valve/confirm' && m === 'POST') { engine.confirmValve((await jsonBody(req)).name); return ok(res); }
  if (p === '/ui/hydrometers/heard' && m === 'GET') return ok(res, hw.hydroHeardList());      // Hardware IDs heard but not claimed (Rule 6.25)
  if (p === '/ui/reading' && m === 'POST') { engine.readingAction(await jsonBody(req), me?.name); return ok(res); }      // take_reading's pop-up (Rule 6.25)
  // the Override button (Fritz, 2026-10-30): every running Process moves on past the wait, sleep or loop that holds it
  if (p === '/ui/override' && m === 'POST') return ok(res, { processes: engine.override(me.name) });
  if (p === '/ui/hold' && m === 'POST') {
    const { name, down } = await jsonBody(req);
    const el = store.get(name);
    // a Push Button (Semi_Widgets_Devices), a Push Button gGlobal, or an output or switch set to "push button (on while held)"
    const push = el && (el.type === 'pushButton' || (el.type === 'gGlobal' && el.kind === 'pushbutton') || (['digitalOut', 'switch'].includes(el.type) && el.tap === 'hold'));
    if (!push) return fail(res, 400, `"${name}" is not a Push Button`);
    hold(el.name, down);
    return ok(res);
  }
  if (p === '/ui/layout' && m === 'PUT') {
    const body = await jsonBody(req, true);
    // each item gets the hidden key of the item it stands for; a copy gets a new one and remembers its first item (lib/keys.js)
    for (const list of ['elements', 'graphics', 'workspaces', 'devices']) if (Array.isArray(body[list])) claimKeys(body[list], store.config[list]);
    // a User version of a Skynet Device Template (Rule 5.16): its fixed attributes are put back to the Template's, whatever was sent
    for (const el of body.elements ?? []) if (el?.template && el.templateCls === 'skynet') applyDeviceTemplate(el, templates.find('device', el.template));
    // a gGlobal's Kind is set when it is made and never changes (Fritz, 2026-11-02, public/gkinds.js)
    { const bad = kindChangeError(store.config.elements, body.elements); if (bad) return fail(res, 400, bad); }
    for (const el of body.elements ?? []) fixValveLists(el);      // a tap water valve: always on Close all, never on Open all (Rule 6.15)
    for (const el of body.elements ?? []) cleanDatabase(el);     // .database and .API: only the known settings are kept (lib/itemapi.js)
    { const bad = body.elements && apiNameListError(body.elements); if (bad) return fail(res, 400, bad); }     // API_Name is Unique (Rule 6.18)
    // device_controlled (Semi_Widgets_Devices, public/semi.js): only a Device with an ON / OFF state; a deleted one goes back to None
    if (body.elements) { const { errors } = checkControlled(body.elements); if (errors.length) return fail(res, 400, errors[0]); }
    // only one Override button on each Tab (Fritz, 2026-10-30)
    { const seen = new Set(); for (const g of body.graphics ?? []) if (g?.kind === 'override') { if (seen.has(g.workspace)) return fail(res, 400, `The ${g.workspace} Tab has two Override buttons: only one is allowed on a Tab`); seen.add(g.workspace); } }
    schemas.checkLayout(body.graphics);                  // a locked Equipment Profile: the equipment and pipes on its Tab can't change
    if (body.workspaces) schemas.keepTabProfiles(body.workspaces);   // each Tab's profile is picked on the ☰ Menu only
    if (body.devices) checkIds(body.devices, 'interface');   // Interface IDs: 1-4 letters, unique (public/naming.js)
    // renamed items, found by their hidden key (Fritz, 2026-10-27): old name -> new name. Clones of a renamed item follow it.
    const renames = new Map(), clones = new Map();
    if (body.elements) {
      const r = keyRenames(store.config.elements, body.elements);
      const texts = new Set((body.graphics ?? store.config.graphics).filter(g => g.kind === 'text').map(g => g.name));
      const c = followClones(body.elements, r, texts);
      for (const m of [r, c]) for (const [a, b] of m) renames.set(a, b);
      for (const [a, b] of c) clones.set(a, b);
    }
    if (body.graphics) {
      const r = keyRenames(store.config.graphics, body.graphics), c = followClones(body.graphics, r);
      for (const m of [r, c]) for (const [a, b] of m) if (!renames.has(a)) renames.set(a, b);
      for (const [a, b] of c) clones.set(a, b);
    }
    // every Label: no © ® ™ @ ~ and no space at the start or end (OakBarn Brewery, 2026-11-11, Rule 3.4; public/naming.js tidyLabel)
    for (const k of ['elements', 'graphics']) for (const x of body[k] ?? []) if (x && typeof x.label === 'string') x.label = tidyLabel(x.label);
    // a new or newly spelled Device or Widget name follows Fritz's rules (public/names.js); names that were there already stay as they are
    for (const el of body.elements ?? []) { const bad = !el.instanceOf && !store.has(cleanName(el.name)) && elementNameError(el.name); if (bad) return fail(res, 400, bad); }
    // ... and so does every other new or newly spelled name: Tabs, Texts, pipes, vessels ... (Fritz, 2026-10-29, Skynet Rule 3.11)
    for (const [k, what] of [['workspaces', 'Tab'], ['graphics', 'item']]) {
      const had = new Set((store.config[k] ?? []).map(x => x?.name));
      for (const x of body[k] ?? []) { const bad = x?.name && !x.of && !had.has(x.name) && elementNameError(x.name, what); if (bad) return fail(res, 400, bad); }
    }
    // an RTD on a Mega: chip-select (CS) pin only on D14-D17, D22-D39, D41-D43, D47-D49 or D53 (Skynet Rule 6.9, public/naming.js)
    for (const el of body.elements ?? []) { const bad = rtdPinError(el, body.devices ?? store.config.devices); if (bad) return fail(res, 400, bad); }
    // an Ethernet Mega: no Device on pin D10, its Ethernet shield's pin (Skynet Rule 6.10, public/naming.js)
    if (body.devices || body.elements) for (const d of body.devices ?? store.config.devices) { const bad = ethernetPinError(d, body.elements ?? store.config.elements); if (bad) return fail(res, 400, bad); }
    if (renames.size && body.elements) for (const el of body.elements) renameElementRefs(el, renames);     // settings that point to a renamed one (follow, input ...)
    // the browser already changed what points to a name it renamed; a clone renamed here needs the same done on the Brain
    if (clones.size) for (const g of body.graphics ?? store.config.graphics) renameGraphicRefs(g, clones);
    store.saveLayout({ ...body, renames });
    if (body.devices) { store.config.devices = body.devices.map(d => ({ ...d })); store.writeConfig(); hw.restart(); }
    const out = { ok: true };
    if (renames.size) {
      out.renamed = [...renames].map(([from, to]) => ({ from, to, clone: clones.has(from) }));
      out.processes = renameInProcesses(engine, renames);              // the scripts/ folder: shared by every Schema
      if (store.config.logSets) { store.config.logSets = store.config.logSets.map(s => renameElementRefs(s, renames)); store.writeConfig(); }
      out.otherSchemas = schemas.usingNames([...renames.keys()]);   // other Schemas that still have a Device or Widget by the old name
    }
    if (body.updateVersion) Object.assign(out, schemas.newVersion());   // the "Update Version" switch next to Save
    return ok(res, out);
  }
  if (p === '/ui/settings' && m === 'PUT') {
    const body = await jsonBody(req);
    const tl = body.brewDefaults?.textLarge;         // \L large text in strings: bigger than normal text (18 px)
    if (tl !== undefined && tl !== null && !(+tl > 18 && +tl <= 200)) return fail(res, 400, 'Large text size must be more than 18 (normal text) and at most 200');
    for (const k of ['mediaRoots', 'apiKey', 'autostart', 'beerxml', 'title', 'chooseSample', 'vesselLists', 'warnOffBrainPaths', 'restartLimit', 'restartAlarm', 'brewDefaults', 'menuOrder']) if (k in body) store.config[k] = body[k];
    if ('userStyles' in body) store.config.userStyles = cleanUserStyles(body.userStyles);     // a Skynet Style can never be changed (public/styles.js)
    if ('theme' in body) { if (!THEME_KEYS.includes(body.theme)) return fail(res, 400, 'That Look (theme) is not one of the Skynet Looks'); store.config.theme = body.theme; }
    if ('donation' in body) store.config.donation = cleanDonation(body.donation);
    if ('passwordRules' in body) store.config.passwordRules = cleanPasswordRules(body.passwordRules);
    store.writeConfig(); broadcast('config', {});
    if ('mediaRoots' in body) pictures.start();
    return ok(res);
  }
  // the Look on every Tab (Rule 2.39): apply keeps the Tabs' colors first (lookUndo), restore puts them back
  if (p === '/ui/look/tabs' && m === 'POST') {
    const b = await jsonBody(req);
    let tabs;
    if (b.action === 'apply') tabs = forceLookOnTabs(store.config, store.config.theme);
    else if (b.action === 'restore') { if (!store.config.lookUndo) return fail(res, 400, 'Nothing to put back'); tabs = restoreTabs(store.config); }
    else return fail(res, 400, 'Unknown action');
    store.writeConfig(); broadcast('config', {});
    return ok(res, { tabs });
  }
  // ---- The Brew Process (☰ Menu > Brew Process): everyone sees it, admins change it, operators start the Brew Day
  if (p === '/ui/brewprocess' && m === 'GET') {
    const v = recipeValues(store.config, { mash: brewProfiles.mash.list(), boil: brewProfiles.boil.list(), water: brewProfiles.water.list() });
    return ok(res, { steps: MAJOR_STEPS, fields: FIELDS, setup: brewSetup(store.config), templates: processTemplates.list(), recipeFields: RECIPE_FIELDS,
      recipe: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, plain(x)])), processes: brewNames(brewSetup(store.config)).filter(n => engine.exists(n)) });
  }
  if (p === '/ui/brewprocess' && m === 'PUT') {
    const b = await jsonBody(req), cur = brewSetup(store.config);
    for (const s of MAJOR_STEPS) { const n = b.templates?.[s.key]; if (n !== undefined) { if (n !== SKIP && !processTemplates.find(s.key, n)) return fail(res, 400, `${s.title}: no Process Template "${n}"`); cur.templates[s.key] = n; } }
    for (const f of Object.keys(FIELDS)) if (b.fields && f in b.fields) { if (b.fields[f]) cur.fields[f] = String(b.fields[f]); else delete cur.fields[f]; }
    store.config.brewProcess = cur; store.writeConfig(); broadcast('config', {});
    return ok(res, cur);
  }
  const bpt = /^\/ui\/brewprocess\/template\/([A-Za-z_]+)\/([A-Za-z0-9_-]+)$/.exec(p);
  if (bpt && m === 'GET') { const t = processTemplates.find(bpt[1], bpt[2]); return t ? ok(res, t) : fail(res, 404, 'No Process Template ' + bpt[2]); }
  if (bpt && m === 'PUT') { processTemplates.saveUser(bpt[1], bpt[2], (await jsonBody(req)).text ?? ''); return ok(res); }
  if (bpt && m === 'DELETE') { processTemplates.deleteUser(bpt[1], bpt[2]); return ok(res); }
  if (p === '/ui/brewprocess/build' && m === 'POST') {
    const out = buildBrewDay(brewSetup(store.config), processTemplates, store.config.elements ?? []);
    const busy = out.map(x => x.name).filter(n => engine.running.has(n));
    if (busy.length) return fail(res, 409, `Stop ${busy.join(', ')} before building the Brew Day again`);
    store.config.processClasses ??= {};
    for (const { name, text } of out) {
      if (engine.exists(name) && engine.read(name) !== text) engine.backup(name);      // the one it replaces is kept as .bak
      store.config.processClasses[name] = 'flow';
      engine.write(name, text);
    }
    // a Brew_ Process the list no longer has (a step skipped or renamed, or the numbers moved) goes to the bin, so only one
    // chain of Brew_ Processes is left (it can be brought back from there)
    const keep = new Set(out.map(x => x.name)), gone = [];
    for (const n of engine.list().map(x => x.name ?? x).filter(isBrewName)) if (!keep.has(n) && !engine.running.has(n)) { engine.remove(n); gone.push(n); }
    store.writeConfig(); engine.renumber();
    return ok(res, { built: out.map(x => x.name), removed: gone });
  }
  if (p === '/ui/brewprocess/start' && m === 'POST') {
    const first = brewNames(brewSetup(store.config))[0];
    if (!first || !engine.exists(first)) return fail(res, 400, 'Build the Brew Day first (☰ Menu > Brew Process)');
    engine.start(first, me.name || 'user'); return ok(res);
  }
  // Simulation mode: everyone sees it, admins change it
  if (p === '/ui/sim' && m === 'GET') return ok(res, { ...sim.status(), upcoming: sim.upcoming() });
  if (p === '/ui/sim' && m === 'PUT') { sim.save(await jsonBody(req)); broadcast('config', {}); return ok(res, sim.status()); }
  const tl = /^\/ui\/sim\/timeline\/([^/]+)$/.exec(p);
  if (tl && m === 'GET') { if (!engine.exists(tl[1])) return fail(res, 404, 'No process ' + tl[1]); return ok(res, timeline(engine, tl[1])); }
  if (p === '/ui/sim/skip' && m === 'POST') {
    const b = await jsonBody(req);
    if (b.next) return ok(res, { ok: true, ...sim.skipToNext() });
    return ok(res, { ok: true, skipped: sim.skip(Number(b.seconds) * 1000) });
  }
  if (p === '/ui/mqtt' && m === 'GET') return ok(res, mqttView());
  if (p === '/ui/mqtt' && m === 'PUT') {
    const body = await jsonBody(req), old = store.config.mqtt ?? {};
    const c = {
      enabled: !!body.enabled, host: String(body.host ?? '').trim(), port: Number(body.port) || (body.tls ? 8883 : 1883), tls: !!body.tls,
      username: String(body.username ?? '').trim(), password: body.password === undefined ? (old.password ?? '') : String(body.password),
      baseTopic: String(body.baseTopic ?? 'brewpanel').trim() || 'brewpanel',
      homeAssistant: { enabled: body.homeAssistant?.enabled !== false, prefix: String(body.homeAssistant?.prefix ?? 'homeassistant').trim() || 'homeassistant' },
      scripts: Array.isArray(body.scripts) ? body.scripts.map(String) : (old.scripts ?? []),
      items: cleanItems(store, body.items && typeof body.items === 'object' ? body.items : (old.items ?? {})),
    };
    store.config.mqtt = c; store.writeConfig(); mqtt.restart(); broadcast('config', {});
    return ok(res, mqttView());
  }
  if (p === '/ui/import/beerxml' && m === 'POST') return ok(res, { ok: true, ...importBeerXml(await readBody(req), store, store.config.beerxml) });
  if (p === '/ui/import/brucontrol' && m === 'POST') {
    const q = url.searchParams;
    if (q.get('preview') !== '1' && schemas.lockedProfile()) return fail(res, 409, lockedMsgFor(schemas.lockedProfile()));
    const conv = convertBruControl(await readBody(req, 64 * 1024 * 1024), { mediaFolder: q.get('media') ?? 'Images', simulate: q.get('simulate') !== '0' });
    const missingMedia = conv.media.filter(f => { const full = findMedia(f); return !full || !fs.existsSync(full); });
    const out = { summary: conv.summary, warnings: conv.warnings, missingMedia, mediaCount: conv.media.length, autostart: conv.autostart };
    if (q.get('preview') === '1') return ok(res, { ok: true, preview: true, ...out });
    const applied = applyBruControl(conv, { store, engine, mode: q.get('mode') === 'merge' ? 'merge' : 'replace', overwriteScripts: q.get('overwrite') !== '0' });
    hw.restart();
    return ok(res, { ok: true, ...out, ...applied });
  }
  // Config Editor (admin only, see needRole)
  // The Config Editor never shows the hidden keys; on Save each item gets its key back by its name (lib/keys.js)
  if (p === '/ui/config/open' && m === 'POST') { const b = backupConfigFile(store); return ok(res, { ok: true, text: stripKeysText(fs.readFileSync(CONFIG, 'utf8')), backup: b.name, made: b.made, file: path.relative(ROOT, CONFIG) }); }
  if (p === '/ui/config/check' && m === 'POST') return ok(res, { ok: true, problem: checkConfigText(await readBody(req, 16 * 1024 * 1024), DATA) });
  if (p === '/ui/config' && m === 'PUT') {
    let text = await readBody(req, 16 * 1024 * 1024);
    try { const problem = checkConfigText(text, DATA); if (problem) return ok(res, { ok: false, problem }); } catch { /* applyConfigText says what is wrong */ }
    try { text = JSON.stringify(keepKeysByName(dropKeys(JSON.parse(text)), store.config), null, 2); } catch { /* not JSON: applyConfigText says so */ }
    try { return ok(res, { ok: true, ...applyConfigText(text, { store, engine, hw, pictures, dataDir: DATA }) }); }
    catch (e) { if (e.problem) return ok(res, { ok: false, problem: e.problem }); throw e; }
  }
  if (p === '/ui/config/backups' && m === 'GET') return ok(res, listBackups(store));
  const cb = /^\/ui\/config\/backups\/([^/]+?)(\/restore)?$/.exec(p);
  if (cb && m === 'GET' && !cb[2]) return ok(res, stripKeysText(readBackup(store, cb[1])));
  if (cb && m === 'POST' && cb[2]) {
    const r = applyConfigText(readBackup(store, cb[1]), { store, engine, hw, pictures, dataDir: DATA });
    return ok(res, { ok: true, ...r, text: stripKeysText(fs.readFileSync(CONFIG, 'utf8')) });
  }
  if (p === '/ui/samples' && m === 'GET') return ok(res, listSamples(SAMPLES));
  const smp = /^\/ui\/samples\/([\w-]+)\/load$/.exec(p);
  if (smp && m === 'POST') {
    const meta = listSamples(SAMPLES).find(x => x.id === smp[1]); if (!meta) return fail(res, 404, 'No such sample');
    // a sample comes in as a new Schema; the pick on the very first start fills (and names) the one you have.
    // Clone a Schema can name it (Fritz, 2026-10-28: the 1, 2 and 3 vessel samples clone to a User Schema like any other)
    const b = await jsonBody(req).catch(() => ({})), want = String(b?.name ?? '').trim();
    if (want && schemas.list().some(x => x.name.toLowerCase() === want.toLowerCase())) return fail(res, 400, `There is already a Schema called "${want}"`);
    const sname = want || meta.name;
    if (!store.config.chooseSample) { hw.allOff?.(); schemas.startNew(sname); } else if (store.config.schema) store.config.schema.name = schemas.freeName(sname);
    // its Interfaces are all simulated, and the whole panel goes to Simulator mode too, as for a new empty Schema (Rule 10.5)
    const wasSim = sim.cfg.on;
    if (!wasSim) sim.save({ on: true });
    return ok(res, { ...loadSample(SAMPLES, smp[1], { store, engine, hw }), schema: store.config.schema, wasSim });
  }

  // Schemas: everyone sees the list, admins load, add, rename and delete
  const schemaView = () => ({ active: store.config.schema, list: schemas.list() });
  if (p === '/ui/schemas' && m === 'GET') return ok(res, schemaView());
  // Schema Templates (templates/schema, Rule 16.6): the questions' starting points, and the real Interfaces they can use
  if (p === '/ui/schematemplates' && m === 'GET') {
    const dir = path.join(ROOT, 'templates', 'schema');
    const list = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => { try { return { name: f.slice(0, -5), ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }; } catch { return null; } }).filter(Boolean) : [];
    return ok(res, { templates: list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)), interfaces: schemas.realInterfaces() });
  }
  if (p === '/ui/schemas' && m === 'POST') {
    const b = await jsonBody(req);
    const real = b.iface ? schemas.realInterfaces().find(d => d.name === b.iface) : null;
    if (b.iface && !real) return fail(res, 400, `There is no Interface called "${b.iface}"`);
    schemas.create(b.name, { empty: !!b.empty });
    if (real) schemas.useInterface(real);
    // a new empty Schema (not a copy) has only its simulated New_Mega_2560_N: the whole panel goes to Simulator mode (Fritz, 2026-10-27)
    const wasSim = sim.cfg.on;
    if (b.empty && !wasSim) sim.save({ on: true });
    return ok(res, { ...schemaView(), simulator: !!b.empty, wasSim, iface: b.empty ? store.config.devices[0]?.name : undefined, real: !!real });
  }
  // the Equipment Profile of one Tab of the loaded Schema (b.tab: the Tab's name), and its Default Layout
  if (p === '/ui/schema/profile' && m === 'PUT') { const b = await jsonBody(req); const r = schemas.setProfile(b.tab, b.id || null, { layout: b.layout }); return ok(res, { ...schemaView(), ...r }); }
  if (p === '/ui/schema/layout' && m === 'POST') { const b = await jsonBody(req); return ok(res, schemas.layoutAction(b.tab, b.action)); }
  // Open a Schema file (Fritz, 2026-11-06): the files the BruControl Importer saved in the Brewing folder's Import subfolder,
  // or a .json file sent from this browser. It becomes a new Schema; its Processes are written (an old one that differs is backed up).
  if (p === '/ui/schemas/importfolder' && m === 'GET') return ok(res, listSchemaFiles(importFolder(ROOT)));
  if (p === '/ui/schemas/import' && m === 'POST') {
    const pick = url.searchParams.get('file');
    let raw;
    if (pick) {
      if (!/^[^\\/:*?"<>|]+\.json$/i.test(pick)) return fail(res, 400, 'Pick a .json file from the Import folder');
      try { raw = fs.readFileSync(path.join(importFolder(ROOT), pick), 'utf8'); } catch { return fail(res, 404, 'That file is not in the Import folder any more'); }
    } else raw = await readBody(req, 64 * 1024 * 1024);
    let got;
    try { got = readSchemaFile(dropKeys(JSON.parse(raw))); } catch (e) { return fail(res, 400, e instanceof SyntaxError ? 'That file is not a Skynet Schema file (it is not JSON).' : e.message); }
    const made = schemas.addFromFile(got.schema, { from: pick || got.source || 'a .json file' });
    const procs = { written: [], backedUp: [], same: [], failed: [] };
    for (const { name, text } of got.processes) {
      try {
        if (engine.exists(name)) {
          if (engine.read(name) === text) { procs.same.push(name); continue; }
          engine.backup(name); procs.backedUp.push(name);
        }
        engine.write(name, text); procs.written.push(name);
      } catch (e) { procs.failed.push(`${name} (${e.message})`); }
    }
    if (procs.written.length) engine.renumber();
    if (url.searchParams.get('load') === '1') schemas.load(made.id);
    return ok(res, { ...schemaView(), made, processes: procs, draft: got.draft, warnings: got.warnings.slice(0, 200), warningCount: got.warnings.length });
  }
  let sc = /^\/ui\/schemas\/([a-z0-9-]+)(?:\/(load|backup|backups|restore|version|export|clone))?$/.exec(p);
  if (sc) {
    if (!schemas.has(sc[1])) return fail(res, 404, 'No such Schema');
    if (sc[2] === 'backup' && m === 'POST') return ok(res, { ok: true, file: schemas.backupSchema(sc[1]) });
    if (sc[2] === 'export' && m === 'GET') return ok(res, dropKeys(schemas.exportSchema(sc[1])));     // the file you keep has no keys: a Schema loaded from it gets new ones
    if (sc[2] === 'backups' && m === 'GET') return ok(res, schemas.listBackups(sc[1]));
    if (sc[2] === 'restore' && m === 'POST') { const b = await jsonBody(req); schemas.restore(sc[1], b.file, { version: !!b.version }); return ok(res, schemaView()); }
    if (sc[2] === 'version' && m === 'POST') { const r = schemas.newVersion(sc[1]); return ok(res, { ...schemaView(), ...r }); }
    if (sc[2] === 'clone' && m === 'POST') { const b = await jsonBody(req); const made = schemas.clone(sc[1], b.name, { load: !!b.load }); return ok(res, { ...schemaView(), made }); }
    if (sc[2] === 'load' && m === 'POST') { schemas.load(sc[1]); return ok(res, schemaView()); }
    if (!sc[2] && m === 'PUT') { schemas.rename(sc[1], (await jsonBody(req)).name); return ok(res, schemaView()); }
    if (!sc[2] && m === 'DELETE') { schemas.remove(sc[1]); return ok(res, schemaView()); }
  }
  // The Recipe (☰ Menu > Recipe): everyone sees it, brewers (operators) import, change and save it
  if (p === '/ui/recipe' && m === 'GET') {
    const v = recipeView(currentRecipe() ?? blankRecipe(store.config.brewDefaults ?? {}), store.config.brewDefaults ?? {});
    for (const a of v.schedule.alerts) { const f = store.resolveMedia(a.audio); a.audioFound = !!f && fs.existsSync(f); }
    return ok(res, { ...v, has: !!currentRecipe(), saved: recipes.list(), alerts: hopAlerts.status() });
  }
  // a voice file for one hop alert, made on a text to voice web site and put here: media/Audio/Hops/<name>
  if (p === '/ui/recipe/audio' && m === 'PUT') {
    const name = url.searchParams.get('name') ?? '';
    if (!/^[\w.-]+\.(mp3|wav|ogg|m4a)$/i.test(name)) return fail(res, 400, 'A voice file must be .mp3, .wav, .ogg or .m4a');
    try { const r = await mediaFiles.upload(req, 0, 'Audio/Hops', name, true); return ok(res, { ok: true, ...r }); } catch (e) { return fail(res, 400, e.message); }
  }
  if (p === '/ui/recipe' && m === 'PUT') { useRecipe(await jsonBody(req)); return ok(res, recipeView(currentRecipe(), store.config.brewDefaults ?? {})); }
  if (p === '/ui/recipe/new' && m === 'POST') { useRecipe(blankRecipe(store.config.brewDefaults ?? {})); return ok(res); }
  if (p === '/ui/recipe/import' && m === 'POST') {
    const got = readRecipeFile(await readBody(req, 32 * 1024 * 1024, true), url.searchParams.get('file') ?? '', url.searchParams.get('pick') ?? undefined);
    useRecipe(got.recipe); return ok(res, { names: got.names, name: got.recipe.name });
  }
  if (p === '/ui/recipe/save' && m === 'POST') { const b = await jsonBody(req); const s = recipes.save(currentRecipe() ?? {}, b.id || undefined); return ok(res, { id: s.id, saved: recipes.list() }); }
  if (p === '/ui/recipe/alerts' && m === 'POST') {
    const b = await jsonBody(req);
    const text = b.action === 'stop' ? (hopAlerts.stop(), 'Hop alerts stopped') : hopAlerts.start(b.timer || undefined, 'Recipe tab');
    engine.print('system', text); return ok(res, { text, alerts: hopAlerts.status() });
  }
  sc = /^\/ui\/recipes\/([a-z0-9-]+)(?:\/(open))?$/.exec(p);
  if (sc) {
    if (!recipes.has(sc[1])) return fail(res, 404, 'No such saved Recipe');
    if (sc[2] === 'open' && m === 'POST') { useRecipe(recipes.get(sc[1])); return ok(res); }
    if (!sc[2] && m === 'DELETE') { recipes.remove(sc[1]); return ok(res, { saved: recipes.list() }); }
  }
  // Mash, Boil, Water, Tab Background and Valve Profiles: everyone sees them, admins make and change them
  sc = /^\/ui\/profiles\/(mash|boil|water|tab|valve)(?:\/([a-z0-9-]+))?$/.exec(p);
  if (sc) {
    const ps = brewProfiles[sc[1]];
    if (!sc[2] && m === 'GET') return ok(res, ps.list());
    if (!sc[2] && m === 'POST') { const b = await jsonBody(req); const made = ps.create(b.name, { from: b.from, units: b.units }); return ok(res, { made: made.id, list: ps.list() }); }
    if (sc[2] && !ps.has(sc[2])) return fail(res, 404, 'No such profile');
    if (sc[2] && m === 'PUT') { const q = ps.save(sc[2], await jsonBody(req)); return ok(res, { saved: q, list: ps.list() }); }
    if (sc[2] && m === 'DELETE') { ps.remove(sc[2]); return ok(res, { list: ps.list() }); }
  }
  // Vessel and Bundled Fitting Templates: everyone sees them, admins make and change them (Skynet ones only while Skynet builds them)
  if (p === '/ui/templates' && m === 'GET') return ok(res, templates.view());
  sc = /^\/ui\/templates\/(vessel|fitting|device)(?:\/([A-Za-z0-9_-]+))?$/.exec(p);
  if (sc) {
    if (!sc[2] && m === 'POST') { const b = await jsonBody(req); const made = templates.create(sc[1], b.name, { from: b.from, skynet: b.skynet }); return ok(res, { made: made.name, ...templates.view() }); }
    if (sc[2] && m === 'GET') return ok(res, templates.get(sc[1], sc[2]));
    if (sc[2] && m === 'PUT') { const t = templates.save(sc[1], sc[2], await jsonBody(req)); return ok(res, { saved: t, ...templates.view() }); }
    if (sc[2] && m === 'DELETE') { templates.remove(sc[1], sc[2]); return ok(res, templates.view()); }
  }
  // Equipment Profiles: everyone sees them, admins make and change them
  const profileView = () => profiles.list().map(q => ({ ...withVolumes(q), usedBy: schemas.usedBy(q.id), usedOn: schemas.usedOn(q.id) }));
  if (p === '/ui/equipment' && m === 'GET') return ok(res, profileView());
  if (p === '/ui/equipment' && m === 'POST') {
    const b = await jsonBody(req), made = profiles.create(b.name, b.from);
    if (b.assign) schemas.setProfile(b.tab, made.id, { layout: b.layout });   // "Make it unique" or "Use it on this Tab": the new one goes on that Tab
    return ok(res, { made: made.id, list: profileView() });
  }
  sc = /^\/ui\/equipment\/([a-z0-9-]+)(\/lock)?$/.exec(p);
  if (sc) {
    if (!profiles.has(sc[1])) return fail(res, 404, 'No such Equipment Profile');
    if (sc[2] && m === 'PUT') {
      const on = !!(await jsonBody(req)).locked;
      schemas.lockProfile(sc[1], on, me.name);
      return ok(res, { list: profileView() });
    }
    if (sc[2]) return fail(res, 405, 'Use PUT');
    if (m === 'GET') return ok(res, withVolumes(profiles.get(sc[1])));
    if (m === 'PUT') { const q = profiles.save(sc[1], await jsonBody(req)); broadcast('config', {}); return ok(res, { saved: withVolumes(q), list: profileView() }); }
    if (m === 'DELETE') {
      const q = profiles.get(sc[1]); if (q.locked) return fail(res, 409, lockedMsgFor(q));
      schemas.dropProfile(sc[1], q.graphics || []); profiles.remove(sc[1]); return ok(res, { list: profileView() });
    }
  }
  if (p === '/ui/ports' && m === 'GET') return ok(res, await hw.listPorts());
  // Board Talk (Rule 6.27): the lines to and from a board, sending one, and Pause communications
  if (p === '/ui/boardtalk' && m === 'GET') { try { return ok(res, hw.talkSince(String(url.searchParams.get('name') ?? ''), Number(url.searchParams.get('after')) || 0)); } catch (e) { return fail(res, 400, e.message); } }
  if (p === '/ui/boardtalk' && m === 'POST') {
    const body = await jsonBody(req);
    try {
      if (typeof body.pause === 'boolean') {
        hw.pause(String(body.name ?? ''), body.pause);
        const d = store.config.devices?.find(x => x.name === body.name); if (d) { if (body.pause) d.paused = true; else delete d.paused; store.writeConfig(); }
        return ok(res, { ok: true });
      }
      hw.talkSend(String(body.name ?? ''), cleanTalkLine(body.line));
      return ok(res, { ok: true });
    } catch (e) { return fail(res, 400, e.message); }
  }
  if (p === '/ui/log/names' && m === 'GET') return ok(res, logger.names());
  // a Chart Widget's lines (Rule 1.26): /ui/chart?names=A,B&from=ms&to=ms&points=400
  if (p === '/ui/chart' && m === 'GET') {
    const sp = url.searchParams, names = (sp.get('names') || '').split(',').map(x => x.trim()).filter(Boolean).slice(0, 2);
    return ok(res, logger.chartSeries({ names, from: sp.get('from'), to: sp.get('to'), points: sp.get('points') }));
  }
  // Log page > Download CSV: pick values (or a saved CSV set) and a time span; the file is named after them
  if (p === '/ui/log/export.csv' && m === 'GET') {
    const sp = url.searchParams, names = (sp.get('names') || '').split(',').map(s => s.trim()).filter(Boolean), tz = Number(sp.get('tz')) || 0;
    const rows = logger.exportRows({ names, from: sp.get('from'), to: sp.get('to') });
    const label = sp.get('label') || (names.length === 1 ? names[0] : names.length ? `${names.length}_values` : 'All');
    const name = csvFileName(label, rows, tz);
    res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Disposition': `attachment; filename="${name}"` });
    return res.end(buildCsv(rows, { names, layout: sp.get('layout'), tz }));
  }
  if (p === '/ui/log/sets' && m === 'PUT') { store.config.logSets = cleanLogSets((await jsonBody(req)).sets); store.writeConfig(); broadcast('config', {}); return ok(res); }
  let s = /^\/ui\/log\/now\/(.+)$/.exec(p);
  if (s && m === 'POST') { logger.logNow(s[1], 'ondemand'); return ok(res); }
  // Database Groups (Rule 6.14): ➕ Add new Group… and ✏ Change name in an item's Database and .API box
  if (p === '/ui/dbgroups' && m === 'POST') {
    const g = addGroup(store.config, (await jsonBody(req)).name);
    store.writeConfig(); broadcast('config', {});
    return ok(res, { group: g });
  }
  if (p === '/ui/dbgroups/rename' && m === 'POST') {
    const b = await jsonBody(req), g = groupById(store.config, b.id);
    if (!g) return fail(res, 404, 'That Group is gone');
    const to = checkGroupName(store.config, b.name, g.id), from = g.name;
    g.name = to; store.writeConfig(); broadcast('config', {});
    // Update All: every Process line send_db_group / start_db_group / stop_db_group Old gets the New Name
    const changed = [];
    if (from !== to) for (const name of engine.names()) {
      const text = engine.read(name), out = renameGroupInText(text, from, to);
      if (out === text) continue;
      engine.backup(name); engine.write(name, out);
      changed.push({ name, running: engine.running.has(name) });
    }
    return ok(res, { group: g, processes: changed });
  }

  // scripts
  if (p === '/ui/scripts' && m === 'GET') return ok(res, engine.list());
  if (p === '/ui/scripts/check' && m === 'POST') return ok(res, engine.check(await readBody(req)));
  if (p === '/ui/scripts/words' && m === 'GET') return ok(res, processWords());
  if (p === '/ui/scripts/addsteps' && m === 'POST') return ok(res, { text: addSteps(await readBody(req)) });
  s = /^\/ui\/scripts\/([^/]+)(?:\/(start|stop|restart|rename|class|autorestart|order|version))?$/.exec(p);
  if (s) {
    const name = s[1], act = s[2];
    if (act === 'version' && m === 'POST') return ok(res, { version: engine.newVersion(name) });
    if (act === 'class' && m === 'POST') { const { cls } = await jsonBody(req); engine.setClass(name, cls); return ok(res); }
    if (act === 'start' && m === 'POST') return ok(res, engine.start(name, 'user'));
    if (act === 'stop' && m === 'POST') return ok(res, { ok: engine.stop(name) });
    if (act === 'restart' && m === 'POST') return ok(res, await engine.restart(name, 'user'));
    if (act === 'order' && m === 'POST') { const { n } = await jsonBody(req); return ok(res, { order: engine.setOrder(name, n) }); }
    if (act === 'autorestart' && m === 'POST') { const { on } = await jsonBody(req); engine.setAutoRestart(name, !!on); return ok(res); }
    if (act === 'rename' && m === 'POST') {          // the Process keeps its hidden key; the other Processes that start or stop it follow
      const { to } = await jsonBody(req), from = cleanName(name), now = cleanName(to);
      engine.rename(from, now);
      const auto = store.config.autostart ?? [];
      if (auto.includes(from)) { store.config.autostart = auto.map(n => n === from ? now : n); store.writeConfig(); }
      if (followProcessRename(store.config.elements, from, now)) { store.writeConfig(); broadcast('config', {}); }     // its Process Widgets follow (Rule 1.31)
      return ok(res, { ok: true, processes: renameInProcesses(engine, new Map([[from, now]])) });
    }
    if (!act && m === 'GET') { if (!engine.exists(name)) return fail(res, 404, 'No process ' + name); return send(res, 200, engine.read(name), 'text/plain; charset=utf-8'); }
    if (!act && m === 'PUT') {
      if (!engine.exists(name)) checkFileName(name, { ext: false, what: 'Process' });   // a new Process is the file scripts/<name>.txt (public/names.js)
      // saved in the new style (alm_Hops = true, my_Widget.visible = false), then every step is renumbered
      const mod = modernize(await readBody(req), n => store.get(n));
      engine.write(name, mod.text);
      engine.renumber();
      const text = engine.read(name);
      return ok(res, { ...engine.check(text), text, modernized: mod.changed });
    }
    if (!act && m === 'DELETE') { engine.remove(name); return ok(res); }
  }
  // Recycle Bin of deleted Processes: list and look for everyone, restore or erase for admins (needRole)
  if (p === '/ui/recycle' && m === 'GET') return ok(res, engine.binList());
  s = /^\/ui\/recycle\/([^/]+?)(\/restore)?$/.exec(p);
  if (s) {
    const id = s[1];
    if (!s[2] && m === 'GET') return send(res, 200, engine.binRead(id), 'text/plain; charset=utf-8');
    if (s[2] && m === 'POST') {
      const { as } = await jsonBody(req);
      try { return ok(res, { ok: true, ...engine.binRestore(id, as) }); } catch (e) { if (e.code === 409) return ok(res, { ok: false, taken: true, msg: e.message }); throw e; }
    }
    if (!s[2] && m === 'DELETE') { engine.binPurge(id); return ok(res); }
  }
  // An outside link from the panel on this computer opens in the default browser, not in Skynet's clean Edge window (lib/appwindow.js).
  // Only for a page on this same computer: a phone or another PC opens its links itself.
  if (p === '/ui/openlink' && m === 'POST') {
    const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(clientIp(req)) && !req.headers['x-forwarded-for'];
    let url = ''; try { url = String((await jsonBody(req))?.url ?? ''); } catch { /* no body: nothing to open */ }
    return ok(res, { opened: local && CLOSABLE ? openInDefaultBrowser(url) : false });
  }
  if (p === '/ui/stopall' && m === 'POST') { engine.stopAll(); return ok(res); }
  // ☰ Menu > Close Skynet Brewer (Fritz, 2026-10-30): stops the panel, and the launcher then closes its Command Prompt window.
  // Every open page is told first, so a phone shows that the panel was closed, not just "lost connection".
  if (p === '/ui/close' && m === 'POST') {
    if (!CLOSABLE) return fail(res, 400, 'The panel runs as a service here (it starts by itself with the Brain), so it is not closed from the panel.');
    console.log(`Closed from the panel by ${me?.name ?? 'an admin'}`);
    broadcast('closing', { by: me?.name ?? '' });
    ok(res); setTimeout(() => shutdown({ closeWindow: true }), 300);
    return;
  }

  // ☰ Menu > Move Brain (Fritz, 2026-11-03, Rule 9.9, lib/brainmove.js): from a computer Brain to a Pi (or any new Brain)
  if (p.startsWith('/ui/brainmove')) {
    if (p === '/ui/brainmove' && m === 'GET') {
      const now = await hw.listPorts(), last = lastMove(DATA), ifs = usbInterfaces(path.dirname(CONFIG), store.config);
      const oldPorts = [...new Set(ifs.map(x => x.port))];
      return ok(res, { interfaces: ifs, ports: now, suggest: suggestPorts(oldPorts, last?.usbPorts ?? [], now.ports), service: !CLOSABLE, platform: process.platform,
        last: last && { from: last.from, made: last.made, movedIn: last.movedIn, platform: last.platform, usbPorts: last.usbPorts ?? [] },
        checked: fs.existsSync(checkedFile(ROOT)), minPassword: MIN_MOVE_PASSWORD });
    }
    // 1. Make a Brain Move file (on the old Brain): everything saved first, then one locked file to download
    if (p === '/ui/brainmove/export' && m === 'POST') {
      const { password } = await jsonBody(req);
      auth.flush(); store.persistNow();
      const tmp = path.join(os.tmpdir(), `skynet-brewlog-${process.pid}-${Date.now()}.db`);
      try {
        try { logger.copyTo(tmp); } catch (e) { console.log('Brew log copy for the Brain Move file failed: ' + e.message); }
        const r = makeMoveFile({ dirs: { ...MOVE_DIRS, media: store.mediaRoots()[0] }, password, brewlogCopy: tmp, ports: (await hw.listPorts()).ports,
          version: PANEL_VERSION?.version ?? '', from: os.hostname(), mediaRoots: store.config.mediaRoots ?? [] });
        console.log(`Brain Move file made by ${me?.name ?? 'an admin'}: ${r.manifest.files} files`);
        res.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Length': r.file.length, 'Cache-Control': 'no-store', 'Content-Disposition': `attachment; filename="${r.fileName}"` });
        return res.end(r.file);
      } catch (e) { return fail(res, 400, e.message); }
      finally { fs.rmSync(tmp, { force: true }); }
    }
    // 2. Bring in a Brain Move file (on the new Brain): unlocked and checked, then it waits for "Move in now"
    if (p === '/ui/brainmove/import' && m === 'PUT') {
      try {
        const buf = await readBody(req, MAX_MOVE, true);
        const man = saveChecked(ROOT, unlock(buf, decodeURIComponent(req.headers['x-move-password'] ?? '')));
        return ok(res, { ok: true, from: man.from, made: man.made, platform: man.platform, version: man.version, files: man.files, bytes: man.bytes, interfaces: man.interfaces ?? [], notMoved: man.notMoved ?? [] });
      } catch (e) { return fail(res, 400, e.message); }
    }
    // "Move in now": the panel stops; as it starts again the old Brain's files go in place
    if (p === '/ui/brainmove/go' && m === 'POST') {
      try { stageMove(ROOT); } catch (e) { return fail(res, 400, e.message); }
      console.log(`Brain Move started by ${me?.name ?? 'an admin'}: the panel stops and puts the old Brain's files in place when it starts again`);
      broadcast('closing', { by: me?.name ?? '', moving: true, service: !CLOSABLE });
      ok(res, { ok: true, service: !CLOSABLE }); setTimeout(() => shutdown({ closeWindow: CLOSABLE }), 300);
      return;
    }
    // USB ports: each old port becomes the new one, in every Schema at once
    if (p === '/ui/brainmove/ports' && m === 'POST') {
      const { map } = await jsonBody(req), clean = {};
      for (const [from, to] of Object.entries(map ?? {})) { const t = String(to ?? '').trim(); if (t && t !== from) clean[from] = t; }
      if (!Object.keys(clean).length) return ok(res, { ok: true, changed: 0 });
      const live = remapConfig(store.config, clean);
      if (live) store.writeConfig();
      const others = remapSchemaFiles(path.dirname(CONFIG), clean, store.config.schema?.id);
      if (live) hw.restart();
      store.emit('devices');
      console.log(`USB ports changed by ${me?.name ?? 'an admin'}: ${Object.entries(clean).map(([a, b]) => `${a} -> ${b}`).join(', ')}`);
      return ok(res, { ok: true, changed: live + others });
    }
  }

  // media files by path
  if (p === '/media' && m === 'GET') {
    const f = findMedia(url.searchParams.get('path') ?? '');
    if (!f) return fail(res, 403, 'That path is not inside a media folder (see Settings > Media folders)');
    return sendFile(req, res, pictures.pick(f, url.searchParams.get('as')));   // as=original / as=svg for side-by-side previews
  }
  // File Move page (admin only, see needRole): copy files and folders from your computer to the Brain
  if (p.startsWith('/ui/filemove/')) {
    const q = Object.fromEntries(url.searchParams);
    if (p === '/ui/filemove/kinds' && m === 'GET') return ok(res, { kinds: Object.fromEntries(Object.entries(MOVE_KINDS).map(([k, v]) => [k, v.label])), brain: ROOT });
    if (p === '/ui/filemove/missing' && m === 'GET') return ok(res, { missing: missingMedia(store.config, findMedia) });
    if (p === '/ui/filemove/check' && m === 'POST') return ok(res, { items: fileMove.check((await jsonBody(req)).items) });
    if (p === '/ui/filemove/upload' && m === 'PUT') {
      try {
        const r = await fileMove.save(req, q.kind, q.path, q.overwrite === '1');
        if (q.kind === 'pictures') { pictures.forget(r.full); pictures.add(r.full); }
        if (q.kind === 'processes') engine.emit('scripts');         // the Processes list shows the new one
        return ok(res, { ok: true, saved: r.saved, use: r.use });
      } catch (e) { return fail(res, e.code === 409 ? 409 : 400, e.message); }
    }
    return fail(res, 404, 'Unknown File Move route');
  }
  // Get Skynet pictures (admin only, see needRole): what GitHub has that this Brain is missing, then copy them
  if (p === '/ui/skynetpics/check' && m === 'GET') return ok(res, await skynetPics.check());
  if (p === '/ui/skynetpics/get' && m === 'POST') {
    const { paths } = await jsonBody(req);
    const r = await skynetPics.get(Array.isArray(paths) ? paths.map(String) : [], f => pictures.add(f));
    if (r.saved.length) broadcast('media', {});
    return ok(res, { ok: true, ...r });
  }
  // Media page
  if (p.startsWith('/ui/media/')) {
    const q = Object.fromEntries(url.searchParams), root = Number(q.root) || 0;
    if (p === '/ui/media/list' && m === 'GET') return ok(res, mediaFiles.list(root, q.dir ?? ''));
    if (p === '/ui/media/tree' && m === 'GET') return ok(res, mediaFiles.tree(root));
    if (p === '/ui/media/groups' && m === 'GET') return ok(res, { groups: listGroups(store._findMedia('Images')) });
    if (p === '/ui/media/all' && m === 'GET') return ok(res, { files: mediaFiles.all(root, q.dir ?? '') });
    if (p === '/ui/media/upload' && m === 'PUT') {
      try {
        const r = await mediaFiles.upload(req, root, q.dir ?? '', q.name ?? '', q.overwrite === '1');
        for (const u of r.saved) { const f = resolveMedia(u); if (f) { pictures.forget(f); pictures.add(f); } }
        return ok(res, { ok: true, ...r });
      } catch (e) { return fail(res, e.code === 409 ? 409 : 400, e.message); }
    }
    const b = m === 'GET' ? {} : await jsonBody(req);
    if (p === '/ui/media/folder' && m === 'POST') { mediaFiles.mkdir(b.root, b.path); return ok(res); }
    if (p === '/ui/media/rename' && m === 'POST') { const from = mediaFiles.resolve(b.root, b.from); mediaFiles.rename(b.root, b.from, b.to); pictures.forget(from); pictures.add(mediaFiles.resolve(b.root, b.to)); return ok(res); }
    if (p === '/ui/media/delete' && m === 'POST') { const f = mediaFiles.resolve(b.root, b.path); mediaFiles.remove(b.root, b.path); pictures.forget(f); return ok(res); }
    return fail(res, 404, 'Unknown media route');
  }
  // Help tab: everyone reads, admins edit
  if (p === '/ui/help' && m === 'GET') return ok(res, help.list());
  if (p === '/ui/help' && m === 'POST') { const { title } = await jsonBody(req); return ok(res, { ok: true, name: help.create(title) }); }
  const hp = /^\/ui\/help\/([^/]+)$/.exec(p);
  if (hp) {
    try {
      if (m === 'GET') return send(res, 200, help.read(hp[1]), 'text/plain; charset=utf-8');
      if (m === 'PUT') { help.write(hp[1], await readBody(req, 1024 * 1024 + 1)); return ok(res); }
      if (m === 'DELETE') { help.remove(hp[1]); return ok(res); }
    } catch (e) { return fail(res, e.code === 404 ? 404 : 400, e.message); }
  }

  // PNG/JPG -> SVG pictures
  if (p === '/ui/pictures' && m === 'GET') return ok(res, pictures.status());
  if (p === '/ui/pictures/convert' && m === 'POST') { const { force } = await jsonBody(req); return ok(res, { ok: true, queued: pictures.convertAll(!!force) }); }
  if (p === '/ui/pictures/mode' && m === 'PUT') { pictures.setMode((await jsonBody(req)).mode); if (pictures.mode !== 'off') pictures.convertAll(false); broadcast('config', {}); return ok(res); }
  if (p === '/ui/pictures/choice' && m === 'PUT') { const { path: rel, use } = await jsonBody(req); pictures.setChoice(String(rel), use); broadcast('config', {}); return ok(res); }

  // static UI
  if (m === 'GET') {
    const f = path.join(PUBLIC, p === '/' ? 'index.html' : path.normalize(p).replace(/^([\\/])+/, ''));
    if (!f.startsWith(PUBLIC)) return fail(res, 403, 'Forbidden');
    return sendFile(req, res, f);
  }
  fail(res, 404, 'Not found');
}

const server = http.createServer((req, res) => {
  res.setHeader('X-Frame-Options', 'DENY');               // the panel cannot be hidden inside another site's page
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  route(req, res).catch(e => { if (!res.headersSent) fail(res, 400, e.message); });
});
const PORT = Number(process.env.PORT ?? store.config.port ?? 8080);
server.listen(PORT, () => {
  console.log(`Panel version: ${PANEL_VERSION.version || 'not stamped (not from a GitHub merge)'}`);
  console.log(`Skynet Brew Panel running:  http://localhost:${PORT}`);
  console.log(`Config:  ${CONFIG}\nProcesses: ${SCRIPTS}\nData:    ${DATA}`);
  pictures.start();
  if (auth.needsSetup()) console.log('No users yet: open the panel from a computer or phone on your home network to create the admin account.');
  for (const n of store.config.autostart ?? []) { try { engine.start(n, 'autostart'); } catch (e) { console.error(e.message); } }
  // Windows: the panel opens in its own clean window, whatever .bat started it (Rule 2.36, lib/appwindow.js)
  if (CLOSABLE && !IMPORT_BUILD) { const how = openAppWindow(`http://localhost:${PORT}`, { port: PORT }); if (how !== 'none') console.log(how === 'app' ? 'Opened the panel in its own window.' : 'Opened the panel in your browser (no Edge or Chrome found).'); }
  if (!IMPORT_BUILD) minimizeWindow();
});
// Skynet Brewer double-clicked while the panel is already running (its window was closed with its X): open the window again
server.on('error', e => {
  if (e.code === 'EADDRINUSE' && CLOSABLE && !IMPORT_BUILD && process.platform === 'win32') {
    console.log(`The panel is already running on port ${PORT}. Opening its window again.`);
    openAppWindow(`http://localhost:${PORT}`, { port: PORT, list: () => [] });
    setTimeout(() => process.exit(0), 1500);
    return;
  }
  throw e;
});

// Windows (Fritz, 2026-10-30): once the panel is up and the browser has opened it, Skynet_Brewer.bat's Command Prompt window
// goes down to the task bar (the .bat sets SKYNET_MINIMIZE=1). PowerShell shares this console, so it minimizes this window.
function minimizeWindow() {
  if (process.platform !== 'win32' || process.env.SKYNET_MINIMIZE !== '1') return;
  const ps = "Add-Type -Name W -Namespace S -MemberDefinition '[DllImport(\"kernel32.dll\")] public static extern System.IntPtr GetConsoleWindow(); [DllImport(\"user32.dll\")] public static extern bool ShowWindow(System.IntPtr h, int c);'; [void][S.W]::ShowWindow([S.W]::GetConsoleWindow(), 6)";
  setTimeout(() => {
    try { spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', ps], { stdio: 'ignore', windowsHide: false }).on('error', () => {}); } catch { /* the window just stays open */ }
  }, 6000);
}

// A panel started as a service (systemd sets INVOCATION_ID, for example on a Pi) restarts by itself, so only a panel started
// from its window (Skynet_Brewer.bat, the Linux or Mac launcher, npm start) can be closed from ☰ Menu.
const CLOSABLE = !process.env.INVOCATION_ID;
// closeWindow: closed from ☰ Menu, so on Windows its Command Prompt window closes too, whatever .bat started it (Rule 2.25)
function shutdown({ closeWindow = false } = {}) {
  console.log('Stopping...'); auth.flush(); engine.stopAll(); control.stop(); store.persistNow(); mqtt.stop(); hw.stop(); pictures.stop(); logger.close();
  if (!IMPORT_BUILD) closeAppWindow();   // the panel's own clean window closes with it (Rule 2.36); the normal browser is never touched (the Importer's Build page leaves the real panel's window alone)
  if (closeWindow) closeLauncherWindow();
  process.exit(0);
}
// SIGHUP: the black window was closed with its X (Windows gives the panel a few seconds to stop)
process.on('SIGINT', () => shutdown()); process.on('SIGTERM', () => shutdown()); process.on('SIGHUP', () => shutdown());
