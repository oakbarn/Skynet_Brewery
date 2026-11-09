// Right-click Help (Fritz): which Help page, and which part of it, explains an item on a tab or on the Menu Bar.
// Each answer is [page, section]: the page name without its number is enough, the section is the id of a heading on it
// (the heading in lower case, every run of other characters turned into one "-"). test/helpmap.test.js checks they all exist.

// the screens on the Menu Bar (data-view of each button)
const VIEWS = {
  workspace: ['tabs'], scripts: ['scripts'], globals: ['variables'], log: ['log'], devices: ['devices'], media: ['media'],
  filemove: ['file-move'], import: ['import'], settings: ['settings'], help: ['editing-help'], config: ['schema-json'],
};
export const viewTopic = v => VIEWS[v] || null;      // Help for the page you are on (the Help button)
const DEVICE = ['devices', 'putting-a-device-on-a-tab'];

// a device or widget element (the things added with Add Device / Add Widget)
export function elementTopic(e) {
  if (!e) return null;
  if (e.integratedIn) return ['skynet-integrated-devices'];
  // a Temperature Probe, plain, Thermowell or probe tee: the Pump's drill-down (Fritz, 2026-11-05, Rule 18.26, Help 138)
  if (e.type === 'temperature' && !e.template && !e.kind) return ['temperature-probe-device-properties'];
  if (e.subtype === 'thermowell') return ['probe-tees-and-thermowells-on-pipes', 'thermowells'];     // Rule 5.30, Help 132
  if (e.subtype === 'probeTee') return ['pipe-widgets-from-fritzs-drawings', 'tees-with-a-temperature-probe'];   // Fritz, 2026-11-02
  if (e.subtype === 'propValve') return ['proportional-valves'];      // Skynet KLD20T and the User Defined one (Fritz, 2026-11-03, Help 117)
  // a Motorized Ball Valve, Skynet or User Defined: the Pump's drill-down without a Cover (Fritz, 2026-11-05, Rule 18.23, Help 128)
  if (e.type === 'digitalOut' && e.subtype === 'valve' && !e.kind && e.valveType !== 'manual' && (!e.template || /^Skynet_Motorized_Ball_Valve_/.test(e.template))) return ['motorized-ball-valve-device-properties'];
  // a PWM output or an Analog output: the Pump's drill-down (Fritz, 2026-11-05, Rule 18.25, Help 136)
  if (['pwmOut', 'analogOut'].includes(e.type) && !e.kind && !e.template && !['propValve', 'element'].includes(e.subtype)) return ['pwm-and-analog-out-device-properties'];
  if (e.template && e.templateCls === 'skynet') return ['skynet-device-templates'];      // a User version of a Skynet Device Template
  switch (e.type) {
    case 'digitalOut':
      if (e.subtype === 'valve' && e.valveType === 'manual') return ['manual-valves'];
      if (e.subtype === 'valve' && e.tapwater) return ['tap-water-valves'];
      if (e.subtype === 'pump' && !e.kind) return ['pump-device-properties', 'dc-pumps-pump-speed-and-pump-facts'];      // Rule 18.32, Help 163
      if (e.subtype === 'element' && !e.kind && !e.template) return ['heating-element-device-properties'];      // the Pump's drill-down (Fritz, 2026-11-05, Help 137)      // the drill-down (Fritz, 2026-11-03, Rule 18.12)
      return DEVICE;
    case 'deadband': return ['deadband-device'];      // as in BruControl (Fritz, 2026-11-05, Rule 6.17, Help 126)
    case 'stepper': return ['stepper-motors'];
    case 'alarm': return e.alarmClass ? ['alarm-widget'] : ['alarms-and-sound'];      // the Alarm Widget subclasses (Fritz, 2026-11-02)
    case 'soundPlayer': return ['alarms-and-sound', 'sound-player'];
    case 'timer': return ['timer-widget'];
    case 'chart': return ['graph-widget'];      // the Graph Widget (was Chart), Rule 1.26
    case 'valueWidget': case 'timeWidget': case 'dateTimeWidget': return ['value-time-and-datetime-widgets'];     // Rule 1.23 (Fritz, 2026-11-05)      // Timer Widget Properties (Fritz, 2026-10-29)
    case 'codeValueWidget': return ['code-value-widget'];      // Rule 1.27 (OakBarn Brewery, 2026-11-08)
    case 'gGlobal':       // the six variable Kinds have their own page (Fritz, 2026-11-02); the on-screen kinds stay on Variables
      if (['string', 'graphic', 'value', 'bool', 'time', 'datetime'].includes(e.kind ?? 'value')) return ['gglobal-kinds'];
      return e.kind === 'list' ? ['variables', 'gglobal-list-a-dropdown-on-a-tab'] : ['variables', 'gglobal-kinds'];
    case 'picture': return ['picture-widget', 'turns-on-with'];
    case 'switch': case 'pushButton': case 'pulseButton': case 'led': return ['semi-widgets-devices'];     // Rule 1.20 (Fritz, 2026-11-02)
    case 'label': case 'manual': return ['tabs', 'changing-the-layout-admins'];
    case 'temperature': return e.sensor === 'ds18b20' ? ['devices', 'onewire-probes-ds18b20'] : DEVICE;
    default: return DEVICE;      // the other devices on a board pin: outputs, inputs, probes, sensors, flow meters, scales
  }
}

