// BruControl configuration import (.brucfg).
// BruControl saves its whole setup (interfaces, device ports, workspaces, elements, scripts) as one XML file.
// This turns it into Brew Panel devices, elements, workspaces and script files, keeping every setting we can use
// and storing the rest under "bru" on each item so nothing is lost.

import { retireGlobals, reportLines } from './globals.js';
import { importAlarms, foldStacked, stackedLeft, foldLines } from './fold.js';
import { modernize, spaceRenames, renameInText, renameDeep } from './modernize.js';

// ---------------------------------------------------------------- XML
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const decode = s => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : (ENT[e.toLowerCase()] ?? m));
const local = n => n.slice(n.indexOf(':') + 1);

// XML -> {tag, type, nil, children, text}. Tags lose their namespace prefix; i:type and i:nil are kept.
export function parseXml(xml) {
  const root = { tag: '#root', children: [], text: '' };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<!\[CDATA\[([\s\S]*?)\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<\/\s*([\w:.-]+)\s*>|<\s*([\w:.-]+)([^>]*?)(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(xml))) {
    const top = stack[stack.length - 1];
    if (m[1] !== undefined) top.text += m[1];
    else if (m[2]) {
      const tag = local(m[2]);
      while (stack.length > 1 && stack[stack.length - 1].tag !== tag) stack.pop();
      if (stack.length > 1) stack.pop();
    } else if (m[3]) {
      const node = { tag: local(m[3]), children: [], text: '' };
      for (const a of m[4].matchAll(/([\w:.-]+)\s*=\s*"([^"]*)"/g)) {
        const n = local(a[1]);
        if (n === 'type') node.type = a[2];
        if (n === 'nil') node.nil = a[2] === 'true';
      }
      top.children.push(node);
      if (!m[5]) stack.push(node);
    } else if (m[6]) top.text += decode(m[6]);
  }
  return root;
}

const kid = (n, tag) => n?.children.find(c => c.tag === tag);
const kids = (n, tag) => n?.children.filter(c => c.tag === tag) ?? [];
const at = (n, p) => p.split('/').reduce((x, t) => kid(x, t), n);
const txt = (n, p) => { const k = at(n, p); return k && !k.nil ? k.text.trim() : ''; };
const num = (n, p, d = null) => { const v = parseFloat(txt(n, p)); return Number.isFinite(v) ? v : d; };
const bool = (n, p) => txt(n, p).toLowerCase() === 'true';

