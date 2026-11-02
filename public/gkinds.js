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
  { name: 'gG_Brew_Day_Picture', type: 'gGlobal', kind: 'graphic', initial: 'Images/Skynet/Miscellaneous/brewery_main.png', imagePath_1: 'Images/Skynet/Miscellaneous/brewery_main.png', background: 1 },
  { name: 'gV_Strike_Temp', type: 'gGlobal', kind: 'value', initial: '163', precision: 1, units: '°F', min: 32, max: 212 },
  { name: 'gB_Grain_Added', type: 'gGlobal', kind: 'bool', initial: 'false' },
  { name: 'gT_Mash_Rest', type: 'gGlobal', kind: 'time', initial: '01:00:00' },
  { name: 'gD_Brew_Day_Start', type: 'gGlobal', kind: 'datetime', initial: '2026-11-07T07:00:00' },
];
// the samples whose names are not used yet, so adding them twice does nothing
export function samplesToAdd(elements, graphics = []) {
  const taken = new Set([...(elements ?? []), ...(graphics ?? [])].map(x => String(x?.name ?? '').toLowerCase()));
  return SAMPLE_GLOBALS.filter(s => !taken.has(s.name.toLowerCase())).map(s => ({ ...s, retain: true }));
}
