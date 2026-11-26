// 几何一致性：编辑器 ESM 几何 vs anim 已跑通的 AARC 移植（buildPath 同源对照）
const path = require('path');
const { pathToFileURL } = require('url');
const REPO = path.resolve(__dirname, '..', '..');
const ANIM = 'D:/dsh-working-place/anim/src/real2004.cjs';

(async () => {
  const g = await import(pathToFileURL(path.join(REPO, 'editor/geometry.js')).href);
  const s = await import(pathToFileURL(path.join(REPO, 'editor/save.js')).href);
  const r = await import(pathToFileURL(path.join(REPO, 'editor/render.js')).href);
  const raw = JSON.parse(require('fs').readFileSync(path.join(REPO, 'editor/sample.save.json'), 'utf8'));
  const model = s.buildModel(raw);
  const rm = r.buildRenderModel(model);
  const M = require(ANIM);

  let worst = 0, worstLine = '', checked = 0, lines = 0;
  for (const item of rm.lines) {
    const rawPts = item.line.pts.map(id => {
      const p = model.byId.get(id);
      return { x: p.pos[0], y: p.pos[1], dir: p.dir, free: p.free };
    });
    if (rawPts.length < 2) continue;
    const ref = M.buildPath(rawPts);
    const a = item.path.pts;
    if (a.length !== ref.pts.length) { console.log('PT COUNT MISMATCH', item.line.name, a.length, ref.pts.length); process.exitCode = 1; continue; }
    lines++;
    for (let i = 0; i < a.length; i += 3) {
      const d = Math.hypot(a[i].x - ref.pts[i].x, a[i].y - ref.pts[i].y);
      if (d > worst) { worst = d; worstLine = item.line.name + '@' + i; }
      checked++;
    }
    if (Math.abs(item.path.total - ref.total) > 0.01) { console.log('LEN MISMATCH', item.line.name, item.path.total.toFixed(4), ref.total.toFixed(4)); process.exitCode = 1; }
  }
  console.log(JSON.stringify({ checked, lines, worst: +worst.toFixed(6), worstLine, transfers: rm.transfers.length }));
  if (worst > 1e-6) { console.log('FAIL worst > 1e-6'); process.exitCode = 1; }
  const qhw = rm.transfers.find(t => t.name === '前海湾');
  if (!qhw) { console.log('FAIL missing 前海湾 cluster'); process.exitCode = 1; }
  if (process.exitCode !== 1) console.log('OK');
})();
