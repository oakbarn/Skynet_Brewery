// goLine follows its line (OakBarn Brewery, 2026-11-13, Rule 16.10: "I would want the goline number updated to its new line number").
// When a Process is saved, the old file and the new text are compared line by line. Every goLine that was already there (its line is
// unchanged) gets the new number of the line it pointed at: lines added or taken out ABOVE that line move it; lines below do not.
// A goLine typed or changed in this edit is kept as typed. If its line was taken out, it points at the next line that is still there.

const GOLINE = /\bgoline(\s+)(\d+)\b/gi;

// For each old line (0-based), its new line (0-based), or -1 when it was taken out or changed.
export function lineMap(oldLines, newLines) {
  const map = new Array(oldLines.length).fill(-1);
  let a = 0, b = 0;
  while (a < oldLines.length && a < newLines.length && oldLines[a] === newLines[a]) { map[a] = a; a++; }      // the same start
  let ea = oldLines.length, eb = newLines.length;
  while (ea > a && eb > a && oldLines[ea - 1] === newLines[eb - 1]) { ea--; eb--; map[ea] = eb; }          // the same end
  const n = ea - a, m2 = eb - a; b = a;
  if (n && m2 && n * m2 <= 4e6) {               // the middle: longest common lines (a Process is at most a few thousand lines)
    const L = Array.from({ length: n + 1 }, () => new Uint16Array(m2 + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m2 - 1; j >= 0; j--)
      L[i][j] = oldLines[a + i] === newLines[b + j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    let i = 0, j = 0;
    while (i < n && j < m2) {
      if (oldLines[a + i] === newLines[b + j]) { map[a + i] = b + j; i++; j++; }
      else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++;
    }
  }
  return map;
}

// The new text with every unchanged goLine pointing at the same line as before. Returns { text, changed }.
export function followGoLines(oldText, newText) {
  if (typeof oldText !== 'string' || !/goline/i.test(newText)) return { text: newText, changed: 0 };
  const eol = /\r\n/.test(newText) ? '\r\n' : '\n';
  const oldLines = oldText.split(/\r?\n/), newLines = newText.split(/\r?\n/);
  const map = lineMap(oldLines, newLines);
  const back = new Map(); map.forEach((j, i) => { if (j >= 0) back.set(j, i); });
  const target = n => {                         // old line number (1-based) -> new line number, or null
    for (let i = n - 1; i < oldLines.length; i++) if (map[i] >= 0) return map[i] + 1;
    return null;
  };
  let changed = 0;
  const out = newLines.map((line, j) => {
    if (!back.has(j) || !/goline/i.test(line)) return line;           // new or changed lines are kept as typed
    const cut = line.indexOf('//'), code = cut < 0 ? line : line.slice(0, cut), rest = cut < 0 ? '' : line.slice(cut);
    const fixed = code.replace(GOLINE, (all, sp, num) => {
      const n = +num; if (n < 1 || n > oldLines.length) return all;
      const to = target(n); if (to === null || to === n) return all;
      changed++; return all.replace(/\d+$/, String(to));
    });
    return fixed + rest;
  });
  return { text: out.join(eol), changed };
}
