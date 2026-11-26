// metro_web/editor/view.js
// 相机与坐标变换（世界坐标 -> 屏幕坐标）
export function createView(cx = 0, cy = 0, s = 1) { return { cx, cy, s }; }

export function worldToScreen(view, x, y, W, H) {
  return { x: W / 2 + (x - view.cx) * view.s, y: H / 2 + (y - view.cy) * view.s };
}
export function screenToWorld(view, x, y, W, H) {
  return { x: view.cx + (x - W / 2) / view.s, y: view.cy + (y - H / 2) / view.s };
}
export function fitView(bbox, W, H, pad = 80) {
  const w = Math.max(1, bbox.x1 - bbox.x0), h = Math.max(1, bbox.y1 - bbox.y0);
  const s = Math.min((W - pad * 2) / w, (H - pad * 2) / h);
  return { cx: (bbox.x0 + bbox.x1) / 2, cy: (bbox.y0 + bbox.y1) / 2, s: Math.max(0.05, Math.min(4, s)) };
}
export function zoomAt(view, sx, sy, factor, W, H) {
  const before = screenToWorld(view, sx, sy, W, H);
  const s = Math.max(0.05, Math.min(8, view.s * factor));
  const after = screenToWorld({ ...view, s }, sx, sy, W, H);
  return { cx: view.cx + (before.x - after.x), cy: view.cy + (before.y - after.y), s };
}
