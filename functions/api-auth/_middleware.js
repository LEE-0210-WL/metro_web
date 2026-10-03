// functions/api-auth/_middleware.js
//
// 同源代理：把 /api-auth/* 转发到 metro-auth-worker。
//
// 为什么用 _middleware.js 而不是 [[path]].js：
//   GitHub 的网页「拖拽上传」无法处理文件名里的方括号，
//   上传 [[path]].js 会报 "Something went really wrong, and we can't process that file."
//   _middleware.js 没有任何特殊字符，可以正常拖拽上传，
//   而它同样能拦截 /api-auth/ 目录下的所有请求并直接返回响应。
//
// 为什么需要这个代理：
//   *.workers.dev 在国内被 DNS 污染（会解析到非 Cloudflare 的 IP，TCP 443 一直超时），
//   浏览器直连不上；而 *.pages.dev 是正常的。
//   所以页面改为请求自己站点的 /api-auth/*，由 Pages Function 在 Cloudflare 内部转发过去。
//   这也正是你原有 functions/api/kv-stats.js 对 kv-stats-worker 用的同一套路。
//
// 路由映射（剥掉 /api-auth 前缀即可）：
//   /api-auth/plans         -> {WORKER}/plans
//   /api-auth/auth/login    -> {WORKER}/auth/login
//   /api-auth/ai/chat       -> {WORKER}/ai/chat      （SSE 流式，必须原样透传）

const WORKER_ORIGIN = 'https://metro-auth-worker.3582099572.workers.dev';

// Worker 侧有来源白名单校验（originBlocked）；这里以站点自身作为来源，保证通过校验。
// 以后换了自定义域名，记得同步改这里和 Worker 的 ALLOWED_ORIGIN。
const SITE_ORIGIN = 'https://metro-web-b8o.pages.dev';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // 去掉 /api-auth 前缀，剩下的原样接到 Worker 根上
  const rest = url.pathname.replace(/^\/api-auth\/?/, '');
  const target = WORKER_ORIGIN + '/' + rest + url.search;

  const method = request.method.toUpperCase();
  const hasBody = method !== 'GET' && method !== 'HEAD';

  // 只透传必要请求头，别把 Host、Cookie 之类的东西带过去
  const headers = new Headers();
  const ct = request.headers.get('Content-Type');
  const auth = request.headers.get('Authorization');
  if (ct) headers.set('Content-Type', ct);
  if (auth) headers.set('Authorization', auth);
  headers.set('Origin', SITE_ORIGIN);

  // 把真实客户端 IP 往后传：Worker 用它做登录失败限流，
  // 否则所有用户会共用 Pages Function 的同一个出口 IP。
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) headers.set('X-Forwarded-For', ip);

  let upstream;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body: hasBody && request.body ? request.body : undefined,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: '代理转发失败：' + ((e && e.message) || e) }),
      { status: 502, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }

  // 逐跳头与编码相关头不能照搬，否则响应体会被二次解压或长度不符
  const DROP = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection']);
  const outHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!DROP.has(key.toLowerCase())) outHeaders.set(key, value);
  });
  // 认证与 AI 响应一律不缓存
  outHeaders.set('Cache-Control', 'no-store');

  // 直接透传 body（不要 await text()），否则 SSE 流式会被整体缓冲、失去打字机效果
  return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
}
