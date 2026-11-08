// Confirmation Widgets (OakBarn Brewery, 2026-11-08, Skynet Rule 1.28, Help 162): "The Special Widgets Just ask for a Confirmation
// that the Widget was turned On. These are a special Class of Widget and do not really turn anything on, just a confirmation that
// the User did so manually." Each stands for something done by hand on the brewery. Its .confirmation attribute (a switch in its
// Properties: "Add an Attribute .confirmation to widgets and if ticked, they are that special class") puts it in the class. A click
// on it on its Tab, or a Process line such as wgt_MP_Pump~7_BR.state = true, shows a pop-up asking the person to do it by hand and
// press Done; only then does it show On or Off, and a Process waits for that Done.
//   On to start:      Manual Valves (the Manual Valve Widget, the Tap Water Valve and a Manual valve Device) and the Manual Pump Widget
//   Can be ticked:    the Switch and the LED (any other Widget only when OakBarn Brewery says so)
//   Always like this: moving a Quick Disconnect hose (Hose_1.connect = QD_1, Rule 5.34)
// Used by the Brain (lib/store.js, lib/engine.js) and the screen (public/app.js).

// The Manual Pump Widget (OakBarn Brewery, 2026-11-08: "create Manual Pump Wizard. The same types as Pump Devices"): a pump drawn on a
// Tab like a Pump Device (the same pump drawings, IPs, Cover and Overlay), but no Interface Port turns it: it is plugged into a wall
// outlet and switched by hand. Its .state is true (ON) or false (OFF).
export const MANUAL_PUMP_TYPE = 'manualPump';
export const isManualPump = el => el?.type === MANUAL_PUMP_TYPE;
const manualValveDevice = el => el?.type === 'digitalOut' && el.subtype === 'valve' && el.valveType === 'manual';
// a Manual Valve Widget: on a Tab it is an IP fitting (a graphic); in the Brain it is an element of type manualValve
const manualValveWidget = el => el?.type === 'manualValve' || (el?.kind === 'ip' && el.fitting === 'manualValve');
export const isManualValveThing = el => manualValveDevice(el) || manualValveWidget(el);
// ticked to start (and when .confirmation was never set)
export const confirmOnToStart = el => isManualValveThing(el) || isManualPump(el);
export const CONFIRM_TICKABLE = ['switch', 'led'];
export const canConfirm = el => confirmOnToStart(el) || CONFIRM_TICKABLE.includes(el?.type);
export const isConfirmation = el => canConfirm(el) && (confirmOnToStart(el) ? el.confirmation !== false : el.confirmation === true);
// the words of the pop-up: OPEN / CLOSE a valve, TURN ON / TURN OFF anything else; and what it is once done
export function byHandWords(el, on) {
  const valve = isManualValveThing(el);
  return { say: valve ? (on ? 'OPEN' : 'CLOSE') : (on ? 'TURN ON' : 'TURN OFF'), is: valve ? (on ? 'open' : 'closed') : (on ? 'on' : 'off') };
}
export const CONFIRM_TIP = 'On: a Confirmation Widget (Rule 1.28). It stands for something done by hand. A click on it, or a Process line such as Name.state = true, shows a pop-up asking you to do it by hand and press Done; only then does it show On or Off, and a Process waits for Done. Off: a click changes it at once.';
