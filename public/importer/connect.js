// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Connect your brewery (Rule 15.4, Fritz 2026-11-07): how the valves and pumps join the vessels. Used by the Importer's page
// (public/importer/importer.js) and its server (importer.js), so both work the same way (one source). No AI is used here: the
// guesses come from the item names, the BruControl Scripts and where BruControl had each item; the brewer checks every one.
//
// "Build the manifold like the knee bone is connected to the leg bone" (Fritz): the manifold is a list of CHAINS. A chain starts
// at a Vessel opening (or a pump, a valve, Tap Water ...) and each step says what the last piece is connected to, and whether
// by Hose or Pipe, until it reaches an end (a Vessel opening, Tap Water, Drain, a QD or Not connected).

// The openings a Vessel's pipes join (the Vessel Device's IP spots, public/app.js VW_IPS, without the Element and Probe spots)
export const OPENINGS = [
  ['cBottomOutlet', 'Center Bottom Outlet'], ['cOutlet', 'Center Outlet'], ['lTangential', 'Left Tangential'], ['rTangential', 'Right Tangential'],
  ['lSparge', 'Left Sparge'], ['rSparge', 'Right Sparge'], ['lHermsIn', 'Left HERMS In'], ['lHermsOut', 'Left HERMS Out'],
  ['rHermsIn', 'Right HERMS In'], ['rHermsOut', 'Right HERMS Out'],
];
export const openingName = k => OPENINGS.find(([x]) => x === k)?.[1] ?? k;

// A word on its own: "M_HLT Pump" has HLT, "Ghlt" has not (an underscore counts as a gap, as BruControl names use it)
const word = w => new RegExp(`(?<![a-z0-9])(?:${w})(?![a-z0-9])`, 'i');
// The vessel kinds, Hot Side first. A Fermenter is on the Cold Side: it is asked, not pictured (Fritz, 2026-11-07).
export const VESSEL_KINDS = [
  { key: 'HLT', name: 'HLT', re: word('hlt|hot ?liquor(?: tank)?'), side: 'hot' },
  { key: 'MLT', name: 'Mash Tun', re: word('mlt|mash(?: ?tun)?'), side: 'hot' },
  { key: 'BK', name: 'Boil Kettle', re: word('bk|boil(?: ?kettle)?|kettle'), side: 'hot' },
  { key: 'FV', name: 'Fermenter', re: word('ferm\\w*|conical|unitank'), side: 'cold' },
];
const PUMP = /pump|chugger|riptide|march|whirlpool/i;
const VALVE = new RegExp([/valve|butterfly/.source, word('(?:m_)?v\\d+|pv ?\\d+|fv ?\\d+|bv ?\\d*|mbv ?\\d*').source].join('|'), 'i');
const PUMP_TYPES = new Set(['digitalOut', 'pwmOut', 'hysteresis', 'deadband', 'pid']);
const VALVE_TYPES = new Set(['digitalOut', 'pwmOut']);
const NOT_VALVE = /switch|block|ssr|outlet|relay|24 ?vdc|120 ?vac/i;     // a power switch for the valves is not a valve
const COOL = /cool|chill|glycol/i, WARM = /warm|heat/i;

const textOf = e => `${e.bru?.name ?? ''} ${e.label ?? ''}`;
const itemOf = (e, kind) => ({ id: e.name, kind, label: e.label || e.name, bru: e.bru?.name || e.name, tab: e.workspace, x: e.x, y: e.y, w: e.w, h: e.h });

// The parts of the brewery this page joins: the vessels (guessed from the names and Scripts), the pumps and the valves.
// conv = the converted config (lib/bruimport.js); scripts = [{ name, text }] (read only as clues, Fritz 2026-11-06)
export function findParts(conv, scripts = []) {
  const els = conv?.elements ?? [];
  const pumps = [], valves = [];
  for (const e of els) {
    if (e.subtype === 'element' || e.integratedIn) continue;
    const t = textOf(e);
    if (PUMP.test(t) && PUMP_TYPES.has(e.type)) pumps.push(itemOf(e, 'pump'));
    else if (VALVE.test(t) && !NOT_VALVE.test(t) && VALVE_TYPES.has(e.type)) valves.push(itemOf(e, 'valve'));
  }
  const all = [...els.map(textOf), ...scripts.map(s => `${s.name} ${s.text}`)].join('\n');
  const vessels = VESSEL_KINDS.filter(k => k.re.test(all)).map(k => ({ key: k.key, name: k.name, side: k.side }));
  return { vessels, pumps, valves };
}
// which vessel an item belongs to, by its name (M_HLT Pump -> HLT), or ''
export function vesselOf(item, vessels) {
  const t = `${item.bru} ${item.label}`;
  return vessels.find(v => VESSEL_KINDS.find(k => k.key === v.key)?.re.test(t))?.key ?? '';
}

