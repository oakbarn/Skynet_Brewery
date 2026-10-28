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
  if (e.subtype === 'thermowell') return ['skynet-integrated-devices', 'thermowells'];
  switch (e.type) {
    case 'digitalOut':
      if (e.subtype === 'valve' && e.valveType === 'manual') return ['manual-valves'];
      if (e.subtype === 'valve' && e.tapwater) return ['tap-water-valves'];
      return DEVICE;
    case 'stepper': return ['stepper-motors'];
    case 'alarm': return ['alarms-and-sound'];
    case 'soundPlayer': return ['alarms-and-sound', 'sound-player'];
    case 'timer': return ['tabs', 'timers'];
    case 'gKonstant': return e.kind === 'list' ? ['variables', 'gkonstant-list-a-dropdown-on-a-tab'] : ['variables', 'gkonstant-kinds'];
    case 'gAPI': return ['variables', 'gapi-kinds'];
    case 'shared': return ['variables', 'which-kind-to-use'];
    case 'picture': return ['picture-widget', 'turns-on-with'];
    case 'label': case 'switch': case 'manual': return ['tabs', 'changing-the-layout-admins'];
    case 'temperature': return e.sensor === 'ds18b20' ? ['devices', 'onewire-probes-ds18b20'] : DEVICE;
    default: return DEVICE;      // the other devices on a board pin: outputs, inputs, probes, sensors, flow meters, scales
  }
}

// a graphic: equipment, an IP or fitting, a pipe or hose, a picture or a text
export function graphicTopic(g) {
  if (!g) return null;
  switch (g.kind) {
    case 'vessel':
      if (g.vesselType === 'bfit' && g.templateCls === 'skynet') return ['skynet-fittings'];
      if (g.integrated) return g.vesselType === 'rims' ? ['skynet-integrated-devices'] : ['skynet-integrated-electric-kettle'];
      if (g.template && g.templateCls === 'skynet') return ['skynet-vessels'];
      if (g.vesselType === 'bfit' || g.template) return ['vessel-and-fitting-templates', 'tabvessel-and-tabfitting'];
      if (g.bundled) return ['equipment', 'bundle-a-vessel-with-its-ips'];
      return g.vesselType === 'vessel' ? ['vessel-tab'] : ['equipment', 'other-equipment'];
    case 'ip':
      if (g.fitting === 'manualValve') return ['manual-valves'];
      if (g.fitting && g.fitting !== 'point') return ['pipes-and-hoses', 'sizes'];
      return ['ip-snap-and-valve-pictures', 'snap-to-align'];
    case 'pipe': return ['pipes-and-hoses', g.hose ? 'hoses' : 'pipes'];
    case 'image': return ['picture-paths'];
    case 'clone': return ['cloned-devices', 'a-clone-s-properties'];
    default: return ['text-boxes'];      // a text
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
  ['#wgtKind, #wgtAdd, #addImg, #addText, #vesselPick, #addManualValve, #addVesselType', ['edit-layout-bar', 'widgets']],
  ['#addIpType', ['edit-layout-bar', 'row-2-pipes-fittings-locks-and-tabs']],
  ['#turnBar', ['build-tab-add-button', 'turn-and-flip-a-fitting-or-vessel']],
  ['#cloneDev', ['cloned-devices', 'make-a-clone']],
  ['#buildTab, #saveBuild, #previewBuild, #wsTabs .buildTab', ['build-tab']],
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
export const DB_TRIGGER = ['variables', 'database-trigger'];
export const RIGHT_CLICK_PAGE = ['right-click-help'];
export const ALL_TOPICS = () => [...MENU_ALL(), ...Object.values(VIEWS), DEVICE, TAB_SPOT, DB_TRIGGER, RIGHT_CLICK_PAGE,
  ...['digitalOut', 'stepper', 'alarm', 'soundPlayer', 'timer', 'gAPI', 'shared', 'picture', 'label', 'temperature'].map(type => elementTopic({ type, sensor: 'ds18b20' })),
  elementTopic({ type: 'digitalOut', subtype: 'valve', valveType: 'manual' }), elementTopic({ type: 'digitalOut', subtype: 'valve', tapwater: true }),
  elementTopic({ type: 'gKonstant', kind: 'list' }), elementTopic({ type: 'gKonstant' }),
  ...[{ vesselType: 'vessel' }, { vesselType: 'pchiller' }, { bundled: true }, { vesselType: 'bfit' }, { vesselType: 'bfit', templateCls: 'skynet' }, { vesselType: 'vessel', template: 'HLT', templateCls: 'skynet' }].map(v => graphicTopic({ kind: 'vessel', ...v })),
  ...[{ fitting: 'manualValve' }, { fitting: 'tee' }, {}].map(f => graphicTopic({ kind: 'ip', ...f })),
  ['vessel-and-fitting-templates', 'vessel-template-settings'], ['vessel-and-fitting-templates', 'bundled-fitting-template-settings'],
  graphicTopic({ kind: 'pipe' }), graphicTopic({ kind: 'pipe', hose: true }), graphicTopic({ kind: 'image' }), graphicTopic({ kind: 'text' }), graphicTopic({ kind: 'clone' }),
  ...BAR.map(b => b[1])];

// The yellow ? icons on the ☰ Menu tabs: a heading in a Menu tab goes to the Help part named for it ("_" = any other heading).
// A heading matches when its text starts with the name (after a 🔒). Section headings inside a form only get an icon when named.
const MENU_TOPICS = {
  default: { Text: ['text-boxes', 'defaults'], _: ['menu', 'the-default-tab'] },
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
  tab: { 'Tabs of the Schema': ['tab-and-valve-profiles', 'give-a-tab-its-profile'], _: ['tab-and-valve-profiles', 'tab-background-profile'] },
  valve: { _: ['tab-and-valve-profiles', 'valve-profile'] },
  skynetpics: { _: ['get-skynet-pictures'] },
  schema: { 'Schemas on this Brain': ['schema-switching-and-cloning', 'clone-a-schema'], 'Add a Sample Schema': ['sample-schemas'], _: ['schema-switching-and-cloning'] },
};
export function menuTopic(key, heading, main = true) {
  const m = MENU_TOPICS[key]; if (!m) return null;
  const text = String(heading).replace(/^🔒\s*/, '').trim();
  const named = Object.keys(m).find(k => k !== '_' && text.startsWith(k));
  return named ? m[named] : main ? m._ : null;
}
export const MENU_ALL = () => Object.values(MENU_TOPICS).flatMap(Object.values);
