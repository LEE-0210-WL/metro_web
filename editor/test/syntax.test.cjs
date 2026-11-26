// ESM 语法检查：把 editor/*.js 复制成 .mjs 后 node --check
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..');
const files = ['geometry', 'save', 'render', 'view', 'main'];
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'edcheck-'));
let bad = 0;
for (const f of files) {
  const src = path.join(ROOT, 'editor', f + '.js');
  const dst = path.join(dir, f + '.mjs');
  fs.copyFileSync(src, dst);
  const r = spawnSync(process.execPath, ['--check', dst], { encoding: 'utf8' });
  if (r.status === 0) console.log('OK ' + f); else { bad++; console.log('FAIL ' + f + ' ' + (r.stderr || '').slice(0, 200)); }
}
fs.rmSync(dir, { recursive: true, force: true });
console.log(bad ? 'FAIL' : 'OK');
process.exit(bad ? 1 : 0);
