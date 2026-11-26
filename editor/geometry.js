// metro_web/editor/geometry.js
// 线路几何内核：控制点 -> 45°/90° 正式折线 + 圆角。
// 算法移植自 AARC（https://github.com/au114514/aarc，AGPLv3）的 formalize / buildLinePathGeometry。
// 本文件按 AGPLv3 分发；修改请保留此声明。

const TURN_BASE = 30;
const MULT_SLOW = 0.670248;
const MULT_SHARP = 1.491983;
const EPS0 = 1e-6;
const isZero = v => Math.abs(v) < EPS0;

function coordRelDiff(xDiff, yDiff) {
  if (isZero(xDiff)) { if (isZero(yDiff)) return { posRel: 's', rev: false }; return { posRel: 'u', rev: yDiff > 0 }; }
  if (isZero(yDiff)) return { posRel: 'l', rev: xDiff > 0 };
  if (isZero(xDiff - yDiff)) return { posRel: 'lu', rev: xDiff > 0 };
  if (isZero(xDiff + yDiff)) return { posRel: 'ur', rev: yDiff > 0 };
  if ((yDiff > 0 && xDiff > yDiff) || (yDiff < 0 && xDiff < yDiff)) return { posRel: 'llu', rev: yDiff > 0 };
  if ((xDiff > 0 && yDiff > xDiff) || (xDiff < 0 && yDiff < xDiff)) return { posRel: 'luu', rev: xDiff > 0 };
  if ((yDiff > 0 && -xDiff < yDiff) || (yDiff < 0 && xDiff < -yDiff)) return { posRel: 'uur', rev: yDiff > 0 };
  return { posRel: 'urr', rev: xDiff < 0 };
}

function coordFillUnordered(a, b, xDiff, yDiff, posRel, type) {
  if (posRel === 'l' || posRel === 'u' || posRel === 'lu' || posRel === 'ur') return [];
  if (posRel === 'llu') {
    if (type === 'top') { const bias = -xDiff + yDiff; return [{ x: a.x + bias, y: a.y }]; }
    if (type === 'bottom') { const bias = -xDiff + yDiff; return [{ x: b.x - bias, y: b.y }]; }
    if (type === 'midInc') { const bias = (-xDiff + yDiff) / 2; return [{ x: a.x + bias, y: a.y }, { x: b.x - bias, y: b.y }]; }
    const bias = -yDiff / 2; return [{ x: a.x + bias, y: a.y + bias }, { x: b.x - bias, y: b.y - bias }];
  }
  if (posRel === 'luu') {
    if (type === 'top') { const bias = xDiff - yDiff; return [{ x: b.x, y: b.y - bias }]; }
    if (type === 'bottom') { const bias = xDiff - yDiff; return [{ x: a.x, y: a.y + bias }]; }
    if (type === 'midInc') { const bias = (xDiff - yDiff) / 2; return [{ x: a.x, y: a.y + bias }, { x: b.x, y: b.y - bias }]; }
    const bias = -xDiff / 2; return [{ x: a.x + bias, y: a.y + bias }, { x: b.x - bias, y: b.y - bias }];
  }
  if (posRel === 'uur') {
    if (type === 'top') { const bias = -xDiff - yDiff; return [{ x: b.x, y: b.y - bias }]; }
    if (type === 'bottom') { const bias = -xDiff - yDiff; return [{ x: a.x, y: a.y + bias }]; }
    if (type === 'midInc') { const bias = (-xDiff - yDiff) / 2; return [{ x: a.x, y: a.y + bias }, { x: b.x, y: b.y - bias }]; }
    const bias = -xDiff / 2; return [{ x: a.x + bias, y: a.y - bias }, { x: b.x - bias, y: b.y + bias }];
  }
  if (posRel === 'urr') {
    if (type === 'top') { const bias = xDiff + yDiff; return [{ x: a.x - bias, y: a.y }]; }
    if (type === 'bottom') { const bias = xDiff + yDiff; return [{ x: b.x + bias, y: b.y }]; }
    if (type === 'midInc') { const bias = (xDiff + yDiff) / 2; return [{ x: a.x - bias, y: a.y }, { x: b.x + bias, y: b.y }]; }
    const bias = yDiff / 2; return [{ x: a.x + bias, y: a.y - bias }, { x: b.x - bias, y: b.y + bias }];
  }
  return [];
}
function coordFill(a, b, xDiff, yDiff, posRel, reversed, type) {
  const res = coordFillUnordered(a, b, xDiff, yDiff, posRel, type);
  if (reversed) res.reverse();
  return res;
}
export function formalizeSeg(a, b) {
  let xDiff = a.x - b.x, yDiff = a.y - b.y;
  const rel = coordRelDiff(xDiff, yDiff);
  const pr = rel.posRel, rv = rel.rev;
  if (pr === 's') return { a, b, itp: [], ill: 0, direct: false };
  let A = a, B = b;
  if (rv) { const t = A; A = B; B = t; xDiff = -xDiff; yDiff = -yDiff; }
  let itp = [];
  let ill = 0;
  const dA = A.dir | 0, dB = B.dir | 0;
  if (dA === dB) {
    itp = coordFill(A, B, xDiff, yDiff, pr, rv, dA === 1 ? 'midVert' : 'midInc');
    if (itp.length === 0) {
      ill = ((dA === 0 && (pr === 'lu' || pr === 'ur')) || (dA === 1 && (pr === 'l' || pr === 'u'))) ? 2 : 0;
    } else ill = 1;
  } else if (dA === 1) {
    itp = coordFill(A, B, xDiff, yDiff, pr, rv, (pr === 'luu' || pr === 'uur') ? 'top' : 'bottom');
  } else {
    itp = coordFill(A, B, xDiff, yDiff, pr, rv, (pr === 'luu' || pr === 'uur') ? 'bottom' : 'top');
  }
  return { a, b, itp, ill, direct: false };
}

