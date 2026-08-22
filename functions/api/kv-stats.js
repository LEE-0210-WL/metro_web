// functions/api/kv-stats.js
// 代理 kv-stats-worker，缓存 10 秒，支持强制刷新

const WORKER_URL = 'https://kv-stats-worker.3582099572.workers.dev/';
let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 10000;

export async function onRequest(context) {
  const { request } = context;

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

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const force = url.searchParams.has('t') || url.searchParams.get('force') === 'true';
  const now = Date.now();

  if (force || !cachedData || now - cacheTime > CACHE_TTL) {
    try {
      const resp = await fetch(WORKER_URL);
      if (!resp.ok) throw new Error('Worker responded with ' + resp.status);
      const data = await resp.json();
      cachedData = data;
      cacheTime = now;
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    } catch (err) {
      if (cachedData) {
        return new Response(JSON.stringify({ ...cachedData, stale: true }), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        });
      }
      return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify(cachedData), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}// functions/api/kv-stats.js
// 代理 kv-stats-worker，缓存 10 秒，支持强制刷新参数

const WORKER_URL = 'https://kv-stats-worker.3582099572.workers.dev/';
let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 10000; // 10 秒

export async function onRequest(context) {
  const { request } = context;

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

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const force = url.searchParams.has('t') || url.searchParams.get('force') === 'true';
  const now = Date.now();

  // 如果强制刷新或缓存过期，重新请求 Worker
  if (force || !cachedData || now - cacheTime > CACHE_TTL) {
    try {
      const resp = await fetch(WORKER_URL);
      if (!resp.ok) throw new Error('Worker responded with ' + resp.status);
      const data = await resp.json();
      cachedData = data;
      cacheTime = now;
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    } catch (err) {
      if (cachedData) {
        return new Response(JSON.stringify({ ...cachedData, stale: true }), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });
      }
      return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
    }
  }

  // 缓存命中
  return new Response(JSON.stringify(cachedData), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