// ---- the ends of a link. kind: vessel (key, at = an opening), pump (id, side in/out), valve (id), tap, drain,
// qd (sex male/female, shut true = Shut-off), manifold (n), none
export const endKey = e => !e ? '' : e.kind === 'vessel' ? `vessel:${e.key}:${e.at}` : e.kind === 'pump' || e.kind === 'valve' ? `${e.kind}:${e.id}`
  : e.kind === 'qd' ? `qd:${e.sex || 'male'}:${e.shut ? 'shut' : 'open'}:${e.n ?? 1}` : e.kind === 'manifold' ? `manifold:${e.n ?? 1}` : e.kind;
export const isFinal = e => ['vessel', 'tap', 'drain', 'qd', 'none'].includes(e?.kind);
export function endText(e, parts) {
  if (!e) return '';
  const find = id => [...(parts?.pumps ?? []), ...(parts?.valves ?? [])].find(i => i.id === id);
  switch (e.kind) {
    case 'vessel': return `${parts?.vessels?.find(v => v.key === e.key)?.name ?? e.key} ${openingName(e.at)}`;
    case 'pump': return `${find(e.id)?.label ?? e.id}${e.side ? ` ${e.side === 'out' ? 'Out' : 'In'}` : ''}`;
    case 'valve': return find(e.id)?.label ?? e.id;
    case 'tap': return 'Tap Water';
    case 'drain': return 'Drain';
    case 'qd': return `QD ${e.n ?? 1} (${e.sex === 'female' ? 'Female' : 'Male'}, ${e.shut ? 'Shut-off' : 'Open'})`;
    case 'manifold': return `Supply Manifold ${e.n ?? 1}`;
    default: return 'Not connected';
  }
}

// ---- the guesses (each one marked as a guess until the brewer OKs or changes it)
// 1. names: a vessel's own valve and pump ("M_HLT PV2", "M_HLT Pump"): its Center Bottom Outlet -> its valve -> its pump's In,
//    by Pipe ("the outlet's connected to the valve, the valve's connected to the pump"). A whirlpool pump goes back into the
//    Boil Kettle's Right Tangential.
// 2. the picture: on a Tab with a background picture (a brewer who put the buttons on a picture of the brewery), a valve that
//    sits right next to a pump is joined to that pump's In.
// The fermenter's own valves and pumps are left to the Fermenter questions.
export function guessChains(parts, { backgrounds = {}, fermenters = [] } = {}) {
  const chains = [], used = new Set(fermenters.flatMap(f => [f.feed, f.ret, f.coolPump, f.warmPump]).filter(Boolean));
  const hot = parts.vessels.filter(v => v.side === 'hot');
  const mine = (list, v) => list.filter(i => !used.has(i.id) && vesselOf(i, parts.vessels) === v.key && !COOL.test(i.bru) && !/whirlpool/i.test(i.bru));
  for (const v of hot) {
    const valves = mine(parts.valves, v), pumps = mine(parts.pumps, v);
    if (!valves.length && !pumps.length) continue;
    const steps = [...valves.map(i => ({ to: { kind: 'valve', id: i.id }, by: 'pipe', source: 'name' })),
      ...pumps.slice(0, 1).map(i => ({ to: { kind: 'pump', id: i.id, side: 'in' }, by: 'pipe', source: 'name' }))];
    for (const s of steps) used.add(s.to.id);
    chains.push({ start: { kind: 'vessel', key: v.key, at: 'cBottomOutlet' }, steps });
  }
  const bk = hot.find(v => v.key === 'BK');
  for (const p of parts.pumps) if (!used.has(p.id) && bk && /whirlpool/i.test(p.bru)) {
    used.add(p.id);
    chains.push({ start: { kind: 'pump', id: p.id, side: 'out' }, steps: [{ to: { kind: 'vessel', key: 'BK', at: 'rTangential' }, by: 'pipe', source: 'name' }] });
  }
  // the picture: only on a Tab with a background picture
  for (const val of parts.valves) {
    if (used.has(val.id) || !backgrounds[val.tab]) continue;
    const near = parts.pumps.filter(p => p.tab === val.tab && !COOL.test(p.bru) && gap(val, p) <= Math.max(40, Math.min(val.w, val.h)))
      .sort((a, b) => gap(val, a) - gap(val, b))[0];
    if (!near) continue;
    used.add(val.id);
    chains.push({ start: { kind: 'valve', id: val.id }, steps: [{ to: { kind: 'pump', id: near.id, side: 'in' }, by: 'pipe', source: 'picture' }] });
  }
  return chains;
}
// the gap between two boxes on a Tab (0 when they touch or overlap)
function gap(a, b) {
  const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w)), dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h));
  return Math.hypot(dx, dy);
}

