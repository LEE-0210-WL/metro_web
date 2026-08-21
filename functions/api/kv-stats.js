// functions/api/kv-stats.js
// 代理 kv-stats-worker，并缓存 60 秒

const WORKER_URL = 'https://kv-stats-worker.3582099572.workers.dev/';
let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 60000; // 60 秒

export async function onRequest(context) {
  const { request } = context;
  
  // 处理 OPTIONS（虽然同域不需要，但保留）
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // 只允许 GET
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 检查缓存
  const now = Date.now();
  if (cachedData && now - cacheTime < CACHE_TTL) {
    return new Response(JSON.stringify(cachedData), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 请求 kv-stats-worker
    const resp = await fetch(WORKER_URL);
    if (!resp.ok) throw new Error(`Worker responded with ${resp.status}`);
    const data = await resp.json();
    
    // 更新缓存
    cachedData = data;
    cacheTime = now;

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    // 如果请求失败，且缓存有旧数据，返回旧数据（标记为过期）
    if (cachedData) {
      return new Response(JSON.stringify({ ...cachedData, stale: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // 无缓存，返回错误
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
