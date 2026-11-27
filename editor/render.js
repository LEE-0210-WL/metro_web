// metro_web/editor/render.js
// Canvas 渲染：线路（白边 + 线色）、站点/换乘胶囊、站名、网格、选中态。
// 站名位置遵循 AARC：锚点 = 站点 + nameP（地图单位），按 nameP 方向对齐文本。
import { buildPath, capsuleOf } from './geometry.js';
import { labelLayout, labelFontPx, labelBox, namePOf, NAME_DIST } from './namelabel.js';

const LINE_W = 13;
const CASING_W = 19;
const FONT = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif';

export function fmtName(name) {
  const s = String(name || '');
  if (s.length <= 3) return [s];
  const cut = Math.ceil(s.length / 2);
  return [s.slice(0, cut), s.slice(cut)];
}

export function buildRenderModel(model) {
  const lines = model.lines.map(l => ({
    line: l,
    path: buildPath(l.pts.map(id => {
      const p = model.byId.get(id);
      return { x: p.pos[0], y: p.pos[1], dir: p.dir, free: p.free };
    }).filter(Boolean))
  }));
  const transfers = [];
  for (const [cid, c] of model.clusters) {
    if (c.pts.length < 2) continue;
    const ps = c.pts.map(id => model.byId.get(id)).filter(Boolean);
    if (!ps.length) continue;
    const rep = ps.find(p => p.nameP) || ps[0];
    transfers.push({
      cid,
      name: c.names[0] || '',
      pts: ps,
      lines: [...c.lines],
      cx: ps.reduce((s, p) => s + p.pos[0], 0) / ps.length,
      cy: ps.reduce((s, p) => s + p.pos[1], 0) / ps.length,
      nameP: rep.nameP || null,
      anchorX: rep.anchorX, anchorY: rep.anchorY, repId: rep.id
    });
  }
  const pointColor = new Map();
  for (const l of model.lines) for (const id of l.pts) if (!pointColor.has(id)) pointColor.set(id, l.color);
  return { lines, transfers, pointColor };
}

function overlaps(a, b) { return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h; }

function setFont(ctx, fs) {
  ctx.font = '600 ' + fs + 'px ' + FONT;
  ctx.textBaseline = 'alphabetic';
}

function drawLabelText(ctx, lines, gx, gy, alignX, alignY, fs) {
  setFont(ctx, fs);
  const lh = fs * 1.15;
  ctx.textAlign = alignX > 0 ? 'left' : alignX < 0 ? 'right' : 'center';
  ctx.textBaseline = alignY > 0 ? 'top' : alignY < 0 ? 'bottom' : 'middle';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = fs * 0.42;
  ctx.fillStyle = '#1b2430';
  const y0 = alignY === 0 ? gy - (lines.length - 1) * lh / 2 : gy;
  lines.forEach((t, i) => {
    const ty = y0 + i * lh;
    ctx.strokeText(t, gx, ty);
    ctx.fillText(t, gx, ty);
  });
}

