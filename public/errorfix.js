// MIT License Granted
// Copyright (c) OakBarn Brewery 2026
// How to fix a Process error, when it is evident (Rule 10.13; OakBarn Brewery, 2026-11-23: "an error log with the line # of the error,
// what the error was and a way to fix it if evident"). '' when the error's own words already say it (they give an example) or the
// fix is not evident. Plain English, one sentence or two. Used by the Brain (lib/errorlog.js) and the tests.
const HINTS = [
  [/^Variable (\S+) used before "new"/, m => `Move the "new ... ${m[1]}" line above this line, so ${m[1]} is made before it is used.`],
  [/^Unknown name (\S+?):/, m => `Check the spelling of ${m[1]}: a Device or Widget name must be the same as on the Devices page. If it is your own variable, make it first with a new line above this one, for example: new value ${m[1]} = 0`],
  [/^Unknown variable (\S+)/, m => `Check the spelling of ${m[1]}: a Device or Widget name must be the same as on the Devices page. If it is your own variable, make it first with a new line above this one, for example: new value ${m[1]} = 0`],
  [/has no property (\S+)/, m => `Check the word after the dot (.${m[1]}): the Insert bar's Devices and Widgets lists show the properties each one has.`],
  [/(no process or element named|no process named|nothing is named|No valve named|No hose named|No pipe, hose or IP named|no alarm or sound player named) "([^"]+)"/,
    m => `Check the spelling of "${m[2]}": it must be the same as its name on the Devices page or in the Processes list (a name changed there is not changed here by itself).`],
  [/^Missing closing quote/, () => 'Add the closing " at the end of the text on this line.'],
  [/^(\{ needs an if|\} without \{|if has no endif|endif without if|else without if|elseif without if|else after else|elseif after else|\{ has no \})/,
    () => 'Every if needs its endif (or its { and }). Count them from the if on this line: one is missing or there is one too many.'],
  [/^goto: no label \[([^\]]+)\]/, m => `Add the label line [${m[1]}] where the Process should go to, or fix the label's spelling after goto.`],
  [/^Label \[([^\]]+)\] is used twice/, m => `Give one of the two [${m[1]}] labels another name (and its goto too).`],
  [/^Unexpected character "\["/, () => 'A [Label] goes on a line by itself. After goto write the name without brackets, for example: goto Mash_In'],
  [/^(Do not understand|Unknown statement|Bad expression|Missing expression)/, () => 'Check the first word and the spelling on this line. The Insert bar shows every command with an example to copy.'],
  [/is NULL \(empty\)/, () => ''],
  [/^wait_boil: no temperature probe has Boil Probe/, () => 'Open the boil kettle probe\'s Properties and switch Boil Probe on.'],
  [/^goLine (\d+): the Process has only (\d+) lines/, m => `Change goLine ${m[1]} to a line from 1 to ${m[2]}.`],
  [/Cannot divide by zero|division by zero|divide by 0/i, () => 'The number after / is 0 here. Test it first, for example: if X != 0'],
];
export function fixHint(msg) {
  const s = String(msg ?? '').replace(/^line \d+:\s*/, '').trim();
  if (/for example|use \w+ instead|Test it first/i.test(s)) return '';      // the error's own words already show how
  for (const [re, f] of HINTS) { const m = re.exec(s); if (m) return f(m); }
  return '';
}
