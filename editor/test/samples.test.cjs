// 示例存档：默认合成图 vs 作者提供的深圳线网
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const ROOT = path.resolve(__dirname, '..', '..');

(async () => {
  const s = await import(pathToFileURL(path.join(ROOT, 'editor/save.js')).href);
  const r = await import(pathToFileURL(path.join(ROOT, 'editor/render.js')).href);

  const demo = JSON.parse(fs.readFileSync(path.join(ROOT, 'editor/sample.save.json'), 'utf8'));
  const sz = JSON.parse(fs.readFileSync(path.join(ROOT, 'editor/samples/shenzhen-metro-user.save.json'), 'utf8'));

  const dm = s.buildModel(demo), dr = r.buildRenderModel(dm);
  const sm = s.buildModel(sz), sr = r.buildRenderModel(sm);

  const demoText = JSON.stringify(demo);
  const samplesHtml = fs.readFileSync(path.join(ROOT, 'samples.html'), 'utf8');
  const mainJs = fs.readFileSync(path.join(ROOT, 'editor/main.js'), 'utf8');
  const checks = {
    samplesResizeObserver: samplesHtml.includes('ResizeObserver'),
    editorResizeObserver: mainJs.includes('ResizeObserver'),
    editorLabelDrag: mainJs.includes('dragName') && mainJs.includes('snapNameP'),
    demoPoints: dm.points.length === 16,
    demoLines: dm.lines.length === 3,
    demoNoShenzhen: !demoText.includes('罗湖'),
    szPoints: sm.points.length === 522,
    szLines: sm.lines.length === 25,
    szHasQianhaiwan: sm.points.some(p => p.name === '前海湾'),
    demoTransfers: dr.transfers.length >= 1,
    szTransfers: sr.transfers.length >= 1
  };
  console.log(JSON.stringify({ demo: [dm.points.length, dm.lines.length], sz: [sm.points.length, sm.lines.length], checks }));
  const bad = Object.entries(checks).filter(([, v]) => !v);
  if (bad.length) { console.log('FAIL ' + bad.map(([k]) => k).join(',')); process.exit(1); }
  console.log('OK');
})();