// The Fermenter questions (Fritz, 2026-11-07: "for Fermentors we ask questions as they are likely in a different Room").
// Each starts with a guess from the names and Scripts, for example Tartan's "FV 1 ... // return glycol", "FV 2 ... // feed glycol".
export const COOLING = [['coil', 'Glycol coil inside'], ['jacket', 'Glycol jacket'], ['chamber', 'Fermentation chamber (fridge)'], ['wrap', 'Cooling wrap'], ['none', 'Not cooled']];
export const HEATING = [['none', 'Not heated'], ['pump', 'Warm water pumped through it'], ['wrap', 'Heat wrap or belt'], ['chamber', 'Heater in the chamber']];
export function guessFermenters(parts, conv, scripts = []) {
  const els = conv?.elements ?? [], text = scripts.map(s => s.text).join('\n'), lines = text.split(/\r?\n/);
  const ferm = VESSEL_KINDS.find(k => k.key === 'FV').re;
  const said = (item, re) => lines.some(l => l.includes(`"${item.bru}"`) && re.test(l));
  return parts.vessels.filter(v => v.side === 'cold').map(v => {
    const valves = parts.valves, pumps = parts.pumps;
    const feed = valves.find(i => said(i, /feed|supply/i)), ret = valves.find(i => i !== feed && said(i, /return/i));
    const coolPump = pumps.find(i => COOL.test(i.bru)), warmPump = pumps.find(i => WARM.test(i.bru) && !COOL.test(i.bru));
    const probe = els.find(e => ['temperature', 'analogIn'].includes(e.type) && ferm.test(textOf(e)) && /temp/i.test(textOf(e)));
    const pressure = els.find(e => e.type === 'analogIn' && ferm.test(textOf(e)) && /psi|pressure/i.test(textOf(e)));
    const glycol = /glycol/i.test(text) || els.some(e => /glycol/i.test(textOf(e)));
    return { vessel: v.key, cooling: glycol ? 'coil' : coolPump ? 'jacket' : 'none', heating: warmPump ? 'pump' : 'none',
      feed: feed?.id ?? '', ret: ret?.id ?? '', coolPump: coolPump?.id ?? '', warmPump: warmPump?.id ?? '', probe: probe?.name ?? '', pressure: pressure?.name ?? '', source: 'guess' };
  });
}

// ---- chains <-> links
// The links of a chain, one per step: { from, to, by, source }. After a pump the next link leaves from its Out.
export function chainLinks(c) {
  const out = [];
  let at = c.start;
  for (const s of c.steps ?? []) {
    const from = at?.kind === 'pump' ? { ...at, side: at === c.start ? (at.side || 'out') : 'out' } : at;
    out.push({ from, to: s.to, by: s.by || 'pipe', source: s.source || 'you' });
    at = s.to;
  }
  return out;
}
export const allLinks = chains => chains.flatMap(chainLinks);
// Links (from the AI's answer, or the picture) made into chains: a link that starts where a chain ends carries that chain on
const sameItem = (a, b) => (a.kind === 'pump' || a.kind === 'valve') ? a.kind === b.kind && a.id === b.id : endKey(a) === endKey(b);
export function chainsFromLinks(links) {
  const chains = [];
  for (const l of links) addLink(chains, l);
  return chains;
}
// Hose or Pipe: the guess is Pipe, unless one end is a QD (then Hose) (Fritz, 2026-11-07)
export const guessBy = (a, b) => a?.kind === 'qd' || b?.kind === 'qd' ? 'hose' : 'pipe';
// One more link: it carries on the chain that ends where it starts, or starts a new chain; chains that now meet are joined
export function addLink(chains, l) {
  const step = { to: l.to, by: l.by || guessBy(l.from, l.to), source: l.source || 'you' };
  const c = chains.find(x => { const last = x.steps.at(-1)?.to ?? x.start; return !isFinal(last) && sameItem(last, l.from); });
  if (c) c.steps.push(step);
  else chains.push({ start: l.from, steps: [step] });
  for (let again = true; again;) {
    again = false;
    for (const a of chains) {
      const last = a.steps.at(-1)?.to; if (!last || isFinal(last)) continue;
      const b = chains.find(x => x !== a && sameItem(x.start, last));
      if (b) { a.steps.push(...b.steps); chains.splice(chains.indexOf(b), 1); again = true; break; }
    }
  }
  return chains;
}
// is this pump or valve already in a chain or a Fermenter answer?
export function usedIds(chains, fermenters = []) {
  return new Set([...fermenters.flatMap(f => [f.feed, f.ret, f.coolPump, f.warmPump]).filter(Boolean),
    ...chains.flatMap(c => [c.start, ...c.steps.map(s => s.to)]).filter(e => e?.kind === 'pump' || e?.kind === 'valve').map(e => e.id)]);
}
// The pumps and valves no chain or Fermenter answer uses yet (each gets its own chain at the end, Fritz's plan)
export function looseItems(parts, chains, fermenters = []) {
  const used = usedIds(chains, fermenters);
  return [...parts.valves, ...parts.pumps].filter(i => !used.has(i.id));
}

