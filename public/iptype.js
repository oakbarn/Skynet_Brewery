// IP Type (OakBarn Brewery, 2026-11-14, Skynet Rule 5.40): the connector at an IP. "4 Choices Triclamp, NPT, BSP, or
// QuickDisconnet"; "Pipe and Hose Attributes as to IP Type that are set by the selected Defaults"; "On Both End"; "Add
// Connection Type for the In and Out IPs as above on a Pump". Used by the panel (public/app.js) and the Brain (lib/store.js).
//
// Sized IP Types (OakBarn Brewery, 2026-11-16): "IPs Types will need to be expanded to have size  TC1.5  TC3/4   TC2  ....   NPT to
// MPT1  MPT1/2  MPT 2"; "FPT1.   A list of the sizes and type in Defualts with a TickBox to show in the List.  Have sizes from  1/8 to
// 6 " ( and if there are odd Metrics Those too."; "Do A with all Unclicked in the Default". An IP Type is a type and a size in one
// code (TC1.5, FPT1/2, MPT1, BSP3/4, DN15, QD1/2). Only real sizes are listed (no TC1/8). Default settings has a tick box for each;
// all start unticked. A dropdown shows the ticked ones, the ones already used in the Schema, and its own.

// the families: what the connector is drawn as, and what fits what
export const IP_TYPES = [['tc', 'Tri-Clamp'], ['npt', 'NPT'], ['bsp', 'BSP'], ['qd', 'Quick Disconnect']];
const FAMILY_NAME = { tc: 'Tri-Clamp', fpt: 'FPT (female pipe thread, NPT)', mpt: 'MPT (male pipe thread, NPT)', bsp: 'BSP (British pipe thread)', dn: 'Metric pipe (DN)', cam: 'Camlock (CAMF female coupler, CAMM male adapter)', gh: 'Garden Hose thread (FGH female, MGH male)', qd: 'Quick Disconnect, stainless (FMSSQD female, MSSQD male)' };
// Quick Disconnects (OakBarn Brewery, 2026-11-16: "Hose FMSSQD1/2 wher they are on a Pipe or Pump and a MSSQD1/2 on the other end"):
// FMSSQD = female stainless steel quick disconnect, MSSQD = male
const QD = ['1/2', '3/4', '1', '1.5', '2', '3'];
// Camlocks (OakBarn Brewery, 2026-11-17: "add camlocks and 1/2 to the Ends"; "Add them to the list with Tck Boxes and no need for
// image"): a row of tick boxes from 1/2" up, CAMF = female coupler, CAMM = male adapter; no drawing of their own
const CAM = ['1/2', '3/4', '1', '1.25', '1.5', '2', '2.5', '3', '4', '6'];
// Garden Hose thread (OakBarn Brewery, 2026-11-18, Panel Update Final 3 #4: "Add FGH and MGH (Female and Male Garden Hose to end types)";
// Rule 18.49): the 3/4" hose thread of a household hose bib (Tap Water Valve) and a garden hose. FGH = female, MGH = male.
const GH = ['3/4'];
const THREAD = ['1/8', '1/4', '3/8', '1/2', '3/4', '1', '1.25', '1.5', '2', '2.5', '3', '4', '5', '6'];
// every size of every type, in this order (a Tri-Clamp is sized by its clamp: 1/2" to 1.5" tube often all use the TC1.5 clamp)
export const IP_SIZES = [
  ['tc', ['1/2', '3/4', '1.5', '2', '2.5', '3', '4', '6'].map(s => 'TC' + s)],
  ['fpt', THREAD.map(s => 'FPT' + s)],
  ['mpt', THREAD.map(s => 'MPT' + s)],
  ['bsp', THREAD.map(s => 'BSP' + s)],
  ['dn', ['6', '8', '10', '15', '20', '25', '32', '40', '50', '65', '80', '100', '125', '150'].map(s => 'DN' + s)],
  ['qd', [...QD.map(s => 'FMSSQD' + s), ...QD.map(s => 'MSSQD' + s)]],
  ['cam', [...CAM.map(s => 'CAMF' + s), ...CAM.map(s => 'CAMM' + s)]],
  ['gh', [...GH.map(s => 'FGH' + s), ...GH.map(s => 'MGH' + s)]],
].map(([f, codes]) => ({ family: f, name: FAMILY_NAME[f], codes }));
const ALL = IP_SIZES.flatMap(x => x.codes);
export const isIpCode = t => ALL.includes(t);
// the family of a code, also for the old plain family codes (tc, npt, bsp, qd) an older Schema may have
export function ipFamily(t) {
  const s = String(t || '');
  if (['tc', 'npt', 'bsp', 'qd'].includes(s)) return s;
  if (/^TC/.test(s)) return 'tc';
  if (/^[FM]PT/.test(s)) return 'npt';
  if (/^BSP/.test(s)) return 'bsp';
  if (/^DN/.test(s)) return 'dn';
  if (/^(FM|M)SSQD/.test(s)) return 'qd';
  if (/^CAM[FM]/.test(s)) return 'cam';
  if (/^[FM]GH/.test(s)) return 'gh';
  return '';
}
const sizeOf = t => String(t || '').replace(/^(TC|FPT|MPT|BSP|DN|FMSSQD|MSSQD|CAMF|CAMM|FGH|MGH)/, '');
const gender = t => /^(FPT|FMSSQD|CAMF|FGH)/.test(t) ? 'f' : /^(MPT|MSSQD|CAMM|MGH)/.test(t) ? 'm' : '';
// the IP Type that fits this one: FPT and MPT of the same size fit each other; every other type fits its own kind and size
export const ipMate = t => /^FGH/.test(t) ? 'M' + t.slice(1) : /^MGH/.test(t) ? 'F' + t.slice(1) : /^CAMF/.test(t) ? 'CAMM' + t.slice(4) : /^CAMM/.test(t) ? 'CAMF' + t.slice(4) : /^FPT/.test(t) ? 'M' + t.slice(1) : /^MPT/.test(t) ? 'F' + t.slice(1) : /^FMSSQD/.test(t) ? t.slice(1) : /^MSSQD/.test(t) ? 'F' + t : t;
// can two IP Types be joined without an adapter? sameSize false: only the type is checked (two pipes of different sizes meet at a
// reducer, which Skynet draws)
export function ipFits(a, b, { sameSize = true } = {}) {
  if (!isIpCode(a) || !isIpCode(b)) return true;       // not known: no warning
  if (ipFamily(a) !== ipFamily(b)) return false;
  if (gender(a) && gender(a) === gender(b)) return false;      // MPT to MPT, FPT to FPT
  return !sameSize || sizeOf(a) === sizeOf(b);
}
// the choices of an IP Type dropdown: the ticked sizes (Default settings), the ones already used in the Schema, and its own
export function ipTypeChoices(ticks = [], used = [], own = []) {
  const on = new Set([...(ticks || []), ...(used || []), ...(own || [])].filter(isIpCode));
  return ALL.filter(t => on.has(t)).map(t => [t, t]);
}
// Tri-Clamp is not made under 1/2" (for the Default pipe and hose IP Type, which is a family)
export const ipTypeSizeOk = (t, inch) => !(t === 'tc' && +inch > 0 && +inch < 0.5);
export const ipTypePick = inch => IP_TYPES.filter(([t]) => ipTypeSizeOk(t, inch));
// the sized code for a family and a pipe size in inches: the nearest real size; a thread is male on a pipe or hose end and female on
// a pump or vessel outlet
const nearest = (list, inch) => list.reduce((b, s) => Math.abs(frac(s) - inch) < Math.abs(frac(b) - inch) ? s : b);
const frac = s => s.includes('/') ? s.split('/')[0] / s.split('/')[1] : +s;
export function sizedIp(fam, inch = 0.5, { female = false } = {}) {
  const n = +inch > 0 ? +inch : 0.5;
  if (fam === 'tc') return n <= 1.5 ? 'TC1.5' : 'TC' + nearest(['2', '2.5', '3', '4', '6'], n);
  if (fam === 'npt') return (female ? 'FPT' : 'MPT') + nearest(THREAD, n);
  if (fam === 'bsp') return 'BSP' + nearest(THREAD, n);
  if (fam === 'qd') return (female ? 'FMSSQD' : 'MSSQD') + nearest(QD, n);
  if (fam === 'gh') return (female ? 'FGH' : 'MGH') + '3/4';
  if (fam === 'dn') return 'DN' + nearest(['6', '8', '10', '15', '20', '25', '32', '40', '50', '65', '80', '100', '125', '150'], n * 25.4);
  return '';
}
// a code as it is, an old family code turned into its size
export const toSized = (t, inch, opts) => isIpCode(t) ? t : ipFamily(t) ? sizedIp(ipFamily(t), inch, opts) : '';
// what a pipe or hose of this size starts with: the Default pipe or hose IP Type (Tri-Clamp and Quick Disconnect unless changed), in
// the pipe's size; a Quick Disconnect hose is always Quick Disconnect
export function defaultIpType(d = {}, { hose = false, qd = false, inch = 0.5, female = false } = {}) {
  if (qd) return sizedIp('qd', inch);
  const t = hose ? d.defHoseIp || 'qd' : d.defPipeIp || 'tc';
  return sizedIp(ipTypeSizeOk(t, inch) ? ipFamily(t) || 'tc' : 'npt', inch, { female });
}
// a pump's In and Out IPs: its Ports when they are one of the sizes (FPT1/2), else read from its Ports text (TC is Tri-Clamp, FPT or
// MPT or NPT is a female thread, BSP is BSP, 1/2" unless 3/4" or 1" is named), else the Default pipe IP Type, female
export function pumpIpType(ports, d = {}) {
  const raw = String(ports || '').trim(), p = raw.toUpperCase().replace(/\s+/g, '');
  if (isIpCode(p)) return p;
  const inch = /3\/4/.test(raw) ? 0.75 : /(^|\D)1(\D|$)|1"/.test(raw) && !/1\/2/.test(raw) ? 1 : 0.5;
  if (p.startsWith('TC')) return sizedIp('tc', inch);
  if (/^[FM]PT/.test(p) || p.includes('NPT')) return sizedIp('npt', inch, { female: true });
  if (p.startsWith('BSP')) return sizedIp('bsp', inch);
  return defaultIpType(d, { female: true });
}
// A pipe or hose end on a pump's In or Out IP, or on a Stove Top Vessel's Bottom Outlet, fits it by itself (OakBarn Brewery: "Pipe and
// hose changes are always auto"): the end takes the IP Type that mates with it (FPT1/2 on the pump: MPT1/2 on the pipe end). To
// change it, change the pump's (or the vessel's) IP Type. Returns how many ends changed.
// a Hose Bib (Tap Water Valve, Rule 18.45) and the End Fitting of its one IP before one is picked: the male garden hose thread
export const HOSE_BIB_PIC = 'Images/Skynet/Valves/Tap_Water_Valve_Hose_Bib.svg', HOSE_BIB_END = 'MGH3/4';
export function ownerIpType(config, id) {
  if (typeof id !== 'string') return '';
  const m = /^dev:(.*):(in|out)$/.exec(id);
  if (m) { const e = (config.elements || []).find(x => x.name === m[1] && x.subtype === 'pump'); return e ? (m[2] === 'in' ? e.ipTypeIn : e.ipTypeOut || e.ipTypeIn) || '' : ''; }
  const hb = /^eq:(.*):out$/.exec(id), bib = hb && (config.graphics || []).find(x => x.id === hb[1] && x.kind === 'ip' && x.fitting === 'manualValve' && x.image === HOSE_BIB_PIC);
  if (bib) return bib.ipTypeOut || HOSE_BIB_END;      // a Hose Bib's outlet: MGH3/4 unless changed (Rule 18.49)
  const g = (config.graphics || []).find(x => x.id === id && x.kind === 'ip' && x.port === 'outlet');
  const v = g && (config.graphics || []).find(x => x.id === g.attachTo && x.vesselType === 'stoveTopOut');
  return v?.ipTypeOut || '';
}
// a hose's Quick Disconnect end is female (FMSSQD) where it is on a pipe or a pump, and male (MSSQD) on its other end (OakBarn
// Brewery, 2026-11-16). On a Tri-Clamp pipe the real adapter (TC1.5 x MSSQD1/2) goes there; Skynet never assumes it (Rule 5.43).
const sizedQd = (t, female) => (female ? 'FMSSQD' : 'MSSQD') + sizeOf(t);
export function hoseEndJoined(config, p, end) {
  const id = p[end]; if (typeof id !== 'string') return false;
  if (/^(dev|pspot):/.test(id)) return true;          // a pump's In or Out (a valve too: it is in a pipe)
  return (config.graphics || []).some(o => o !== p && o.kind === 'pipe' && !o.hose && (o.from === id || o.to === id));
}
export function fitOwnedEnds(config) {
  let n = 0;
  for (const p of (config.graphics || []).filter(g => g?.kind === 'pipe')) for (const [end, k] of [['from', 'ipTypeFrom'], ['to', 'ipTypeTo']]) {
    let want;
    const bib = /^eq:/.test(p[end]) ? ownerIpType(config, p[end]) : '';      // a Hose Bib's outlet wins, a Quick Disconnect hose too (Rule 18.49)
    if (isIpCode(bib)) want = ipMate(bib);
    else if (p.hose && ipFamily(p[k]) === 'qd') want = sizedQd(p[k], hoseEndJoined(config, p, end));      // a hose's Quick Disconnect end
    else { const t = ownerIpType(config, p[end]); if (!isIpCode(t)) continue; want = ipMate(t); }
    if (p[k] !== want) { p[k] = want; n++; }
  }
  return n;
}
// the IP Types used in a Schema (they always stay in the dropdowns, Never Take Away)
export const usedIpTypes = config => [...new Set([...(config.graphics || []).flatMap(g => [g.ipTypeFrom, g.ipTypeTo, g.ipTypeOut]), ...(config.elements || []).flatMap(e => [e.ipTypeIn, e.ipTypeOut])].filter(isIpCode))];
