// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Process Widget (OakBarn Brewery, 2026-11-09, Rule 1.31, Help 173): shows one Process on a Tab with its name, what it is doing
// (Running, Waiting, Stopped or Stopped on an error) and a Start / Stop button. One click anywhere on it starts the Process when it
// is stopped and stops it when it runs (Rule 2.44: no pop-up to start it). It is BruControl's Script element: the BruControl Import
// makes each Script element a Process Widget (Rule 15.4). In Skynet a script is called a Process (Rule 1.4), so it is the Process
// Widget (OakBarn Brewery, 2026-11-09: "Process Widget").
// Shared by the Brain (lib/store.js), the panel (public/app.js) and the BruControl Import (lib/bruimport.js, lib/brucontrol.js).

export const PROCESS_WIDGET_TYPE = 'processWidget';
export const PROCESS_WIDGET_WORD = 'Process Widget';
export const PROCESS_WIDGET_CODE = 'PSW';         // its Type letters in a Widget name: wgt_PSW_Mash~Steps_BR (Rule 3.14)
export const isProcessWidget = el => el?.type === PROCESS_WIDGET_TYPE;
// the size a new one starts at on the Build Tab
export const PROCESS_WIDGET_SIZE = { w: 200, h: 80 };

// What the Process is doing, in plain words, from its status on the Brain (lib/engine.js list()). '' = no Process picked,
// null status = the Process is not in the Processes list (deleted or not made yet)
export function processState(processName, status) {
  if (!String(processName ?? '').trim()) return { word: 'No Process picked', running: false, missing: true };
  if (!status) return { word: 'No such Process', running: false, missing: true };
  if (status.state === 'running') return { word: status.waiting ? 'Waiting' : 'Running', running: true };
  if (status.state === 'error') return { word: 'Stopped on an error', running: false, error: true };
  return { word: 'Stopped', running: false };
}
// the button's words: what one click does now
// the Stop button's word in the Help language: the Panel sets it (Rule 11.11, public/screenwords.js); the Brain and the Import keep the English
let stopWord = w => w;
export const setStopWord = f => { stopWord = typeof f === 'function' ? f : w => w; };
export const processButton = st => (st.running ? '■ ' + stopWord('Stop') : '▶ Start');

// The hover help of its Properties (Rule 2.38)
export const PROCESS_TIPS = {
  label: 'What it is called on the Tab, for example Mash Steps. The ⬢ beside it sets its font, size and colors.',
  name: 'Made by Skynet from the Label and the Tab (wgt_PSW_Label_TabID, Rule 3.14). It must be unique.',
  process: 'The Process it shows and starts. One click on the Widget starts it when it is stopped and stops it when it runs. If the Process gets a new name (✏ Change name), the Widget follows it.',
  type: 'A Widget lives only in the app: it has no Interface or Port (Rule 1.2).',
  imageOff: 'Optional. A picture drawn in it, between the Label and the button, for example a float switch. The ⬢ beside it holds the picture when on. Empty: no picture.',
  hideRunning: 'On: it hides (.visible = false) once its Process starts, and shows again when the Process stops. For a button that starts something, such as Start Brew Day. Off (the usual): it always shows, so one click can stop it too.',
  group: 'Optional. Process Widgets with the same Group word (for example Water) act together: one click on one greys out the Start of all the others. While the delay runs they all show Delay and the one pressed says Started; once the water flows the one pressed shows Running and the others go blank. A Process sets it with .phase on any one of them: wgt_PSW_X.phase = "running" when the water flows, wgt_PSW_X.phase = "stopped" when it is over; then every Start works again. Empty: it acts on its own.',
  follow: 'The Device or Widget whose state picks the picture: the picture when on while it is on, the picture when off while it is off. None: always the picture when off.',
};
// Its optional picture (OakBarn Brewery, 2026-11-20, the Float buttons of the Fire Hose sample): imageOff, imageOn while follow is on
export const processPicture = (el, isOn) => (el?.follow && el.imageOn && isOn(el.follow) ? el.imageOn : el?.imageOff || el?.imageOn || '');

// A Process got a new name with ✏ Change name (Rule 3.11): every Process Widget that showed it, and every Override button set to it
// (graphics), follows (server.js). Returns how many.
export function followProcessRename(elements, from, to) {
  let n = 0;
  for (const el of elements ?? []) if ((isProcessWidget(el) || el?.kind === 'override') && String(el.process ?? '').trim() === from) { el.process = to; n++; }      // an Override button set to it too (Rule 2.26)
  return n;
}

// Hide while running (OakBarn Brewery, 2026-11-20, Panel Update 8, item 21: "Not a switch! For a Process Start, a Process Widget a Once a
// Process is started, .visible = false"; Rule 1.31). A Process Widget with Hide while running on gets .visible = false while its Process
// runs, and .visible = true again once it stops (only when it was this that hid it). Off to start, so a Start / Stop button (the Fire
// Hose Float buttons) keeps showing. Returns [{ name, visible }] for the Widgets whose .visible must change. hid: the names hidden by it.
export function hideWhileRunning(elements, list, hid) {
  const running = new Set((list ?? []).filter(s => s?.state === 'running').map(s => s.name));
  const out = [];
  for (const el of elements ?? []) {
    if (!isProcessWidget(el) || !el.hideRunning) { if (hid.has(el?.name)) { hid.delete(el.name); } continue; }
    const run = running.has(String(el.process ?? '').trim());
    if (run && !hid.has(el.name)) { hid.add(el.name); out.push({ name: el.name, visible: false }); }
    else if (!run && hid.has(el.name)) { hid.delete(el.name); out.push({ name: el.name, visible: true }); }
  }
  return out;
}
