// 存档 round-trip + 吸附方向
const path = require('path');
const { pathToFileURL } = require('url');
const REPO = path.resolve(__dirname, '..', '..');
(async () => {
  const s = await import(pathToFileURL(path.join(REPO, 'editor/save.js')).href);
  const g = await import(pathToFileURL(path.join(REPO, 'editor/geometry.js')).href);
  const raw = JSON.parse(require('fs').readFileSync(path.join(REPO, 'editor/sample.save.json'), 'utf8'));
  const text = s.serializeSave(raw);
  const again = JSON.parse(text);
  if (JSON.stringify(raw) !== JSON.stringify(again)) { console.log('FAIL round-trip'); process.exit(1); }
  const m1 = s.buildModel(raw), m2 = s.buildModel(again);
  if (m1.points.length !== m2.points.length || m1.lines.length !== m2.lines.length) { console.log('FAIL model'); process.exit(1); }

  const cases = [
    [{ x: 0, y: 0 }, { x: 100, y: 3 }, 0],
    [{ x: 0, y: 0 }, { x: 100, y: 96 }, 45],
    [{ x: 0, y: 0 }, { x: -100, y: 100 }, 135],
    [{ x: 0, y: 0 }, { x: 3, y: 100 }, 90]
  ];
  for (const [a, b, want] of cases) {
    const p = g.snapPoint(a, b);
    let deg = Math.atan2(p.y - a.y, p.x - a.x) * 180 / Math.PI;
    deg = ((deg % 180) + 180) % 180;
    if (Math.abs(deg - want) > 1e-6) { console.log('FAIL snap', deg, 'want', want); process.exit(1); }
  }
  console.log(JSON.stringify({ points: m1.points.length, lines: m1.lines.length, snap: 'ok', roundtrip: 'ok' }));
  console.log('OK');
})();
