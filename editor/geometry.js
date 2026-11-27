// metro_web/editor/geometry.js
// 线路几何内核（自研）：控制点 -> 45°/90° 折线 -> 二次贝塞尔圆角；换乘胶囊按主轴拟合。
// 不包含任何第三方算法代码；存档 JSON 的读取格式独立于本实现。

const CORNER_BASE = 26;
const CORNER_SHARP = 18;
const CORNER_WIDE = 34;
const EPS = 1e-6;

function rotateAround(p, cx, cy, ang) {
  const vx = p.x - cx, vy = p.y - cy;
  const c = Math.cos(ang), s = Math.sin(ang);
  return { x: cx + vx * c - vy * s, y: cy + vx * s + vy * c };
}

/** 把折线每段迭代对齐到最近的 45° 轴（对称调整两端，中点不动）。 */
export function formalize(pts, iterations = 6) {
  const out = pts.map(p => ({ x: p.x, y: p.y, dir: p.dir == null ? 0 : p.dir, free: !!p.free }));
  if (out.length < 2) return out;
  for (let it = 0; it < iterations; it++) {
    let maxErr = 0;
    for (let i = 0; i < out.length - 1; i++) {
      const a = out[i], b = out[i + 1];
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      if (len < EPS) continue;
      const ang = Math.atan2(dy, dx);
      const target = Math.round(ang / (Math.PI / 4)) * (Math.PI / 4);
      const err = ang - target;
      if (Math.abs(err) < EPS) continue;
      maxErr = Math.max(maxErr, Math.abs(err));
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const na = rotateAround(a, mx, my, -err / 2);
      const nb = rotateAround(b, mx, my, err / 2);
      a.x = na.x; a.y = na.y; b.x = nb.x; b.y = nb.y;
    }
    if (maxErr < EPS) break;
  }
  // 最后一遍精确对齐：以每段起点为锚，消除残留误差
  for (let i = 0; i < out.length - 1; i++) {
    const a = out[i], b = out[i + 1];
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < EPS) continue;
    const ang = Math.atan2(dy, dx);
    const target = Math.round(ang / (Math.PI / 4)) * (Math.PI / 4);
    b.x = a.x + Math.cos(target) * len;
    b.y = a.y + Math.sin(target) * len;
  }
  return out;
}

export function cornerRadius(deg) {
  if (deg < 67.5) return CORNER_SHARP;
  if (deg < 112.5) return CORNER_BASE;
  return CORNER_WIDE;
}

/** 二次贝塞尔圆角：切点 A、B，角点 P 为控制点，采样固定步数。 */
function quad(a, p, b, steps) {
  const out = [];
  for (let k = 0; k <= steps; k++) {
    const t = k / steps, u = 1 - t;
    out.push({
      x: u * u * a.x + 2 * u * t * p.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * p.y + t * t * b.y
    });
  }
  return out;
}