export function render(ctx, model, rm, view, opts = {}) {
  const W = ctx.canvas.width / (opts.dpr || 1);
  const H = ctx.canvas.height / (opts.dpr || 1);
  ctx.save();
  ctx.setTransform(opts.dpr || 1, 0, 0, opts.dpr || 1, 0, 0);
  ctx.fillStyle = opts.bg || '#f2f4f6';
  ctx.fillRect(0, 0, W, H);

  const toX = x => W / 2 + (x - view.cx) * view.s;
  const toY = y => H / 2 + (y - view.cy) * view.s;

  if (opts.grid !== false) {
    const step = 100;
    const x0 = Math.floor((view.cx - W / 2 / view.s) / step) * step;
    const x1 = view.cx + W / 2 / view.s;
    const y0 = Math.floor((view.cy - H / 2 / view.s) / step) * step;
    const y1 = view.cy + H / 2 / view.s;
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = x0; x <= x1; x += step) { ctx.moveTo(toX(x), 0); ctx.lineTo(toX(x), H); }
    for (let y = y0; y <= y1; y += step) { ctx.moveTo(0, toY(y)); ctx.lineTo(W, toY(y)); }
    ctx.stroke();
  }

  // 1) 线路
  for (const item of rm.lines) {
    const { line, path } = item;
    if (!path.pts.length) continue;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    path.pts.forEach((p, i) => { const x = toX(p.x), y = toY(p.y); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.strokeStyle = 'rgba(0,0,0,0.16)';
    ctx.lineWidth = CASING_W * view.s;
    ctx.stroke();
    ctx.strokeStyle = line.color;
    ctx.lineWidth = LINE_W * view.s;
    ctx.stroke();
    if (opts.selectedLineId === line.id) {
      ctx.strokeStyle = 'rgba(255,90,31,0.5)';
      ctx.lineWidth = (LINE_W + 10) * view.s;
      ctx.stroke();
    }
  }

  const labelBoxes = [];
  const hitBoxes = [];
  const labelFs = labelFontPx(view.s);
  const showLabels = opts.labels !== false && view.s > 0.25;

  function drawLeader(px, py, gx, gy, fs, k) {
    const r = 7 * k * 1.6;
    const dx = gx - px, dy = gy - py;
    const len = Math.hypot(dx, dy);
    if (len <= r) return;
    ctx.beginPath();
    ctx.strokeStyle = '#999';
    ctx.lineWidth = Math.max(1, fs * 0.12);
    ctx.moveTo(px + dx / len * r, py + dy / len * r);
    ctx.lineTo(gx, gy);
    ctx.stroke();
  }

  // 2) 普通站（单点簇 / 不参与簇）
  const drawnClusters = new Set();
  for (const p of model.points) {
    if (!p.sta) continue;
    const r = model.clusterOf.get(p.id);
    const c = r != null ? model.clusters.get(r) : null;
    if (c && c.pts.length > 1) { drawnClusters.add(r); continue; }
    if (drawnClusters.has(r)) continue;
    if (r != null) drawnClusters.add(r);
    const x = toX(p.pos[0]), y = toY(p.pos[1]);
    const k = Math.max(0.7, Math.min(1.4, view.s));
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x, y, 7 * k, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rm.pointColor.get(p.id) || '#888';
    ctx.beginPath(); ctx.arc(x, y, 3.6 * k, 0, Math.PI * 2); ctx.fill();
    if (!showLabels) continue;
    const name = p.name || (c && c.names[0]) || '';
    if (!name) continue;
    const lines = fmtName(name);
    let placed = false;
    if (Array.isArray(p.nameP)) {
      const lay = labelLayout(p, view);
      const gx = toX(lay.gx), gy = toY(lay.gy);
      setFont(ctx, labelFs);
      const box = labelBox(gx, gy, lay.alignX, lay.alignY, labelFs, lines);
      if (lay.leader) drawLeader(x, y, gx, gy, labelFs, k);
      drawLabelText(ctx, lines, gx, gy, lay.alignX, lay.alignY, labelFs);
      labelBoxes.push(box);
      hitBoxes.push({ id: p.id, ...box });
      placed = true;
    }
    if (!placed) {
      // 无 nameP：在 8 个方向位里挑一个不撞的（18 地图单位）
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
        const ax = p.pos[0] + dx * NAME_DIST, ay = p.pos[1] + dy * NAME_DIST;
        const gx = toX(ax), gy = toY(ay);
        const bx = labelBox(gx, gy, Math.sign(dx), Math.sign(dy), labelFs, lines);
        if (bx.x < 4 || bx.y < 4 || bx.x + bx.w > W - 4 || bx.y + bx.h > H - 4) continue;
        if (labelBoxes.some(b => overlaps(b, bx))) continue;
        drawLabelText(ctx, lines, gx, gy, Math.sign(dx), Math.sign(dy), labelFs);
        labelBoxes.push(bx);
        hitBoxes.push({ id: p.id, ...bx });
        break;
      }
    }
  }

  // 3) 换乘胶囊（多点簇）
  for (const tr of rm.transfers) {
    const dirs = tr.pts.map(p => p.dir | 0);
    const cap = capsuleOf(tr.pts.map(p => ({ x: p.pos[0], y: p.pos[1] })), dirs);
    const x = toX(cap.cx), y = toY(cap.cy);
    const len = cap.len * view.s, thick = cap.thick * view.s;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(cap.angle);
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.beginPath(); ctx.roundRect(-len / 2, -thick / 2, len, thick, thick / 2); ctx.fill();
    const colors = tr.lines.map(n => (model.lines.find(l => l.name === n) || {}).color).filter(Boolean);
    const g = ctx.createLinearGradient(-len / 2 + 3, 0, len / 2 - 3, 0);
    if (colors.length) colors.forEach((c, i) => g.addColorStop(i / Math.max(1, colors.length - 1), c));
    else g.addColorStop(0, '#666');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.roundRect(-len / 2 + 3, -thick / 2 + 3, len - 6, thick - 6, Math.max(1, (thick - 6) / 2)); ctx.fill();
    ctx.restore();

    if (showLabels && tr.name) {
      const np = Array.isArray(tr.nameP) ? tr.nameP : [NAME_DIST, 0];
      const ax = tr.anchorX != null ? Math.sign(tr.anchorX) : Math.sign(np[0]);
      const ay = tr.anchorY != null ? Math.sign(tr.anchorY) : Math.sign(np[1]);
      // 胶囊：站名贴着胶囊外缘，而不是相对某个成员点（避免压在线条上）
      const halfW = Math.abs(Math.cos(cap.angle)) * len / 2 + Math.abs(Math.sin(cap.angle)) * thick / 2;
      const halfH = Math.abs(Math.sin(cap.angle)) * len / 2 + Math.abs(Math.cos(cap.angle)) * thick / 2;
      const gx = x + ax * (halfW + 3);
      const gy = y + ay * (halfH + 3);
      const lines = fmtName(tr.name);
      drawLabelText(ctx, lines, gx, gy, ax, ay, labelFs);
      const box = labelBox(gx, gy, ax, ay, labelFs, lines);
      labelBoxes.push(box);
      hitBoxes.push({ id: null, ...box });
    }
  }

  if (opts.selectedPointId != null) {
    const p = model.byId.get(opts.selectedPointId);
    if (p) {
      ctx.strokeStyle = '#ff5a1f';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(toX(p.pos[0]), toY(p.pos[1]), 12, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.restore();
  return hitBoxes;
}

export function hitTest(model, rm, view, sx, sy, W, H, radius = 14) {
  const w = { x: view.cx + (sx - W / 2) / view.s, y: view.cy + (sy - H / 2) / view.s };
  let best = null, bestD = radius / view.s;
  for (const p of model.points) {
    const d = Math.hypot(p.pos[0] - w.x, p.pos[1] - w.y);
    if (d < bestD) { bestD = d; best = p; }
  }
  return best;
}