// ---- Ask a free AI, outside the Importer (Fritz, 2026-11-07). The Importer stays AI-free: it only writes the question and reads
// the answer back with plain text matching.
export const AI_SITES = [['https://claude.ai/new', 'Claude'], ['https://chatgpt.com/', 'ChatGPT'], ['https://gemini.google.com/app', 'Gemini']];
// every name the AI may use, each with the end it stands for
export function endNames(parts) {
  const out = [];
  for (const v of parts.vessels.filter(x => x.side === 'hot')) for (const [k, n] of OPENINGS) out.push([`${v.name} ${n}`, { kind: 'vessel', key: v.key, at: k }]);
  for (const p of parts.pumps) for (const side of ['in', 'out']) out.push([`${p.label} ${side === 'in' ? 'In' : 'Out'}`, { kind: 'pump', id: p.id, side }]);
  for (const v of parts.valves) out.push([v.label, { kind: 'valve', id: v.id }]);
  out.push(['Tap Water', { kind: 'tap' }], ['Drain', { kind: 'drain' }], ['QD', { kind: 'qd', sex: 'male', shut: false, n: 1 }], ['Not connected', { kind: 'none' }]);
  return out;
}
export function aiQuestion(parts) {
  const names = endNames(parts).map(([n]) => n);
  return [
    'This is a picture of my home brewery (the Hot Side: the HLT, Mash Tun, Boil Kettle and so on). Please look at how the pipes and hoses join the vessels, valves and pumps.',
    '',
    'Answer ONLY in this form, one line for each connection, and nothing else:',
    'Hot side vessels: <how many>',
    'From <name> To <name> by <Pipe or Hose>',
    '',
    'Use only these names, exactly as written:',
    ...names.map(n => `- ${n}`),
    '',
    'For example:',
    `From ${parts.vessels[0] ? `${parts.vessels[0].name} Center Bottom Outlet` : 'Mash Tun Center Bottom Outlet'} To ${parts.valves[0]?.label ?? 'V1'} by Pipe`,
  ].join('\n');
}
const norm = s => String(s ?? '').toLowerCase().replace(/[_\s]+/g, ' ').replace(/[^\w #.+-]/g, '').trim();
// Read the AI's answer back: { vessels (the count, or null), links, unread (lines that could not be read; never guessed) }
export function readAiAnswer(text, parts) {
  const names = new Map(endNames(parts).map(([n, e]) => [norm(n), e]));
  const out = { vessels: null, links: [], unread: [] };
  for (const raw of String(text ?? '').split(/\r?\n/)) {
    const line = raw.replace(/^[\s>*\-•\d.)]+/, '').replace(/\*\*/g, '').trim();
    if (!line) continue;
    const m = /^hot side vessels\s*[:=]\s*(\d+)/i.exec(line);
    if (m) { out.vessels = Number(m[1]); continue; }
    const k = /^from\s+(.+?)\s+to\s+(.+?)(?:\s+(?:by|with|using)\s+(pipe|hose|tubing|tube))?\.?$/i.exec(line);
    const from = k && names.get(norm(k[1])), to = k && names.get(norm(k[2]));
    if (!from || !to) { if (k || /\bto\b/i.test(line)) out.unread.push(raw.trim()); continue; }
    out.links.push({ from, to, by: /hose|tub/i.test(k[3] ?? '') ? 'hose' : 'pipe', source: 'ai' });
  }
  return out;
}

// ---- what is saved in the Schema file: the chains as they are, plus each link with the names spelled out
export function connectReport(state) {
  const { parts, chains = [], fermenters = [] } = state;
  return {
    vessels: parts.vessels,
    chains,
    links: allLinks(chains).map(l => ({ ...l, fromText: endText(l.from, parts), toText: endText(l.to, parts) })),
    fermenters,
    loose: looseItems(parts, chains, fermenters).map(i => i.id),
    places: state.places ?? {},
  };
}
