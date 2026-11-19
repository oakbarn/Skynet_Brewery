// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// On Press (OakBarn Brewery, 2026-11-19, Rule 6.38, Help 235): a physical DIN push button (a Digital Input Device) does one thing the
// user picks, with no code to write. Shared by the Brain (lib/dinpress.js, server.js) and the panel (public/app.js, its Properties).

export const ON_PRESS = [['', 'None'], ['process', 'Run a Process'], ['advance', 'Advance (Override)'], ['alarms', 'Cancel all alarms']];
export const onPressOf = el => (el?.type === 'digitalIn' && ON_PRESS.some(([k]) => k && k === el.onPress) ? el.onPress : '');
export const pressProcessOf = el => String(el?.pressProcess ?? '').trim();
export const pressNeedsProcess = el => ['process', 'advance'].includes(onPressOf(el));

// The Hover Help of its two rows (Rule 2.38)
export const ON_PRESS_TIPS = {
  onPress: 'What one press of this button does, with no code to write. None (the usual): only its State changes, for a Process to read. Run a Process: starts the Process below and lets it run to its end, as a Process Widget\'s Start does (a press while it runs is ignored). Advance (Override): works like an Override button set to the Process below, but only when that Process is waiting in a wait or sleep; otherwise the press is ignored. Cancel all alarms: every Alarm sounding now is turned Off. The input\'s lockout, debounce and on delay count first.',
  process: 'Run a Process: the Process it starts. Advance: Any (every running Process except Loopers) or the one Process it moves on. If the Process gets a new name, this follows it.',
};

// A Process got a new name (✏ Change name): every input set to run it or advance it follows, as a Process Widget does (Rule 1.31)
export function followPressRename(elements, from, to) {
  let n = 0;
  for (const el of elements ?? []) if (pressNeedsProcess(el) && pressProcessOf(el) === from) { el.pressProcess = to; n++; }
  return n;
}
