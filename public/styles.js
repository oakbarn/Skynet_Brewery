// Styles (Fritz, 2026-10-29): a Style is a named look a Widget picks from a list. Skynet Styles come with Skynet and can
// never be changed by a user; a user makes a User Style (➕ Add new User Style…) and can change or delete only those.
// A Timer has no pictures: its look is only its Style (and its Label colors). No imports, so node can load it too.
// Tab Styles (Fritz, 2026-10-30): a Tab's Style is the look of the Devices and Widgets on it that have none of their own:
//   labelFore / labelBack / labelFont / labelSize: their Label (title)   fore / back / font / size: the Device or Widget itself
//   '' = as it is now (the ☰ Menu > Default tab, then the panel's normal look). A Tab with no Style uses the Default tab's.
//   look:   timer = seven-segment digits on a panel, led = LED digits, normal = plain text
//   digits: the digit color   panel: the panel color ('' = the orange-red glow)   bezel: the frame round the panel
//   titleFore / titleBack: the Label's title bar (the Label box in its Properties wins over them)
export const SKYNET_STYLES = {
  timer: [
    { id: 'sky_timer_orange', name: 'Skynet Orange Timer', look: 'timer', digits: '#ffffff', panel: '', bezel: '#9a9a9a', titleFore: '#ffffff', titleBack: '#000000' },
    { id: 'sky_timer_green', name: 'Skynet Green LCD', look: 'timer', digits: '#7cff4f', panel: '#0d2a0d', bezel: '#9a9a9a', titleFore: '#ffffff', titleBack: '#000000' },
    { id: 'sky_timer_blue', name: 'Skynet Blue Timer', look: 'timer', digits: '#ffffff', panel: '#0b3d91', bezel: '#c9ced3', titleFore: '#ffffff', titleBack: '#0b1f44' },
    { id: 'sky_timer_red', name: 'Skynet Red LED digits', look: 'led', digits: '', panel: '', bezel: '', titleFore: '', titleBack: '' },
    { id: 'sky_timer_plain', name: 'Skynet Plain text', look: 'normal', digits: '', panel: '', bezel: '', titleFore: '', titleBack: '' },
  ],
  tab: [
    { id: 'sky_tab_default', name: 'Skynet Default', labelFore: '', labelBack: '', labelFont: '', labelSize: '', fore: '', back: '', font: '', size: '' },
    { id: 'sky_tab_tennyson', name: 'Tennyson', labelFore: '#000000', labelBack: '#c3c3c3', labelFont: '"Comic Sans MS", "Comic Sans", cursive', labelSize: '16', fore: '', back: '', font: '', size: '' },
  ],
};
export const STYLE_KINDS = Object.keys(SKYNET_STYLES);
export const KIND_KEYS = { timer: ['digits', 'panel', 'bezel', 'titleFore', 'titleBack'], tab: ['labelFore', 'labelBack', 'labelFont', 'labelSize', 'fore', 'back', 'font', 'size'] };
export const STYLE_KEYS = KIND_KEYS.timer;
export const isSkynetStyle = id => STYLE_KINDS.some(k => SKYNET_STYLES[k].some(s => s.id === id));

// the Style an item uses: its own pick (Skynet or User), else the first Skynet Style. An older Timer with no Style keeps
// its old look: LED digits -> Skynet Red LED digits, plain text -> Skynet Plain text.
export function styleOf(kind, item, userStyles = {}) {
  const all = [...(SKYNET_STYLES[kind] ?? []), ...(userStyles?.[kind] ?? [])];
  const own = all.find(s => s.id === item?.style);
  if (own) return own;
  if (kind === 'timer' && item?.look === 'led') return SKYNET_STYLES.timer.find(s => s.look === 'led');
  if (kind === 'timer' && item?.look === 'normal') return SKYNET_STYLES.timer.find(s => s.look === 'normal');
  return all[0] ?? null;
}

// a Tab's Style: its own pick, else the ☰ Menu > Default tab's (brewDefaults.tabStyle), else Skynet Default
export const tabStyleOf = (w, defaults = {}, userStyles = {}) => styleOf('tab', { style: w?.style || defaults?.tabStyle }, userStyles);

// User Styles from a browser, made safe: only known kinds and keys, names unique and never "Skynet ...", ids u_...
export function cleanUserStyles(input) {
  const out = {};
  for (const kind of STYLE_KINDS) {
    const seen = new Set(SKYNET_STYLES[kind].map(s => s.name.toLowerCase()));
    out[kind] = [];
    for (const s of Array.isArray(input?.[kind]) ? input[kind].slice(0, 200) : []) {
      const name = String(s?.name ?? '').trim().slice(0, 60), id = String(s?.id ?? '');
      if (!name || /^skynet\b/i.test(name) || seen.has(name.toLowerCase()) || !/^u_[A-Za-z0-9]{1,40}$/.test(id) || isSkynetStyle(id)) continue;
      seen.add(name.toLowerCase());
      const look = kind !== 'timer' ? {} : { look: ['timer', 'led', 'normal'].includes(s.look) ? s.look : 'timer' };
      out[kind].push({ id, name, ...look, ...Object.fromEntries(KIND_KEYS[kind].map(k => [k, String(s[k] ?? '').trim().slice(0, 60)])) });
    }
  }
  return out;
}
