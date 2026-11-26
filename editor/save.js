// metro_web/editor/save.js
// AARC 存档子集：读取 / 校验 / 站点簇推导 / 序列化。
// 站点簇规则与 AARC 一致：同名合并 + 60 单位内邻近合并（noCluster 点除外）。

const CLUSTER_DIST = 60;

export function normName(s) { return String(s || '').replace(/\s+/g, ''); }

export function emptySave() {
  return {
    idIncre: 1,
    points: [],
    lines: [],
    textTags: [],
    cvsSize: [2400, 1600],
    config: {},
    meta: { editor: 'metro_web-editor', version: 1 }
  };
}

export function validateSave(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('存档不是 JSON 对象');
  if (!Array.isArray(raw.points)) throw new Error('缺少 points 数组');
  if (!Array.isArray(raw.lines)) throw new Error('缺少 lines 数组');
  for (const p of raw.points) {
    if (typeof p.id !== 'number') throw new Error('点缺少数字 id');
    if (!Array.isArray(p.pos) || p.pos.length < 2) throw new Error('点 ' + p.id + ' 缺少 pos');
  }
  for (const l of raw.lines) {
    if (typeof l.id !== 'number') throw new Error('线缺少数字 id');
    if (!Array.isArray(l.pts)) throw new Error('线 ' + l.id + ' 缺少 pts');
  }
  return raw;
}

// 由原始点/线推导：站点簇、每条线的站点序列
export function buildModel(raw) {
  const points = raw.points.map(p => ({
    ...p,
    pos: [...p.pos],
    dir: p.dir | 0,
    sta: p.sta ? 1 : 0,
    noCluster: !!p.noCluster,
    n: normName(p.name)
  }));
  const byId = new Map(points.map(p => [p.id, p]));
  const parent = new Map(points.map(p => [p.id, p.id]));
  const find = x => {
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r);
    while (parent.get(x) !== r) { const nx = parent.get(x); parent.set(x, r); x = nx; }
    return r;
  };
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra, rb); };

  const named = new Map();
  for (const p of points) {
    if (!p.sta || !p.n || p.noCluster) continue;
    if (named.has(p.n)) union(named.get(p.n), p.id); else named.set(p.n, p.id);
  }
  const near = [];
  for (const p of points) {
    if (!p.sta || p.noCluster) continue;
    for (const q of points) {
      if (!q.sta || q.noCluster || q.id === p.id) continue;
      if (q.id < p.id) continue;
      const dx = p.pos[0] - q.pos[0], dy = p.pos[1] - q.pos[1];
      if (dx * dx + dy * dy < CLUSTER_DIST * CLUSTER_DIST) union(p.id, q.id);
    }
  }
  const clusters = new Map();
  const clusterOf = new Map();
  for (const p of points) {
    if (!p.sta) continue;
    const hasName = !!p.n;
    if (!hasName && p.noCluster) { continue; }
    const r = find(p.id);
    if (!clusters.has(r)) clusters.set(r, { id: r, names: [], pts: [], lines: new Set() });
    const c = clusters.get(r);
    if (p.n && !c.names.includes(p.n)) c.names.push(p.n);
    c.pts.push(p.id);
    clusterOf.set(p.id, r);
  }
  const lines = raw.lines.map(l => ({
    id: l.id,
    name: l.name || ('line-' + l.id),
    color: l.color || '#3a7bd5',
    width: l.width || 1,
    type: l.type == null ? 0 : l.type,
    pts: (l.pts || []).filter(id => byId.has(id))
  }));
  for (const l of lines) {
    for (const id of l.pts) {
      const p = byId.get(id);
      if (!p || !p.sta) continue;
      const r = clusterOf.get(id);
      if (r != null && clusters.has(r)) clusters.get(r).lines.add(l.name);
    }
  }
  return { raw, points, byId, lines, clusters, clusterOf };
}

export function stationName(model, pid) {
  const p = model.byId.get(pid);
  if (!p) return '';
  if (p.name) return p.name;
  const r = model.clusterOf.get(pid);
  const c = r != null ? model.clusters.get(r) : null;
  return c && c.names.length ? c.names[0] : '';
}

export function lineStations(model, line) {
  const out = [];
  for (const id of line.pts) {
    const p = model.byId.get(id);
    if (!p || !p.sta) continue;
    const r = model.clusterOf.get(id);
    const c = r != null ? model.clusters.get(r) : null;
    out.push({ id, point: p, cluster: c, name: stationName(model, id) });
  }
  return out;
}

export function serializeSave(raw) {
  return JSON.stringify(raw, null, 2);
}

export function nextId(raw) {
  let id = Math.max(1, raw.idIncre | 0);
  const used = new Set();
  for (const p of raw.points) used.add(p.id);
  while (used.has(id)) id++;
  return id;
}

export function makePoint(raw, id, pos, extra = {}) {
  return { id, pos: [pos.x, pos.y], dir: 0, sta: 1, ...extra };
}