// a Skynet pipe fitting: a tee, elbow, U, reducer or End Cap and nothing else (the same test as isPlainUnit in app.js)
const plainFit = fs => (fs || []).some(f => f.kind !== 'none') && (fs || []).every(f => f.kind === 'none' || (['tee', 'elbow90', 'elbow45', 'u', 'reducer', 'cap', 'check', 'sightGlass'].includes(f.kind) && !f.thermowell));
// a graphic: equipment, an IP or fitting, a pipe or hose, a picture or a text
export function graphicTopic(g) {
  if (!g) return null;
  switch (g.kind) {
    case 'vessel':
      if (g.vesselType === 'bfit' && g.templateCls === 'skynet' && (g.fittings || []).some(f => f.kind === 'valveTee')) return ['valve-tees-and-supply-manifolds'];      // Rule 5.35, Help 146
      if (g.vesselType === 'bfit' && g.templateCls === 'skynet' && (g.fittings || []).some(f => f.kind === 'sightGlass')) return ['sight-glasses'];      // Rule 5.32, Help 139
      if (g.vesselType === 'bfit' && g.templateCls === 'skynet' && plainFit(g.fittings)) return ['tc-pipe-fittings'];      // TC Pipe Fittings (Rule 5.25, Help 124)
      if (g.vesselType === 'bfit' && g.templateCls === 'skynet') return ['skynet-fittings'];
      if (g.vwidget && !g.integrated) return ['vessel-widget'];      // the Vessel Widget class (Fritz, 2026-11-05, Rule 5.31, Help 133)
      if (g.integrated) return g.vesselType === 'rims' ? ['skynet-integrated-devices'] : ['skynet-integrated-electric-kettle'];
      if (g.template && g.templateCls === 'skynet') return ['skynet-vessels'];
      if (g.vesselType === 'bfit' || g.template) return ['vessel-and-fitting-templates', 'tabvessel-and-tabfitting'];
      if (g.bundled) return ['equipment', 'bundle-a-vessel-with-its-ips'];
      return g.vesselType === 'vessel' ? ['vessel-tab'] : ['equipment', 'other-equipment'];
    case 'ip':
      if (g.fitting === 'manualValve' && /Tap_Water_Valve_Hose_Bib\.svg$/.test(g.image || '')) return ['tap-water-valve'];      // Rule 5.33, Help 141
      if (g.fitting === 'manualValve') return ['pipe-fittings-and-manual-valves', 'the-manual-valve-widget'];
      if (g.fitting === 'qd') return ['quick-disconnects-and-qd-hoses', 'the-quick-disconnect-widget'];      // Rule 5.28, Help 127
      if (['elbow90', 'elbow45', 'tee', 'cross'].includes(g.fitting)) return ['tc-pipe-fittings'];
      if (g.fitting && g.fitting !== 'point') return ['pipe-fittings-and-manual-valves', 'pipe-fittings'];
      return ['ip-snap-and-valve-pictures', 'snap-to-align'];
    case 'pipe': return g.qd ? ['quick-disconnects-and-qd-hoses', 'the-quick-disconnect-hose'] : ['pipe-and-hose-flow-colors'];      // Rule 5.21; a QD hose Rule 5.28      // Rule 5.21 (Rule 5.19's pipe angles: Help 105)
    case 'image': return ['picture-paths'];
    case 'clone': return ['cloned-devices', 'a-clone-s-properties'];
    case 'override': return ['override-button'];
    default: return ['text-widget'];      // a Text Widget (its Properties, Fritz 2026-10-29)
  }
}

