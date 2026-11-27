// metro_web/editor/main.js
// 线路绘制器入口：状态、渲染循环、编辑交互、导入导出、撤销重做。
import { buildModel, validateSave, serializeSave, nextId, emptySave } from './save.js';
import { buildRenderModel, render, hitTest } from './render.js';
import { createView, fitView, screenToWorld, zoomAt } from './view.js';
import { bboxOf, snapPoint } from './geometry.js';
import { snapNameP } from './namelabel.js';

const LS_KEY = 'metro_editor_save_v1';
const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} }
};

const state = {
  raw: null,
  model: null,
  rm: null,
  view: createView(0, 0, 1),
  tool: 'select',
  drawLineId: null,
  selPointId: null,
  selLineId: null,
  labels: true,
  grid: true,
  undo: [],
  redo: [],
  drag: null,
  dragName: null,
  labelHit: [],
  pan: null,
  space: false,
  dpr: 1
};

const $ = id => document.getElementById(id);
const cv = $('cv');
const ctx = cv.getContext('2d');

const PALETTE = ['#009943', '#B94EA0', '#7A1B3A', '#c23a2b', '#1f6fb2', '#d98a00', '#6a4c93', '#00838f'];

function status(msg) { $('status').textContent = msg || ''; }

function snapshot() { return JSON.stringify(state.raw); }

function pushUndo() {
  state.undo.push(snapshot());
  if (state.undo.length > 100) state.undo.shift();
  state.redo = [];
  updateButtons();
}

function restore(text) {
  state.raw = JSON.parse(text);
  state.model = buildModel(state.raw);
  state.rm = buildRenderModel(state.model);
  state.selPointId = null;
  state.selLineId = state.drawLineId = null;
  refreshUI();
  draw();
}

function undo() { if (!state.undo.length) return; state.redo.push(snapshot()); restore(state.undo.pop()); updateButtons(); }
function redo() { if (!state.redo.length) return; state.undo.push(snapshot()); restore(state.redo.pop()); updateButtons(); }

function updateButtons() {
  $('btnUndo').disabled = !state.undo.length;
  $('btnRedo').disabled = !state.redo.length;
}

function fitAllView(W, H) {
  const pts = state.model.points.map(p => ({ x: p.pos[0], y: p.pos[1] }));
  const bbox = pts.length ? bboxOf(pts) : { x0: 0, y0: 0, x1: 1600, y1: 900 };
  return fitView(bbox, W || cv.clientWidth || 1200, H || cv.clientHeight || 800);
}

function loadRaw(raw, { keepView = false, resetUndo = true } = {}) {
  validateSave(raw);
  state.raw = raw;
  state.model = buildModel(raw);
  state.rm = buildRenderModel(state.model);
  state.selPointId = null;
  state.selLineId = null;
  state.drawLineId = null;
  state.tool = 'select';
  if (!keepView) state.view = fitAllView();
  if (resetUndo) { state.undo = []; state.redo = []; }
  refreshUI();
  updateButtons();
  draw();
}

function autosave() { if (state.raw) ls.set(LS_KEY, serializeSave(state.raw)); }

function resize() {
  const r = cv.parentElement.getBoundingClientRect();
  state.dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.max(1, Math.round(r.width * state.dpr));
  cv.height = Math.max(1, Math.round(r.height * state.dpr));
  cv.style.width = r.width + 'px';
  cv.style.height = r.height + 'px';
  draw();
}

function draw() {
  if (!state.model) return;
  const W = cv.width / state.dpr, H = cv.height / state.dpr;
  state.labelHit = render(ctx, state.model, state.rm, state.view, {
    dpr: state.dpr,
    labels: state.labels,
    grid: state.grid,
    selectedLineId: state.selLineId,
    selectedPointId: state.selPointId,
    bg: '#f2f4f6'
  }) || [];
}

