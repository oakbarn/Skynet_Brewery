// Shut down the Brain's computer (Rule 6.40, lib/brainoff.js): Admins only, only with Shut Down Brain Option On
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { powerOffPlan, startPowerOff, finishPowerOff, systemctlPath, cannotWhy, WINDOWS_DELAY_S } from '../lib/brainoff.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// what turns each kind of computer off
assert.deepEqual(powerOffPlan('win32').now.slice(0, 1), ['shutdown.exe']);
assert.deepEqual(powerOffPlan('win32').now[1].slice(0, 3), ['/s', '/t', String(WINDOWS_DELAY_S)]);
assert.equal(powerOffPlan('win32').last, undefined);
const pi = powerOffPlan('linux', p => p === '/usr/bin/systemctl');
assert.deepEqual(pi.check, ['sudo', ['-n', '-l', '/usr/bin/systemctl', 'poweroff']]);      // -n: never waits for a password
assert.deepEqual(pi.last, ['sudo', ['-n', '/usr/bin/systemctl', 'poweroff']]);
assert.equal(systemctlPath(p => p === '/bin/systemctl'), '/bin/systemctl');
assert.equal(systemctlPath(() => false), 'systemctl');
assert.equal(powerOffPlan('darwin').last[0], 'osascript');
assert.equal(powerOffPlan('freebsd'), null);
for (const pl of ['linux', 'win32', 'darwin']) assert.ok(cannotWhy(pl).length > 20);

// the check comes first: a computer that refuses stops nothing
{
  const ran = [];
  assert.equal(await startPowerOff('linux', { exists: () => true, exec: async (c, a) => { ran.push([c, ...a].join(' ')); return false; } }), false);
  assert.deepEqual(ran, ['sudo -n -l /usr/bin/systemctl poweroff']);
  ran.length = 0;
  assert.equal(await startPowerOff('linux', { exists: () => true, exec: async (c, a) => { ran.push([c, ...a].join(' ')); return true; } }), true);
  assert.equal(ran.length, 1);       // poweroff itself waits until the Brain has stopped
  assert.equal(await startPowerOff('win32', { exec: async () => false }), false);
  assert.equal(await startPowerOff('win32', { exec: async () => true }), true);
  assert.equal(await startPowerOff('freebsd', { exec: async () => true }), false);
}
// as the Brain stops: the last command runs on by itself
{
  const started = [];
  finishPowerOff('linux', { exists: () => true, start: (c, a, o) => { started.push([c, a, o.detached]); return { on() { }, unref() { } }; } });
  assert.deepEqual(started, [['sudo', ['-n', '/usr/bin/systemctl', 'poweroff'], true]]);
  started.length = 0;
  finishPowerOff('win32', { start: (...x) => started.push(x) });
  assert.equal(started.length, 0);   // Windows' own countdown already runs
  finishPowerOff('linux', { exists: () => true, start: () => { throw new Error('no sudo'); } });   // never stops the Brain from stopping
}

// the server: Admins only, the Setting must be On, checked before anything stops, allowed in Standby
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const route = server.slice(server.indexOf("if (p === '/ui/poweroff'"), server.indexOf("if (p === '/ui/wake'"));
assert.ok(route.includes("me.role !== 'admin'"));
assert.ok(route.includes('brewDefaults?.shutDownBrain'));
assert.ok(route.indexOf('startPowerOff') < route.indexOf('shutdown('));
assert.ok(server.includes("['/ui/wake', '/ui/close', '/ui/poweroff']"));

// the panel: the ☰ Menu choice and the Standby page button only for an Admin with the Setting On; the Setting is Off to start
const app = fs.readFileSync(path.join(root, 'public/app.js'), 'utf8');
assert.ok(/S\.me\?\.role === 'admin' && !S\.importBuild && S\.config\?\.brewDefaults\?\.shutDownBrain\)\s*\n\s*list\.append\(item\('⏼ Shut down the Brain\\'s computer'/.test(app));
assert.ok(app.includes("admin && S.config?.brewDefaults?.shutDownBrain ? h('button'"));
assert.ok(app.includes("['shutDownBrain', 'Shut Down Brain Option', 'bool', false"));
assert.ok(/PANEL_SET_KEYS = \[[^\]]*'shutDownBrain'/.test(app));

// the Pi and Linux installers allow only the poweroff command without a password
for (const f of ['install/pi/skynet-first-install-pi.sh', 'install/linux/install-skynet-brewer.sh']) {
  const s = fs.readFileSync(path.join(root, f), 'utf8');
  assert.ok(s.includes('NOPASSWD: /usr/bin/systemctl poweroff, /bin/systemctl poweroff"'), f);
  assert.ok(s.includes('visudo -cf'), f);
}
console.log('Shut down the Brain\'s computer ok');
