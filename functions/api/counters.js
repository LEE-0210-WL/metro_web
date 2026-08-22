// functions/api/counters.js
// 支持每个用户独立的每日额度，用户标识通过 Header X-User-Id 传递

export async function onRequestGet(context) {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id"
  };

  try {
    const kv = context.env.COUNTER_KV || globalThis.COUNTER_KV;
    if (!kv) {
      return new Response(JSON.stringify({ error: "KV not bound" }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // 获取用户 ID
    const userId = context.request.headers.get('X-User-Id') || 'anonymous';
    const today = new Date().toISOString().split('T')[0];

    // 读取所有业务数据
    const remaining = parseFloat(await kv.get("remaining") || "11300000000");
    const sold = parseFloat(await kv.get("sold") || "50000000");
    const blast = parseFloat(await kv.get("blast") || "0");
    const xifuRemaining = parseFloat(await kv.get("xifuRemaining") || "20000");
    const xifuSold = parseFloat(await kv.get("xifuSold") || "0");
    const bombProgress = parseFloat(await kv.get("bombProgress") || "0");
    const dogProgress = parseFloat(await kv.get("dogProgress") || "0");
    const dogDecimals = parseInt(await kv.get("dogDecimals") || "2");

    // 读取各业务的每日已用量（按用户隔离）
    const estateDaily = parseFloat(await kv.get(`estate_daily_${today}_${userId}`) || "0");
    const xifuDaily = parseFloat(await kv.get(`xifu_daily_${today}_${userId}`) || "0");
    const blastDaily = parseFloat(await kv.get(`blast_daily_${today}_${userId}`) || "0");
    const bombDaily = parseFloat(await kv.get(`bomb_daily_${today}_${userId}`) || "0");
    const dogDaily = parseFloat(await kv.get(`dog_daily_${today}_${userId}`) || "0");

    return new Response(JSON.stringify({
      remaining, sold, blast, xifuRemaining, xifuSold,
      bombProgress, dogProgress, dogDecimals,
      daily: {
        estate: estateDaily,
        xifu: xifuDaily,
        blast: blastDaily,
        bomb: bombDaily,
        dog: dogDaily
      }
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
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id"
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

    // 获取用户 ID
    const userId = context.request.headers.get('X-User-Id') || 'anonymous';
    const today = new Date().toISOString().split('T')[0];

    // ========== 各业务分支 ==========
    if (id === "estate") {
      const dailyKey = `estate_daily_${today}_${userId}`;
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

      // 返回最新数据
      return new Response(JSON.stringify({
        ok: true,
        remaining,
        sold,
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2"),
        daily: {
          estate: dailySold + delta,
        }
      }), {
        headers: corsHeaders
      });
    } else if (id === "xifu") {
      const dailyKey = `xifu_daily_${today}_${userId}`;
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

      return new Response(JSON.stringify({
        ok: true,
        xifuRemaining,
        xifuSold,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2"),
        daily: {
          xifu: dailySold + delta,
        }
      }), {
        headers: corsHeaders
      });
    } else if (id === "blast") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify({ error: "单次爆破步长必须在 0.01 ~ 1.5 之间" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = `blast_daily_${today}_${userId}`;
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

      return new Response(JSON.stringify({
        ok: true,
        blast,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2"),
        daily: {
          blast: dailyBlast + delta,
        }
      }), {
        headers: corsHeaders
      });
    } else if (id === "bombardier") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify({ error: "单次翻新步长必须在 0.01 ~ 1.5 之间" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = `bomb_daily_${today}_${userId}`;
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

      return new Response(JSON.stringify({
        ok: true,
        bombProgress,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2"),
        daily: {
          bomb: dailyBomb + delta,
        }
      }), {
        headers: corsHeaders
      });
    } else if (id === "dogchair") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify({ error: "单次倒闭步长必须在 0.01 ~ 1.5 之间" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = `dog_daily_${today}_${userId}`;
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

      return new Response(JSON.stringify({
        ok: true,
        dogProgress,
        dogDecimals,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        daily: {
          dog: dailyDog + delta,
        }
      }), {
        headers: corsHeaders
      });
    } else {
      return new Response(JSON.stringify({ error: "unknown id" }), {
        status: 400,
        headers: corsHeaders
      });
    }
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
      "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
      "Access-Control-Max-Age": "86400"
    }
  });
}
