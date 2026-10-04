import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { Store } from '../lib/store.js'; import { Engine, compile } from '../lib/engine.js';
const d = fs.mkdtempSync(path.join(os.tmpdir(), 'bp'));
fs.writeFileSync(path.join(d,'c.json'), JSON.stringify({elements:[
 {name:'gblS_Msg',type:'vKonstant',kind:'string'},{name:'gblV_N',type:'vKonstant',kind:'value'},
 {name:'tm_T',type:'timer',timerType:'countdown'},{name:'sw_X',type:'switch'},{name:'shr',type:'shared',dataType:'value'}]}));
const store = new Store(path.join(d,'c.json'), path.join(d,'data')); store.load();
const eng = new Engine(store, path.join(d,'scripts'), {logNow(){}});
eng.on('print', p=>console.log('PRINT', p.script, JSON.stringify(p.text)));
setInterval(()=>store.tickTimers(0.1),100).unref();
const t1 = `//test "quoted" comment
new value vA
new string vS
new time vT
new datetime vD
new value "Euler's number"
"Euler's number" = 2.718
vA = 3
vA += 2 * 3 ^ 2
print vA
vS = "A" + vA
print vS
vT = 00:01:30
vT += 00:00:30
print vT
if vA > 100
  print "big"
elseif vA == 21
  print "is 21"
  [InsideIf]
else
  print "other"
endif
vD = now
vS = vD
"gblS_Msg" value = "hello\\nworld"
print "gblS_Msg" value
"tm_T" value = 00:00:01
start "tm_T"
wait "tm_T" value <= 00:00:00
print "timer done"
"sw_X" state = true
if "sw_X" state == true && vA != 5
 print "switch on"
endif
vA = 0
[Loop]
vA += 1
if vA < 3
 goto "Loop"
endif
print "loops " + vA
"shr" value = 7
"gblV_N" value = "shr" value * 2
print "gblV_N" value
start "child"
sleep 200
print "Euler's number"
`;
fs.mkdirSync(path.join(d,'scripts'),{recursive:true});
fs.writeFileSync(path.join(d,'scripts','t1.txt'), t1);
fs.writeFileSync(path.join(d,'scripts','child.txt'), 'print "child ran"\nstop "child"\nprint "never"\n');
fs.writeFileSync(path.join(d,'scripts','bad.txt'), 'if 1 == 1\nprint "x"\ngoto "Nope"\nvQ = 1\n"nosuch" value = 1\n');
console.log('CHECK bad', JSON.stringify(eng.check(fs.readFileSync(path.join(d,'scripts','bad.txt'),'utf8'))));
console.log(eng.start('bad'));
console.log(eng.start('t1'));
setTimeout(()=>{ console.log(JSON.stringify(eng.list())); process.exit(0); }, 2500);
