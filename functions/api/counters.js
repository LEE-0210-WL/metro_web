// functions/api/counters.js
// 支持每个用户独立的每日额度，用户标识通过 Header X-User-Id 传递
// 新增楼盘：云帆·闰悦府、景云上辰花园、深铁璟城、深铁珑境、深铁瑞城、深铁汇城

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

    // 新增楼盘
    const yunfanRemaining = parseFloat(await kv.get("yunfanRemaining") || "45000");
    const yunfanSold = parseFloat(await kv.get("yunfanSold") || "0");
    const jingyunRemaining = parseFloat(await kv.get("jingyunRemaining") || "55000");
    const jingyunSold = parseFloat(await kv.get("jingyunSold") || "0");
    const jingchengRemaining = parseFloat(await kv.get("jingchengRemaining") || "35000");
    const jingchengSold = parseFloat(await kv.get("jingchengSold") || "0");
    const longjingRemaining = parseFloat(await kv.get("longjingRemaining") || "25000");
    const longjingSold = parseFloat(await kv.get("longjingSold") || "0");
    const ruichengRemaining = parseFloat(await kv.get("ruichengRemaining") || "65000");
    const ruichengSold = parseFloat(await kv.get("ruichengSold") || "0");
    const huichengRemaining = parseFloat(await kv.get("huichengRemaining") || "25000");
    const huichengSold = parseFloat(await kv.get("huichengSold") || "0");

    // 读取各业务的每日已用量（按用户隔离）
    const estateDaily = parseFloat(await kv.get(`estate_daily_${today}_${userId}`) || "0");
    const xifuDaily = parseFloat(await kv.get(`xifu_daily_${today}_${userId}`) || "0");
    const blastDaily = parseFloat(await kv.get(`blast_daily_${today}_${userId}`) || "0");
    const bombDaily = parseFloat(await kv.get(`bomb_daily_${today}_${userId}`) || "0");
    const dogDaily = parseFloat(await kv.get(`dog_daily_${today}_${userId}`) || "0");
    // 新增楼盘每日用量（可选，暂不返回，可后续加）

    return new Response(JSON.stringify({
      remaining, sold, blast, xifuRemaining, xifuSold,
      bombProgress, dogProgress, dogDecimals,
      yunfanRemaining, yunfanSold,
      jingyunRemaining, jingyunSold,
      jingchengRemaining, jingchengSold,
      longjingRemaining, longjingSold,
      ruichengRemaining, ruichengSold,
      huichengRemaining, huichengSold,
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

    // ===== 原有 estate =====
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
        // 新增楼盘也一并返回最新值
        yunfanRemaining: parseFloat(await kv.get("yunfanRemaining") || "45000"),
        yunfanSold: parseFloat(await kv.get("yunfanSold") || "0"),
        jingyunRemaining: parseFloat(await kv.get("jingyunRemaining") || "55000"),
        jingyunSold: parseFloat(await kv.get("jingyunSold") || "0"),
        jingchengRemaining: parseFloat(await kv.get("jingchengRemaining") || "35000"),
        jingchengSold: parseFloat(await kv.get("jingchengSold") || "0"),
        longjingRemaining: parseFloat(await kv.get("longjingRemaining") || "25000"),
        longjingSold: parseFloat(await kv.get("longjingSold") || "0"),
        ruichengRemaining: parseFloat(await kv.get("ruichengRemaining") || "65000"),
        ruichengSold: parseFloat(await kv.get("ruichengSold") || "0"),
        huichengRemaining: parseFloat(await kv.get("huichengRemaining") || "25000"),
        huichengSold: parseFloat(await kv.get("huichengSold") || "0"),
        daily: {
          estate: dailySold + delta,
        }
      }), {
        headers: corsHeaders
      });
    }

    // ===== 原有 xifu =====
    else if (id === "xifu") {
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
        yunfanRemaining: parseFloat(await kv.get("yunfanRemaining") || "45000"),
        yunfanSold: parseFloat(await kv.get("yunfanSold") || "0"),
        jingyunRemaining: parseFloat(await kv.get("jingyunRemaining") || "55000"),
        jingyunSold: parseFloat(await kv.get("jingyunSold") || "0"),
        jingchengRemaining: parseFloat(await kv.get("jingchengRemaining") || "35000"),
        jingchengSold: parseFloat(await kv.get("jingchengSold") || "0"),
        longjingRemaining: parseFloat(await kv.get("longjingRemaining") || "25000"),
        longjingSold: parseFloat(await kv.get("longjingSold") || "0"),
        ruichengRemaining: parseFloat(await kv.get("ruichengRemaining") || "65000"),
        ruichengSold: parseFloat(await kv.get("ruichengSold") || "0"),
        huichengRemaining: parseFloat(await kv.get("huichengRemaining") || "25000"),
        huichengSold: parseFloat(await kv.get("huichengSold") || "0"),
        daily: {
          xifu: dailySold + delta,
        }
      }), {
        headers: corsHeaders
      });
    }

    // ===== 原有 blast =====
    else if (id === "blast") {
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
        yunfanRemaining: parseFloat(await kv.get("yunfanRemaining") || "45000"),
        yunfanSold: parseFloat(await kv.get("yunfanSold") || "0"),
        jingyunRemaining: parseFloat(await kv.get("jingyunRemaining") || "55000"),
        jingyunSold: parseFloat(await kv.get("jingyunSold") || "0"),
        jingchengRemaining: parseFloat(await kv.get("jingchengRemaining") || "35000"),
        jingchengSold: parseFloat(await kv.get("jingchengSold") || "0"),
        longjingRemaining: parseFloat(await kv.get("longjingRemaining") || "25000"),
        longjingSold: parseFloat(await kv.get("longjingSold") || "0"),
        ruichengRemaining: parseFloat(await kv.get("ruichengRemaining") || "65000"),
        ruichengSold: parseFloat(await kv.get("ruichengSold") || "0"),
        huichengRemaining: parseFloat(await kv.get("huichengRemaining") || "25000"),
        huichengSold: parseFloat(await kv.get("huichengSold") || "0"),
        daily: {
          blast: dailyBlast + delta,
        }
      }), {
        headers: corsHeaders
      });
    }

    // ===== 原有 bombardier =====
    else if (id === "bombardier") {
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
        yunfanRemaining: parseFloat(await kv.get("yunfanRemaining") || "45000"),
        yunfanSold: parseFloat(await kv.get("yunfanSold") || "0"),
        jingyunRemaining: parseFloat(await kv.get("jingyunRemaining") || "55000"),
        jingyunSold: parseFloat(await kv.get("jingyunSold") || "0"),
        jingchengRemaining: parseFloat(await kv.get("jingchengRemaining") || "35000"),
        jingchengSold: parseFloat(await kv.get("jingchengSold") || "0"),
        longjingRemaining: parseFloat(await kv.get("longjingRemaining") || "25000"),
        longjingSold: parseFloat(await kv.get("longjingSold") || "0"),
        ruichengRemaining: parseFloat(await kv.get("ruichengRemaining") || "65000"),
        ruichengSold: parseFloat(await kv.get("ruichengSold") || "0"),
        huichengRemaining: parseFloat(await kv.get("huichengRemaining") || "25000"),
        huichengSold: parseFloat(await kv.get("huichengSold") || "0"),
        daily: {
          bomb: dailyBomb + delta,
        }
      }), {
        headers: corsHeaders
      });
    }

    // ===== 原有 dogchair =====
    else if (id === "dogchair") {
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
        yunfanRemaining: parseFloat(await kv.get("yunfanRemaining") || "45000"),
        yunfanSold: parseFloat(await kv.get("yunfanSold") || "0"),
        jingyunRemaining: parseFloat(await kv.get("jingyunRemaining") || "55000"),
        jingyunSold: parseFloat(await kv.get("jingyunSold") || "0"),
        jingchengRemaining: parseFloat(await kv.get("jingchengRemaining") || "35000"),
        jingchengSold: parseFloat(await kv.get("jingchengSold") || "0"),
        longjingRemaining: parseFloat(await kv.get("longjingRemaining") || "25000"),
        longjingSold: parseFloat(await kv.get("longjingSold") || "0"),
        ruichengRemaining: parseFloat(await kv.get("ruichengRemaining") || "65000"),
        ruichengSold: parseFloat(await kv.get("ruichengSold") || "0"),
        huichengRemaining: parseFloat(await kv.get("huichengRemaining") || "25000"),
        huichengSold: parseFloat(await kv.get("huichengSold") || "0"),
        daily: {
          dog: dailyDog + delta,
        }
      }), {
        headers: corsHeaders
      });
    }

    // ===== 新增楼盘：云帆·闰悦府 =====
    else if (id === "yunfan") {
      const dailyKey = `yunfan_daily_${today}_${userId}`;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 100; // 每日限额，可调整

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify({
          error: "今日云帆·闰悦府买房额度已用完，明天再来！",
          dailySold,
          maxDaily
        }), {
          status: 429,
          headers: corsHeaders
        });
      }

      let yunfanRemaining = parseFloat(await kv.get("yunfanRemaining") || "45000");
      let yunfanSold = parseFloat(await kv.get("yunfanSold") || "0");

      if (yunfanRemaining < delta) {
        return new Response(JSON.stringify({ error: "not enough yunfan remaining" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      yunfanRemaining -= delta;
      yunfanSold += delta;
      await kv.put("yunfanRemaining", yunfanRemaining.toString());
      await kv.put("yunfanSold", yunfanSold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());

      return new Response(JSON.stringify({
        ok: true,
        yunfanRemaining,
        yunfanSold,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2"),
        jingyunRemaining: parseFloat(await kv.get("jingyunRemaining") || "55000"),
        jingyunSold: parseFloat(await kv.get("jingyunSold") || "0"),
        jingchengRemaining: parseFloat(await kv.get("jingchengRemaining") || "35000"),
        jingchengSold: parseFloat(await kv.get("jingchengSold") || "0"),
        longjingRemaining: parseFloat(await kv.get("longjingRemaining") || "25000"),
        longjingSold: parseFloat(await kv.get("longjingSold") || "0"),
        ruichengRemaining: parseFloat(await kv.get("ruichengRemaining") || "65000"),
        ruichengSold: parseFloat(await kv.get("ruichengSold") || "0"),
        huichengRemaining: parseFloat(await kv.get("huichengRemaining") || "25000"),
        huichengSold: parseFloat(await kv.get("huichengSold") || "0"),
        daily: {
          yunfan: dailySold + delta,
        }
      }), {
        headers: corsHeaders
      });
    }

    // ===== 新增楼盘：景云上辰花园 =====
    else if (id === "jingyun") {
      const dailyKey = `jingyun_daily_${today}_${userId}`;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 100;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify({
          error: "今日景云上辰花园买房额度已用完，明天再来！",
          dailySold,
          maxDaily
        }), {
          status: 429,
          headers: corsHeaders
        });
      }

      let jingyunRemaining = parseFloat(await kv.get("jingyunRemaining") || "55000");
      let jingyunSold = parseFloat(await kv.get("jingyunSold") || "0");

      if (jingyunRemaining < delta) {
        return new Response(JSON.stringify({ error: "not enough jingyun remaining" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      jingyunRemaining -= delta;
      jingyunSold += delta;
      await kv.put("jingyunRemaining", jingyunRemaining.toString());
      await kv.put("jingyunSold", jingyunSold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());

      return new Response(JSON.stringify({
        ok: true,
        jingyunRemaining,
        jingyunSold,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2"),
        yunfanRemaining: parseFloat(await kv.get("yunfanRemaining") || "45000"),
        yunfanSold: parseFloat(await kv.get("yunfanSold") || "0"),
        jingchengRemaining: parseFloat(await kv.get("jingchengRemaining") || "35000"),
        jingchengSold: parseFloat(await kv.get("jingchengSold") || "0"),
        longjingRemaining: parseFloat(await kv.get("longjingRemaining") || "25000"),
        longjingSold: parseFloat(await kv.get("longjingSold") || "0"),
        ruichengRemaining: parseFloat(await kv.get("ruichengRemaining") || "65000"),
        ruichengSold: parseFloat(await kv.get("ruichengSold") || "0"),
        huichengRemaining: parseFloat(await kv.get("huichengRemaining") || "25000"),
        huichengSold: parseFloat(await kv.get("huichengSold") || "0"),
        daily: {
          jingyun: dailySold + delta,
        }
      }), {
        headers: corsHeaders
      });
    }

    // ===== 新增楼盘：深铁璟城 =====
    else if (id === "jingcheng") {
      const dailyKey = `jingcheng_daily_${today}_${userId}`;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 100;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify({
          error: "今日深铁璟城买房额度已用完，明天再来！",
          dailySold,
          maxDaily
        }), {
          status: 429,
          headers: corsHeaders
        });
      }

      let jingchengRemaining = parseFloat(await kv.get("jingchengRemaining") || "35000");
      let jingchengSold = parseFloat(await kv.get("jingchengSold") || "0");

      if (jingchengRemaining < delta) {
        return new Response(JSON.stringify({ error: "not enough jingcheng remaining" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      jingchengRemaining -= delta;
      jingchengSold += delta;
      await kv.put("jingchengRemaining", jingchengRemaining.toString());
      await kv.put("jingchengSold", jingchengSold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());

      return new Response(JSON.stringify({
        ok: true,
        jingchengRemaining,
        jingchengSold,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2"),
        yunfanRemaining: parseFloat(await kv.get("yunfanRemaining") || "45000"),
        yunfanSold: parseFloat(await kv.get("yunfanSold") || "0"),
        jingyunRemaining: parseFloat(await kv.get("jingyunRemaining") || "55000"),
        jingyunSold: parseFloat(await kv.get("jingyunSold") || "0"),
        longjingRemaining: parseFloat(await kv.get("longjingRemaining") || "25000"),
        longjingSold: parseFloat(await kv.get("longjingSold") || "0"),
        ruichengRemaining: parseFloat(await kv.get("ruichengRemaining") || "65000"),
        ruichengSold: parseFloat(await kv.get("ruichengSold") || "0"),
        huichengRemaining: parseFloat(await kv.get("huichengRemaining") || "25000"),
        huichengSold: parseFloat(await kv.get("huichengSold") || "0"),
        daily: {
          jingcheng: dailySold + delta,
        }
      }), {
        headers: corsHeaders
      });
    }

    // ===== 新增楼盘：深铁珑境 =====
    else if (id === "longjing") {
      const dailyKey = `longjing_daily_${today}_${userId}`;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 100;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify({
          error: "今日深铁珑境买房额度已用完，明天再来！",
          dailySold,
          maxDaily
        }), {
          status: 429,
          headers: corsHeaders
        });
      }

      let longjingRemaining = parseFloat(await kv.get("longjingRemaining") || "25000");
      let longjingSold = parseFloat(await kv.get("longjingSold") || "0");

      if (longjingRemaining < delta) {
        return new Response(JSON.stringify({ error: "not enough longjing remaining" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      longjingRemaining -= delta;
      longjingSold += delta;
      await kv.put("longjingRemaining", longjingRemaining.toString());
      await kv.put("longjingSold", longjingSold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());

      return new Response(JSON.stringify({
        ok: true,
        longjingRemaining,
        longjingSold,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2"),
        yunfanRemaining: parseFloat(await kv.get("yunfanRemaining") || "45000"),
        yunfanSold: parseFloat(await kv.get("yunfanSold") || "0"),
        jingyunRemaining: parseFloat(await kv.get("jingyunRemaining") || "55000"),
        jingyunSold: parseFloat(await kv.get("jingyunSold") || "0"),
        jingchengRemaining: parseFloat(await kv.get("jingchengRemaining") || "35000"),
        jingchengSold: parseFloat(await kv.get("jingchengSold") || "0"),
        ruichengRemaining: parseFloat(await kv.get("ruichengRemaining") || "65000"),
        ruichengSold: parseFloat(await kv.get("ruichengSold") || "0"),
        huichengRemaining: parseFloat(await kv.get("huichengRemaining") || "25000"),
        huichengSold: parseFloat(await kv.get("huichengSold") || "0"),
        daily: {
          longjing: dailySold + delta,
        }
      }), {
        headers: corsHeaders
      });
    }

    // ===== 新增楼盘：深铁瑞城 =====
    else if (id === "ruicheng") {
      const dailyKey = `ruicheng_daily_${today}_${userId}`;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 100;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify({
          error: "今日深铁瑞城买房额度已用完，明天再来！",
          dailySold,
          maxDaily
        }), {
          status: 429,
          headers: corsHeaders
        });
      }

      let ruichengRemaining = parseFloat(await kv.get("ruichengRemaining") || "65000");
      let ruichengSold = parseFloat(await kv.get("ruichengSold") || "0");

      if (ruichengRemaining < delta) {
        return new Response(JSON.stringify({ error: "not enough ruicheng remaining" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      ruichengRemaining -= delta;
      ruichengSold += delta;
      await kv.put("ruichengRemaining", ruichengRemaining.toString());
      await kv.put("ruichengSold", ruichengSold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());

      return new Response(JSON.stringify({
        ok: true,
        ruichengRemaining,
        ruichengSold,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2"),
        yunfanRemaining: parseFloat(await kv.get("yunfanRemaining") || "45000"),
        yunfanSold: parseFloat(await kv.get("yunfanSold") || "0"),
        jingyunRemaining: parseFloat(await kv.get("jingyunRemaining") || "55000"),
        jingyunSold: parseFloat(await kv.get("jingyunSold") || "0"),
        jingchengRemaining: parseFloat(await kv.get("jingchengRemaining") || "35000"),
        jingchengSold: parseFloat(await kv.get("jingchengSold") || "0"),
        longjingRemaining: parseFloat(await kv.get("longjingRemaining") || "25000"),
        longjingSold: parseFloat(await kv.get("longjingSold") || "0"),
        huichengRemaining: parseFloat(await kv.get("huichengRemaining") || "25000"),
        huichengSold: parseFloat(await kv.get("huichengSold") || "0"),
        daily: {
          ruicheng: dailySold + delta,
        }
      }), {
        headers: corsHeaders
      });
    }

    // ===== 新增楼盘：深铁汇城 =====
    else if (id === "huicheng") {
      const dailyKey = `huicheng_daily_${today}_${userId}`;
      const dailySold = parseFloat(await kv.get(dailyKey) || "0");
      const maxDaily = 100;

      if (dailySold + delta > maxDaily) {
        return new Response(JSON.stringify({
          error: "今日深铁汇城买房额度已用完，明天再来！",
          dailySold,
          maxDaily
        }), {
          status: 429,
          headers: corsHeaders
        });
      }

      let huichengRemaining = parseFloat(await kv.get("huichengRemaining") || "25000");
      let huichengSold = parseFloat(await kv.get("huichengSold") || "0");

      if (huichengRemaining < delta) {
        return new Response(JSON.stringify({ error: "not enough huicheng remaining" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      huichengRemaining -= delta;
      huichengSold += delta;
      await kv.put("huichengRemaining", huichengRemaining.toString());
      await kv.put("huichengSold", huichengSold.toString());
      await kv.put(dailyKey, (dailySold + delta).toString());

      return new Response(JSON.stringify({
        ok: true,
        huichengRemaining,
        huichengSold,
        remaining: parseFloat(await kv.get("remaining") || "11300000000"),
        sold: parseFloat(await kv.get("sold") || "50000000"),
        blast: parseFloat(await kv.get("blast") || "0"),
        xifuRemaining: parseFloat(await kv.get("xifuRemaining") || "20000"),
        xifuSold: parseFloat(await kv.get("xifuSold") || "0"),
        bombProgress: parseFloat(await kv.get("bombProgress") || "0"),
        dogProgress: parseFloat(await kv.get("dogProgress") || "0"),
        dogDecimals: parseInt(await kv.get("dogDecimals") || "2"),
        yunfanRemaining: parseFloat(await kv.get("yunfanRemaining") || "45000"),
        yunfanSold: parseFloat(await kv.get("yunfanSold") || "0"),
        jingyunRemaining: parseFloat(await kv.get("jingyunRemaining") || "55000"),
        jingyunSold: parseFloat(await kv.get("jingyunSold") || "0"),
        jingchengRemaining: parseFloat(await kv.get("jingchengRemaining") || "35000"),
        jingchengSold: parseFloat(await kv.get("jingchengSold") || "0"),
        longjingRemaining: parseFloat(await kv.get("longjingRemaining") || "25000"),
        longjingSold: parseFloat(await kv.get("longjingSold") || "0"),
        ruichengRemaining: parseFloat(await kv.get("ruichengRemaining") || "65000"),
        ruichengSold: parseFloat(await kv.get("ruichengSold") || "0"),
        daily: {
          huicheng: dailySold + delta,
        }
      }), {
        headers: corsHeaders
      });
    }

    else {
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
