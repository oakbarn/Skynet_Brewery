// gGlobal Kinds (Fritz, 2026-11-02): six variable Kinds, the Kind can't change once made, one sample of each Kind
import assert from 'node:assert/strict';
import { VAR_KINDS, isVarKind, kindChangeError, SAMPLE_GLOBALS, samplesToAdd } from '../public/gkinds.js';
import { G_KINDS } from '../lib/store.js';
import { elementTopic } from '../public/helpmap.js';

assert.deepEqual(Object.values(VAR_KINDS), ['gS_Global_String', 'gG_Global_Graphic', 'gV_Global_Value', 'gB_Global_Boolean', 'gT_Global_Time', 'gD_Global_DateTime']);
for (const [k, name] of Object.entries(VAR_KINDS)) {
  assert.ok(G_KINDS[k]?.variable, `${k} is a variable Kind on the Brain`);
  assert.equal(G_KINDS[k].label, name);
}
assert.ok(isVarKind(undefined), 'no kind = value');
for (const k of ['switch', 'pushbutton', 'momentary', 'list', 'step', 'longstring']) { assert.ok(!isVarKind(k)); assert.ok(!G_KINDS[k].variable, `${k} stays an on-screen kind`); }

// the Kind is fixed: same key, other kind -> refused; a rename or a new value is fine
const cur = [{ name: 'gV_A', type: 'gGlobal', kind: 'value', _key: 'k1' }, { name: 'Pump', type: 'digitalOut', _key: 'k2' }];
assert.equal(kindChangeError(cur, [{ name: 'gV_B', type: 'gGlobal', kind: 'value', initial: '5', _key: 'k1' }]), '');
assert.equal(kindChangeError(cur, [{ name: 'gV_A', type: 'gGlobal', _key: 'k1' }]), '', 'no kind is value');
assert.match(kindChangeError(cur, [{ name: 'gV_A', type: 'gGlobal', kind: 'string', _key: 'k1' }]), /gV_Global_Value.*can't be changed/);
assert.equal(kindChangeError(cur, [{ name: 'gS_New', type: 'gGlobal', kind: 'string', _key: 'k9' }]), '', 'a new one is fine');
assert.equal(kindChangeError(cur, [{ name: 'gS_New', type: 'gGlobal', kind: 'string' }]), '', 'no key yet is fine');

// the sample: one of each Kind, not on a Tab, not added twice
assert.deepEqual(SAMPLE_GLOBALS.map(s => s.kind).sort(), Object.keys(VAR_KINDS).sort());
assert.ok(SAMPLE_GLOBALS.every(s => !s.workspace && s.type === 'gGlobal'));
assert.equal(samplesToAdd([]).length, 6);
assert.equal(samplesToAdd([{ name: 'gv_strike_temp' }]).length, 5, 'a name already used (any case) is skipped');
assert.ok(samplesToAdd([]).every(s => s.retain === true));

assert.deepEqual(elementTopic({ type: 'gGlobal', kind: 'time' }), ['gglobal-kinds']);
assert.deepEqual(elementTopic({ type: 'gGlobal', kind: 'list' })[0], 'variables');
console.log('gkinds tests passed');
