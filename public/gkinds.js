// gGlobal Kinds, used by the Brain and the browser (Fritz, 2026-11-02, thread "Add gGlobal Kinds and BruControl import").
// A gGlobal is a variable with a global scope: every Process can read and change it. It is not a Widget and does not sit on
// a Tab (a Text, Picture, Value, Time or Date Time Widget shows things on a Tab). Each gGlobal has one Kind, picked when it is
// made, and the Kind can never change afterwards: a wrong Kind is deleted and made again.
//   gS_Global_String    .value is a String
//   gG_Global_Graphic   the standard background picture paths (Image Path 1-3, Background #, Back Colour)
//   gV_Global_Value     .value is a Value (a number)
//   gB_Global_Boolean   .value is a Boolean (true / false)
//   gT_Global_Time      .value is a Time (00:00:00)
//   gD_Global_DateTime  .value is a Date Time
// The other kinds G_KINDS still has (Switch, Push Button, Pulse Button, List, Step, Long String) are not gGlobals (Fritz,
// 2026-11-02): they go to the new Semi_Widgets_Devices class and work as before until it is built.

// kind (as kept in the Schema file) -> Kind name
export const VAR_KINDS = {
  string: 'gS_Global_String',
  graphic: 'gG_Global_Graphic',
  value: 'gV_Global_Value',
  bool: 'gB_Global_Boolean',
  time: 'gT_Global_Time',
  datetime: 'gD_Global_DateTime',
};
export const isVarKind = k => Object.hasOwn(VAR_KINDS, k ?? 'value');
const kindOf = el => el?.kind ?? 'value';

// A layout save that changes the Kind of a gGlobal that already exists (found by its hidden key) is refused.
// Returns the message, or '' when every Kind is unchanged.
export function kindChangeError(current, incoming, keyOf = el => el?._key) {
  const was = new Map((current ?? []).filter(e => e?.type === 'gGlobal' && keyOf(e)).map(e => [keyOf(e), e]));
  for (const el of incoming ?? []) {
    const old = el?.type === 'gGlobal' && keyOf(el) ? was.get(keyOf(el)) : null;
    if (old && kindOf(old) !== kindOf(el)) {
      const k = VAR_KINDS[kindOf(old)] || kindOf(old);
      return `${old.name} is a ${k}. A gGlobal's Kind is set when it is made and can't be changed: delete it and make a new one of the right Kind.`;
    }
  }
  return '';
}

// The sample: one gGlobal of each Kind, none of them on a Tab.
export const SAMPLE_GLOBALS = [
  { name: 'gS_Brewer_Note', type: 'gGlobal', kind: 'string', initial: 'Add the yeast nutrient at 10 minutes' },
  { name: 'gG_Brew_Day_Picture', type: 'gGlobal', kind: 'graphic', initial: 'Images/Skynet/Miscellaneous/brewery_main.png', backpath: 'Images/Skynet/Miscellaneous/brewery_main.png', background: 1 },
  { name: 'gV_Strike_Temp', type: 'gGlobal', kind: 'value', initial: '163', precision: 1, units: '°F', min: 32, max: 212 },
  { name: 'gB_Grain_Added', type: 'gGlobal', kind: 'bool', initial: 'false' },
  { name: 'gT_Mash_Rest', type: 'gGlobal', kind: 'time', initial: '01:00:00' },
  { name: 'gD_Brew_Day_Start', type: 'gGlobal', kind: 'datetime', initial: '2026-11-07T07:00:00' },
];
// the samples whose names are not used yet, so adding them twice does nothing
export function samplesToAdd(elements, graphics = []) {
  const taken = new Set([...(elements ?? []), ...(graphics ?? [])].map(x => String(x?.name ?? '').toLowerCase()));
  return SAMPLE_GLOBALS.filter(s => !taken.has(s.name.toLowerCase())).map(s => ({ ...s }));
}

// Making a gGlobal in a Process (Fritz, 2026-11-06, Rule 1.24). Every one of these makes the same gGlobal:
//   new gGlobalValue gV_Mash_Temp = 152     the long word (typing it fills in gV_)
//   new gV gV_Mash_Temp = 152               the short word
//   new value gV_Mash_Temp = 152            a normal variable word, but the name starts gV_, so it is a gGlobal
// "declare" works the same as "new". A name whose start does not fit its word is an error (new value gS_Note).
// A Graphic gGlobal (gG_) has picture paths, so it is only made on the Variables screen.
// The = 152 is the first value, used only when the gGlobal is made: a gGlobal keeps its value (Rule 1.22).
export const G_DECLARE = {
  value: { long: 'gGlobalValue', short: 'gV', prefix: 'gV_', what: 'a Value (a number)', local: 'value' },
  string: { long: 'gGlobalString', short: 'gS', prefix: 'gS_', what: 'a String (text)', local: 'string' },
  time: { long: 'gGlobalTime', short: 'gT', prefix: 'gT_', what: 'a Time', local: 'time' },
  datetime: { long: 'gGlobalDateTime', short: 'gD', prefix: 'gD_', what: 'a Date Time', local: 'datetime' },
  bool: { long: 'gGlobalBoolean', short: 'gB', prefix: 'gB_', what: 'a Boolean (true or false)', local: 'bool' },
};
export const DECLARE_WORDS = ['new', 'declare'];
const LOCAL_WORDS = ['value', 'string', 'bool', 'time', 'datetime'];
// the word after new: { kind, global } or null when it is not a variable word
export function declareWord(word) {
  const w = String(word ?? '').toLowerCase();
  if (LOCAL_WORDS.includes(w)) return { kind: w, global: false };
  for (const [kind, d] of Object.entries(G_DECLARE)) if (w === d.long.toLowerCase() || w === d.short.toLowerCase()) return { kind, global: true };
  return null;
}
// the Kind a name's start says (gV_ -> value, gG_ -> graphic), or null for a name with no gGlobal start
export function prefixKind(name) {
  const m = /^g([a-z])_/i.exec(String(name ?? ''));
  if (!m) return null;
  const c = m[1].toUpperCase();
  if (c === 'G') return 'graphic';
  return Object.keys(G_DECLARE).find(k => G_DECLARE[k].prefix[1] === c) ?? null;
}
// new <word> <name>: { kind, global } when it is fine, or { error } in plain words
export function declareCheck(word, name) {
  const dw = declareWord(word);
  if (!dw) return null;
  const pk = prefixKind(name), d = G_DECLARE[dw.kind];
  if (pk === 'graphic') return { error: `${name}: a name starting gG_ is a Graphic gGlobal (picture paths). Make it on the Variables screen, not in a Process.` };
  if (dw.global) {
    if (!pk) return { error: `new ${word} ${name}: a ${d.long} name starts ${d.prefix}, for example ${d.prefix}${name}` };
    if (pk !== dw.kind) return { error: `new ${word} ${name}: ${G_DECLARE[pk].prefix} is for ${G_DECLARE[pk].what}, but ${word} is ${d.what}. Use ${d.prefix} or new ${G_DECLARE[pk].short} ${name}` };
    return { kind: dw.kind, global: true };
  }
  if (pk && pk !== dw.kind) return { error: `new ${word} ${name}: ${G_DECLARE[pk].prefix} is for ${G_DECLARE[pk].what}, not ${d.what}. Use new ${G_DECLARE[pk].local} ${name}, or give it a name starting ${d.prefix}` };
  return { kind: dw.kind, global: !!pk };
}
