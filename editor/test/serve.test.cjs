// 静态服务冒烟：启动 dev-server，抓 editor.html / main.js / sample，随后关闭
const { spawn } = require('child_process');
const path = require('path');
const PORT = 8799;
const ROOT = path.resolve(__dirname, '..', '..');
const child = spawn(process.execPath, [path.join(ROOT, 'editor/dev-server.cjs'), String(PORT)], { stdio: 'ignore' });
const url = p => 'http://127.0.0.1:' + PORT + p;
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  try {
    let ok = false;
    for (let i = 0; i < 20; i++) {
      try { const r = await fetch(url('/editor.html')); if (r.ok) { ok = true; break; } } catch {}
      await wait(150);
    }
    if (!ok) throw new Error('server not ready');
    const html = await (await fetch(url('/editor.html'))).text();
    const main = await fetch(url('/editor/main.js'));
    const sample = await (await fetch(url('/editor/sample.save.json'))).json();
    const res = {
      html: html.includes('editor/main.js'),
      main: main.status,
      samplePoints: sample.points.length,
      sampleLines: sample.lines.length
    };
    console.log(JSON.stringify(res));
    if (!res.html || res.main !== 200 || res.samplePoints < 1) { console.log('FAIL'); process.exitCode = 1; }
    else console.log('OK');
  } catch (e) {
    console.log('FAIL ' + e.message); process.exitCode = 1;
  } finally {
    child.kill();
  }
})();
