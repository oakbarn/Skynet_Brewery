// Gives every new Skynet picture its fixed ID number (Rule 7.22) and writes the printable list docs/Skynet_Picture_IDs.md.
//   node tools/skynet-picture-ids.js          adds numbers for new pictures in media/Images/Skynet, then writes the list
//   node tools/skynet-picture-ids.js --check  changes nothing; fails when a picture has no number or the list is out of date
// A number is never changed or given to another picture (Design Rule #2, a Meaningless Key): a picture that is gone keeps its row,
// marked retired. To rename a picture, change the "file" of its row by hand (its number stays).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { updateSkynetPicIds, IDS_FILE, skynetPicRows, forgetSkynetPicIds } from '../lib/skynetpicids.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKYNET = path.join(ROOT, 'media', 'Images', 'Skynet');
export const LIST_MD = path.join(ROOT, 'docs', 'Skynet_Picture_IDs.md');

export function listMarkdown(rows) {
  const live = rows.filter(r => !r.retired), gone = rows.filter(r => r.retired);
  const line = r => { const [g, ...f] = r.file.split('/'); return `| ${r.id} | ${f.join('/')} | ${g.replace(/_/g, ' ')} |`; };
  return [
    '# Skynet Picture ID numbers',
    '',
    'Every picture that comes with Skynet has a fixed ID number (Skynet Rule 7.22). The number never changes and is never given to',
    'another picture, even if the picture is renamed. Every picture list in the panel shows the number beside the file name, and a',
    'Process can use the number or the file name, for example `MyAlarm.setgraphic = 17` or `MyAlarm.setgraphic = "Alarm_Hops.svg"`.',
    '',
    'In the panel: Media page > **🔢 Skynet Picture numbers** shows this list with each picture, ready to print.',
    '',
    `${live.length} pictures.`,
    '',
    '| ID | File name | Group |',
    '|---:|---|---|',
    ...live.map(line),
    ...(gone.length ? ['', '## Retired numbers (never used again)', '', '| ID | File name | Group |', '|---:|---|---|', ...gone.map(line)] : []),
    '',
    '*This list is written by `node tools/skynet-picture-ids.js`.*',
    '',
  ].join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check');
  if (check) {
    const tmp = path.join(ROOT, '.skynetpicids-check.json');
    fs.copyFileSync(IDS_FILE, tmp);
    const { added, retired } = updateSkynetPicIds(SKYNET, tmp);
    fs.rmSync(tmp, { force: true });
    const md = listMarkdown(skynetPicRows());
    const stale = !fs.existsSync(LIST_MD) || fs.readFileSync(LIST_MD, 'utf8') !== md;
    if (added.length || retired.length || stale) {
      console.error(`Skynet Picture IDs out of date: ${added.length} new, ${retired.length} gone${stale ? ', docs/Skynet_Picture_IDs.md not current' : ''}. Run: node tools/skynet-picture-ids.js`);
      process.exit(1);
    }
    console.log('Skynet Picture IDs are up to date.');
  } else {
    const { added, retired } = updateSkynetPicIds(SKYNET);
    forgetSkynetPicIds();
    fs.writeFileSync(LIST_MD, listMarkdown(skynetPicRows()));
    console.log(`Added ${added.length} new number(s)${added.length ? ': ' + added.map(r => `${r.id} ${r.file}`).join(', ') : ''}; ${retired.length} retired. Wrote docs/Skynet_Picture_IDs.md`);
  }
}
