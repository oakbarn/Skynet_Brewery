// Connection ratings by board (public/links.js): node test/links.test.js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { BOARDS, connChoices, boardOf, linkOf, isHeating, rating, heatingLinkWarning, lostLinkSec } from '../public/links.js';

assert.equal(boardOf({ name: 'Main Brewery Mega USB' }), 'mega', 'an older Interface with no board: a Mega');
assert.equal(boardOf({ name: 'Garage ESP32' }), 'esp32', 'an "ESP" name is an ESP32');
assert.equal(boardOf({ name: 'x', board: '' }), '', 'a board the BruControl Import could not tell: not picked yet');
assert.deepEqual(BOARDS.map(b => b[0]), ['mega', 'uno', 'unoR4', 'nano', 'nanoEvery', 'leonardo', 'micro', 'due', 'giga', 'nanoEsp32', 'grandCentral', 'featherM0', 'esp32', 'esp8266', 'pi'],
  'every standard Arduino board and every BruControl board, the Mega first, no "other" (OakBarn Brewery, 2026-11-15 and 2026-11-19)');
assert.ok(!BOARDS.some(b => b[0] === 'other' || b[0] === 'opta'), 'no "other"; the Opta waits for its own program (plan first)');
assert.deepEqual(connChoices('uno').map(c => c[0]), ['serial', 'ethernet'], 'an Uno: USB or an Ethernet shield');
assert.deepEqual(connChoices('giga').map(c => c[0]), ['serial', 'ethernet', 'esp32'], 'a GIGA: WiFi built in');
assert.deepEqual(connChoices('esp8266').map(c => c[0]), ['serial', 'esp32'], 'an ESP8266: USB or WiFi');
assert.equal(rating({ board: 'grandCentral', connection: 'ethernet' }).level, 'ok', 'an Arduino-type board is rated like a Mega');
assert.equal(rating({ board: 'giga', connection: 'esp32' }).level, 'good', 'built-in WiFi is not the bridge');
assert.equal(rating({ board: 'giga', connection: 'esp32' }, true).level, 'poor', 'heating on WiFi is poor on every board');
assert.deepEqual(connChoices('pi').map(c => c[0]), ['ethernet', 'esp32'], 'a Raspberry Pi talks over the network only');
assert.match(connChoices('mega')[1][1], /W5100/, 'a Mega on Ethernet: with its shield');
assert.ok(!['mega', 'esp32', 'pi'].some(b => connChoices(b).some(c => c[0] === 'simulator')), 'no Simulator: it belongs to the panel');
assert.equal(linkOf({ connection: 'simulator', realConnection: 'esp32' }), 'esp32', 'a simulated board keeps its real Connection');
assert.equal(linkOf({ connection: 'serial' }), 'serial');

assert.equal(rating({ board: 'mega', connection: 'serial' }).level, 'best');
assert.equal(rating({ board: 'mega', connection: 'ethernet' }).level, 'ok');
assert.equal(rating({ board: 'mega', connection: 'esp32' }).level, 'poor');
assert.equal(rating({ board: 'esp32', connection: 'ethernet' }).level, 'good');
assert.equal(rating({ board: 'esp32', connection: 'esp32' }).level, 'good');
assert.equal(rating({ board: 'esp32', connection: 'esp32' }, true).level, 'poor', 'heating on WiFi is poor');
assert.equal(rating({ board: 'esp32', connection: 'ethernet' }, true).level, 'good', 'heating on Ethernet keeps its rating');
assert.equal(rating({ connection: 'simulator' }).level, '');

assert.ok(isHeating({ type: 'pid' }) && isHeating({ type: 'pwmOut', typeCode: 'H_Element' }) && isHeating({ type: 'digitalOut', subtype: 'element' }) && isHeating({ type: 'digitalOut', typeCode: 'Valve_Sgas' }));
assert.ok(!isHeating({ type: 'digitalOut', typeCode: 'Pump' }));

const devs = [{ name: 'MEGA', connection: 'serial' }, { name: 'WIFI', connection: 'esp32', board: 'esp32' }, { name: 'ETH', connection: 'ethernet' }];
assert.match(heatingLinkWarning({ name: 'HLT_Element', type: 'pwmOut', typeCode: 'H_Element', device: 'WIFI' }, devs), /on WiFi.*after 10 s/, 'heating on WiFi: allowed, with a warning');
assert.match(heatingLinkWarning({ name: 'HLT_Element', type: 'pwmOut', typeCode: 'H_Element', device: 'ETH' }, [{ name: 'ETH', connection: 'ethernet', lostLinkSec: 5 }]), /on Ethernet.*after 5 s/);
assert.equal(heatingLinkWarning({ name: 'HLT_Element', type: 'pwmOut', typeCode: 'H_Element', device: 'MEGA' }, devs), '', 'no warning on USB');
assert.equal(heatingLinkWarning({ name: 'Pump1', type: 'digitalOut', typeCode: 'Pump', device: 'WIFI' }, devs), '');
assert.equal(lostLinkSec(undefined), 10); assert.equal(lostLinkSec({ lostLinkSec: 1 }), 3); assert.equal(lostLinkSec({ lostLinkSec: 9999 }), 600); assert.equal(lostLinkSec({ lostLinkSec: 30 }), 30);
console.log('links tests passed');

