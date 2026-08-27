// functions/api/counters.js
// 支持所有商品类型：普通商品（日总量）、限量商品（每用户日限+总库存）、餐饮（八合里特殊）、打卡

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

    const userId = context.request.headers.get('X-User-Id') || 'anonymous';
    const today = new Date().toISOString().split('T')[0];

    // ---------- 商品配置 ----------
    const products = getProductConfig();

    // 读取所有商品数据
    const result = {};
    for (const [id, config] of Object.entries(products)) {
      const remaining = parseFloat(await kv.get(`remaining_${id}`) || config.totalStock.toString());
      const sold = parseFloat(await kv.get(`sold_${id}`) || "0");
      const dailyUsed = parseFloat(await kv.get(`daily_${id}_${today}`) || "0");
      // 如果有限量（每用户每日限额），读取用户当天的使用量
      let userDailyUsed = 0;
      if (config.perUserDailyLimit) {
        userDailyUsed = parseFloat(await kv.get(`daily_${id}_${today}_${userId}`) || "0");
      }
      result[id] = {
        remaining,
        sold,
        dailyUsed,
        userDailyUsed,
        dailyLimit: config.dailyLimit,
        perUserDailyLimit: config.perUserDailyLimit || null,
        totalStock: config.totalStock,
        unit: config.unit,
        name: config.name,
        category: config.category,
        type: config.type || 'normal'
      };
    }

    // 读取打卡数据
    const checkinKey = `checkin_atsgs_${userId}`;
    const checkinStatus = parseInt(await kv.get(checkinKey) || "0");

    return new Response(JSON.stringify({
      products: result,
      checkin: {
        id: 'atsgs',
        name: '安托山公厕',
        status: checkinStatus,
        target: 1,
        unit: '次'
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

    if (!id || isNaN(delta) || delta <= 0) {
      return new Response(JSON.stringify({ error: "invalid params" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const userId = context.request.headers.get('X-User-Id') || 'anonymous';
    const today = new Date().toISOString().split('T')[0];

    // ---------- 处理打卡 ----------
    if (id === 'atsgs') {
      const checkinKey = `checkin_atsgs_${userId}`;
      const current = parseInt(await kv.get(checkinKey) || "0");
      if (current >= 1) {
        return new Response(JSON.stringify({
          error: "你今天已经打过卡了！明天再来吧",
          checkin: { status: 1, target: 1 }
        }), {
          status: 429,
          headers: corsHeaders
        });
      }
      await kv.put(checkinKey, "1");
      return new Response(JSON.stringify({
        ok: true,
        checkin: { status: 1, target: 1 },
        message: "打卡成功！✅ 安托山公厕今日已打卡"
      }), {
        headers: corsHeaders
      });
    }

    // ---------- 商品配置 ----------
    const products = getProductConfig();
    const config = products[id];
    if (!config) {
      return new Response(JSON.stringify({ error: "unknown product id" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // ---------- 读取当前状态 ----------
    let remaining = parseFloat(await kv.get(`remaining_${id}`) || config.totalStock.toString());
    let sold = parseFloat(await kv.get(`sold_${id}`) || "0");
    let dailyUsed = parseFloat(await kv.get(`daily_${id}_${today}`) || "0");

    // 每用户每日限制
    let userDailyUsed = 0;
    const userDailyKey = `daily_${id}_${today}_${userId}`;
    if (config.perUserDailyLimit) {
      userDailyUsed = parseFloat(await kv.get(userDailyKey) || "0");
    }

    // ---------- 特殊处理：八合里牛肉火锅 ----------
    if (id === 'bhl') {
      // 每用户每天只能下一单
      if (userDailyUsed >= 1) {
        return new Response(JSON.stringify({
          error: "你今天已经在八合里下过单了！明天再来吧",
          dailyUsed: userDailyUsed,
          dailyLimit: 1
        }), {
          status: 429,
          headers: corsHeaders
        });
      }
      // 每单金额 1~500 元
      if (delta < 1 || delta > 500) {
        return new Response(JSON.stringify({
          error: "每单金额必须在 1 ~ 500 元之间"
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      // 总库存用大数表示（不限量，但为了统一结构，设一个很大的数）
      if (remaining < 1) {
        return new Response(JSON.stringify({ error: "今日八合里已售罄" }), {
          status: 400,
          headers: corsHeaders
        });
      }
      // 执行购买
      const newRemaining = remaining - 1; // 每单消耗1库存
      const newSold = sold + delta; // 销售额累加金额
      const newDailyUsed = dailyUsed + delta; // 每日总收入累加金额
      const newUserDailyUsed = 1; // 用户当天已下单
      await kv.put(`remaining_${id}`, newRemaining.toString());
      await kv.put(`sold_${id}`, newSold.toString());
      await kv.put(`daily_${id}_${today}`, newDailyUsed.toString());
      await kv.put(userDailyKey, newUserDailyUsed.toString());

      return new Response(JSON.stringify({
        ok: true,
        id: id,
        remaining: newRemaining,
        sold: newSold,
        dailyUsed: newDailyUsed,
        userDailyUsed: newUserDailyUsed,
        amount: delta,
        unit: config.unit,
        name: config.name
      }), {
        headers: corsHeaders
      });
    }

    // ---------- 普通商品处理 ----------
    // 检查总库存
    if (remaining < delta) {
      return new Response(JSON.stringify({
        error: `${config.name}库存不足！当前剩余 ${remaining} ${config.unit}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 检查每日总量限制（全局）
    if (dailyUsed + delta > config.dailyLimit) {
      return new Response(JSON.stringify({
        error: `今日${config.name}额度已用完（${dailyUsed}/${config.dailyLimit} ${config.unit}），明天再来！`
      }), {
        status: 429,
        headers: corsHeaders
      });
    }

    // 检查每用户每日限制
    if (config.perUserDailyLimit) {
      if (userDailyUsed + delta > config.perUserDailyLimit) {
        return new Response(JSON.stringify({
          error: `你今天已买 ${userDailyUsed} ${config.unit}，每人每天限 ${config.perUserDailyLimit} ${config.unit}`
        }), {
          status: 429,
          headers: corsHeaders
        });
      }
    }

    // 执行购买
    const newRemaining = remaining - delta;
    const newSold = sold + delta;
    const newDailyUsed = dailyUsed + delta;
    const newUserDailyUsed = userDailyUsed + delta;

    await kv.put(`remaining_${id}`, newRemaining.toString());
    await kv.put(`sold_${id}`, newSold.toString());
    await kv.put(`daily_${id}_${today}`, newDailyUsed.toString());
    if (config.perUserDailyLimit) {
      await kv.put(userDailyKey, newUserDailyUsed.toString());
    }

    return new Response(JSON.stringify({
      ok: true,
      id: id,
      remaining: newRemaining,
      sold: newSold,
      dailyUsed: newDailyUsed,
      userDailyUsed: newUserDailyUsed,
      dailyLimit: config.dailyLimit,
      perUserDailyLimit: config.perUserDailyLimit || null,
      unit: config.unit,
      name: config.name
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
      "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
      "Access-Control-Max-Age": "86400"
    }
  });
}

// ---------- 商品配置 ----------
function getProductConfig() {
  return {
    // ===== 饮料零食（日总量 100000，无用户限制） =====
    mlwz: {
      id: 'mlwz',
      name: '麻辣王子',
      unit: '包',
      dailyLimit: 100000,
      totalStock: 100000,
      perUserDailyLimit: null,
      category: '饮料零食',
      type: 'normal'
    },
    bsl: {
      id: 'bsl',
      name: '补水啦',
      unit: '瓶',
      dailyLimit: 100000,
      totalStock: 100000,
      perUserDailyLimit: null,
      category: '饮料零食',
      type: 'normal'
    },
    wlj: {
      id: 'wlj',
      name: '王老吉',
      unit: '瓶',
      dailyLimit: 100000,
      totalStock: 100000,
      perUserDailyLimit: null,
      category: '饮料零食',
      type: 'normal'
    },
    wxr: {
      id: 'wxr',
      name: '外星人电解质水',
      unit: '瓶',
      dailyLimit: 100000,
      totalStock: 100000,
      perUserDailyLimit: null,
      category: '饮料零食',
      type: 'normal'
    },
    ydlm: {
      id: 'ydlm',
      name: '营多捞面',
      unit: '包',
      dailyLimit: 100000,
      totalStock: 100000,
      perUserDailyLimit: null,
      category: '泡面饮料',
      type: 'normal'
    },
    ksfpm: {
      id: 'ksfpm',
      name: '康师傅泡面',
      unit: '桶',
      dailyLimit: 100000,
      totalStock: 100000,
      perUserDailyLimit: null,
      category: '泡面饮料',
      type: 'normal'
    },
    bxpm: {
      id: 'bxpm',
      name: '白象泡面',
      unit: '桶',
      dailyLimit: 100000,
      totalStock: 100000,
      perUserDailyLimit: null,
      category: '泡面饮料',
      type: 'normal'
    },
    bhc: {
      id: 'bhc',
      name: '冰红茶',
      unit: '瓶',
      dailyLimit: 100000,
      totalStock: 100000,
      perUserDailyLimit: null,
      category: '泡面饮料',
      type: 'normal'
    },
    jl: {
      id: 'jl',
      name: '劲凉',
      unit: '桶',
      dailyLimit: 100000,
      totalStock: 100000,
      perUserDailyLimit: null,
      category: '泡面饮料',
      type: 'normal'
    },

    // ===== 日用品（用户每日限量 + 总库存） =====
    fxyt: {
      id: 'fxyt',
      name: '翻新圆坨坨',
      unit: '辆',
      dailyLimit: 10000, // 全局日总量
      totalStock: 10000,
      perUserDailyLimit: 10, // 每人每天限 10 辆
      category: '日用品',
      type: 'limited'
    },
    dycz: {
      id: 'dycz',
      name: '德祐湿厕纸',
      unit: '包',
      dailyLimit: 10000,
      totalStock: 10000,
      perUserDailyLimit: 5,
      category: '日用品',
      type: 'limited'
    },

    // ===== 餐饮（特殊：八合里） =====
    bhl: {
      id: 'bhl',
      name: '八合里牛肉火锅',
      unit: '单',
      dailyLimit: 999999, // 每日总单数无硬性限制
      totalStock: 999999, // 总库存用大数表示
      perUserDailyLimit: 1, // 每人每天限 1 单
      category: '餐饮',
      type: 'bhl'
    },

    // ===== 其他类（每日限额 1000，总库存 50000，用户无额外限制） =====
    hdlw: {
      id: 'hdlw',
      name: '恒大烂尾楼公园',
      unit: '个',
      dailyLimit: 1000,
      totalStock: 50000,
      perUserDailyLimit: null,
      category: '其他',
      type: 'normal'
    },
    glfe: {
      id: 'glfe',
      name: '格伦菲尔口腔',
      unit: '个',
      dailyLimit: 1000,
      totalStock: 50000,
      perUserDailyLimit: null,
      category: '其他',
      type: 'normal'
    },
    ypzp: {
      id: 'ypzp',
      name: '鱼泡招聘',
      unit: '个',
      dailyLimit: 1000,
      totalStock: 50000,
      perUserDailyLimit: null,
      category: '其他',
      type: 'normal'
    },
    yjbat: {
      id: 'yjbat',
      name: '益节补氨糖',
      unit: '个',
      dailyLimit: 1000,
      totalStock: 50000,
      perUserDailyLimit: null,
      category: '保健',
      type: 'normal'
    },
    '555c': {
      id: '555c',
      name: '停靠纱织北站的555车',
      unit: '个',
      dailyLimit: 1000,
      totalStock: 50000,
      perUserDailyLimit: null,
      category: '交通',
      type: 'normal'
    }
  };
}
