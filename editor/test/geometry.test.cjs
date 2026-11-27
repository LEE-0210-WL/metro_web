// 自研几何内核的性质测试：45° 量化、对齐、幂等、圆角路径、胶囊主轴
const path = require('path');
const { pathToFileURL } = require('url');
const ROOT = path.resolve(__dirname, '..', '..');

(async () => {
  const g = await import(pathToFileURL(path.join(ROOT, 'editor/geometry.js')).href);
  const D = Math.PI / 4;
  const angOf = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
  const modErr = (ang) => {
    const q = ang / D;
    return Math.abs(q - Math.round(q)) * D;
  };
  const out = {};

  // 1) 8 方向吸附：角度落在 45° 倍数上，长度不变
  const snaps = [[100, 30], [100, 90], [10, 100], [-100, 100], [80, -40]].map(([x, y]) => {
    const p = g.snapPoint({ x: 0, y: 0 }, { x, y });
    return { len: Math.hypot(p.x, p.y), err: modErr(Math.atan2(p.y, p.x)) };
  });
  out.snapMaxErr = Math.max(...snaps.map(s => s.err));
  out.snapLenOk = snaps.every((s, i) => Math.abs(s.len - Math.hypot(...[[100, 30], [100, 90], [10, 100], [-100, 100], [80, -40]][i])) < 1e-9);

  // 2) formalize：每段都是 45° 倍数，点数不变，无 NaN
  const raw = [
    { x: 0, y: 0, dir: 0 }, { x: 101, y: 37, dir: 0 }, { x: 180, y: 74, dir: 1 },
    { x: 260, y: 73, dir: 0 }, { x: 330, y: -12, dir: 0 }
  ];
  const f = g.formalize(raw);
  let maxSegErr = 0;
  for (let i = 0; i < f.length - 1; i++) maxSegErr = Math.max(maxSegErr, modErr(angOf(f[i], f[i + 1])));
  out.segMaxErr = maxSegErr;
  out.countKept = f.length === raw.length;
  out.finite = f.every(p => Number.isFinite(p.x) && Number.isFinite(p.y));

  // 3) 幂等：再次对齐不再移动
  const f2 = g.formalize(f);
  out.idempotent = f2.every((p, i) => Math.hypot(p.x - f[i].x, p.y - f[i].y) < 1e-6);

  // 4) 路径：端点吻合、总长为正、全部有限、顶点数不变
  const b = g.buildPath(raw.map(p => ({ x: p.x, y: p.y, dir: p.dir })));
  out.pathEnds = Math.hypot(b.pts[0].x - b.verts[0].x, b.pts[0].y - b.verts[0].y) < 1e-9 &&
    Math.hypot(b.pts[b.pts.length - 1].x - b.verts[b.verts.length - 1].x,
               b.pts[b.pts.length - 1].y - b.verts[b.verts.length - 1].y) < 1e-9;
  out.totalPositive = b.total > 0;
  out.pathFinite = b.pts.every(p => Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.len));
  out.vertsKept = b.verts.length === raw.length;
  out.pointAtMid = g.pointAt(b, b.total / 2).x;

  // 5) 圆角半径分段
  out.r45 = g.cornerRadius(45);
  out.r90 = g.cornerRadius(90);
  out.r135 = g.cornerRadius(135);

  // 6) 胶囊：水平/斜向主轴，长度含两端半径
  const capH = g.capsuleOf([{ x: 0, y: 0 }, { x: 100, y: 0 }]);
  const capD = g.capsuleOf([{ x: 0, y: 0 }, { x: 100, y: 100 }]);
  out.capH = { angle: Math.abs(capH.angle) < 1e-9, len: Math.round(capH.len), thick: capH.thick };
  out.capD = { angle: Math.abs(Math.abs(capD.angle) - Math.PI / 4) < 1e-9, len: Math.round(capD.len) };

  // 7) bbox / pointAt 端点
  const bb = g.bboxOf([{ x: 3, y: 4 }, { x: -2, y: 10 }]);
  out.bbox = bb.x0 === -2 && bb.x1 === 3 && bb.y0 === 4 && bb.y1 === 10;
  out.endpoint = Math.hypot(g.pointAt(b, 0).x - b.pts[0].x, g.pointAt(b, 0).y - b.pts[0].y) < 1e-9;

  console.log(JSON.stringify(out));
  const ok = out.snapMaxErr < 1e-9 && out.snapLenOk &&
    out.segMaxErr < 1e-6 && out.countKept && out.finite && out.idempotent &&
    out.pathEnds && out.totalPositive && out.pathFinite && out.vertsKept &&
    out.r45 === 18 && out.r90 === 26 && out.r135 === 34 &&
    out.capH.angle && out.capH.thick === 14 && out.capD.angle &&
    out.bbox && out.endpoint;
  console.log(ok ? 'OK' : 'FAIL');
  process.exit(ok ? 0 : 1);
})();