export function buildPath(rawPts) {
  if (!rawPts.length) return { pts: [], total: 0, verts: [] };
  const v = formalize(rawPts.map(p => ({ x: p.x, y: p.y, dir: p.dir, free: p.free })));
  const out = [{ x: v[0].x, y: v[0].y }];
  for (let i = 1; i < v.length - 1; i++) {
    const p0 = v[i - 1], p1 = v[i], p2 = v[i + 1];
    const ux = p1.x - p0.x, uy = p1.y - p0.y;
    const wx = p2.x - p1.x, wy = p2.y - p1.y;
    const l1 = Math.hypot(ux, uy), l2 = Math.hypot(wx, wy);
    if (l1 < 0.01 || l2 < 0.01) { out.push({ x: p1.x, y: p1.y }); continue; }
    const u = { x: ux / l1, y: uy / l1 };
    const w = { x: wx / l2, y: wy / l2 };
    const cross = u.x * w.y - u.y * w.x;
    const dot = Math.max(-1, Math.min(1, u.x * w.x + u.y * w.y));
    const delta = Math.abs(Math.atan2(cross, dot)) * 180 / Math.PI;
    if (delta < 1 || delta > 179) { out.push({ x: p1.x, y: p1.y }); continue; }
    const d = Math.min(cornerRadius(delta), l1 * 0.5, l2 * 0.5);
    const A = { x: p1.x - u.x * d, y: p1.y - u.y * d };
    const B = { x: p1.x + w.x * d, y: p1.y + w.y * d };
    const arc = quad(A, { x: p1.x, y: p1.y }, B, 8);
    for (const p of arc) out.push(p);
  }
  out.push({ x: v[v.length - 1].x, y: v[v.length - 1].y });

  // 均匀加密，便于按长度取点
  const dense = [];
  for (let i = 0; i < out.length - 1; i++) {
    const A = out[i], B = out[i + 1];
    const d = Math.hypot(B.x - A.x, B.y - A.y);
    const n = Math.max(1, Math.ceil(d / 12));
    for (let k = 0; k < n; k++) dense.push({ x: A.x + (B.x - A.x) * k / n, y: A.y + (B.y - A.y) * k / n });
  }
  dense.push({ x: out[out.length - 1].x, y: out[out.length - 1].y });
  let acc = 0;
  dense.forEach((p, i) => { if (i > 0) acc += Math.hypot(p.x - dense[i - 1].x, p.y - dense[i - 1].y); p.len = acc; });
  return { pts: dense, total: acc, verts: v };
}

export function pointAt(path, len) {
  const pts = path.pts;
  if (!pts.length) return { x: 0, y: 0 };
  if (len <= 0) return { x: pts[0].x, y: pts[0].y };
  if (len >= path.total) return { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y };
  let lo = 0, hi = pts.length - 1;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (pts[mid].len < len) lo = mid + 1; else hi = mid; }
  const b = pts[lo], a = pts[Math.max(0, lo - 1)];
  const seg = b.len - a.len || 1;
  const t = (len - a.len) / seg;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function bboxOf(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of pts) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
  return { x0, y0, x1, y1 };
}

// 编辑用：把 to 点吸附到相对 from 的 8 方向（45° 倍数）上
export function snapPoint(from, to, opts = {}) {
  const axisOnly = !!opts.axisOnly;
  const step = axisOnly ? 90 : 45;
  const dx = to.x - from.x, dy = to.y - from.y;
  if (Math.hypot(dx, dy) < 1e-6) return { x: to.x, y: to.y };
  const deg = Math.atan2(dy, dx) * 180 / Math.PI;
  const snapped = Math.round(deg / step) * step;
  const rad = snapped * Math.PI / 180;
  const len = Math.hypot(dx, dy);
  return { x: from.x + Math.cos(rad) * len, y: from.y + Math.sin(rad) * len };
}

/** 换乘胶囊：PCA 主轴定角度，投影长度 + 两端半径定长度。 */
export function capsuleOf(points) {
  const pts = points.length ? points : [{ x: 0, y: 0 }];
  const n = pts.length;
  const cx = pts.reduce((s, p) => s + p.x, 0) / n;
  const cy = pts.reduce((s, p) => s + p.y, 0) / n;
  const THICK = 14;
  if (n === 1) return { cx, cy, len: 26, thick: THICK, angle: 0 };
  let sxx = 0, sxy = 0, syy = 0;
  for (const p of pts) {
    const dx = p.x - cx, dy = p.y - cy;
    sxx += dx * dx; sxy += dx * dy; syy += dy * dy;
  }
  const angle = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  const ux = Math.cos(angle), uy = Math.sin(angle);
  let lo = Infinity, hi = -Infinity;
  for (const p of pts) {
    const t = (p.x - cx) * ux + (p.y - cy) * uy;
    if (t < lo) lo = t;
    if (t > hi) hi = t;
  }
  return { cx, cy, len: Math.max(26, hi - lo + THICK * 2), thick: THICK, angle };
}
