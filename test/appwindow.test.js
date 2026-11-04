// Skynet opens in its own clean window on Windows; the normal browser is never changed (Rule 2.36, lib/appwindow.js)
import assert from 'node:assert/strict';
import { browserPaths, findBrowser, profileDir, appArgs, waitingOpeners, openAppWindow, closeScript, closeAppWindow } from '../lib/appwindow.js';

const env = { 'ProgramFiles(x86)': 'C:\\Program Files (x86)', ProgramFiles: 'C:\\Program Files', LOCALAPPDATA: 'C:\\Users\\Fritz\\AppData\\Local' };
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
// Edge first, then Chrome
assert.equal(browserPaths(env)[0], edge);
assert.equal(findBrowser({ env, exists: p => p === edge || p === chrome }), edge);
assert.equal(findBrowser({ env, exists: p => p === chrome }), chrome);
assert.equal(findBrowser({ env, exists: () => false }), null);
// Skynet's own profile, never the person's normal one
assert.equal(profileDir(env), 'C:\\Users\\Fritz\\AppData\\Local\\SkynetBrewer\\AppWindow');
assert.equal(profileDir({ USERPROFILE: 'C:\\Users\\Fritz' }), 'C:\\Users\\Fritz\\AppData\\Local\\SkynetBrewer\\AppWindow');
const args = appArgs('http://localhost:8080', profileDir(env));
assert.ok(args.includes('--app=http://localhost:8080'));
assert.ok(args.some(a => a.startsWith('--user-data-dir=') && a.endsWith('SkynetBrewer\\AppWindow')));
// an old .bat's waiting "start http://localhost:8080" is found; other Command Prompts are not
const procs = [
  { pid: 10, name: 'cmd.exe', cmd: 'C:\\WINDOWS\\system32\\cmd.exe /c ""C:\\Brewing\\Skynet_Brewer.bat" "' },
  { pid: 30, name: 'cmd.exe', cmd: 'cmd  /c "timeout /t 4 /nobreak >nul & start "" http://localhost:8080"' },
  { pid: 31, name: 'cmd.exe', cmd: 'cmd  /c "timeout /t 4 /nobreak >nul & start "" http://localhost:9090"' },
];
assert.deepEqual(waitingOpeners(procs, 8080), [30]);

// opening: Edge app window; the waiting old opener is ended first
{
  const ran = [], killed = [];
  assert.equal(openAppWindow('http://localhost:8080', { platform: 'win32', env, find: () => edge, run: (e, a) => ran.push([e, a]), list: () => procs, kill: p => killed.push(p) }), 'app');
  assert.deepEqual(killed, [30]);
  assert.equal(ran[0][0], edge); assert.ok(ran[0][1][0] === '--app=http://localhost:8080');
}
// no Edge or Chrome: the normal browser
{
  const ran = [];
  assert.equal(openAppWindow('http://localhost:8080', { platform: 'win32', env, find: () => null, run: (e, a) => ran.push([e, a]), list: () => [] }), 'browser');
  assert.deepEqual(ran, [['explorer.exe', ['http://localhost:8080']]]);
}
// SKYNET_WINDOW=browser / none; not on Linux, Mac or Pi; a failure never stops the panel
assert.equal(openAppWindow('u', { platform: 'win32', env: { ...env, SKYNET_WINDOW: 'browser' }, find: () => edge, run: () => {}, list: () => [] }), 'browser');
assert.equal(openAppWindow('u', { platform: 'win32', env: { ...env, SKYNET_WINDOW: 'none' }, run: () => assert.fail() }), 'none');
assert.equal(openAppWindow('u', { platform: 'linux', env, run: () => assert.fail() }), 'none');
assert.equal(openAppWindow('u', { platform: 'win32', env, find: () => edge, run: () => { throw new Error('x'); }, list: () => { throw new Error('y'); } }), 'none');

// closing: only the browser using Skynet's profile, asked nicely first, then made to close
{
  const s = closeScript("C:\\Users\\O'Neil\\AppData\\Local\\SkynetBrewer\\AppWindow");
  assert.ok(s.includes("O''Neil")); assert.ok(s.includes('CloseMainWindow')); assert.ok(s.indexOf('CloseMainWindow') < s.indexOf('Stop-Process'));
  let got = '';
  assert.equal(closeAppWindow({ platform: 'win32', env, run: x => { got = x; } }), true);
  assert.ok(got.includes('SkynetBrewer\\AppWindow'));
  assert.equal(closeAppWindow({ platform: 'darwin', env, run: () => assert.fail() }), false);
  assert.equal(closeAppWindow({ platform: 'win32', env, run: () => { throw new Error('no PowerShell'); } }), false);
}
console.log('appwindow tests passed');
