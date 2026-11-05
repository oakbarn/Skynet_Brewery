// Right-click Help: every page and part the map points at must exist in help/.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ALL_TOPICS, elementTopic, graphicTopic } from '../public/helpmap.js';

const dir = new URL('../help/', import.meta.url);
const bare = n => n.replace(/^\d+[-_]/, '').replace(/\.md$/, '');
// the same heading ids as help.js: lower case, marks and other characters become "-"
const slug = s => s.toLowerCase().replace(/[*_`]/g, '').replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pages = Object.fromEntries(fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
  const text = fs.readFileSync(new URL(f, dir), 'utf8');
  return [bare(f), [...text.matchAll(/^#{1,6}\s+(.*?)\s*#*$/gm)].map(m => slug(m[1]))];
}));

for (const [page, section] of ALL_TOPICS()) {
  assert.ok(pages[page], `help page "${page}" exists`);
  if (section) assert.ok(pages[page].includes(section), `"${page}" has a part "${section}"`);
}
assert.deepEqual(elementTopic({ type: 'digitalOut', subtype: 'valve', valveType: 'manual' }), ['manual-valves']);
assert.deepEqual(elementTopic({ type: 'temperature', subtype: 'probeTee' }), ['temperature-probe-device-properties'], 'a tee with a Temperature Probe: the Probe drill-down (Fritz, 2026-11-05, Rule 18.26)');
assert.deepEqual(elementTopic({ type: 'flowMeter' })[0], 'devices', 'unknown devices go to Devices');
assert.deepEqual(elementTopic({ type: 'alarm', alarmClass: 'basic' }), ['alarm-widget'], 'the Alarm Widget subclasses have their own Help page');
assert.deepEqual(elementTopic({ type: 'alarm' }), ['alarms-and-sound'], 'an older Alarm keeps Alarms and sound');
assert.deepEqual(graphicTopic({ kind: 'pipe', hose: true }), ['pipe-and-hose-flow-colors'], 'Rule 5.21');
assert.deepEqual(graphicTopic({ kind: 'pipe', hose: true, qd: true }), ['quick-disconnects-and-qd-hoses', 'the-quick-disconnect-hose'], 'Rule 5.28');
assert.deepEqual(graphicTopic({ kind: 'ip', fitting: 'qd' }), ['quick-disconnects-and-qd-hoses', 'the-quick-disconnect-widget'], 'Rule 5.28');
console.log('helpmap tests passed');
