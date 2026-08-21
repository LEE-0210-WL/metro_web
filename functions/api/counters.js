const STATS_KEY = "_kv_stats";
let cachedStats = null;
let writeCounter = 0;
const WRITE_BATCH = 5;

async function loadStats(kv) {
  // 优先使用内存缓存（同一天内有效）
  if (cachedStats) {
    const now = new Date();
    const last = new Date(cachedStats.lastReset);
    if (now.getUTCDate() === last.getUTCDate()) {
      return cachedStats;
    }
  }
  // 缓存失效或不存在，从 KV 读取
  try {
    const data = await kv.get(STATS_KEY);
    if (data) {
      cachedStats = JSON.parse(data);
      return cachedStats;
    }
  } catch (e) {}
  cachedStats = { reads: 0, writes: 0, lastReset: Date.now() };
  return cachedStats;
}

async function saveStats(kv, stats, force = false) {
  cachedStats = stats; // 更新内存
  writeCounter++;
  // 每 WRITE_BATCH 次或强制写入时，才真正写 KV
  if (writeCounter >= WRITE_BATCH || force) {
    await kv.put(STATS_KEY, JSON.stringify(stats));
    writeCounter = 0;
  }
}

function resetIfNeeded(stats) {
  const now = new Date();
  const last = new Date(stats.lastReset);
  if (now.getUTCDate() !== last.getUTCDate()) {
    return { reads: 0, writes: 0, lastReset: Date.now() };
  }
  return stats;
}

