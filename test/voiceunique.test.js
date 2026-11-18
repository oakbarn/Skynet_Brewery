// Every Voice Command is Unique (OakBarn Brewery, 2026-11-18: "add Voice Command must be Unique"; Rule 6.18, Help 144)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { voiceNames, apiNameItems, apiNameListError, apiNameOwner } from '../public/apiname.js';

// the API_Name first, a Label no other item has, else the Name
const said = voiceNames([{ name: 'P1', label: 'Pump' }, { name: 'P2', label: 'pump' }, { name: 'V1', label: 'Mash Valve' }, { name: 'V2', label: 'Boil', apiName: 'Mash  valve' }, { name: 'T1', label: 'HLT', apiName: 'Hot Liquor' }, { name: 'X' }]);
assert.deepEqual([...said], [['P1', 'P1'], ['P2', 'P2'], ['V1', 'V1'], ['V2', 'Mash valve'], ['T1', 'Hot Liquor'], ['X', 'X']]);
// Unique across every Device and Widget, a Hose Bib too
const cfg = { elements: [{ name: 'Red_Pump', apiName: 'Chiller Water' }], graphics: [{ id: 'g', kind: 'ip', fitting: 'manualValve', name: 'wgt_TWV_Chiller~water_BH', apiName: 'chiller water' }, { id: 't', kind: 'text', apiName: 'x' }] };
assert.equal(apiNameItems(cfg).length, 2);
assert.match(apiNameListError(apiNameItems(cfg)), /used by both Red_Pump and wgt_TWV_Chiller~water_BH/);
assert.equal(apiNameOwner(apiNameItems(cfg), 'CHILLER water', cfg.graphics[0])?.name, 'Red_Pump');
const app = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
const srv = fs.readFileSync(new URL('../server.js', import.meta.url), 'utf8');
const mq = fs.readFileSync(new URL('../lib/mqtt.js', import.meta.url), 'utf8');
assert.match(app, /apiNameOwner\(apiNameItems\(editing && draft \? draft : S\.config\), n, self\)/);
assert.match(srv, /apiNameListError\(apiNameItems\(/);
assert.match(mq, /said = voiceNames\(shared\)/); assert.match(mq, /store\.manualValves\?\.\(\)/);
console.log('voice unique tests passed');
