// DC pumps (Fritz, 2026-11-08, Rule 18.32, Help 162): any Pump can be On/Off, or PWM if it can. A Pump with Speed control PWM
// (.pwm) runs its pin as PWM at its Speed % while On, 0 while Off. my_Pump.speed = 60 changes it. Its facts (power, flow, lift ...)
// come from its model.
import assert from 'node:assert/strict';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store, attrsOf } from '../lib/store.js';
import { Engine } from '../lib/engine.js';
import { PUMP_FACTS, factsOf, factLines, powerOf, pumpSpeed, isPwmPump } from '../public/pumps.js';
import { freePins } from '../public/naming.js';

const d = fs.mkdtempSync(path.join(os.tmpdir(), 'pumpspeed'));
const cfg = path.join(d, 'c.json');
fs.writeFileSync(cfg, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator', board: 'mega' }], elements: [
  { name: 'Pump_Plain', type: 'digitalOut', subtype: 'pump', device: 'MB', channel: 30 },
  { name: 'Pump_DC', type: 'digitalOut', subtype: 'pump', device: 'MB', channel: 9, pwm: true, speed: 70, power: 'dc24', imageOff: 'Images/Skynet/Pumps/Pump_Topsflo_TD5_Poly_Center_Inlet.svg' },
  { name: 'Done', type: 'gKonstant', kind: 'value' },
] }));
const store = new Store(cfg, path.join(d, 'data')); store.load();
assert.equal(store.getProp('Pump_DC', 'speed'), 70, 'starts at the Speed % in its Properties');
assert.equal(store.getProp('Pump_Plain', 'speed'), 100, 'empty = 100 %');
assert.ok(attrsOf(store.get('Pump_DC')).includes('speed'), 'autofill offers .speed on pumps');

const { Hardware } = await import('../lib/hardware.js');
const hw = new Hardware(store);
assert.match(hw._outLine(store.get('Pump_Plain')), /^DO 30 0$/, 'an On/Off pump is a plain pin');
assert.equal(hw._outLine(store.get('Pump_DC')), 'PWM 9 0', 'a PWM pump that is Off gives 0');
store.setProp('Pump_DC', 'state', true);
assert.equal(hw._outLine(store.get('Pump_DC')), `PWM 9 ${Math.round(70 * 255 / 100)}`, 'On runs at its Speed %');
assert.ok(hw._isOn(store.get('Pump_DC')));

const eng = new Engine(store, path.join(d, 'scripts'), { logNow() { } });
const until = async (f, ms = 4000) => { for (let i = 0; i < ms / 20 && !f(); i++) await new Promise(r => setTimeout(r, 20)); return f(); };
eng.write('slow', 'Pump_DC.speed = 40\nDone = 1\n');
eng.start('slow');
assert.ok(await until(() => store.getProp('Done', 'value') === 1), 'the Process runs to the end');
assert.equal(store.getProp('Pump_DC', 'speed'), 40);
assert.equal(hw._outLine(store.get('Pump_DC')), `PWM 9 ${Math.round(40 * 255 / 100)}`);
eng.stopAll?.();

// facts
assert.equal(pumpSpeed(''), 100); assert.equal(pumpSpeed(150), 100); assert.equal(pumpSpeed(-5), 0);
assert.equal(factsOf(store.get('Pump_DC')).key, 'topsflo_td5', 'the drawing tells the model');
assert.equal(powerOf({ pumpModel: 'march_809_dc' }), 'dc24');
assert.equal(powerOf({ pumpModel: 'march_809_dc', power: 'dc12' }), 'dc12', 'its own Power wins');
assert.ok(factLines(store.get('Pump_DC')).some(l => /Lift: 14 ft/.test(l)));
assert.ok(factLines({ pumpModel: 'penguin_glycol' }).includes('Use: Cold (glycol, ice water)'));
assert.equal(new Set(PUMP_FACTS.map(f => f.key)).size, PUMP_FACTS.length, 'one key each');
for (const f of PUMP_FACTS) for (const p of f.pics ?? []) assert.ok(fs.existsSync(new URL(`../media/Images/Skynet/Pumps/${p}.svg`, import.meta.url)), p);
assert.ok(isPwmPump(store.get('Pump_DC')) && !isPwmPump(store.get('Pump_Plain')));
// a PWM pump is offered only true PWM pins on a Mega
const pins = freePins({ type: 'digitalOut', subtype: 'pump', pwm: true, device: 'MB' }, [], [{ name: 'MB', board: 'mega' }]);
assert.ok(pins.length && pins.every(p => [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 44, 45, 46].map(String).includes(String(p))), String(pins));
console.log('pumpspeed: ok');
// on a Port that cannot do true PWM, a PWM pump is a plain On/Off pin (full speed), never a half-made PWM
{
  const d2 = fs.mkdtempSync(path.join(os.tmpdir(), 'pumpspeed2')), c2 = path.join(d2, 'c.json');
  fs.writeFileSync(c2, JSON.stringify({ devices: [{ name: 'MB', type: 'simulator', board: 'mega' }], elements: [{ name: 'P30', type: 'digitalOut', subtype: 'pump', device: 'MB', channel: 30, pwm: 'pwm', speed: 40 }] }));
  const s2 = new Store(c2, path.join(d2, 'data')); s2.load(); const h2 = new Hardware(s2);
  s2.setProp('P30', 'state', true);
  assert.equal(h2._outLine(s2.get('P30')), 'DO 30 1');
}
console.log('pumpspeed (plain pin): ok');
