// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// Starts the Brain in the Background (Rule 6.32, OakBarn Brewery 2026-11-14: "Maybe Change that the Brain is in the Back ground and
// somewhat separate on a Computer"). Skynet_Brewer.bat (and Skynet_Importer.bat) run this last:
//
//   node lib\startbrain.js <panel folder>            the Brain (server.js)
//   node lib\startbrain.js <panel folder> importer   the BruControl Importer (importer.js)
//
// The Brain runs with no window on the screen (Windows gives it its own hidden window, so Windows still tells it when the computer
// shuts down, restarts or signs out, Rule 6.31). What it writes goes to data\brain.log (the Importer's to data\importer.log). Once it
// answers, this ends and the .bat's black window closes. It did not start: the last lines of the log are shown and the window stays.
// Already running: the Brain opens its window again by itself.
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { panelPort } from './stoppanel.js';

export const IMPORTER_PORT = 8095;
export const START_WAIT_MS = 90000;     // a first start (samples copied, pictures made) can take a while

const listening = port => new Promise(done => {
  const s = net.connect({ host: '127.0.0.1', port });
  s.setTimeout(1000, () => { s.destroy(); done(false); });
  s.once('connect', () => { s.destroy(); done(true); });
  s.once('error', () => done(false));
});
export const lastLines = (text, n = 25) => String(text ?? '').split(/\r?\n/).filter(l => l.trim()).slice(-n).join('\n');

export function brainJob(root, kind = 'brain') {
  const importer = kind === 'importer';
  return {
    script: path.join(root, importer ? 'importer.js' : 'server.js'),
    port: importer ? IMPORTER_PORT : panelPort(root),
    log: path.join(root, 'data', importer ? 'importer.log' : 'brain.log'),
    name: importer ? 'The BruControl Importer' : 'The Skynet Brain',
  };
}

// Returns 0 (running in the Background) or 1 (did not start; the .bat keeps its window open so the reason can be read)
export async function startBrain(root, { kind = 'brain', wait = START_WAIT_MS, log = console.log, spawnFn = spawn, isListening = listening } = {}) {
  const job = brainJob(root, kind);
  const already = await isListening(job.port);
  fs.mkdirSync(path.dirname(job.log), { recursive: true });
  // a new log each start (the old one is kept once as .old), so it never grows without end
  if (!already) try { if (fs.existsSync(job.log)) fs.renameSync(job.log, job.log + '.old'); } catch { /* still in use: written after it */ }
  const out = fs.openSync(job.log, 'a');
  const child = spawnFn(process.execPath, ['--no-warnings', job.script], { cwd: root, env: process.env, stdio: ['ignore', out, out], windowsHide: true, detached: process.platform !== 'win32' });
  let ended = null;
  child.on?.('exit', code => { ended = code ?? 1; });
  child.on?.('error', () => { ended = 1; });
  child.unref?.();
  fs.closeSync(out);
  if (already) { log(` ${job.name} is already running in the Background. Its window opens again.`); return 0; }
  const end = Date.now() + wait;
  while (Date.now() < end) {
    if (await isListening(job.port)) {
      log(` ${job.name} is running in the Background. This window closes now.`);
      return 0;
    }
    if (ended !== null) break;
    await new Promise(r => setTimeout(r, 500));
  }
  let text = ''; try { text = fs.readFileSync(job.log, 'utf8'); } catch { }
  log(`\n ${job.name} did not start. The last lines of ${job.log}:\n`);
  log(lastLines(text) || ' (nothing was written)');
  return 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startBrain(path.resolve(process.argv[2] ?? '.'), { kind: process.argv[3] === 'importer' ? 'importer' : 'brain' }).then(code => process.exit(code));
}
