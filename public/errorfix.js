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

// An error's words split in two for the Error Log (OakBarn Brewery, Error Text PDF 2026-11-25): what went wrong, and the names that are
// allowed when the error lists them ("... is not a Recipe value (they are: a, b, c)"), shown after "Possible Suggested Replacement at Line N:"
export function errSplit(msg) {
  // an old entry may have its list cut short (no closing bracket): the list shows as far as it goes
  const m = /^([\s\S]*?)\s*\(they are:\s*([\s\S]*?)\)?\s*$/.exec(String(msg ?? ''));
  return m ? { what: m[1], list: m[2] } : { what: String(msg ?? ''), list: '' };
}

// Why it failed, in plain words (OakBarn Brewery, 2026-11-26: "if you can add plain text to the error and why it failed, do so"). One
// sentence on what went wrong, for the pop-up and the Error Log, next to the error's own words. '' when the error's words are already plain.
const WHY = [
  [/^(skn_rcp_\S+) is not a Recipe value/, m => `This line asks the Recipe for ${m[1]}, but the Recipe has no value with that name, so there is nothing to use here.`],
  [/^(\S+) is NULL \(empty\)/, m => /^skn_rcp_/.test(m[1]) ? `${m[1]} has no value: no Recipe is loaded, or the Recipe leaves it empty, so this line has nothing to work with.`
    : `${m[1]} has no value yet (nothing was put in it), so this line has nothing to work with.`],
  [/^Unknown (?:name|variable) (\S+?):?(\s|$)/, m => `Skynet does not know the name ${m[1]}: no Device, Widget or variable has that name.`],
  [/^Variable (\S+) used before "new"/, m => `${m[1]} is used on this line before the line that makes it.`],
  [/^(\S+) has no property (\S+)/, m => `${m[1]} has nothing called .${m[2]}.`],
  [/has no property (\S+)/, m => `The name before the dot has nothing called .${m[1]}.`],
  [/(no process or element named|no process named|nothing is named|No valve named|No hose named|No pipe, hose or IP named|no alarm or sound player named) "([^"]+)"/,
    m => `Nothing in this Schema is called "${m[2]}".`],
  [/^Process not found: "([^"]+)"/, m => `There is no Process called "${m[1]}".`],
  [/^Element not found: "([^"]+)"/, m => `Nothing in this Schema is called "${m[1]}".`],
  [/^(\S+) is not connected \(([^)]*)\)/, m => `The board ${m[1]} is not talking to the Brain (${m[2]}), so the Device on this line could not be switched or read.`],
  [/^Missing closing quote/, () => 'A text on this line starts with " but does not end with one.'],
  [/^(\{ needs an if|\} without \{|if has no endif|endif without if|else without if|elseif without if|else after else|elseif after else|\{ has no \})/,
    () => 'The if, else and endif lines do not pair up, so Skynet cannot tell where this part ends.'],
  [/^goto: no label \[([^\]]+)\]/, m => `goto points to [${m[1]}], but no line in this Process is that label.`],
  [/^Label \[([^\]]+)\] is used twice/, m => `Two lines are the label [${m[1]}], so a goto cannot tell which one to go to.`],
  [/^(Do not understand|Unknown statement|Bad expression|Missing expression|Unexpected character)/, () => 'Skynet could not read this line: a word or sign in it is not one it knows.'],
  [/^wait_boil: no temperature probe has Boil Probe/, () => 'wait_boil needs a probe marked Boil Probe, and no probe is.'],
  [/^goLine (\d+): the Process has only (\d+) lines/, m => `goLine points to line ${m[1]}, past the end of the Process.`],
  [/Cannot divide by zero|division by zero|divide by 0/i, () => 'This line divides by 0, which has no answer.'],
  [/^start_hop_alerts: no timer named "([^"]+)"/, m => `start_hop_alerts names the timer "${m[1]}", and there is no timer with that name.`],
  [/^send_db: "([^"]+)" has no value to send/, m => `"${m[1]}" is empty, so there is nothing to send.`],
];
export function whyOf(msg) {
  const s = String(msg ?? '').replace(/^line \d+:\s*/, '').trim();
  for (const [re, f] of WHY) { const m = re.exec(s); if (m) return f(m); }
  return '';
}
