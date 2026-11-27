// metro_web/editor/namelabel.js
// 站名布局：AARC 的 nameP（相对站心的偏移，地图单位）+ 8 方向吸附。
export const NAME_DIST = 18;
export const NAME_DIAG = NAME_DIST / Math.SQRT2; // 12.72792206…
export const NAME_SNAP_THR = 6;

const CANDIDATES = [
  [NAME_DIST, 0], [-NAME_DIST, 0], [0, NAME_DIST], [0, -NAME_DIST],
  [NAME_DIAG, NAME_DIAG], [-NAME_DIAG, NAME_DIAG], [NAME_DIAG, -NAME_DIAG], [-NAME_DIAG, -NAME_DIAG]
];

export function defaultNameP() { return [NAME_DIST, 0]; }

/** 站名偏移吸附到 8 个方向位；超出阈值返回自由偏移。 */
export function snapNameP(dx, dy, thr = NAME_SNAP_THR) {
  let best = CANDIDATES[0], bd = Infinity;
  for (const c of CANDIDATES) {
    const d = Math.hypot(dx - c[0], dy - c[1]);
    if (d < bd) { bd = d; best = c; }
  }
  return bd <= thr ? { p: [best[0], best[1]], snapped: true, dist: bd }
                   : { p: [dx, dy], snapped: false, dist: bd };
}

export function namePOf(pt) {
  return Array.isArray(pt.nameP) && pt.nameP.length === 2 && pt.nameP.every(Number.isFinite)
    ? pt.nameP : defaultNameP();
}

function sgn(v) { return v > 1e-6 ? 1 : v < -1e-6 ? -1 : 0; }

/** 站名锚点（世界坐标）与对齐方向；leader 表示需要画引导线。 */
export function labelLayout(pt, view = { s: 1 }) {
  const np = namePOf(pt);
  const alignX = Number.isFinite(pt.anchorX) ? sgn(pt.anchorX) : sgn(np[0]);
  const alignY = Number.isFinite(pt.anchorY) ? sgn(pt.anchorY) : sgn(np[1]);
  return {
    gx: pt.pos[0] + np[0],
    gy: pt.pos[1] + np[1],
    alignX,
    alignY,
    leader: Math.hypot(np[0], np[1]) > NAME_DIST * Math.SQRT2 + 0.01,
    np
  };
}

export function labelFontPx(s) { return Math.max(9, Math.min(20, 12 * s)); }

/** 文本在屏幕上的包围盒（供命中与碰撞用）。 */
export function labelBox(gx, gy, alignX, alignY, fs, lines) {
  const lh = fs * 1.15;
  const w = Math.max(...lines.map(t => t.length)) * fs * 0.92 + 4;
  const h = lines.length * lh + 4;
  const x = alignX > 0 ? gx : alignX < 0 ? gx - w : gx - w / 2;
  const y = alignY > 0 ? gy : alignY < 0 ? gy - h : gy - h / 2;
  return { x, y, w, h };
}