// The Add Interface pop-up (OakBarn Brewery, 2026-11-15, Rule 18.39): its own balloon on each name, no Baud, no Simulator note,
// Test Communication in place of Pause, Lost Comm, the ID balloon is Dialog 1's with the real ID and Name
{
  const fs = await import('node:fs');
  const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const i = app.indexOf('async function addInterfaceDialog('), body = app.slice(app.indexOf('const IFACE_TIP = {'), app.indexOf('\n}\n', i));
  assert.ok(i > 0 && body.length > 1000);
  const boxes = app.slice(app.indexOf('const boardFields'), app.indexOf('function boardStart')) + app.slice(i, app.indexOf('\n}\n', i));
  assert.ok(!/'baud'|Pause communications|Simulator mode/.test(boxes), 'no Baud box, no Pause box, no Simulator note');
  assert.match(body, /'Lost Comm \(s\)'/); assert.match(body, /Test Communication/);
  assert.match(body, /\['id', 'Interface ID', 'text', null, false, false, \{ tip: ifaceIdTip\(/, 'the ID balloon is on the Interface ID');
  assert.match(body, /IFACE_PUMP_PARTS\.slice\(4, 8\)/, 'Dialog 1, word for word, before a Name or ID');
  assert.match(body, /connChoices\(o\.board\)/, 'the Connection follows the Board');
  assert.match(app, /dlgEnterSeq = keepSeq/, 'the New Device box gets its Enter back');
  // Add Interface markup 2 (OakBarn Brewery, 2026-11-16)
  const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
  assert.match(css, /dialog#dlg:has\(#dlgBody \[data-k="lostLinkSec"\]\) \.dlgBottomBar, dialog#dlg:has\(#dlgBody \.mSet\) \.dlgBottomBar \{ display: none; \}/, 'frozen at the top, none at the bottom');
  assert.match(css, /dialog#dlg:has\(#dlgBody \[data-k="lostLinkSec"\]\) \.dlgHead, dialog#dlg:has\(#dlgBody \.mSet\) \.dlgHead \{ position: sticky;/, 'its title and buttons frozen at the top');
  // never hide or pin a whole dialog (OakBarn Brewery, 2026-11-16: the Add Interface box from the RipTide Add box left a greyed Build
  // Tab with no way out: a selector missing its " .dlgBottomBar" hid the whole dialog)
  for (const rule of css.match(/[^{}]+\{[^}]*(display: none|position: sticky)[^}]*\}/g) || [])
    for (const sel of rule.slice(0, rule.indexOf('{')).split(',').map(x => x.trim()).filter(x => /^dialog#dlg:has\(/.test(x)))
      assert.ok(/\)\s+\S+$/.test(sel), `a whole dialog is hidden or pinned: ${sel}`);
  assert.match(app, /\['name', 'id', 'board', 'connection'\]\.includes/, 'a new Connection keeps the suggested ID');
  assert.match(app, /const NET_HELP_START = 'If you do not understand Networks and protocols, call a friend to help\./);
  assert.match(body, /hostWifi: NET_HELP_START/); assert.match(body, /hostEth: NET_HELP_START/);
  assert.match(body, /lostYou: '⚠ You are the Safety\./); assert.match(body, /IFACE_TIP\.lost \+ '\\n\\n' \+ IFACE_TIP\.lostYou/);
  assert.match(body, /Turn it Off after\.\\n\\nSkynet gives no help with communication problems/);
  assert.match(body, /⟪b:Simulation mode⟫/);
}
console.log('Add Interface pop-up tests passed');

// A suggested Network address (OakBarn Brewery, 2026-11-16: "suggest a Network address based on the Brian's IP address"; Rule 18.39)
{
  const app2 = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8'), srv = fs.readFileSync(new URL('../server.js', import.meta.url), 'utf8');
  const src = app2.slice(app2.indexOf('function suggestHost('), app2.indexOf('// start: an Interface to change'));
  const suggestHost = new Function(src + '; return suggestHost;')();
  assert.equal(suggestHost(['192.168.1.20'], []), '192.168.1.60', 'the Brain\'s network, 60 first');
  assert.equal(suggestHost(['10.0.0.5'], [{ host: '10.0.0.60' }, { host: '10.0.0.61' }]), '10.0.0.62', 'a number no other Interface uses');
  assert.equal(suggestHost(['192.168.4.60'], []), '192.168.4.61', 'never the Brain itself');
  assert.equal(suggestHost([], []), '192.168.1.60', 'no address known: the Mega program\'s');
  assert.ok(srv.includes('brainIps: brainIps(),') && srv.includes('function brainIps()'), 'the Brain sends its home addresses');
  assert.ok(app2.includes("o.host = suggestHost(S.brainIps, S.config.devices);") && app2.includes('NET_HELP_START + NET_HELP_BEFORE +'), 'a new Interface starts with it, and the Hover Help explains');
  console.log('suggested Network address tests passed');
}
