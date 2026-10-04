// Background worker for lib/vectorize.js: traces one picture at a time and writes the SVG copy.
import fs from 'node:fs';
import { parentPort } from 'node:worker_threads';
import { traceFile } from './vectorize.js';

parentPort.on('message', ({ file, out }) => {
  try {
    const r = traceFile(file);
    if (r.skipped) return parentPort.postMessage({ file, skipped: r.skipped });
    fs.writeFileSync(out + '.tmp', r.svg); fs.renameSync(out + '.tmp', out);
    parentPort.postMessage({ file, score: r.score });
  } catch (e) { parentPort.postMessage({ file, error: e.message }); }
});
