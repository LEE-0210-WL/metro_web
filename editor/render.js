// metro_web/editor/render.js
// Canvas 渲染：线路（白边 + 线色）、站点/换乘胶囊、站名、网格、选中态。
import { buildPath, capsuleOf } from './geometry.js';

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
    transfers.push({
      cid,
      name: c.names[0] || '',
      pts: ps,
      lines: [...c.lines],
      cx: ps.reduce((s, p) => s + p.pos[0], 0) / ps.length,
      cy: ps.reduce((s, p) => s + p.pos[1], 0) / ps.length
    });
  }
  const pointColor = new Map();
  for (const l of model.lines) for (const id of l.pts) if (!pointColor.has(id)) pointColor.set(id, l.color);
  return { lines, transfers, pointColor };
}

function labelCandidates(name, x, y, fs, W, H) {
  const pad = 4;
  const lines = fmtName(name);
  const w = Math.max(...lines.map(t => t.length)) * fs + pad * 2;
  const h = lines.length * fs * 1.15 + pad * 2;
  const d = 16;
  const out = [];
  const push = (lx, ly) => out.push({ x: lx, y: ly, w, h, text: lines, fs });
  push(x + d, y - h / 2);
  push(x - d - w, y - h / 2);
  push(x - w / 2, y - h - d);
  push(x - w / 2, y + d);
  push(x + d, y + d);
  push(x - d - w, y - h - d);
  push(x + d, y - h - d);
  push(x - d - w, y + d);
  return out;
}
function overlaps(a, b) { return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h; }

function drawLabel(ctx, rect) {
  ctx.font = '600 ' + rect.fs + 'px ' + FONT;
  ctx.textBaseline = 'top';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = rect.fs * 0.42;
  ctx.fillStyle = '#1b2430';
  rect.text.forEach((t, i) => {
    const tx = rect.x + 4;
    const ty = rect.y + 4 + i * rect.fs * 1.15;
    ctx.strokeText(t, tx, ty);
    ctx.fillText(t, tx, ty);
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
  const labelFs = Math.max(10, Math.min(16, 12 * Math.sqrt(Math.max(0.5, view.s))));
  const showLabels = opts.labels !== false && view.s > 0.3;

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
    if (showLabels) {
      const name = p.name || (c && c.names[0]) || '';
      if (name) {
        const cand = labelCandidates(name, x, y, labelFs);
        for (const rr of cand) {
          if (rr.x < 4 || rr.y < 4 || rr.x + rr.w > W - 4 || rr.y + rr.h > H - 4) continue;
          if (labelBoxes.some(b => overlaps(b, rr))) continue;
          labelBoxes.push(rr); drawLabel(ctx, rr); break;
        }
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
      const cand = labelCandidates(tr.name, x, y, labelFs);
      for (const rr of cand) {
        if (rr.x < 4 || rr.y < 4 || rr.x + rr.w > W - 4 || rr.y + rr.h > H - 4) continue;
        if (labelBoxes.some(b => overlaps(b, rr))) continue;
        labelBoxes.push(rr); drawLabel(ctx, rr); break;
      }
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
