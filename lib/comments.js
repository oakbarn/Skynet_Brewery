// Comments in a Process (Fritz, 2026-10-19): besides // the comment marks of other languages work too.
//   //  and  #  and  '   comment to the end of the line (C, C++, C#, JavaScript, Node.js, Python, Visual Basic)
//   /* ... */           a block comment, on one line or over many lines (C, C++, C#, JavaScript)
// Text inside "quotes" is never a comment. Also used by the browser (public/colorize.js imports nothing, it has its own copy).

// Where a line comment starts in `line` (outside quotes), or -1
export function lineCommentAt(line, from = 0) {
  let q = false;
  for (let i = from; i < line.length; i++) {
    const c = line[i];
    if (c === '"') q = !q;
    else if (!q && (c === '#' || c === "'" || (c === '/' && line[i + 1] === '/'))) return i;
  }
  return -1;
}

// lines -> { lines, touched }: every /* block comment */ is replaced by spaces (so columns stay where they were);
// touched holds the index of each line that had block comment text in it.
export function maskBlockComments(lines) {
  const out = [], touched = new Set();
  let inBlock = false;
  lines.forEach((line, n) => {
    let s = '', q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inBlock) {
        touched.add(n);
        if (c === '*' && line[i + 1] === '/') { inBlock = false; s += '  '; i++; } else s += c === '\t' ? '\t' : ' ';
        continue;
      }
      if (c === '"') q = !q;
      if (!q && c === '/' && line[i + 1] === '*') { inBlock = true; touched.add(n); s += '  '; i++; continue; }
      if (!q && (c === '#' || c === "'" || (c === '/' && line[i + 1] === '/'))) { s += line.slice(i); break; }   // rest of the line is a comment
      s += c;
    }
    out.push(s);
  });
  return { lines: out, touched };
}
