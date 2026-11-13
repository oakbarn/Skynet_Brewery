// Writes skynet_files.json: the fingerprint of every core program file git knows (Rule 9.14, lib/official.js).
// GitHub runs it on every merge (.github/workflows/panel-version.yml) and commits it with version.json. Never edit it by hand.
// Usage: node tools/make-file-list.js
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { makeList, LIST_FILE } from '../lib/official.js';

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const files = makeList('.', tracked);
fs.writeFileSync(LIST_FILE, JSON.stringify({ note: 'Written by GitHub on every merge (Skynet Rule 9.14). Never edit it by hand.', files }, null, 1) + '\n');
console.log(`${LIST_FILE}: ${Object.keys(files).length} core files`);
