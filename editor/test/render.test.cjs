// 渲染冒烟：1920×1080 全图导出（需要 @napi-rs/canvas；缺失则跳过）
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const ROOT = path.resolve(__dirname, '..', '..');
let canvas;
try { canvas = require('@napi-rs/canvas'); }
catch { try { canvas = require('D:/dsh-working-place/_aarc_latest/aarc-core/node_modules/@napi-rs/canvas'); } catch { console.log('SKIP no canvas'); process.exit(0); } }

(async () => {
  const s = await import(pathToFileURL(path.join(ROOT, 'editor/save.js')).href);
  const r = await import(pathToFileURL(path.join(ROOT, 'editor/render.js')).href);
  const v = await import(pathToFileURL(path.join(ROOT, 'editor/view.js')).href);
  const g = await import(pathToFileURL(path.join(ROOT, 'editor/geometry.js')).href);
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'editor/sample.save.json'), 'utf8'));
  const model = s.buildModel(raw);
  const rm = r.buildRenderModel(model);
  const bbox = g.bboxOf(model.points.map(p => ({ x: p.pos[0], y: p.pos[1] })));
  const W = 1920, H = 1080;
  const cv = canvas.createCanvas(W, H);
  r.render(cv.getContext('2d'), model, rm, v.fitView(bbox, W, H, 80), { dpr: 1, labels: true, grid: false, bg: '#f2f4f6' });
  const out = path.join(ROOT, 'editor/test/_render.png');
  fs.writeFileSync(out, cv.toBuffer('image/png'));
  const res = { w: cv.width, h: cv.height, bytes: fs.statSync(out).size, lines: rm.lines.length, transfers: rm.transfers.length };
  console.log(JSON.stringify(res));
  console.log(res.w === 1920 && res.h === 1080 ? 'OK' : 'FAIL');
})();