function refreshUI() {
  const list = $('lineList');
  list.innerHTML = '';
  for (const l of state.model.lines) {
    const row = document.createElement('div');
    row.className = 'ed-line' + (state.selLineId === l.id ? ' on' : '');
    row.innerHTML = '<span class="sw" style="background:' + l.color + '"></span><span class="nm">' + escapeHtml(l.name) + '</span><span class="ct">' + l.pts.length + ' 点</span>';
    row.onclick = () => { state.selLineId = l.id; state.selPointId = null; state.tool = 'select'; refreshUI(); draw(); };
    list.appendChild(row);
  }
  const lp = $('linePanel');
  const line = state.model.lines.find(l => l.id === state.selLineId);
  if (line) {
    lp.innerHTML = '';
    const name = document.createElement('input');
    name.value = line.name;
    name.oninput = () => { line.name = name.value; autosave(); refreshUI(); draw(); };
    const color = document.createElement('input');
    color.type = 'color';
    color.value = line.color;
    color.oninput = () => { line.color = color.value; autosave(); refreshUI(); draw(); };
    const del = document.createElement('button');
    del.textContent = '删除线路';
    del.className = 'danger';
    del.onclick = () => {
      pushUndo();
      state.raw.lines = state.raw.lines.filter(x => x.id !== line.id);
      state.model = buildModel(state.raw);
      state.rm = buildRenderModel(state.model);
      state.selLineId = null;
      autosave(); refreshUI(); draw();
    };
    lp.append(row2('名称', name), row2('颜色', color), del);
  } else {
    lp.innerHTML = '<p class="muted">点击上方线路进行编辑</p>';
  }

  const pp = $('ptPanel');
  const p = state.selPointId != null ? state.model.byId.get(state.selPointId) : null;
  pp.innerHTML = '';
  if (!p) pp.innerHTML = '<p class="muted">点击画布上的点进行编辑</p>';
  else {
    const name = document.createElement('input');
    name.placeholder = '站名';
    name.value = p.name || '';
    name.onchange = () => {
      p.name = name.value;
      state.model = buildModel(state.raw);
      state.rm = buildRenderModel(state.model);
      autosave(); refreshUI(); draw();
    };
    const sta = document.createElement('label');
    sta.className = 'chk';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!p.sta;
    cb.onchange = () => { p.sta = cb.checked ? 1 : 0; autosave(); refreshUI(); draw(); };
    sta.append(cb, document.createTextNode(' 作为车站'));
    const del = document.createElement('button');
    del.className = 'danger'; del.textContent = '删除该点';
    del.onclick = () => deletePoint(p.id);
    pp.append(row2('站名', name), sta, del);
  }
  status(state.model.points.length + ' 点 / ' + state.model.lines.length + ' 线' + (state.tool === 'draw' ? ' · 绘制中：点击加点，Esc 结束' : ''));
}