// a spot on the Menu Bar or the bars under it: the first selector the clicked element sits in wins
const BAR = [
  ['#schemaPick, .schemaPick', ['schemas-and-equipment-profiles', 'pick-and-load-a-schema']],
  ['#menuTabs', ['menu', 'menu-tabs']],
  ['.menuCopy', ['menu-everywhere']],
  ['.menuWrap', ['menu']],
  ['#devKind, #devAdd', ['edit-layout-bar', 'devices-select-device-type-and-add-device']],
  ['#editBar select[data-dev]', ['edit-layout-bar', 'the-shortcuts-pumps-valves-probe-heating-element-pwm']],
  ['#wgtKind, #wgtAdd, #addImg, #addText, #addOverride, #vesselPick, #addManualValve, #addVesselType, #addBoolean, #addValueW, #addTimeW, #addDateTimeW', ['edit-layout-bar', 'widgets']],
  ['#addIpType', ['edit-layout-bar', 'row-2-pipes-fittings-locks-and-tabs']],
  ['#turnBar', ['build-tab-add-button', 'turn-and-flip-a-fitting-or-vessel']],
  ['#cloneDev', ['cloned-devices', 'make-a-clone']],
  ['#buildTab, #saveBuild, #previewBuild, #itemToBuild, #wsTabs .buildTab', ['build-tab']],
  ['#wsTabs', ['tabs', 'using-a-tab-on-brew-day']],
  ['#editBar', ['tabs', 'changing-the-layout-admins']],
  ['#barHelp', ['help-window']],
  ['#barEdit', ['tabs', 'changing-the-layout-admins']],
  ['#simBar', ['simulator-bar']],
  ['#barSim', ['simulator-or-real-boards']],
  ['#soundBtn', ['alarms-and-sound']],
  ['#who', ['login']],
  ['#top', ['getting-started', 'finding-your-way']],
];
export function barTopic(target) {
  const view = target.closest?.('#views button')?.dataset.view;
  if (view) return VIEWS[view] || null;
  return BAR.find(([sel]) => target.closest?.(sel))?.[1] || null;
}

export const TAB_SPOT = ['tab-background'];      // an empty spot on a tab, and Tab settings: its background color and picture
export const DB_TRIGGER = ['database-and-api', 'database'];
export const RIGHT_CLICK_PAGE = ['right-click-help'];
export const ALL_TOPICS = () => [...MENU_ALL(), ...Object.values(VIEWS), DEVICE, TAB_SPOT, DB_TRIGGER, RIGHT_CLICK_PAGE,
  ...['digitalOut', 'stepper', 'alarm', 'soundPlayer', 'timer', 'gGlobal', 'picture', 'label', 'temperature'].map(type => elementTopic({ type, sensor: 'ds18b20' })),
  elementTopic({ type: 'alarm', alarmClass: 'basic' }),
  elementTopic({ type: 'digitalOut', subtype: 'valve', valveType: 'manual' }), elementTopic({ type: 'digitalOut', subtype: 'valve', tapwater: true }),
  elementTopic({ type: 'gGlobal', kind: 'list' }), elementTopic({ type: 'analogOut', subtype: 'propValve' }),
  ...['switch', 'pushButton', 'pulseButton', 'led'].map(type => elementTopic({ type })),
  ...[{ vesselType: 'vessel' }, { vesselType: 'pchiller' }, { bundled: true }, { vesselType: 'bfit' }, { vesselType: 'bfit', templateCls: 'skynet' }, { vesselType: 'bfit', templateCls: 'skynet', fittings: [{ kind: 'tee' }] }, { vesselType: 'vessel', template: 'HLT', templateCls: 'skynet' }].map(v => graphicTopic({ kind: 'vessel', ...v })),
  ...[{ fitting: 'manualValve' }, { fitting: 'manualValve', image: 'Images/Skynet/Valves/Tap_Water_Valve_Hose_Bib.svg' }, { fitting: 'tee' }, {}].map(f => graphicTopic({ kind: 'ip', ...f })),
  ['vessel-and-fitting-templates', 'vessel-template-settings'], ['vessel-and-fitting-templates', 'bundled-fitting-template-settings'],
  graphicTopic({ kind: 'pipe' }), graphicTopic({ kind: 'pipe', hose: true }), graphicTopic({ kind: 'pipe', hose: true, qd: true }), graphicTopic({ kind: 'ip', fitting: 'qd' }), graphicTopic({ kind: 'image' }), graphicTopic({ kind: 'text' }), graphicTopic({ kind: 'clone' }), graphicTopic({ kind: 'override' }),
  ...BAR.map(b => b[1])];

