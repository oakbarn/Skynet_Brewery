// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Script Widget (OakBarn Brewery, 2026-11-09, Rule 1.31, Help 172): shows one Process on a Tab with its name, what it is doing
// (Running, Waiting, Stopped or Stopped on an error) and a Start / Stop button. One click anywhere on it starts the Process when it
// is stopped and stops it when it runs (Rule 2.44: no pop-up to start it). It is BruControl's Script element: the BruControl Import
// makes each Script element a Script Widget (Rule 15.4). In Skynet a script is called a Process (Rule 1.4); the Widget keeps the
// name OakBarn Brewery gave it.
// Shared by the Brain (lib/store.js), the panel (public/app.js) and the BruControl Import (lib/bruimport.js, lib/brucontrol.js).

export const SCRIPT_WIDGET_TYPE = 'scriptWidget';
export const SCRIPT_WIDGET_WORD = 'Script Widget';
export const SCRIPT_WIDGET_CODE = 'SCR';         // its Type letters in a Widget name: wgt_SCR_Mash~Steps_BR (Rule 3.14)
export const isScriptWidget = el => el?.type === SCRIPT_WIDGET_TYPE;
// the size a new one starts at on the Build Tab
export const SCRIPT_WIDGET_SIZE = { w: 200, h: 80 };

// What the Process is doing, in plain words, from its status on the Brain (lib/engine.js list()). '' = no Process picked,
// null status = the Process is not in the Processes list (deleted or not made yet)
export function scriptState(processName, status) {
  if (!String(processName ?? '').trim()) return { word: 'No Process picked', running: false, missing: true };
  if (!status) return { word: 'No such Process', running: false, missing: true };
  if (status.state === 'running') return { word: status.waiting ? 'Waiting' : 'Running', running: true };
  if (status.state === 'error') return { word: 'Stopped on an error', running: false, error: true };
  return { word: 'Stopped', running: false };
}
// the button's words: what one click does now
export const scriptButton = st => (st.running ? '■ Stop' : '▶ Start');

// The hover help of its Properties (Rule 2.38)
export const SCRIPT_TIPS = {
  label: 'What it is called on the Tab, for example Mash Steps. The ⬢ beside it sets its font, size and colors.',
  name: 'Made by Skynet from the Label and the Tab (wgt_SCR_Label_TabID, Rule 3.14). It must be unique.',
  process: 'The Process it shows and starts. One click on the Widget starts it when it is stopped and stops it when it runs. If the Process gets a new name (✏ Change name), the Widget follows it.',
  type: 'A Widget lives only in the app: it has no Interface or Port (Rule 1.2). It is BruControl\'s Script element.',
};

// A Process got a new name with ✏ Change name (Rule 3.11): every Script Widget that showed it follows (server.js). Returns how many.
export function followProcessRename(elements, from, to) {
  let n = 0;
  for (const el of elements ?? []) if (isScriptWidget(el) && String(el.process ?? '').trim() === from) { el.process = to; n++; }
  return n;
}
