// Writes the general Notepad++ colors file, docs/Skynet_Process_Notepad++.xml (node tools/notepadpp.js).
// The panel makes one with your own names: Processes > Save to file > Notepad++ colors file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { notepadPlusPlus } from '../public/colorize.js';

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'Skynet_Process_Notepad++.xml');
fs.writeFileSync(out, notepadPlusPlus());
console.log('Wrote ' + out);