function row2(label, el) {
  const d = document.createElement('label');
  d.className = 'ed-row';
  d.append(document.createTextNode(label), el);
  return d;
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function deletePoint(id) {
  pushUndo();
  state.raw.points = state.raw.points.filter(p => p.id !== id);
  for (const l of state.raw.lines) l.pts = l.pts.filter(x => x !== id);
  if (state.raw.idIncre <= id) state.raw.idIncre = id + 1;
  state.selPointId = null;
  state.model = buildModel(state.raw);
  state.rm = buildRenderModel(state.model);
  autosave(); refreshUI(); draw();
}

function addLine() {
  pushUndo();
  const id = nextId(state.raw);
  state.raw.idIncre = id + 1;
  const line = { id, name: '新线路 ' + (state.raw.lines.length + 1), color: PALETTE[state.raw.lines.length % PALETTE.length], width: 1, type: 0, pts: [] };
  state.raw.lines.push(line);
  state.selLineId = id;
  state.drawLineId = id;
  state.tool = 'draw';
  state.model = buildModel(state.raw);
  state.rm = buildRenderModel(state.model);
  autosave(); refreshUI(); draw();
}

function canvasPos(e) {
  const r = cv.getBoundingClientRect();
  return { x: (e.clientX - r.left), y: (e.clientY - r.top) };
}

function addDrawPoint(world, opts = {}) {
  const line = state.raw.lines.find(l => l.id === state.drawLineId);
  if (!line) return;
  pushUndo();
  let pos = { x: world.x, y: world.y };
  if (line.pts.length) {
    const prevId = line.pts[line.pts.length - 1];
    const prev = state.model.byId.get(prevId);
    if (prev && !opts.free) pos = snapPoint({ x: prev.pos[0], y: prev.pos[1] }, pos);
    if (prev) {
      const dx = pos.x - prev.pos[0], dy = pos.y - prev.pos[1];
      const axis = Math.abs(dx) < 0.5 || Math.abs(dy) < 0.5;
      prev.dir = axis ? 0 : 1;
    }
  }
  const id = nextId(state.raw);
  state.raw.idIncre = id + 1;
  const p = { id, pos: [pos.x, pos.y], dir: 0, sta: 1 };
  state.raw.points.push(p);
  line.pts.push(id);
  state.model = buildModel(state.raw);
  state.rm = buildRenderModel(state.model);
  state.selPointId = id;
  autosave(); refreshUI(); draw();
}

function onPointerDown(e) {
  if (e.button === 1 || state.space || state.tool === 'pan') {
    state.pan = { x: e.clientX, y: e.clientY, cx: state.view.cx, cy: state.view.cy };
    cv.setPointerCapture(e.pointerId);
    return;
  }
  if (e.button !== 0) return;
  const sp = canvasPos(e);
  const W = cv.clientWidth, H = cv.clientHeight;
  const world = screenToWorld(state.view, sp.x, sp.y, W, H);
  if (state.tool === 'draw') {
    addDrawPoint(world, { free: e.altKey });
    return;
  }
  const labelHit = state.labels && state.tool === 'select'
    ? state.labelHit.find(b => b.id != null && sp.x >= b.x && sp.x <= b.x + b.w && sp.y >= b.y && sp.y <= b.y + b.h)
    : null;
  if (labelHit) {
    const p = state.model.byId.get(labelHit.id);
    const rp = state.raw.points.find(q => q.id === labelHit.id);
    if (p && rp) {
      pushUndo();
      state.dragName = { id: labelHit.id, startNameP: Array.isArray(p.nameP) ? [...p.nameP] : null };
      cv.setPointerCapture(e.pointerId);
      draw();
      return;
    }
  }
  const hit = hitTest(state.model, state.rm, state.view, sp.x, sp.y, W, H, 16);
  if (hit) {
    pushUndo();
    state.selPointId = hit.id;
    state.drag = { id: hit.id };
    cv.setPointerCapture(e.pointerId);
    refreshUI(); draw();
  } else {
    state.selPointId = null;
    refreshUI(); draw();
  }
}

function onPointerMove(e) {
  if (state.pan) {
    state.view.cx = state.pan.cx - (e.clientX - state.pan.x) / state.view.s;
    state.view.cy = state.pan.cy - (e.clientY - state.pan.y) / state.view.s;
    draw();
    return;
  }
  if (state.dragName) {
    const p = state.model.byId.get(state.dragName.id);
    const rp = state.raw.points.find(q => q.id === state.dragName.id);
    if (!p || !rp) return;
    const sp = canvasPos(e);
    const world = screenToWorld(state.view, sp.x, sp.y, cv.clientWidth, cv.clientHeight);
    const sn = snapNameP(world.x - p.pos[0], world.y - p.pos[1], Math.max(6, 8 / state.view.s));
    p.nameP = [sn.p[0], sn.p[1]];
    rp.nameP = [sn.p[0], sn.p[1]];
    draw();
    return;
  }
  if (!state.drag) return;
  const p = state.model.byId.get(state.drag.id);
  if (!p) return;
  const sp = canvasPos(e);
  const world = screenToWorld(state.view, sp.x, sp.y, cv.clientWidth, cv.clientHeight);
  let pos = { x: world.x, y: world.y };
  if (!e.altKey) {
    const line = state.model.lines.find(l => l.pts.includes(p.id));
    if (line) {
      const i = line.pts.indexOf(p.id);
      const prev = i > 0 ? state.model.byId.get(line.pts[i - 1]) : null;
      const next = i < line.pts.length - 1 ? state.model.byId.get(line.pts[i + 1]) : null;
      if (prev) pos = snapPoint({ x: prev.pos[0], y: prev.pos[1] }, pos);
      else if (next) pos = snapPoint({ x: next.pos[0], y: next.pos[1] }, pos);
    }
  }
  p.pos[0] = pos.x; p.pos[1] = pos.y;
  draw();
}

function onPointerUp() {
  if (state.pan) { state.pan = null; autosave(); return; }
  if (state.dragName) {
    state.dragName = null;
    autosave();
    draw();
    return;
  }
  if (state.drag) {
    state.drag = null;
    state.model = buildModel(state.raw);
    state.rm = buildRenderModel(state.model);
    autosave(); refreshUI(); draw();
  }
}

function onWheel(e) {
  e.preventDefault();
  const sp = canvasPos(e);
  const factor = Math.exp(-e.deltaY * 0.0012);
  state.view = zoomAt(state.view, sp.x, sp.y, factor, cv.clientWidth, cv.clientHeight);
  draw();
}

function importFile(file) {
  const fr = new FileReader();
  fr.onload = () => {
    try {
      const raw = JSON.parse(String(fr.result));
      loadRaw(raw);
      autosave();
      status('已导入 ' + file.name);
    } catch (err) { alert('导入失败：' + err.message); }
  };
  fr.readAsText(file);
}

function exportPng() {
  const W = 1920, H = 1080;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const cx = c.getContext('2d');
  const view = fitAllView(W, H);
  render(cx, state.model, state.rm, view, { dpr: 1, labels: true, grid: false, bg: '#f2f4f6', selectedLineId: null, selectedPointId: null });
  c.toBlob(blob => { if (blob) download(blob, 'metro-map.png'); }, 'image/png');
}

function exportJson() {
  download(new Blob([serializeSave(state.raw)], { type: 'application/json' }), 'metro-save.json');
}
function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function saveFromQuery() {
  try {
    const src = new URLSearchParams(location.search).get('save');
    if (!src || !/^editor\/[A-Za-z0-9_./-]+\.save\.json$/.test(src) || src.includes('..')) return null;
    return src;
  } catch { return null; }
}

async function boot() {
  const saved = ls.get(LS_KEY, null);
  let raw = null;
  const src = saveFromQuery();
  if (src) {
    try { raw = await (await fetch(src, { cache: 'no-store' })).json(); }
    catch (e) { raw = null; }
  }
  if (!raw && saved) { try { raw = JSON.parse(saved); } catch { raw = null; } }
  if (!raw) {
    try { raw = await (await fetch('editor/sample.save.json', { cache: 'no-store' })).json(); }
    catch (e) { raw = emptySave(); }
  }
  loadRaw(raw);
  window.addEventListener('resize', resize);
  let rafResize = 0;
  if (window.ResizeObserver && cv.parentElement) {
    new ResizeObserver(() => {
      if (rafResize) return;
      rafResize = requestAnimationFrame(() => { rafResize = 0; resize(); });
    }).observe(cv.parentElement);
  }
  cv.addEventListener('pointerdown', onPointerDown);
  cv.addEventListener('pointermove', onPointerMove);
  cv.addEventListener('pointerup', onPointerUp);
  cv.addEventListener('pointercancel', onPointerUp);
  cv.addEventListener('wheel', onWheel, { passive: false });
  cv.addEventListener('contextmenu', e => e.preventDefault());
  $('btnNew').onclick = addLine;
  $('btnImport').onclick = () => $('file').click();
  $('file').onchange = () => { const f = $('file').files[0]; if (f) importFile(f); $('file').value = ''; };
  $('btnExport').onclick = exportPng;
  $('btnExportJson').onclick = exportJson;
  $('btnFit').onclick = () => { state.view = fitAllView(); draw(); };
  $('btnUndo').onclick = undo;
  $('btnRedo').onclick = redo;
  $('chkLabels').onchange = e => { state.labels = e.target.checked; draw(); };
  $('chkGrid').onchange = e => { state.grid = e.target.checked; draw(); };
  window.addEventListener('keydown', e => {
    if (e.code === 'Space') { state.space = true; }
    const tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA/.test(tag)) return;
    if (e.key === 'Escape') {
      if (state.dragName) {
        const p = state.model.byId.get(state.dragName.id);
        const rp = state.raw.points.find(q => q.id === state.dragName.id);
        const prev = state.dragName.startNameP;
        if (p) { if (prev) p.nameP = [...prev]; else delete p.nameP; }
        if (rp) { if (prev) rp.nameP = [...prev]; else delete rp.nameP; }
        state.dragName = null;
      }
      state.tool = 'select'; state.drawLineId = null; refreshUI(); draw();
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && state.selPointId != null) { e.preventDefault(); deletePoint(state.selPointId); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
  });
  window.addEventListener('keyup', e => { if (e.code === 'Space') state.space = false; });
  resize();
  refreshUI();
  updateButtons();
}

boot();