// The yellow ? icons on the ☰ Menu tabs: a heading in a Menu tab goes to the Help part named for it ("_" = any other heading).
// A heading matches when its text starts with the name (after a 🔒). Section headings inside a form only get an icon when named.
const MENU_TOPICS = {
  default: { 'Pipes, hoses': ['default-settings', 'pipes-hoses-and-sizes'], 'Defaults set somewhere': ['default-settings', 'defaults-set-somewhere-else'], 'Default settings': ['default-settings'], Text: ['text-boxes', 'defaults'], 'How amounts show': ['recipe-tab', 'recipe-defaults'], 'Hop alerts': ['recipe-tab', 'recipe-defaults'], _: ['menu', 'the-default-tab'] },
  equipment: { 'Equipment Profile': ['schemas-and-equipment-profiles', 'give-each-tab-its-equipment-profile'],
    'Equipment list': ['schemas-and-equipment-profiles', 'build-the-equipment-list'], 'Made on the Vessel tab': ['vessel-tab'], _: ['schemas-and-equipment-profiles', 'what-is-in-an-equipment-profile'] },
  vessel: { Size: ['vessel-tab', 'size'], Heat: ['vessel-tab', 'heat'], Temperature: ['vessel-tab', 'temperature-probe'], Ports: ['vessel-tab', 'ports-and-build'],
    Build: ['vessel-tab', 'ports-and-build'], _: ['vessel-tab'] },
  vtemplates: { _: ['vessel-and-fitting-templates', 'the-template-panes'] },
  etemplates: { _: ['vessel-and-fitting-templates', 'equipment-template-settings'] },
  ftemplates: { _: ['vessel-and-fitting-templates', 'the-template-panes'] },
  layout: { _: ['schemas-and-equipment-profiles', 'the-default-layout'] },
  mash: { _: ['mash-and-boil-profiles', 'mash-profile'] },
  boil: { _: ['mash-and-boil-profiles', 'boil-profile'] },
  recipe: { 'Hop order': ['recipe-tab', 'hop-schedule-and-alerts'], Alerts: ['recipe-tab', 'hop-schedule-and-alerts'], 'Hop alerts': ['recipe-tab', 'hop-schedule-and-alerts'], _: ['recipe-tab'] },
  water: { _: ['recipe-tab', 'water-profile'] },
  tab: { 'Tabs of the Schema': ['tab-and-valve-profiles', 'give-a-tab-its-profile'], _: ['tab-and-valve-profiles', 'tab-background-profile'] },
  valve: { _: ['tab-and-valve-profiles', 'valve-profile'] },
  skynetpics: { _: ['get-skynet-pictures'] },
  brainmove: { '1. On the OLD Brain': ['move-brain', 'make-the-brain-move-file'], '2. On the NEW Brain': ['move-brain', 'bring-it-in-on-the-new-brain'], '3. On the NEW Brain': ['move-brain', 'usb-ports'], _: ['move-brain'] },
  buildtemplate: { _: ['build-template-tab'] },
  brewprocess: { 'Which Device': ['brew-process', 'which-device-does-each-job'], 'Recipe values': ['brew-process', 'recipe-values'], _: ['brew-process'] },
  schema: { 'Schemas on this Brain': ['schema-switching-and-cloning', 'clone-a-schema'], 'Add a Sample Schema': ['sample-schemas'], _: ['schema-switching-and-cloning'] },
};
export function menuTopic(key, heading, main = true) {
  const m = MENU_TOPICS[key]; if (!m) return null;
  const text = String(heading).replace(/^🔒\s*/, '').trim();
  const named = Object.keys(m).find(k => k !== '_' && text.startsWith(k));
  return named ? m[named] : main ? m._ : null;
}
export const MENU_ALL = () => Object.values(MENU_TOPICS).flatMap(Object.values);
