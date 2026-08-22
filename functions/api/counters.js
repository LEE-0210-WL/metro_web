// functions/api/counters.js
// 后端自维护写入计数器，只统计成功写入，避免 GraphQL 含失败请求的问题

export async function onRequestGet(context) {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    const kv = context.env.COUNTER_KV || globalThis.COUNTER_KV;
    if (!kv) {
      return new Response(JSON.stringify({ error: "KV not bound" }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const writeCountKey = "write_count_" + today;
    const writeCount = parseInt(await kv.get(writeCountKey) || "0");

    const remaining = parseFloat(await kv.get("remaining") || "11300000000");
    const sold = parseFloat(await kv.get("sold") || "50000000");
    const blast = parseFloat(await kv.get("blast") || "0");
    const xifuRemaining = parseFloat(await kv.get("xifuRemaining") || "20000");
    const xifuSold = parseFloat(await kv.get("xifuSold") || "0");
    const bombProgress = parseFloat(await kv.get("bombProgress") || "0");
    const dogProgress = parseFloat(await kv.get("dogProgress") || "0");
    const dogDecimals = parseInt(await kv.get("dogDecimals") || "2");

    return new Response(JSON.stringify({
      remaining, sold, blast, xifuRemaining, xifuSold,
      bombProgress, dogProgress, dogDecimals,
      writeCount,
      writeLimit: 1000
    }), {
      headers: corsHeaders
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestPost(context) {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    const kv = context.env.COUNTER_KV || globalThis.COUNTER_KV;
    if (!kv) {
      return new Response(JSON.stringify({ error: "KV not bound" }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const body = await context.request.json();
    const id = body.id;
    const delta = parseFloat(body.delta);

    if (!id || isNaN(delta)) {
      return new Response(JSON.stringify({ error: "invalid params" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const writeCountKey = "write_count_" + today;
    let writeCount = parseInt(await kv.get(writeCountKey) || "0");

    // 后端硬锁：达到 1000 直接拒绝
    if (writeCount >= 1000) {
      return new Response(JSON.stringify({
        error: "今日写入额度已用完，明天再来！",
        writeCount: writeCount,
        writeLimit: 1000,
        locked: true
      }), {
        status: 503,
        headers: corsHeaders
      });
    }

    // ---------- 各业务分支处理 ----------
    let result = { ok: true };
    let success = false;

    if (id === "estate") {
      const dailyKey = "estate_daily_" + today;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 500;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify({
          error: "今日大运TOD买房额度已用完，明天再来！",
          dailySold,
          maxDaily
        }), {
          status: 429,
          headers: corsHeaders
        });
      }

      let remaining = parseFloat(await kv.get("remaining") || "11300000000");
      let sold = parseFloat(await kv.get("sold") || "50000000");

      if (remaining < delta) {
        return new Response(JSON.stringify({ error: "not enough remaining" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      remaining -= delta;
      sold += delta;
      await kv.put("remaining", remaining.toString());
      await kv.put("sold", sold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());
      success = true;
      result = { ok: true, remaining, sold };
    } else if (id === "xifu") {
      const dailyKey = "xifu_daily_" + today;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1000;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify({
          error: "今日深铁熙府买房额度已用完，明天再来！",
          dailySold,
          maxDaily
        }), {
          status: 429,
          headers: corsHeaders
        });
      }

      let xifuRemaining = parseFloat(await kv.get("xifuRemaining") || "20000");
      let xifuSold = parseFloat(await kv.get("xifuSold") || "0");

      if (xifuRemaining < delta) {
        return new Response(JSON.stringify({ error: "not enough xifu remaining" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      xifuRemaining -= delta;
      xifuSold += delta;
      await kv.put("xifuRemaining", xifuRemaining.toString());
      await kv.put("xifuSold", xifuSold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());
      success = true;
      result = { ok: true, xifuRemaining, xifuSold };
    } else if (id === "blast") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify({ error: "单次爆破步长必须在 0.01 ~ 1.5 之间" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "blast_daily_" + today;
      const dailyBlast = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1.5;

      if (dailyBlast + delta > maxDaily) {
        return new Response(JSON.stringify({
          error: "今日爆破额度已用完，明天再来！",
          dailyBlast,
          maxDaily
        }), {
          status: 429,
          headers: corsHeaders
        });
      }

      let blast = parseFloat(await kv.get("blast") || "0");
      blast = Math.min(blast + delta, 100);
      await kv.put("blast", blast.toString());
      await kv.put(dailyKey, (dailyBlast + delta).toString());
      success = true;
      result = { ok: true, blast };
    } else if (id === "bombardier") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify({ error: "单次翻新步长必须在 0.01 ~ 1.5 之间" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "bomb_daily_" + today;
      const dailyBomb = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1.5;

      if (dailyBomb + delta > maxDaily) {
        return new Response(JSON.stringify({
          error: "今日翻新额度已用完，明天再来！",
          dailyBomb,
          maxDaily
        }), {
          status: 429,
          headers: corsHeaders
        });
      }

      let bombProgress = parseFloat(await kv.get("bombProgress") || "0");
      bombProgress = Math.min(bombProgress + delta, 100);
      await kv.put("bombProgress", bombProgress.toString());
      await kv.put(dailyKey, (dailyBomb + delta).toString());
      success = true;
      result = { ok: true, bombProgress };
    } else if (id === "dogchair") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify({ error: "单次倒闭步长必须在 0.01 ~ 1.5 之间" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "dog_daily_" + today;
      const dailyDog = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1.5;

      if (dailyDog + delta > maxDaily) {
        return new Response(JSON.stringify({
          error: "今日倒闭额度已用完，明天再来！",
          dailyDog,
          maxDaily
        }), {
          status: 429,
          headers: corsHeaders
        });
      }

      let dogProgress = parseFloat(await kv.get("dogProgress") || "0");
      let dogDecimals = parseInt(await kv.get("dogDecimals") || "2");

      if (dogProgress >= 99.9 && dogProgress < 99.9999999999) {
        dogDecimals++;
      }

      dogProgress = Math.min(dogProgress + delta, 99.9999999999);
      await kv.put("dogProgress", dogProgress.toString());
      await kv.put("dogDecimals", dogDecimals.toString());
      await kv.put(dailyKey, (dailyDog + delta).toString());
      success = true;
      result = { ok: true, dogProgress, dogDecimals };
    } else {
      return new Response(JSON.stringify({ error: "unknown id" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (success) {
      writeCount++;
      await kv.put(writeCountKey, writeCount.toString());
    }

    // 重新获取最新业务数据
    const remaining = parseFloat(await kv.get("remaining") || "11300000000");
    const sold = parseFloat(await kv.get("sold") || "50000000");
    const blast = parseFloat(await kv.get("blast") || "0");
    const xifuRemaining = parseFloat(await kv.get("xifuRemaining") || "20000");
    const xifuSold = parseFloat(await kv.get("xifuSold") || "0");
    const bombProgress = parseFloat(await kv.get("bombProgress") || "0");
    const dogProgress = parseFloat(await kv.get("dogProgress") || "0");
    const dogDecimals = parseInt(await kv.get("dogDecimals") || "2");

    return new Response(JSON.stringify({
      ...result,
      remaining, sold, blast, xifuRemaining, xifuSold,
      bombProgress, dogProgress, dogDecimals,
      writeCount,
      writeLimit: 1000
    }), {
      headers: corsHeaders
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    }
  });
}