// ---------------------------------------------------------------- value helpers
// ISO 8601 duration (PT1M, -PT0.5S, P1DT2H) -> seconds
export function isoSeconds(s) {
  const m = /^(-)?P(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(String(s ?? '').trim());
  if (!m) return null;
  const v = (+m[2] || 0) * 86400 + (+m[3] || 0) * 3600 + (+m[4] || 0) * 60 + (+m[5] || 0);
  return m[1] ? -v : v;
}
const hms = s => { const a = Math.abs(Math.round(s)); const p = n => String(n).padStart(2, '0'); return (s < 0 ? '-' : '') + p(Math.floor(a / 3600)) + ':' + p(Math.floor(a % 3600 / 60)) + ':' + p(a % 60); };

// .NET ARGB integer -> CSS color
export function argb(v) {
  if (v === '' || v === null || v === undefined) return undefined;
  const u = Number(v) >>> 0, a = u >>> 24, r = (u >> 16) & 255, g = (u >> 8) & 255, b = u & 255;
  const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  return a === 255 ? hex : `rgba(${r},${g},${b},${+(a / 255).toFixed(2)})`;
}

function font(n) {
  if (!n || !n.children.length) return undefined;
  const style = txt(n, 'Style');
  const f = { size: num(n, 'Size'), family: txt(n, 'FontFamily') || undefined };
  if (/bold/i.test(style)) f.bold = true;
  if (/italic/i.test(style)) f.italic = true;
  return f;
}

// "C:\BruControl\Media\wave\x.wav" -> "<folder>/wave/x.wav"
export function mediaPath(p, folder = 'Images') {
  p = String(p ?? '').trim();
  if (!p) return '';
  const norm = p.replace(/\\/g, '/');
  const i = norm.toLowerCase().lastIndexOf('/media/');
  const rest = i >= 0 ? norm.slice(i + 7) : norm.slice(norm.lastIndexOf('/') + 1);
  return folder ? `${folder.replace(/[\\/]+$/, '')}/${rest}` : rest;
}

// Calibrations (applied in order to the raw reading)
function calibrations(calValue) {
  const out = [];
  for (const c of kids(kid(calValue, 'Calibrations'), 'Calibration')) {
    const t = (c.type ?? '').replace(/Calibration$/, '');
    const o = { type: t[0].toLowerCase() + t.slice(1), enabled: txt(c, 'Enabled') !== 'false' };
    for (const k of c.children) {
      if (k.tag === 'Enabled') continue;
      if (k.tag === 'Rows') o.rows = kids(k, 'Row').map(r => [num(r, 'X', 0), num(r, 'Y', 0)]);
      else { const v = k.text.trim(); o[k.tag[0].toLowerCase() + k.tag.slice(1)] = v !== '' && Number.isFinite(+v) ? +v : v; }
    }
    out.push(o);
  }
  return out;
}

const VIS = v => /hidden/i.test(v) ? 'hidden' : 'visible';
const VAR_TYPES = { Value: 'value', String: 'string', TimeSpan: 'time', DateTime: 'datetime', Bool: 'bool', Boolean: 'bool' };
const PORT_TYPES = {
  DigitalOutPort: 'digitalOut', DigitalInPort: 'digitalIn', AnalogInPort: 'analogIn', OWTempPort: 'temperature',
  PWMOutPort: 'pwmOut', DutyCyclePort: 'dutyCycle', HysteresisPort: 'hysteresis', PIDPort: 'pid',
  SPISensorPort: 'temperature', CounterInPort: 'analogIn',
};
const lowerFirst = s => s[0].toLowerCase() + s.slice(1);

// ---------------------------------------------------------------- convert
// opts: { mediaFolder: 'Images', simulate: true }
export function convertBruControl(xml, opts = {}) {
  const folder = opts.mediaFolder ?? 'Images';
  const media = p => mediaPath(p, folder);
  const doc = parseXml(xml.replace(/^\uFEFF/, ''));
  const cfg = kid(doc, 'Configuration');
  if (!cfg) throw new Error('This is not a BruControl configuration file (no <Configuration>)');
  const warnings = [];
  const mediaUsed = new Set();
  const useMedia = p => { const m = media(p); if (m) mediaUsed.add(m); return m; };

  // ---- interfaces -> devices; ports indexed by ID
  const devices = [], ports = new Map();
  for (const d of kids(kid(cfg, 'Devices'), 'Device')) {
    const name = txt(d, 'Name');
    const iface = txt(d, 'Interface');
    const net = /tcp|network|ethernet|wifi/i.test(iface);
    const real = net
      ? { type: 'esp32', host: txt(d, 'Address'), port: num(d, 'Port', 5000) }
      : { type: 'serial', port: /^\d+$/.test(txt(d, 'SerialPort')) ? 'COM' + txt(d, 'SerialPort') : txt(d, 'SerialPort'), baud: num(d, 'BaudRate', 115200) };
    const dev = { name, ...real, enabled: txt(d, 'Enabled') !== 'false' };
    if (opts.simulate) { dev.realType = dev.type; dev.type = 'simulator'; }
    dev.bru = {
      id: txt(d, 'ID'), interface: iface, typeName: txt(d, 'TypeName'), wiringMap: txt(d, 'WiringMap'),
      refreshInterval: num(d, 'RefreshInterval'), receiveTimeout: num(d, 'ReceiveTimeout'), logging: bool(d, 'LoggingEnabled'),
      address: txt(d, 'Address'), tcpPort: num(d, 'Port'), serialPort: txt(d, 'SerialPort'), baudRate: num(d, 'BaudRate'),
    };
    devices.push(dev);
    for (const p of kids(kid(d, 'Ports'), 'DevicePort')) ports.set(txt(p, 'ID'), { dev: name, port: p, kind: p.type });
  }

  // ---- scripts (Processes)
  const scripts = [], procNames = new Map(), autostart = [];
  for (const p of kids(kid(cfg, 'Processes'), 'Process')) {
    const name = txt(p, 'Name'); if (!name) continue;
    procNames.set(txt(p, 'ID'), name);
    const s = at(p, 'Script');
    scripts.push({ name, text: s && !s.nil ? s.text.replace(/\r\n?/g, '\n') : '', userControl: bool(p, 'UserControl') });
    if (bool(p, 'AutoStart')) autostart.push(name);
  }

  // ---- first pass: element name for every port (so hysteresis/PID inputs and alarm outputs can be named)
  const wsNodes = kids(kid(cfg, 'Workspaces'), 'Workspace');
  const portName = new Map();
  for (const w of wsNodes) for (const e of kids(kid(w, 'Elements'), 'Element'))
    if (e.type === 'DeviceElement') portName.set(txt(e, 'PortID'), txt(e, 'Name'));
  const portRef = id => (id && !/^0{8}-/.test(id) && portName.get(id)) || undefined;

  // ---- workspaces + elements
  const workspaces = [], elements = [], names = new Set();
  for (const w of wsNodes) {
    const wsName = txt(w, 'Name');
    const ws = { name: wsName };
    const bg = txt(w, 'BackgroundImagePath');
    let maxX = 0, maxY = 0;
    if (bg) { ws.background = useMedia(bg); ws.bgX = 0; ws.bgY = 0; ws.bgW = num(w, 'BackgroundImageWidth', 800); ws.bgH = num(w, 'BackgroundImageHeight', 600); maxX = ws.bgW; maxY = ws.bgH; }
    if (bool(w, 'Hidden')) ws.hidden = true;
    ws.bru = { backgroundWidth: num(w, 'BackgroundImageWidth'), backgroundHeight: num(w, 'BackgroundImageHeight') };

    for (const e of kids(kid(w, 'Elements'), 'Element')) {
      const el = element(e, wsName);
      if (!el) continue;
      if (names.has(el.name)) {
        let i = 2; while (names.has(`${el.name}_${i}`)) i++;
        warnings.push(`Element "${el.name}" is used twice (workspace "${wsName}"): the second one is named "${el.name}_${i}"`);
        el.name = `${el.name}_${i}`;
      }
      names.add(el.name);
      elements.push(el);
      maxX = Math.max(maxX, el.x + el.w); maxY = Math.max(maxY, el.y + el.h);
    }
    ws.width = Math.max(800, Math.ceil(maxX / 10) * 10 + 20);
    ws.height = Math.max(600, Math.ceil(maxY / 10) * 10 + 20);
    workspaces.push(ws);
  }

  function element(e, wsName) {
    const name = txt(e, 'Name');
    if (!name) { warnings.push(`An element without a name on "${wsName}" was skipped`); return null; }
    const ap = kid(e, 'Appearance');
    const el = { name, type: '', workspace: wsName, x: num(e, 'X', 0), y: num(e, 'Y', 0), w: num(e, 'Width', 100), h: num(e, 'Height', 60) };
    const bru = { id: txt(e, 'ID'), elementType: e.type };

    // ---- what it is
    switch (e.type) {
      case 'GlobalVariableElement': {
        el.type = 'global';        // becomes a vKonstant or vAPI at the end (lib/globals.js)
        const vt = txt(e, 'VariableType');
        el.dataType = VAR_TYPES[vt] ?? 'value';
        if (!VAR_TYPES[vt]) warnings.push(`Global "${name}": variable type "${vt}" imported as a value`);
        const p = num(e, 'Precision'); if (p !== null) el.precision = p;
        const v = txt(e, 'Value');
        if (el.dataType === 'time') { const s = isoSeconds(v); el.initial = s !== null ? hms(s) : v || '00:00:00'; }
        else if (el.dataType === 'value') el.initial = Number.isFinite(+v) ? +v : 0;
        else if (el.dataType === 'bool') el.initial = /^true$/i.test(v);
        else el.initial = v;
        if (txt(e, 'Format')) el.format = txt(e, 'Format');
        if (txt(e, 'VariableName')) bru.variableName = txt(e, 'VariableName');
        break;
      }
      case 'ToggleSwitchElement': el.type = 'switch'; break;
      case 'TimerElement': {
        el.type = 'timer';
        el.timerType = /down/i.test(txt(e, 'Type')) ? 'countdown' : 'countup';
        const rv = isoSeconds(txt(e, 'ResetValue')); if (rv) el.resetValue = hms(rv);
        const v = isoSeconds(txt(e, 'Value')); if (v) el.initial = hms(v);
        if (bool(e, 'InitRunning')) el.initRunning = true;
        if (txt(e, 'Format')) el.format = txt(e, 'Format');
        bru.alarms = kids(kid(e, 'Alarms'), 'TimerAlarm').map(a => ({ enabled: bool(a, 'Enabled'), threshold: hms(isoSeconds(txt(a, 'Threshold')) ?? 0), alarmId: txt(a, 'AlarmID') }));
        break;
      }
      case 'AlarmElement': {
        el.type = 'alarm';
        el.loop = bool(e, 'Loop');
        el.sounds = ['SoundFile', 'SoundFile2', 'SoundFile3'].map(k => txt(e, k) ? useMedia(txt(e, k)) : '');
        el.fileIndex = num(e, 'FileIndex', 1);
        el.soundMode = (txt(e, 'Sound') || 'Default').toLowerCase();
        el.sound = el.sounds[el.fileIndex - 1] || el.sounds.find(Boolean) || '';
        if (txt(e, 'OnImagePath')) el.imageOn = useMedia(txt(e, 'OnImagePath'));
        if (txt(e, 'OffImagePath')) el.imageOff = useMedia(txt(e, 'OffImagePath'));
        const out = portRef(txt(e, 'DigitalOutputID')); if (out) el.output = out;
        if (bool(e, 'EmailNotification')) el.email = true;
        break;
      }
      case 'ScriptElement': {
        // shows a script's variable; BruControl users also use these as script-driven pictures
        el.type = 'picture';
        const proc = procNames.get(txt(e, 'ProcessID'));
        if (proc) el.script = proc;
        if (txt(e, 'VariableName')) el.variable = txt(e, 'VariableName');
        if (proc && bool(e, 'UserControl')) { el.tap = 'script'; el.tapTarget = proc; }
        break;
      }
      case 'DeviceElement': {
        const ref = ports.get(txt(e, 'PortID'));
        if (!ref) { warnings.push(`Device element "${name}" points to a port that is not in the file; skipped`); return null; }
        el.type = PORT_TYPES[ref.kind];
        if (!el.type) { warnings.push(`Device element "${name}": port type "${ref.kind}" is not supported yet; skipped`); return null; }
        Object.assign(el, port(ref, name));
        // Fritz names every valve "VGC...": a digital output becomes a valve (two IP ends, flow either way when open),
        // a PWM output becomes a proportional valve
        if (/^VGC/i.test(name)) {
          if (el.type === 'digitalOut') el.subtype = 'valve';
          else if (el.type === 'pwmOut') el.subtype = 'propValve';
        }
        break;
      }
      default:
        warnings.push(`Element "${name}": type "${e.type}" is not supported yet; skipped`);
        return null;
    }

    // ---- how it looks
    if (txt(e, 'DisplayName')) el.displayName = txt(e, 'DisplayName');
    el.visibility = VIS(txt(ap, 'Visibility'));
    if (txt(ap, 'Visibility') === 'HiddenLocked') bru.visibility = 'HiddenLocked';
    if (txt(ap, 'NameVisibility') === 'Hidden') el.hideName = true;
    const bv = txt(ap, 'BorderVisibility'); if (bv && bv !== 'Default') el.border = bv.toLowerCase();
    const imgs = kids(kid(ap, 'BackgroundImages'), 'string').map(s => s.text.trim() ? useMedia(s.text.trim()) : '');
    if (imgs.some(Boolean)) { el.images = imgs; el.background = Math.max(1, num(ap, 'BackgroundImageIndex', 0)); }
    const col = { nameColor: 'NameForeColor', nameBg: 'NameBackColor', valueColor: 'ValueForeColor', valueBg: 'ValueBackColor' };
    for (const [k, t] of Object.entries(col)) { const c = argb(txt(ap, t)); if (c) el[k] = c; }
    const nf = font(kid(ap, 'NameFont')), vf = font(kid(ap, 'ValueFont'));
    if (nf) el.nameFont = nf;
    if (vf) el.valueFont = vf;
    const ve = num(ap, 'ValueEnlargement'); if (ve) el.valueEnlarge = ve;
    for (const [k, t] of [['nameAlign', 'NameAlignment'], ['valueAlign', 'ValueAlignment']]) { const a = txt(ap, t); if (a && a !== 'Default') el[k] = a; }
    const kind = txt(ap, 'DisplayKind');
    if (kind === 'DigitalGauge') {
      const st = txt(ap, 'DigitalGaugeOptions/Style');
      el.look = /ice|cold|blue|night/i.test(st) ? 'lcd' : 'led';
      bru.gauge = { kind, style: st, digits: num(ap, 'DigitalGaugeOptions/DigitCount') };
    } else if (kind === 'StateIndicator') {
      el.look = 'indicator';
      el.onColor = txt(ap, 'IndicatorOptions/OnColor').toLowerCase();
      el.offColor = txt(ap, 'IndicatorOptions/OffColor').toLowerCase();
    } else if (/Gauge/.test(kind)) {
      const o = kid(ap, kind + 'Options');
      bru.gauge = { kind, ...Object.fromEntries((o?.children ?? []).map(c => [lowerFirst(c.tag), c.text.trim()])) };
    }
    const tt = txt(ap, 'TextDisplayOptions/TrueText'), ft = txt(ap, 'TextDisplayOptions/FalseText');
    if (tt) el.onText = tt;
    if (ft) el.offText = ft;
    if (txt(e, 'UserControl') === 'false' && !el.tap) el.tap = 'none';
    bru.enableButton = txt(ap, 'EnableButtonVisibility') || undefined;
    bru.showSecondaryValue = txt(ap, 'ShowSecondaryValue') === 'true';
    el.bru = bru;
    return el;
  }

  function port({ dev, port: p, kind }, name) {
    const o = { device: dev, channel: num(p, 'Number', 0), enabled: txt(p, 'Enabled') !== 'false' };
    const bru = { portId: txt(p, 'ID'), portType: kind, refreshMultiple: num(p, 'RefreshMultiple'), primaryDisplayChannel: num(p, 'PrimaryDisplayChannel') };
    if (bool(p, 'ActiveLow')) o.activeLow = true;
    const cal = kid(p, 'CalValue') ?? kid(p, 'Temperature');
    if (cal) {
      const cals = calibrations(cal);
      if (cals.length) o.calibrations = cals;
      const pr = num(cal, 'Precision'); if (pr !== null) o.precision = pr;
      if (txt(cal, 'Prefix')) o.prefix = txt(cal, 'Prefix');
      if (txt(cal, 'Suffix')) o.units = txt(cal, 'Suffix');
    }
    switch (kind) {
      case 'DigitalOutPort': {
        const os = num(p, 'OneShot', 0);
        if (os > 0) { o.oneShot = os; o.oneShotDirection = bool(p, 'OneShotDirection'); }
        const dt = num(p, 'DualThrowPortNum', -1);
        if (dt >= 0) { o.dualThrowChannel = dt; o.dualThrowDelay = num(p, 'DualThrowDelay', 0); }
        bru.savedState = bool(p, 'State');
        break;
      }
      case 'AnalogInPort': o.avgWeight = num(p, 'AvgWeight', 100); o.pollRate = num(p, 'PollRate', 1000); break;
      case 'OWTempPort':
        o.sensorIndex = num(p, 'SensorIndex', 0); o.probe = '';
        o.units ??= /fahr/i.test(txt(p, 'Unit')) ? '°F' : /cel/i.test(txt(p, 'Unit')) ? '°C' : '';
        bru.unit = txt(p, 'Unit');
        break;
      case 'PWMOutPort': bru.requestedValue = num(p, 'CalValue/RequestedValue'); break;
      case 'DutyCyclePort': o.dutyCycle = num(p, 'DutyCycle', 0); o.interval = num(p, 'Interval', 1000); break;
      case 'HysteresisPort':
        o.input = portRef(txt(p, 'InputPortID')); o.target = num(p, 'Target', 0);
        o.onOffset = num(p, 'OnOffset', 0); o.onDelay = num(p, 'OnDelay', 0);
        if (bool(p, 'PredictiveHysteresis')) o.predictive = true;
        if (!o.input) warnings.push(`Hysteresis "${name}": its input sensor was not found`);
        break;
      case 'PIDPort':
        o.input = portRef(txt(p, 'InputPortID')); o.target = num(p, 'Target', 0);
        for (const k of ['Kp', 'Ki', 'Kd']) o[k.toLowerCase()] = num(p, k, 0);
        o.maxOutput = num(p, 'MaxOutput', 100); o.maxIntegral = num(p, 'MaxIntegral', 100);
        o.calcTime = num(p, 'CalcTime', 1); o.outTime = num(p, 'OutTime', 1);
        o.reversed = bool(p, 'Reversed'); o.pwm = bool(p, 'Pwm');
        if (!o.input) warnings.push(`PID "${name}": its input sensor was not found`);
        break;
    }
    o.bruPort = bru;
    return o;
  }

  // move port details into el.bru
  for (const el of elements) if (el.bruPort) { Object.assign(el.bru, el.bruPort); delete el.bruPort; }

  const temps = elements.filter(e => e.type === 'temperature' && !e.probe).length;
  if (temps) warnings.push(`${temps} OneWire temperature probe(s) need their probe picked on the Devices page (BruControl numbers them by bus position; the Brew Panel uses each probe's ROM id)`);

  // BruControl Globals become vKonstant / vAPI by their name (gbl, RP_ -> vA_, x deleted): see lib/globals.js
  const retired = retireGlobals({ elements }, scripts);
  // alarm kinds + alm_Name = true, then fold stacked look-alikes (gblS_Brewery_Top_1/2/3) into one: lib/fold.js
  const alarms = importAlarms(retired.cfg.elements, retired.scripts);
  const folded = foldStacked({ elements: retired.cfg.elements }, alarms.scripts);
  let els = folded.cfg.elements;
  // Names have no spaces: "Test Timer" -> Test_Timer (the screen still shows the old name), Processes too
  const map = spaceRenames(els.map(e => e.name));
  for (const [from, to] of spaceRenames(folded.scripts.map(s => s.name))) map.set(from, to);
  if (map.size) {
    for (const el of els) if (map.has(el.name)) el.displayName ??= el.name;
    const keep = els.map(e => e.displayName);
    renameDeep(els, map);
    els.forEach((e, i) => { if (keep[i] !== undefined) e.displayName = keep[i]; });
    for (let i = 0; i < autostart.length; i++) autostart[i] = map.get(autostart[i]) ?? autostart[i];
    warnings.push(`${map.size} name(s) had spaces and now use underscores: ${[...map].slice(0, 5).map(([a, b]) => `"${a}" -> ${b}`).join(', ')}${map.size > 5 ? ' ...' : ''}`);
  }
  // Processes in the new style: alm_Hops = true, Kettle_SP = 185.5, my_Widget.visible = false
  const byName = new Map(els.map(e => [e.name, e]));
  let modern = 0;
  folded.scripts = folded.scripts.map(sc => {
    const m = modernize(renameInText(sc.text, map), n => byName.get(n));
    modern += m.changed;
    return { ...sc, name: map.get(sc.name) ?? sc.name, text: m.text };
  });
  if (modern) warnings.push(`${modern} Process line(s) rewritten in the new style (the name alone for the main value, name.attribute for the rest)`);
  const byType = {};
  for (const el of els) byType[el.type] = (byType[el.type] ?? 0) + 1;
  warnings.push(...reportLines(retired.report));
  warnings.push(...foldLines(folded.report, alarms.report, stackedLeft(els)));

  return {
    devices, workspaces, elements: els, scripts: folded.scripts, autostart,
    media: [...mediaUsed].sort(),
    activeWorkspace: workspaces[num(cfg, 'ActiveWorkspaceIndex', 0)]?.name,
    summary: { devices: devices.length, workspaces: workspaces.length, elements: els.length, scripts: scripts.length, byType },
    globals: retired.report, folded: folded.report, alarms: alarms.report,
    warnings,
  };
}

// ---------------------------------------------------------------- apply to the running panel
// mode 'replace': the BruControl file becomes the configuration (pipes and pictures on kept workspaces stay).
// mode 'merge': items with the same name are updated, new ones added, everything else is kept.
export function applyBruControl(conv, { store, engine, mode = 'replace', overwriteScripts = true }) {
  const c = store.config;
  const byName = (list, add) => { const m = new Map(list.map(x => [x.name, x])); for (const x of add) m.set(x.name, x); return [...m.values()]; };
  let workspaces, elements, devices;
  if (mode === 'merge') {
    workspaces = byName(c.workspaces, conv.workspaces.map(w => ({ ...c.workspaces.find(o => o.name === w.name), ...w })));
    elements = byName(c.elements, conv.elements);
    devices = byName(c.devices, conv.devices);
  } else {
    workspaces = conv.workspaces; elements = conv.elements; devices = conv.devices;
  }
  const wsNames = new Set(workspaces.map(w => w.name));
  const graphics = (c.graphics ?? []).filter(g => wsNames.has(g.workspace));
  // stop scripts first: their elements are about to change
  engine.stopAll();
  store.saveLayout({ workspaces, elements, graphics });
  c.devices = devices;
  const scripts = { written: [], skipped: [], backedUp: [] };
  for (const s of conv.scripts) {
    try {
      if (engine.exists(s.name)) {
        const old = engine.read(s.name);
        if (old === s.text) { scripts.written.push(s.name); continue; }
        if (!overwriteScripts) { scripts.skipped.push(s.name); continue; }
        engine.backup(s.name); scripts.backedUp.push(s.name);
      }
      engine.write(s.name, s.text); scripts.written.push(s.name);
    } catch (e) { scripts.skipped.push(`${s.name} (${e.message})`); }
  }
  c.autostart = mode === 'merge' ? [...new Set([...(c.autostart ?? []), ...conv.autostart])] : conv.autostart;
  store.writeConfig();
  engine.renumber();
  // check every imported script against the new elements
  const problems = [];
  for (const n of scripts.written) {
    const chk = engine.check(engine.read(n));
    if (chk.errors.length) problems.push({ script: n, errors: chk.errors.slice(0, 5), more: Math.max(0, chk.errors.length - 5) });
  }
  return { scripts, problems };
}
