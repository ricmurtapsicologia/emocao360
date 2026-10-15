import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../assets/js/app.js', import.meta.url), 'utf8');
const entry = '<script src="./assets/js/app.js"></script>';
const expectedOriginalBlobSha = '6201ca4a56281e44ac1b3dfdc642e27bc2237e91';

function gitBlobSha(content) {
  const body = Buffer.from(content, 'utf8');
  return createHash('sha1')
    .update(Buffer.from('blob ' + body.length + String.fromCharCode(0), 'utf8'))
    .update(body)
    .digest('hex');
}

test('onda 4: script externo aparece exatamente uma vez', () => {
  assert.equal(html.split(entry).length - 1, 1);
  assert.ok(app.trim().length > 0);
});

test('onda 4: HTML original e regras intactos (reconstituição byte a byte)', () => {
  const reconstructed = html.replace(entry, '<script>' + app + '</script>');
  assert.equal(gitBlobSha(reconstructed), expectedOriginalBlobSha);
});

test('onda 4: JavaScript extraído mantém sintaxe válida', () => {
  const run = spawnSync(process.execPath, ['--check', new URL('../assets/js/app.js', import.meta.url).pathname], {
    encoding: 'utf8',
    timeout: 15000
  });
  assert.equal(run.status, 0, run.stderr || run.error?.message || 'node --check failed');
});
