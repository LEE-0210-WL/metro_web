// 站名 nameP 布局与 8 方向吸附
const path = require('path');
const { pathToFileURL } = require('url');
const ROOT = path.resolve(__dirname, '..', '..');

(async () => {
  const n = await import(pathToFileURL(path.join(ROOT, 'editor/namelabel.js')).href);
  const out = {};
  out.default = n.defaultNameP();
  out.snapRight = n.snapNameP(17.9, 0.5);
  out.snapDiag = n.snapNameP(12, 12.6);
  out.snapFree = n.snapNameP(5, 5);
  const pt = (pos, nameP) => ({ pos, nameP });
  const right = n.labelLayout(pt([100, 100], [18, 0]));
  const upLeft = n.labelLayout(pt([100, 100], [-n.NAME_DIAG, -n.NAME_DIAG]));
  const above = n.labelLayout(pt([100, 100], [0, -18]));
  const far = n.labelLayout(pt([100, 100], [40, 0]));
  out.right = { gx: right.gx, gy: right.gy, ax: right.alignX, ay: right.alignY, leader: right.leader };
  out.upLeft = { ax: upLeft.alignX, ay: upLeft.alignY, leader: upLeft.leader };
  out.above = { ax: above.alignX, ay: above.alignY };
  out.farLeader = far.leader;
  out.fontS1 = n.labelFontPx(1);
  out.fontS2 = n.labelFontPx(2);
  out.fontS04 = n.labelFontPx(0.4);
  const boxR = n.labelBox(118, 100, 1, 0, 12, ['中央']);
  const boxL = n.labelBox(82, 100, -1, 0, 12, ['中央']);
  out.boxRightX = boxR.x; out.boxLeftRight = boxL.x + boxL.w;
  console.log(JSON.stringify(out));

  const ok =
    out.default[0] === 18 && out.default[1] === 0 &&
    out.snapRight.snapped && out.snapRight.p[0] === 18 && out.snapRight.p[1] === 0 &&
    out.snapDiag.snapped && Math.abs(out.snapDiag.p[0] - n.NAME_DIAG) < 1e-6 &&
    !out.snapFree.snapped && out.snapFree.p[0] === 5 &&
    out.right.gx === 118 && out.right.gy === 100 && out.right.ax === 1 && out.right.ay === 0 &&
    out.upLeft.ax === -1 && out.upLeft.ay === -1 && out.upLeft.leader === false &&
    out.above.ax === 0 && out.above.ay === -1 &&
    out.farLeader === true &&
    out.fontS1 === 12 && out.fontS2 === 20 && out.fontS04 === 9 &&
    out.boxRightX === 118 && Math.abs(out.boxLeftRight - 82) < 1e-6;
  console.log(ok ? 'OK' : 'FAIL');
  process.exit(ok ? 0 : 1);
})();
