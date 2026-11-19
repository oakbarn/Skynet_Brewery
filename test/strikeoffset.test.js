// Strike Offset (Panel Updates entry 14): a number in each Equipment Profile and on each Tab, added to the Strike Temperature
import assert from 'node:assert/strict';
import { EQUIP_FIELDS, deltaC } from '../public/brewcalc.js';
import { calculateRecipe } from '../public/recipecalc.js';
import { toMetric, forShow } from '../public/unitconvert.js';
import { cleanProfile, blankProfile } from '../lib/equipment.js';

const f = EQUIP_FIELDS.find(x => x[0] === 'strikeOffset');
assert.deepEqual(f.slice(1), ['Strike offset', '°F', '°C', 0, 0], 'one Strike offset box, 0 to start (an All In One)');
assert.equal(blankProfile().strikeOffset, 0);
// a temperature DIFFERENCE: 10 °F is 5.56 °C (no 32)
assert.equal(Math.round(deltaC(10, 'US') * 100) / 100, 5.56);
assert.equal(deltaC(4, 'Metric'), 4);
assert.equal(deltaC(undefined, 'US'), 0, 'none set: 0');
assert.equal(toMetric.equipment({ units: 'US', name: 'A', strikeOffset: 10 }).strikeOffset, 5.5556);
assert.equal(forShow.equipment({ units: 'Metric', name: 'A', strikeOffset: 5.5556 }, 'US').strikeOffset, 10, 'shown back as 10 °F');
assert.equal(toMetric.equipment({ units: 'US', name: 'A', brewhouseEfficiency: 72 }).strikeOffset, undefined, 'an older profile gets no new number');
assert.equal(cleanProfile({ name: 'A', strikeOffset: -2 }).strikeOffset, -2, 'not restricted (a hot pre-heated Mash Tun)');
assert.throws(() => cleanProfile({ name: 'A', grainAbsorption: -1 }), /below 0/, 'the other numbers still can\'t be below 0');
// the Strike Temperature: the same recipe on two breweries, 10 °F and 0
const rc = { waterToGrain: 2.6, grainTempC: 22.222, ingredients: { fermentables: [{ kg: 5 }] }, mash: { steps: [{ tempC: 66.667 }] } };
const none = calculateRecipe(rc).strikeTempC, zero = calculateRecipe(rc, {}, null, 1, null, 0).strikeTempC, ten = calculateRecipe(rc, {}, null, 1, null, deltaC(10, 'US')).strikeTempC;
assert.equal(zero, none, '0 changes nothing');
assert.ok(Math.abs(ten - none - 5.6) < 0.11, `10 °F more (${none} -> ${ten} °C)`);
console.log('strike offset tests passed');
