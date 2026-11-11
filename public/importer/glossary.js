// Hover help on the bold words of the BruControl Importer (OakBarn Brewery, 2026-11-08: "Hover Help on Bold"; "You can Hover over any
// of these Bolded Words and a Help Dialog can give you more information"). A bold word that is in this list gets its explanation as
// hover help (data-help, the shared public/hoverhelp.js shows it at once). The BruControl word is in ( ) after the Skynet one.
export const GLOSSARY = {
  'schema': 'Schema: your whole brewery setup in Skynet: Interfaces, Tabs, Devices, Widgets and pipes (a BruControl Configuration, .brucfg).',
  'tab': 'Tab: one screen of your brewery in Skynet (a BruControl Workspace). Its ID is the last part of every Suggested Name on it, for example BH for Brew House.',
  'tabs': 'Tabs: the screens of your brewery in Skynet (BruControl Workspaces).',
  'process': 'Process: a program that runs your brewery in Skynet (a BruControl Script). Your Scripts become Processes in a later Importer step.',
  'processes': 'Processes: the programs that run your brewery in Skynet (BruControl Scripts).',
  'device': 'Device: something wired to a Port (Pin) of an Interface board, like a pump, valve, probe or heater (a BruControl Element with a port).',
  'devices': 'Devices: the things wired to the Ports (Pins) of your Interface boards (BruControl Elements with a port).',
  'widget': 'Widget: something on the screen only, with no Port (Pin): pipes, text, pictures, timers, switches (a BruControl Element with no port).',
  'widgets': 'Widgets: things on the screen only, with no Port (Pin) (BruControl Elements with no port).',
  'label': 'Label: the words shown with an item on its Tab (the BruControl DisplayName). It is also the Label part of the Suggested Name; a space becomes ~ there.',
  'interface': 'Interface: a board that Skynet talks to, like an Arduino Mega or ESP32 (a BruControl Device). Its ID (for example MB) is the first part of every Suggested Name on it.',
  'interfaces': 'Interfaces: the boards Skynet talks to, like an Arduino Mega or ESP32 (BruControl Devices).',
  'port': 'Port (Pin): the pin number on an Interface board that a Device is wired to. It is the second part of a Suggested Name, for example 42.',
  'heating element': 'Heating Element: a Device that heats (type HE in its Suggested Name). It has one Method at a time (On/Off, Duty Cycle, Hysteresis, PID, Deadband or Precise), switched with one click or a Process.',
  'heating elements': 'Heating Elements: Devices that heat (type HE). One Port, one Device: all the BruControl Elements on one heater port become one Heating Element with a Method.',
  'method': 'Method: how a Device is controlled: On/Off, PWM, Duty Cycle, Hysteresis, PID, Deadband or Precise. One click or a Process switches it.',
  'modes of control': 'Modes of Control: the Methods a Device can use: PID, Hysteresis, Duty Cycle, Deadband, Direct On/Off and more.',
  'one port, one device': 'One Port, One Device (Skynet Rule 6.1): a Port of an Interface has only one Device, so Suggested Names are always different from each other.',
  'single device': 'A single Device: everything BruControl had on one Port becomes one Skynet Device with a Method.',
  'suggested skynet names': 'Suggested Skynet Names: Interface ID _ Port _ Type _ Label _ Tab ID, for example MB_42_DO@HE_HLT~Heat_BH: a Heating Element on Interface MB, Port 42, Label HLT Heat, on Tab BH. A space in the Label becomes ~.',
  'skynet names': 'Skynet names: Interface ID _ Port _ Type _ Label _ Tab ID (Skynet Rule 3.1). They tell you where each item is at a glance. Recommended.',
  'skynet name': 'Skynet name: Interface ID _ Port _ Type _ Label _ Tab ID (Skynet Rule 3.1).',
  'display name': 'Display Name: the words BruControl showed with an Element (its DisplayName). In Skynet it is the Label.',
  'attribute': 'Attribute: something about a Device or Widget that a Process can read or change, like .state, .label or .visible (a BruControl Property).',
  'default settings (the default tab).': 'Default settings: ☰ Menu > Default settings in the Skynet Panel, every default in one place (BruControl\'s Environment pane).',
  'default settings': 'Default settings: ☰ Menu > Default settings in the Skynet Panel, every default in one place.',
  'properties.': 'Properties: the settings of an item, opened with a double-click on it in Edit layout.',
  'cool pump': 'Cool Pump: a pump switched by a temperature reading to cool (for example a glycol pump). In Skynet it is one Pump with a Method (Hysteresis or Deadband suit pumps best).',
  'warm pump': 'Warm Pump: a pump switched by a temperature reading to warm. In Skynet it is one Pump with a Method.',
  'gglobal': 'gGlobal: a variable every Process can use (a BruControl Global used as a variable).',
  'placeholder': 'Placeholder: a grey box that keeps the place of something a later Importer step brings in.',
  'placeholders': 'Placeholders: grey boxes that keep the place of things a later Importer step brings in.',
  'id': 'ID: the short letters of an Interface or Tab, used in every Suggested Name (Interface ID first, Tab ID last).',
  'accept': 'Accept: keeps your answers on this page and goes on.',
};
const keyOf = t => String(t ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
export function helpFor(text) {
  const k = keyOf(text);
  return GLOSSARY[k] ?? GLOSSARY[k.replace(/[.:,!?]+$/, '')] ?? '';
}
// give every bold word in the list its hover help (once), in a part of the page
export function glossBold(root) {
  for (const b of root.querySelectorAll?.('b, strong') ?? []) {
    if (b.dataset.help || b.closest('[data-help]') || b.closest('button, label, th, .killWarn')) continue;
    const h = helpFor(b.textContent);
    if (h) { b.dataset.help = h; b.classList.add('gloss'); }
  }
}
