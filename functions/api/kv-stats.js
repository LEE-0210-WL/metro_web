// functions/api/kv-stats.js
// 修复版：添加 CORS 头，代理 kv-stats-worker，缓存 10 秒

const WORKER_URL = 'https://kv-stats-worker.3582099572.workers.dev/';
let cachedData = null;
let cacheTime = 0;
const CACHE_TTL = 10000;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
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
          ...corsHeaders()
        }
      });
    } catch (err) {
      if (cachedData) {
        return new Response(JSON.stringify({ ...cachedData, stale: true }), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            ...corsHeaders()
          }
        });
      }
      return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      });
    }
  }

  return new Response(JSON.stringify(cachedData), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      ...corsHeaders()
    }
  });
}
