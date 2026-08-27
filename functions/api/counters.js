// functions/api/counters.js
// 完整版，包含所有商品（楼盘、工程、饮料零食等）

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

    const products = getProductConfig();
    const result = {};
    for (const [id, config] of Object.entries(products)) {
      const remaining = parseFloat(await kv.get(`remaining_${id}`) || config.totalStock.toString());
      const sold = parseFloat(await kv.get(`sold_${id}`) || "0");
      const dailyUsed = parseFloat(await kv.get(`daily_${id}_${today}`) || "0");
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

    // 打卡数据
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

    // 打卡
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

    const products = getProductConfig();
    const config = products[id];
    if (!config) {
      return new Response(JSON.stringify({ error: "unknown product id" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    let remaining = parseFloat(await kv.get(`remaining_${id}`) || config.totalStock.toString());
    let sold = parseFloat(await kv.get(`sold_${id}`) || "0");
    let dailyUsed = parseFloat(await kv.get(`daily_${id}_${today}`) || "0");
    let userDailyUsed = 0;
    const userDailyKey = `daily_${id}_${today}_${userId}`;
    if (config.perUserDailyLimit) {
      userDailyUsed = parseFloat(await kv.get(userDailyKey) || "0");
    }

    // 特殊处理八合里
    if (id === 'bhl') {
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
      if (delta < 1 || delta > 500) {
        return new Response(JSON.stringify({
          error: "每单金额必须在 1 ~ 500 元之间"
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      if (remaining < 1) {
        return new Response(JSON.stringify({ error: "今日八合里已售罄" }), {
          status: 400,
          headers: corsHeaders
        });
      }
      const newRemaining = remaining - 1;
      const newSold = sold + delta;
      const newDailyUsed = dailyUsed + delta;
      const newUserDailyUsed = 1;
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

    // 普通商品
    if (remaining < delta) {
      return new Response(JSON.stringify({
        error: `${config.name}库存不足！当前剩余 ${remaining} ${config.unit}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    if (dailyUsed + delta > config.dailyLimit) {
      return new Response(JSON.stringify({
        error: `今日${config.name}额度已用完（${dailyUsed}/${config.dailyLimit} ${config.unit}），明天再来！`
      }), {
        status: 429,
        headers: corsHeaders
      });
    }
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

function getProductConfig() {
  return {
    // ===== 楼盘（原TOD项目） =====
    estate: {
      id: 'estate',
      name: '深铁阅云境',
      unit: '套',
      dailyLimit: 500,
      totalStock: 11300000000,
      perUserDailyLimit: null,
      category: '楼盘',
      type: 'normal'
    },
    xifu: {
      id: 'xifu',
      name: '深铁熙府',
      unit: '套',
      dailyLimit: 1000,
      totalStock: 20000,
      perUserDailyLimit: null,
      category: '楼盘',
      type: 'normal'
    },
    yunfan: {
      id: 'yunfan',
      name: '云帆·闰悦府',
      unit: '套',
      dailyLimit: 100,
      totalStock: 45000,
      perUserDailyLimit: null,
      category: '楼盘',
      type: 'normal'
    },
    jingyun: {
      id: 'jingyun',
      name: '景云上辰花园',
      unit: '套',
      dailyLimit: 100,
      totalStock: 55000,
      perUserDailyLimit: null,
      category: '楼盘',
      type: 'normal'
    },
    jingcheng: {
      id: 'jingcheng',
      name: '深铁璟城',
      unit: '套',
      dailyLimit: 100,
      totalStock: 35000,
      perUserDailyLimit: null,
      category: '楼盘',
      type: 'normal'
    },
    longjing: {
      id: 'longjing',
      name: '深铁珑境',
      unit: '套',
      dailyLimit: 100,
      totalStock: 25000,
      perUserDailyLimit: null,
      category: '楼盘',
      type: 'normal'
    },
    ruicheng: {
      id: 'ruicheng',
      name: '深铁瑞城',
      unit: '套',
      dailyLimit: 100,
      totalStock: 65000,
      perUserDailyLimit: null,
      category: '楼盘',
      type: 'normal'
    },
    huicheng: {
      id: 'huicheng',
      name: '深铁汇城',
      unit: '套',
      dailyLimit: 100,
      totalStock: 25000,
      perUserDailyLimit: null,
      category: '楼盘',
      type: 'normal'
    },

    // ===== 工程类（爆破、翻新、倒闭） =====
    blast: {
      id: 'blast',
      name: '吵吵吵楼爆破',
      unit: '%',
      dailyLimit: 1.5,
      totalStock: 100,
      perUserDailyLimit: null,
      category: '工程',
      type: 'normal'
    },
    bombardier: {
      id: 'bombardier',
      name: '庞巴迪翻新',
      unit: '%',
      dailyLimit: 1.5,
      totalStock: 100,
      perUserDailyLimit: null,
      category: '工程',
      type: 'normal'
    },
    dogchair: {
      id: 'dogchair',
      name: '狗椅倒闭',
      unit: '%',
      dailyLimit: 1.5,
      totalStock: 99.9999999999,
      perUserDailyLimit: null,
      category: '工程',
      type: 'normal'
    },

    // ===== 饮料零食 =====
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

    // ===== 泡面饮料 =====
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

    // ===== 日用品 =====
    fxyt: {
      id: 'fxyt',
      name: '翻新圆坨坨',
      unit: '辆',
      dailyLimit: 10000,
      totalStock: 10000,
      perUserDailyLimit: 10,
      category: '日用品',
      type: 'normal'
    },
    dycz: {
      id: 'dycz',
      name: '德祐湿厕纸',
      unit: '包',
      dailyLimit: 10000,
      totalStock: 10000,
      perUserDailyLimit: 5,
      category: '日用品',
      type: 'normal'
    },

    // ===== 餐饮 =====
    bhl: {
      id: 'bhl',
      name: '八合里牛肉火锅',
      unit: '单',
      dailyLimit: 999999,
      totalStock: 999999,
      perUserDailyLimit: 1,
      category: '餐饮',
      type: 'bhl'
    },

    // ===== 其他 =====
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

    // ===== 保健 =====
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

    // ===== 交通 =====
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
