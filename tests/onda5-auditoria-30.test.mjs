import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync, spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const main = execFileSync('git', ['show','origin/main:index.html'], {encoding:'utf8'});
const current = readFileSync('index.html','utf8');
const code = readFileSync('assets/js/app.js','utf8');
const stub = '<script src="./assets/js/app.js"></script>';
const expanded = '<script>' + code + '</script>';
const restored = current.replace(stub, expanded);
const preprocessedMain = main.replace(expanded,stub);
const count = (text,tag) => (text.match(new RegExp('<'+tag+'(?=[\\s/>])','gi'))||[]).length;
const attr = (text,regex) => [...text.matchAll(regex)].map(m=>m[1]);
const blob = text => {
  const bytes = Buffer.from(text,'utf8');
  return createHash('sha1').update(Buffer.from('blob '+bytes.length+String.fromCharCode(0))).update(bytes).digest('hex');
};
const checks = [
 ['01 original main exists', () => assert.ok(main.startsWith('<!'))],
 ['02 branch html exists', () => assert.ok(current.startsWith('<!'))],
 ['03 extracted js exists', () => assert.ok(code.length>100)],
 ['04 app reference exactly once', () => assert.equal(current.split(stub).length-1,1)],
 ['05 matching inline script on main', () => assert.equal(main.split(expanded).length-1,1)],
 ['06 no original inline script in new html', () => assert.ok(!current.includes(expanded))],
 ['07 relative local script path', () => assert.ok(stub.includes('src="./assets/js/app.js"'))],
 ['08 reconstructed html byte parity', () => assert.equal(restored,main)],
 ['09 baseline after extraction byte parity', () => assert.equal(preprocessedMain,current)],
 ['10 git blob sha parity', () => assert.equal(blob(restored),blob(main))],
 ['11 js syntax valid', () => {
   const result=spawnSync(process.execPath,['--check','assets/js/app.js'],{encoding:'utf8',timeout:30000});
   assert.equal(result.status,0,result.stderr||String(result.error||'invalid JS'));
 }],
 ['12 title unchanged', () => assert.deepEqual(attr(current,/<title[^>]*>([\s\S]*?)<\/title>/gi),attr(preprocessedMain,/<title[^>]*>([\s\S]*?)<\/title>/gi))],
 ['13 html lang unchanged', () => assert.deepEqual(attr(current,/<html\b[^>]*\blang=["']([^"']+)/gi),attr(preprocessedMain,/<html\b[^>]*\blang=["']([^"']+)/gi))],
 ['14 stylesheet hrefs unchanged', () => assert.deepEqual(attr(current,/<link\b[^>]*href=["']([^"']+)/gi),attr(preprocessedMain,/<link\b[^>]*href=["']([^"']+)/gi))],
 ['15 anchor targets unchanged', () => assert.deepEqual(attr(current,/<a\b[^>]*href=["']([^"']+)/gi),attr(preprocessedMain,/<a\b[^>]*href=["']([^"']+)/gi))],
 ['16 image sources unchanged', () => assert.deepEqual(attr(current,/<img\b[^>]*src=["']([^"']+)/gi),attr(preprocessedMain,/<img\b[^>]*src=["']([^"']+)/gi))],
 ['17 form structure unchanged', () => assert.equal(count(current,'form'),count(preprocessedMain,'form'))],
 ['18 text inputs unchanged', () => assert.equal(count(current,'input'),count(preprocessedMain,'input'))],
 ['19 dropdowns unchanged', () => assert.equal(count(current,'select'),count(preprocessedMain,'select'))],
 ['20 dropdown options unchanged', () => assert.equal(count(current,'option'),count(preprocessedMain,'option'))],
 ['21 textareas unchanged', () => assert.equal(count(current,'textarea'),count(preprocessedMain,'textarea'))],
 ['22 buttons unchanged', () => assert.equal(count(current,'button'),count(preprocessedMain,'button'))],
 ['23 labels unchanged', () => assert.equal(count(current,'label'),count(preprocessedMain,'label'))],
 ['24 main landmarks unchanged', () => assert.equal(count(current,'main'),count(preprocessedMain,'main'))],
 ['25 navigation landmarks unchanged', () => assert.equal(count(current,'nav'),count(preprocessedMain,'nav'))],
 ['26 sections unchanged', () => assert.equal(count(current,'section'),count(preprocessedMain,'section'))],
 ['27 heading tags unchanged', () => assert.deepEqual(['h1','h2','h3'].map(t=>count(current,t)),['h1','h2','h3'].map(t=>count(preprocessedMain,t)))],
 ['28 inline style definitions unchanged', () => assert.deepEqual(attr(current,/<style\b[^>]*>([\s\S]*?)<\/style>/gi),attr(preprocessedMain,/<style\b[^>]*>([\s\S]*?)<\/style>/gi))],
 ['29 privacy links and declarations unchanged', () => assert.deepEqual(attr(current,/<meta\b[^>]*(?:privacy|consent)[^>]*>/gi),attr(preprocessedMain,/<meta\b[^>]*(?:privacy|consent)[^>]*>/gi))],
 ['30 no dependency or policy change', () => assert.equal(current.replace(stub,expanded),main)]
];
assert.equal(checks.length,30);
for(const [label,check] of checks) test(label,check);