const SQ2H = Math.SQRT1_2;
function twinPts2Ray(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const ax = Math.abs(dx), ay = Math.abs(dy);
  let way;
  if (Math.abs(ax - ay) < 1e-6) way = [Math.sign(dx) * SQ2H, Math.sign(dy) * SQ2H];
  else if (ax > ay) way = [Math.sign(dx), 0];
  else way = [0, Math.sign(dy)];
  return { source: a, way };
}
function rayLineIntersect(r1, r2) {
  const [a1, a2] = r1.way, [b1, b2] = r2.way;
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-9) return null;
  const dx = r2.source.x - r1.source.x, dy = r2.source.y - r1.source.y;
  const t = (dx * b2 - dy * b1) / det;
  return { x: r1.source.x + t * a1, y: r1.source.y + t * a2 };
}
function illPosedSegJustify(segs) {
  if (segs.length <= 1) return;
  const illIdxs = [];
  for (let i = 0; i < segs.length; i++) if (segs[i].ill) illIdxs.push(i);
  for (const i of illIdxs) {
    const seg = segs[i];
    if (i > 0 && i < segs.length - 1) {
      const prev = segs[i - 1], next = segs[i + 1];
      const prevHelps = !prev.direct && prev.ill < seg.ill;
      const nextHelps = !next.direct && next.ill < seg.ill;
      if (prevHelps && nextHelps) {
        const prevRef = prev.itp.length === 0 ? prev.a : prev.itp[prev.itp.length - 1];
        const nextRef = next.itp.length === 0 ? next.b : next.itp[0];
        const it = rayLineIntersect(twinPts2Ray(prevRef, prev.b), twinPts2Ray(nextRef, next.a));
        if (it) seg.itp = [it];
      }
    }
  }
}
export function formalize(pts) {
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) segs.push(formalizeSeg(pts[i], pts[i + 1]));
  illPosedSegJustify(segs);
  const out = [{ x: pts[0].x, y: pts[0].y }];
  for (let i = 0; i < segs.length; i++) {
    for (const p of segs[i].itp) out.push({ x: p.x, y: p.y });
    out.push({ x: pts[i + 1].x, y: pts[i + 1].y });
  }
  return out;
}

export function cornerRadius(deg) {
  if (deg < 67.5) return TURN_BASE * MULT_SLOW;
  if (deg < 112.5) return TURN_BASE;
  return TURN_BASE * MULT_SHARP;
}

export function buildPath(rawPts) {
  const v = formalize(rawPts.map(p => ({ x: p.x, y: p.y, dir: p.dir == null ? 0 : p.dir, free: !!p.free })));
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
    const dot = u.x * w.x + u.y * w.y;
    const delta = Math.atan2(Math.abs(cross), dot) * 180 / Math.PI;
    if (delta < 1 || delta > 179) { out.push({ x: p1.x, y: p1.y }); continue; }
    const d = Math.min(cornerRadius(delta), l1 / 2, l2 / 2);
    const A = { x: p1.x - u.x * d, y: p1.y - u.y * d };
    const B = { x: p1.x + w.x * d, y: p1.y + w.y * d };
    out.push(A);
    const n1 = { x: -u.y, y: u.x }, n2 = { x: -w.y, y: w.x };
    const den = n1.x * n2.y - n1.y * n2.x;
    if (Math.abs(den) > 1e-6) {
      const s = ((B.x - A.x) * n2.y - (B.y - A.y) * n2.x) / den;
      const c = { x: A.x + n1.x * s, y: A.y + n1.y * s };
      const r = Math.hypot(A.x - c.x, A.y - c.y);
      const a0 = Math.atan2(A.y - c.y, A.x - c.x);
      const a1 = Math.atan2(B.y - c.y, B.x - c.x);
      let sweep = a1 - a0;
      while (sweep <= -Math.PI) sweep += Math.PI * 2;
      while (sweep > Math.PI) sweep -= Math.PI * 2;
      const steps = Math.max(4, Math.ceil(Math.abs(sweep) * r / 6));
      for (let k = 1; k <= steps; k++) {
        const a = a0 + sweep * k / steps;
        out.push({ x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r });
      }
    } else out.push(B);
  }
  out.push({ x: v[v.length - 1].x, y: v[v.length - 1].y });
  const dense = [];
  for (let i = 0; i < out.length - 1; i++) {
    const A = out[i], B = out[i + 1];
    const d = Math.hypot(B.x - A.x, B.y - A.y);
    const n = Math.max(1, Math.ceil(d / 12));
    for (let k = 0; k < n; k++) dense.push({ x: A.x + (B.x - A.x) * k / n, y: A.y + (B.y - A.y) * k / n });
  }
  dense.push(out[out.length - 1]);
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

// 换乘胶囊：返回 {cx, cy, len, thick, angle}（angle 弧度，长轴方向）
export function capsuleOf(points, activeDirs = []) {
  const pts = points.length ? points : [{ x: 0, y: 0 }];
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of pts) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }
  const w = maxX - minX, h = maxY - minY;
  if (activeDirs.some(d => d === 1) && Math.abs(w - h) < Math.max(w, h) * 0.35 && w > 2) {
    return { cx, cy, len: Math.max(26, Math.hypot(w, h) + 16), thick: 14, angle: Math.PI / 4 };
  }
  if (w >= h) return { cx, cy, len: Math.max(26, w + 26), thick: 14, angle: 0 };
  return { cx, cy, len: Math.max(26, h + 26), thick: 14, angle: Math.PI / 2 };
}
