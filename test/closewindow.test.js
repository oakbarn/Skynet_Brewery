// Close Skynet Brewer closes its Command Prompt window, whatever .bat started the panel (Rule 2.25, lib/closewindow.js)
import assert from 'node:assert/strict';
import { launcherChain, closeLauncherWindow } from '../lib/closewindow.js';

const P = (pid, ppid, name) => ({ pid, ppid, name });
// double-clicked .bat > call npm start > npm's cmd > the panel
const desk = [P(1, 0, 'explorer.exe'), P(10, 1, 'cmd.exe'), P(11, 10, 'conhost.exe'), P(20, 10, 'node.exe'), P(30, 20, 'cmd.exe'), P(40, 30, 'node.exe')];
assert.deepEqual(launcherChain(desk, 40), [30, 20, 10]);
// Windows Terminal above the Command Prompt is left alone
assert.deepEqual(launcherChain([P(5, 1, 'WindowsTerminal.exe'), P(6, 5, 'OpenConsole.exe'), P(10, 6, 'CMD.EXE'), P(40, 10, 'node.exe')], 40), [10]);
// node server.js started straight from a program that is not a Command Prompt: nothing to close
assert.deepEqual(launcherChain([P(1, 0, 'explorer.exe'), P(40, 1, 'node.exe')], 40), []);
assert.deepEqual(launcherChain([P(1, 0, 'services.exe'), P(20, 1, 'node.exe'), P(40, 20, 'node.exe')], 40), []);
// a loop in the list never hangs
assert.deepEqual(launcherChain([P(10, 20, 'cmd.exe'), P(20, 10, 'cmd.exe'), P(40, 10, 'node.exe')], 40), [10, 20]);
// the top Command Prompt is ended first; not on Linux or a Mac; a failure never stops the close
{
  const killed = [];
  assert.deepEqual(closeLauncherWindow({ platform: 'win32', self: 40, list: () => desk, kill: p => killed.push(p) }), [30, 20, 10]);
  assert.deepEqual(killed, [10, 20, 30]);
  assert.deepEqual(closeLauncherWindow({ platform: 'linux', self: 40, list: () => desk, kill: () => assert.fail() }), []);
  assert.deepEqual(closeLauncherWindow({ platform: 'win32', self: 40, list: () => { throw new Error('no PowerShell'); } }), []);
  assert.deepEqual(closeLauncherWindow({ platform: 'win32', self: 40, list: () => desk, kill: () => { throw new Error('gone'); } }), [30, 20, 10]);
}
console.log('closewindow tests passed');