function injectStats(obj, stats) {
  obj._kvReads = stats.reads;
  obj._kvWrites = stats.writes;
  obj._readLimit = 100000;
  obj._writeLimit = 1000;
  return obj;
}

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
      return new Response(JSON.stringify(injectStats({ error: "KV not bound" }, { reads: 0, writes: 0 })), {
        status: 500,
        headers: corsHeaders
      });
    }

    let stats = resetIfNeeded(await loadStats(kv));
    const remaining = parseFloat(await kv.get("remaining") || "11300000000");
    const sold = parseFloat(await kv.get("sold") || "50000000");
    const blast = parseFloat(await kv.get("blast") || "0");
    const xifuRemaining = parseFloat(await kv.get("xifuRemaining") || "20000");
    const xifuSold = parseFloat(await kv.get("xifuSold") || "0");
    const bombProgress = parseFloat(await kv.get("bombProgress") || "0");
    const dogProgress = parseFloat(await kv.get("dogProgress") || "0");
    const dogDecimals = parseInt(await kv.get("dogDecimals") || "2");

    stats.reads++;
    await saveStats(kv, stats); // 仅计数，不一定写KV

    return new Response(JSON.stringify(injectStats({
      remaining, sold, blast, xifuRemaining, xifuSold, bombProgress, dogProgress, dogDecimals
    }, stats)), {
      headers: corsHeaders
    });
  } catch (e) {
    return new Response(JSON.stringify(injectStats({ error: e.message }, { reads: 0, writes: 0 })), {
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
      return new Response(JSON.stringify(injectStats({ error: "KV not bound" }, { reads: 0, writes: 0 })), {
        status: 500,
        headers: corsHeaders
      });
    }

    let stats = resetIfNeeded(await loadStats(kv));
    const body = await context.request.json();
    const id = body.id;
    const delta = parseFloat(body.delta);

    if (!id || isNaN(delta)) {
      return new Response(JSON.stringify(injectStats({ error: "invalid params" }, stats)), {
        status: 400,
        headers: corsHeaders
      });
    }

    const today = new Date().toISOString().split('T')[0];

    // ---------------- estate ----------------
    if (id === "estate") {
      const dailyKey = "estate_daily_" + today;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 500;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({
          error: "今日大运TOD买房额度已用完，明天再来！",
          dailySold, maxDaily
        }, stats)), {
          status: 429,
          headers: corsHeaders
        });
      }

      let remaining = parseFloat(await kv.get("remaining") || "11300000000");
      let sold = parseFloat(await kv.get("sold") || "50000000");

      if (remaining < delta) {
        return new Response(JSON.stringify(injectStats({ error: "not enough remaining" }, stats)), {
          status: 400,
          headers: corsHeaders
        });
      }

      remaining -= delta;
      sold += delta;
      await kv.put("remaining", remaining.toString());
      await kv.put("sold", sold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());

      stats.reads++;
      stats.writes++;
      await saveStats(kv, stats);

      return new Response(JSON.stringify(injectStats({
        ok: true, remaining, sold,
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      }, stats)), {
        headers: corsHeaders
      });
    }

    // ---------------- xifu ----------------
    else if (id === "xifu") {
      const dailyKey = "xifu_daily_" + today;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1000;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({
          error: "今日深铁熙府买房额度已用完，明天再来！",
          dailySold, maxDaily
        }, stats)), {
          status: 429,
          headers: corsHeaders
        });
      }

      let xifuRemaining = parseFloat(await kv.get("xifuRemaining") || "20000");
      let xifuSold = parseFloat(await kv.get("xifuSold") || "0");

      if (xifuRemaining < delta) {
        return new Response(JSON.stringify(injectStats({ error: "not enough xifu remaining" }, stats)), {
          status: 400,
          headers: corsHeaders
        });
      }

      xifuRemaining -= delta;
      xifuSold += delta;
      await kv.put("xifuRemaining", xifuRemaining.toString());
      await kv.put("xifuSold", xifuSold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());

      stats.reads++;
      stats.writes++;
      await saveStats(kv, stats);

      return new Response(JSON.stringify(injectStats({
        ok: true, xifuRemaining, xifuSold,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      }, stats)), {
        headers: corsHeaders
      });
    }

    // ---------------- blast ----------------
    else if (id === "blast") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify(injectStats({
          error: "单次爆破步长必须在 0.01 ~ 1.5 之间"
        }, stats)), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "blast_daily_" + today;
      const dailyBlast = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1.5;

      if (dailyBlast + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({
          error: "今日爆破额度已用完，明天再来！",
          dailyBlast, maxDaily
        }, stats)), {
          status: 429,
          headers: corsHeaders
        });
      }

      let blast = parseFloat(await kv.get("blast") || "0");
      blast = Math.min(blast + delta, 100);
      await kv.put("blast", blast.toString());
      await kv.put(dailyKey, (dailyBlast + delta).toString());

      stats.reads++;
      stats.writes++;
      await saveStats(kv, stats);

      return new Response(JSON.stringify(injectStats({
        ok: true, blast,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      }, stats)), {
        headers: corsHeaders
      });
    }

    // ---------------- bombardier ----------------
    else if (id === "bombardier") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify(injectStats({
          error: "单次翻新步长必须在 0.01 ~ 1.5 之间"
        }, stats)), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "bomb_daily_" + today;
      const dailyBomb = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1.5;

      if (dailyBomb + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({
          error: "今日翻新额度已用完，明天再来！",
          dailyBomb, maxDaily
        }, stats)), {
          status: 429,
          headers: corsHeaders
        });
      }

      let bombProgress = parseFloat(await kv.get("bombProgress") || "0");
      bombProgress = Math.min(bombProgress + delta, 100);
      await kv.put("bombProgress", bombProgress.toString());
      await kv.put(dailyKey, (dailyBomb + delta).toString());

      stats.reads++;
      stats.writes++;
      await saveStats(kv, stats);

      return new Response(JSON.stringify(injectStats({
        ok: true, bombProgress,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      }, stats)), {
        headers: corsHeaders
      });
    }

    // ---------------- dogchair ----------------
    else if (id === "dogchair") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify(injectStats({
          error: "单次倒闭步长必须在 0.01 ~ 1.5 之间"
        }, stats)), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "dog_daily_" + today;
      const dailyDog = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1.5;

      if (dailyDog + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({
          error: "今日倒闭额度已用完，明天再来！",
          dailyDog, maxDaily
        }, stats)), {
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

      stats.reads++;
      stats.writes++;
      await saveStats(kv, stats);

      return new Response(JSON.stringify(injectStats({
        ok: true, dogProgress, dogDecimals,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0")
      }, stats)), {
        headers: corsHeaders
      });
    }

    else {
      return new Response(JSON.stringify(injectStats({ error: "unknown id" }, stats)), {
        status: 400,
        headers: corsHeaders
      });
    }
  } catch (e) {
    return new Response(JSON.stringify(injectStats({ error: e.message }, { reads: 0, writes: 0 })), {
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
}const STATS_KEY = "_kv_stats";
let cachedStats = null;
let writeCounter = 0;
const WRITE_BATCH = 5;

async function loadStats(kv) {
  try {
    const data = await kv.get(STATS_KEY);
    if (data) {
      cachedStats = JSON.parse(data);
      return cachedStats;
    }
  } catch (e) {}
  cachedStats = { reads: 0, writes: 0, lastReset: Date.now() };
  return cachedStats;
}

async function saveStats(kv, stats, force = false) {
  cachedStats = stats;
  writeCounter++;
  if (writeCounter >= WRITE_BATCH || force) {
    await kv.put(STATS_KEY, JSON.stringify(stats));
    writeCounter = 0;
  }
}

function resetIfNeeded(stats) {
  const now = new Date();
  const last = new Date(stats.lastReset);
  if (now.getUTCDate() !== last.getUTCDate()) {
    return { reads: 0, writes: 0, lastReset: Date.now() };
  }
  return stats;
}

function injectStats(obj, stats) {
  obj._kvReads = stats.reads;
  obj._kvWrites = stats.writes;
  obj._readLimit = 100000;
  obj._writeLimit = 1000;
  return obj;
}

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
      return new Response(JSON.stringify(injectStats({ error: "KV not bound" }, { reads: 0, writes: 0 })), {
        status: 500,
        headers: corsHeaders
      });
    }

    let stats = resetIfNeeded(await loadStats(kv));
    const remaining = parseFloat(await kv.get("remaining") || "11300000000");
    const sold = parseFloat(await kv.get("sold") || "50000000");
    const blast = parseFloat(await kv.get("blast") || "0");
    const xifuRemaining = parseFloat(await kv.get("xifuRemaining") || "20000");
    const xifuSold = parseFloat(await kv.get("xifuSold") || "0");
    const bombProgress = parseFloat(await kv.get("bombProgress") || "0");
    const dogProgress = parseFloat(await kv.get("dogProgress") || "0");
    const dogDecimals = parseInt(await kv.get("dogDecimals") || "2");

    stats.reads++;
    await saveStats(kv, stats);

    return new Response(JSON.stringify(injectStats({
      remaining, sold, blast, xifuRemaining, xifuSold, bombProgress, dogProgress, dogDecimals
    }, stats)), {
      headers: corsHeaders
    });
  } catch (e) {
    return new Response(JSON.stringify(injectStats({ error: e.message }, { reads: 0, writes: 0 })), {
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
      return new Response(JSON.stringify(injectStats({ error: "KV not bound" }, { reads: 0, writes: 0 })), {
        status: 500,
        headers: corsHeaders
      });
    }

    let stats = resetIfNeeded(await loadStats(kv));
    const body = await context.request.json();
    const id = body.id;
    const delta = parseFloat(body.delta);

    if (!id || isNaN(delta)) {
      return new Response(JSON.stringify(injectStats({ error: "invalid params" }, stats)), {
        status: 400,
        headers: corsHeaders
      });
    }

    const today = new Date().toISOString().split('T')[0];

    // ---------------- estate ----------------
    if (id === "estate") {
      const dailyKey = "estate_daily_" + today;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 500;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({
          error: "今日大运TOD买房额度已用完，明天再来！",
          dailySold, maxDaily
        }, stats)), {
          status: 429,
          headers: corsHeaders
        });
      }

      let remaining = parseFloat(await kv.get("remaining") || "11300000000");
      let sold = parseFloat(await kv.get("sold") || "50000000");

      if (remaining < delta) {
        return new Response(JSON.stringify(injectStats({ error: "not enough remaining" }, stats)), {
          status: 400,
          headers: corsHeaders
        });
      }

      remaining -= delta;
      sold += delta;
      await kv.put("remaining", remaining.toString());
      await kv.put("sold", sold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());

      stats.reads++;
      stats.writes++;
      await saveStats(kv, stats);

      return new Response(JSON.stringify(injectStats({
        ok: true, remaining, sold,
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      }, stats)), {
        headers: corsHeaders
      });
    }

    // ---------------- xifu ----------------
    else if (id === "xifu") {
      const dailyKey = "xifu_daily_" + today;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1000;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({
          error: "今日深铁熙府买房额度已用完，明天再来！",
          dailySold, maxDaily
        }, stats)), {
          status: 429,
          headers: corsHeaders
        });
      }

      let xifuRemaining = parseFloat(await kv.get("xifuRemaining") || "20000");
      let xifuSold = parseFloat(await kv.get("xifuSold") || "0");

      if (xifuRemaining < delta) {
        return new Response(JSON.stringify(injectStats({ error: "not enough xifu remaining" }, stats)), {
          status: 400,
          headers: corsHeaders
        });
      }

      xifuRemaining -= delta;
      xifuSold += delta;
      await kv.put("xifuRemaining", xifuRemaining.toString());
      await kv.put("xifuSold", xifuSold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());

      stats.reads++;
      stats.writes++;
      await saveStats(kv, stats);

      return new Response(JSON.stringify(injectStats({
        ok: true, xifuRemaining, xifuSold,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      }, stats)), {
        headers: corsHeaders
      });
    }

    // ---------------- blast ----------------
    else if (id === "blast") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify(injectStats({
          error: "单次爆破步长必须在 0.01 ~ 1.5 之间"
        }, stats)), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "blast_daily_" + today;
      const dailyBlast = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1.5;

      if (dailyBlast + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({
          error: "今日爆破额度已用完，明天再来！",
          dailyBlast, maxDaily
        }, stats)), {
          status: 429,
          headers: corsHeaders
        });
      }

      let blast = parseFloat(await kv.get("blast") || "0");
      blast = Math.min(blast + delta, 100);
      await kv.put("blast", blast.toString());
      await kv.put(dailyKey, (dailyBlast + delta).toString());

      stats.reads++;
      stats.writes++;
      await saveStats(kv, stats);

      return new Response(JSON.stringify(injectStats({
        ok: true, blast,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      }, stats)), {
        headers: corsHeaders
      });
    }

    // ---------------- bombardier ----------------
    else if (id === "bombardier") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify(injectStats({
          error: "单次翻新步长必须在 0.01 ~ 1.5 之间"
        }, stats)), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "bomb_daily_" + today;
      const dailyBomb = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1.5;

      if (dailyBomb + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({
          error: "今日翻新额度已用完，明天再来！",
          dailyBomb, maxDaily
        }, stats)), {
          status: 429,
          headers: corsHeaders
        });
      }

      let bombProgress = parseFloat(await kv.get("bombProgress") || "0");
      bombProgress = Math.min(bombProgress + delta, 100);
      await kv.put("bombProgress", bombProgress.toString());
      await kv.put(dailyKey, (dailyBomb + delta).toString());

      stats.reads++;
      stats.writes++;
      await saveStats(kv, stats);

      return new Response(JSON.stringify(injectStats({
        ok: true, bombProgress,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2")
      }, stats)), {
        headers: corsHeaders
      });
    }

    // ---------------- dogchair ----------------
    else if (id === "dogchair") {
      if (delta < 0.01 || delta > 1.5) {
        return new Response(JSON.stringify(injectStats({
          error: "单次倒闭步长必须在 0.01 ~ 1.5 之间"
        }, stats)), {
          status: 400,
          headers: corsHeaders
        });
      }

      const dailyKey = "dog_daily_" + today;
      const dailyDog = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 1.5;

      if (dailyDog + delta > maxDaily) {
        return new Response(JSON.stringify(injectStats({
          error: "今日倒闭额度已用完，明天再来！",
          dailyDog, maxDaily
        }, stats)), {
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

      stats.reads++;
      stats.writes++;
      await saveStats(kv, stats);

      return new Response(JSON.stringify(injectStats({
        ok: true, dogProgress, dogDecimals,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0")
      }, stats)), {
        headers: corsHeaders
      });
    }

    else {
      return new Response(JSON.stringify(injectStats({ error: "unknown id" }, stats)), {
        status: 400,
        headers: corsHeaders
      });
    }
  } catch (e) {
    return new Response(JSON.stringify(injectStats({ error: e.message }, { reads: 0, writes: 0 })), {
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
