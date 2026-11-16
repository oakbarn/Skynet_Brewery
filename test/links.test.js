// Connection ratings by board (public/links.js): node test/links.test.js
import assert from 'node:assert/strict';
import { BOARDS, connChoices, boardOf, linkOf, isHeating, rating, heatingLinkWarning, lostLinkSec } from '../public/links.js';

assert.equal(boardOf({ name: 'Main Brewery Mega USB' }), 'mega', 'an older Interface with no board: a Mega');
assert.equal(boardOf({ name: 'Garage ESP32' }), 'esp32', 'an "ESP" name is an ESP32');
assert.equal(boardOf({ name: 'x', board: '' }), '', 'a board the BruControl Import could not tell: not picked yet');
assert.deepEqual(BOARDS.map(b => b[0]), ['mega', 'esp32', 'pi'], 'boards only, no "other" (OakBarn Brewery, 2026-11-15)');
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
}
console.log('Add Interface pop-up tests passed');
