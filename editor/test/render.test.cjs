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
  let ok = res.w === 1920 && res.h === 1080;

  // 站名/缩放：单站点在两种画布尺寸下，圆点必须仍是圆（不拉伸）
  const raw2 = { points: [{ id: 1, pos: [0, 0], dir: 0, sta: 1, name: '测试', nameP: [18, 0] }], lines: [{ id: 1, pts: [1], name: '1号线', color: '#c8102e', width: 1 }] };
  const m2 = s.buildModel(raw2);
  const rm2 = r.buildRenderModel(m2);
  const bb2 = g.bboxOf(m2.points.map(p => ({ x: p.pos[0], y: p.pos[1] })));
  for (const [w, h] of [[800, 450], [1200, 675]]) {
    const c = canvas.createCanvas(w, h);
    r.render(c.getContext('2d'), m2, rm2, v.fitView(bb2, w, h, 40), { dpr: 1, labels: true, grid: false, bg: '#f2f4f6' });
    const buf = c.toBuffer('image/png');
    const out2 = path.join(ROOT, 'editor/test/_label_' + w + '.png');
    fs.writeFileSync(out2, buf);
    console.log(JSON.stringify({ size: w + 'x' + h, bytes: buf.length }));
  }

  // 圆度：400×300 单站，扫描中心区域非背景像素的包围盒
  const c3 = canvas.createCanvas(400, 300);
  const x3 = c3.getContext('2d');
  r.render(x3, m2, rm2, v.fitView(bb2, 400, 300, 40), { dpr: 1, labels: false, grid: false, bg: '#f2f4f6' });
  const img = x3.getImageData(0, 0, 400, 300).data;
  let minX = 999, maxX = -1, minY = 999, maxY = -1;
  for (let y = 0; y < 300; y++) for (let x = 0; x < 400; x++) {
    const i = (y * 400 + x) * 4;
    if (img[i] >= 250 && img[i + 1] >= 250 && img[i + 2] >= 250) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  const dw = maxX - minX + 1, dh = maxY - minY + 1;
  console.log(JSON.stringify({ dotW: dw, dotH: dh }));
  if (!(dw > 0 && Math.abs(dw - dh) <= 1)) ok = false;
  console.log(ok ? 'OK' : 'FAIL');
  process.exit(ok ? 0 : 1);
})();
