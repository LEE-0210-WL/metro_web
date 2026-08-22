// functions/api/kv-stats.js
// 代理 kv-stats-worker，缓存 10 秒

const WORKER_URL = 'https://kv-stats-worker.3582099572.workers.dev/';
let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 10000; // 10 秒，比之前 60 秒更实时

export async function onRequest(context) {
  const { request } = context;
  
  // 处理 OPTIONS 预检请求
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

  // 检查缓存是否有效
  const now = Date.now();
  if (cachedData && now - cacheTime < CACHE_TTL) {
    // 缓存命中，直接返回（加 no-cache 头，防止浏览器缓存）
    return new Response(JSON.stringify(cachedData), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  // 缓存失效，向 kv-stats-worker 发起请求
  try {
    const resp = await fetch(WORKER_URL);
    if (!resp.ok) throw new Error(`Worker responded with ${resp.status}`);
    const data = await resp.json();
    
    // 更新缓存
    cachedData = data;
    cacheTime = now;

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    // 请求失败，如果有旧缓存则返回旧数据（标记为过期）
    if (cachedData) {
      return new Response(JSON.stringify({ ...cachedData, stale: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
    }
    // 完全没有缓存，返回错误
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  }
}
