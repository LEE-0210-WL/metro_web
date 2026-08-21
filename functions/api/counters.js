let dailyStats = { reads: 0, writes: 0, lastReset: Date.now() };

function resetIfNeeded() {
  const now = new Date();
  const last = new Date(dailyStats.lastReset);
  if (now.getUTCDate() !== last.getUTCDate()) {
    dailyStats = { reads: 0, writes: 0, lastReset: Date.now() };
  }
}

function injectStats(obj) {
  obj._kvReads = dailyStats.reads;
  obj._kvWrites = dailyStats.writes;
  obj._readLimit = 100000;
  return obj;
}

export async function onRequestGet(context) {
  resetIfNeeded();
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    const kv = context.env.COUNTER_KV || globalThis.COUNTER_KV;

    if (!kv) {
      return new Response(JSON.stringify(injectStats({ error: "KV not bound" })), {
        status: 500,
        headers: corsHeaders
      });
    }

    const remaining = parseFloat(await kv.get("remaining") || "11300000000");
    const sold = parseFloat(await kv.get("sold") || "50000000");
    const blast = parseFloat(await kv.get("blast") || "0");
    const xifuRemaining = parseFloat(await kv.get("xifuRemaining") || "20000");
    const xifuSold = parseFloat(await kv.get("xifuSold") || "0");
    const bombProgress = parseFloat(await kv.get("bombProgress") || "0");
    const dogProgress = parseFloat(await kv.get("dogProgress") || "0");
    const dogDecimals = parseInt(await kv.get("dogDecimals") || "2");
    dailyStats.reads++;

    return new Response(JSON.stringify(injectStats({ 
      remaining, sold, blast, xifuRemaining, xifuSold, bombProgress, dogProgress, dogDecimals 
    })), {
      headers: corsHeaders
    });
  } catch (e) {
    return new Response(JSON.stringify(injectStats({ error: e.message })), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestPost(context) {
  resetIfNeeded();
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    const kv = context.env.COUNTER_KV || globalThis.COUNTER_KV;

    if (!kv) {
      return new Response(JSON.stringify(injectStats({ error: "KV not bound" })), {
        status: 500,
        headers: corsHeaders
      });
    }

    const body = await context.request.json();
    const id = body.id;
    const delta = parseFloat(body.delta);

    if (!id || isNaN(delta)) {
      return new Response(JSON.stringify(injectStats({ error: "invalid params" })), {
        status: 400,
        headers: corsHeaders
      });
    }

    const today = new Date().toISOString().split('T')[0];

    if (id === "estate") {
      const dailyKey = "estate_daily_" + today;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 100;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({ 
          error: "今日买房额度已用完，明天再来！",
          dailySold: dailySold,
          maxDaily: maxDaily
        })), {
          status: 429,
          headers: corsHeaders
        });
      }

      const cost = delta;
      let remaining = parseFloat(await kv.get("remaining") || "11300000000");
      let sold = parseFloat(await kv.get("sold") || "50000000");

      if (remaining < cost) {
        return new Response(JSON.stringify(injectStats({ error: "not enough remaining" })), {
          status: 400,
          headers: corsHeaders
        });
      }

      remaining -= cost;
      sold += cost;
      await kv.put("remaining", remaining.toString());
      await kv.put("sold", sold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());
      dailyStats.reads++;
      dailyStats.writes++;

      return new Response(JSON.stringify(injectStats({ 
        ok: true, remaining, sold, blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      })), {
        headers: corsHeaders
      });

    } else if (id === "xifu") {
      const dailyKey = "xifu_daily_" + today;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 10000;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({ 
          error: "今日深铁熙府买房额度已用完，明天再来！",
          dailySold: dailySold,
          maxDaily: maxDaily
        })), {
          status: 429,
          headers: corsHeaders
        });
      }

      const cost = delta;
      let xifuRemaining = parseFloat(await kv.get("xifuRemaining") || "20000");
      let xifuSold = parseFloat(await kv.get("xifuSold") || "0");

      if (xifuRemaining < cost) {
        return new Response(JSON.stringify(injectStats({ error: "not enough xifu remaining" })), {
          status: 400,
          headers: corsHeaders
        });
      }

      xifuRemaining -= cost;
      xifuSold += cost;
      await kv.put("xifuRemaining", xifuRemaining.toString());
      await kv.put("xifuSold", xifuSold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());
      dailyStats.reads++;
      dailyStats.writes++;

      return new Response(JSON.stringify(injectStats({ 
        ok: true, xifuRemaining, xifuSold,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      })), {
        headers: corsHeaders
      });

    } else if (id === "blast") {
      if (delta < 0.01 || delta > 0.5) {
        return new Response(JSON.stringify(injectStats({ 
          error: "单次爆破步长必须在 0.01 ~ 0.05 之间" 
        })), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "blast_daily_" + today;
      const dailyBlast = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 0.5;

      if (dailyBlast + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({ 
          error: "今日爆破额度已用完，明天再来！",
          dailyBlast: dailyBlast,
          maxDaily: maxDaily
        })), {
          status: 429,
          headers: corsHeaders
        });
      }

      let blast = parseFloat(await kv.get("blast") || "0");
      blast = Math.min(blast + delta, 100);
      await kv.put("blast", blast.toString());
      await kv.put(dailyKey, (dailyBlast + delta).toString());
      dailyStats.reads++;
      dailyStats.writes++;

      return new Response(JSON.stringify(injectStats({ 
        ok: true, blast,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      })), {
        headers: corsHeaders
      });

    } else if (id === "bombardier") {
      if (delta < 0.01 || delta > 0.5) {
        return new Response(JSON.stringify(injectStats({ 
          error: "单次翻新步长必须在 0.01 ~ 0.5 之间" 
        })), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "bomb_daily_" + today;
      const dailyBomb = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 0.5;

      if (dailyBomb + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({ 
          error: "今日翻新额度已用完，明天再来！",
          dailyBomb: dailyBomb,
          maxDaily: maxDaily
        })), {
          status: 429,
          headers: corsHeaders
        });
      }

      let bombProgress = parseFloat(await kv.get("bombProgress") || "0");
      bombProgress = Math.min(bombProgress + delta, 100);
      await kv.put("bombProgress", bombProgress.toString());
      await kv.put(dailyKey, (dailyBomb + delta).toString());
      dailyStats.reads++;
      dailyStats.writes++;

      return new Response(JSON.stringify(injectStats({ 
        ok: true, bombProgress,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      })), {
        headers: corsHeaders
      });

    } else if (id === "dogchair") {
      if (delta < 0.01 || delta > 0.5) {
        return new Response(JSON.stringify(injectStats({ 
          error: "单次倒闭步长必须在 0.01 ~ 0.05 之间" 
        })), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "dog_daily_" + today;
      const dailyDog = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 0.5;

      if (dailyDog + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({ 
          error: "今日倒闭额度已用完，明天再来！",
          dailyDog: dailyDog,
          maxDaily: maxDaily
        })), {
          status: 429,
          headers: corsHeaders
        });
      }

      let dogProgress = parseFloat(await kv.get("dogProgress") || "0");
      let dogDecimals = parseInt(await kv.get("dogDecimals") || "2");

      // 拼多多模式：到99.9后每次多加一位小数
      if (dogProgress >= 99.9 && dogProgress < 99.9999999999) {
        dogDecimals++;
      }

      dogProgress = Math.min(dogProgress + delta, 99.9999999999);
      await kv.put("dogProgress", dogProgress.toString());
      await kv.put("dogDecimals", dogDecimals.toString());
      await kv.put(dailyKey, (dailyDog + delta).toString());
      dailyStats.reads++;
      dailyStats.writes++;

      return new Response(JSON.stringify(injectStats({ 
        ok: true, dogProgress, dogDecimals,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0")
      })), {
        headers: corsHeaders
      });

    } else {
      return new Response(JSON.stringify(injectStats({ error: "unknown id" })), {
        status: 400,
        headers: corsHeaders
      });
    }
  } catch (e) {
    return new Response(JSON.stringify(injectStats({ error: e.message })), {
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
