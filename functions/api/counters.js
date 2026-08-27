// functions/api/counters.js
// 修复版：兼容旧数据 + 自动清理 + 手动清理接口

// ========== 旧数据键名映射表 ==========
const LEGACY_KEY_MAP = {
  "remaining": ["estate", "remaining"],
  "sold":      ["estate", "sold"],
  "xifuRemaining": ["xifu", "remaining"],
  "xifuSold":      ["xifu", "sold"],
  "yunfanRemaining": ["yunfan", "remaining"],
  "yunfanSold":      ["yunfan", "sold"],
  "jingyunRemaining": ["jingyun", "remaining"],
  "jingyunSold":      ["jingyun", "sold"],
  "jingchengRemaining": ["jingcheng", "remaining"],
  "jingchengSold":      ["jingcheng", "sold"],
  "longjingRemaining": ["longjing", "remaining"],
  "longjingSold":      ["longjing", "sold"],
  "ruichengRemaining": ["ruicheng", "remaining"],
  "ruichengSold":      ["ruicheng", "sold"],
  "huichengRemaining": ["huicheng", "remaining"],
  "huichengSold":      ["huicheng", "sold"],
  "blast":       ["blast", "remaining"],
  "bombProgress": ["bombardier", "remaining"],
  "dogProgress":  ["dogchair", "remaining"],
  "dogDecimals":  ["dogchair", "decimals"],
};

function newKey(productId, field) {
  if (field === "remaining") return `remaining_${productId}`;
  if (field === "sold") return `sold_${productId}`;
  if (field === "decimals") return `decimals_${productId}`;
  return `${field}_${productId}`;
}

async function compatGet(kv, productId, field, defaultValue) {
  const newK = newKey(productId, field);
  let val = await kv.get(newK);
  if (val !== null) return val;
  for (const [legacyKey, [pid, f]] of Object.entries(LEGACY_KEY_MAP)) {
    if (pid === productId && f === field) {
      val = await kv.get(legacyKey);
      if (val !== null) {
        kv.put(newK, val).catch(() => {});
        return val;
      }
    }
  }
  return defaultValue !== undefined ? String(defaultValue) : null;
}

async function compatPut(kv, productId, field, value) {
  await kv.put(newKey(productId, field), String(value));
}

let cleanedDate = null;
async function cleanupExpiredDaily(kv) {
  const today = new Date().toISOString().split('T')[0];
  if (cleanedDate === today) return;
  cleanedDate = today;
  try {
    const list = await kv.list({ prefix: "daily_" });
    const keysToDelete = [];
    for (const key of list.keys) {
      const parts = key.name.split('_');
      for (let i = 0; i < parts.length; i++) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(parts[i])) {
          if (parts[i] < today) {
            keysToDelete.push(key.name);
          }
          break;
        }
      }
    }
    const toDelete = keysToDelete.slice(0, 50);
    for (const k of toDelete) {
      await kv.delete(k);
    }
    if (keysToDelete.length > 50) {
      console.warn(`[cleanup] 还有 ${keysToDelete.length - 50} 个过期键待清理，下次请求继续`);
    }
  } catch (e) {
    console.error("[cleanup] 清理过期 daily KV 失败:", e);
  }
}

function corsHeaders(contentType = "application/json") {
  return {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
    "Access-Control-Max-Age": "86400"
  };
}

// ========== GET 处理器 ==========
export async function onRequestGet(context) {
  try {
    const kv = context.env.COUNTER_KV || globalThis.COUNTER_KV;
    if (!kv) {
      return new Response(JSON.stringify({ error: "KV not bound" }), {
        status: 500, headers: corsHeaders()
      });
    }
    await cleanupExpiredDaily(kv);

    const userId = context.request.headers.get('X-User-Id') || 'anonymous';
    const today = new Date().toISOString().split('T')[0];

    const products = getProductConfig();
    const result = {};

    for (const [id, config] of Object.entries(products)) {
      const remaining = parseFloat(await compatGet(kv, id, "remaining", config.totalStock) || config.totalStock);
      const sold = parseFloat(await compatGet(kv, id, "sold", 0) || "0");
      const dailyUsed = parseFloat(await kv.get(`daily_${id}_${today}`) || "0");
      let userDailyUsed = 0;
      if (config.perUserDailyLimit) {
        userDailyUsed = parseFloat(await kv.get(`daily_${id}_${today}_${userId}`) || "0");
      }
      let decimals = null;
      if (config.category === '工程') {
        decimals = parseInt(await compatGet(kv, id, "decimals", 0) || "0");
      }

      result[id] = {
        remaining, sold, dailyUsed, userDailyUsed,
        dailyLimit: config.dailyLimit,
        perUserDailyLimit: config.perUserDailyLimit || null,
        totalStock: config.totalStock,
        unit: config.unit,
        name: config.name,
        category: config.category,
        type: config.type || 'normal',
        decimals
      };
    }

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
    }), { headers: corsHeaders() });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: corsHeaders()
    });
  }
}

// ========== POST 处理器 ==========
export async function onRequestPost(context) {
  try {
    const kv = context.env.COUNTER_KV || globalThis.COUNTER_KV;
    if (!kv) {
      return new Response(JSON.stringify({ error: "KV not bound" }), {
        status: 500, headers: corsHeaders()
      });
    }
    await cleanupExpiredDaily(kv);

    const body = await context.request.json();
    const id = body.id;
    const delta = parseFloat(body.delta);

    if (!id || isNaN(delta) || delta <= 0) {
      return new Response(JSON.stringify({ error: "invalid params" }), {
        status: 400, headers: corsHeaders()
      });
    }

    const userId = context.request.headers.get('X-User-Id') || 'anonymous';
    const today = new Date().toISOString().split('T')[0];

    // ========== 打卡 ==========
    if (id === 'atsgs') {
      const checkinKey = `checkin_atsgs_${userId}`;
      const current = parseInt(await kv.get(checkinKey) || "0");
      if (current >= 1) {
        return new Response(JSON.stringify({
          error: "你今天已经打过卡了！明天再来吧",
          checkin: { status: 1, target: 1 }
        }), { status: 429, headers: corsHeaders() });
      }
      await kv.put(checkinKey, "1");
      return new Response(JSON.stringify({
        ok: true,
        checkin: { status: 1, target: 1 },
        message: "打卡成功！✅ 安托山公厕今日已打卡"
      }), { headers: corsHeaders() });
    }

    // ========== 手动清理旧 daily KV（管理接口） ==========
    if (id === '__cleanup_daily__') {
      const targetDate = body.date; // 格式: 2026-08-25
      if (!targetDate || !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
        return new Response(JSON.stringify({ error: "请提供 date 参数，格式 YYYY-MM-DD" }), {
          status: 400, headers: corsHeaders()
        });
      }
      try {
        const list = await kv.list({ prefix: "daily_" });
        let deleted = 0;
        let matched = 0;
        for (const key of list.keys) {
          if (key.name.includes(targetDate)) {
            matched++;
            await kv.delete(key.name);
            deleted++;
            if (deleted >= 100) break; // 单次最多删100个
          }
        }
        return new Response(JSON.stringify({
          ok: true,
          message: `已清理 ${deleted} 个 ${targetDate} 的 daily 键（共匹配 ${matched} 个）`,
          deleted, matched, date: targetDate
        }), { headers: corsHeaders() });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500, headers: corsHeaders()
        });
      }
    }

    const products = getProductConfig();
    const config = products[id];
    if (!config) {
      return new Response(JSON.stringify({ error: "unknown product id" }), {
        status: 400, headers: corsHeaders()
      });
    }

    let remaining = parseFloat(await compatGet(kv, id, "remaining", config.totalStock) || config.totalStock);
    let sold = parseFloat(await compatGet(kv, id, "sold", 0) || "0");
    let dailyUsed = parseFloat(await kv.get(`daily_${id}_${today}`) || "0");
    let userDailyUsed = 0;
    const userDailyKey = `daily_${id}_${today}_${userId}`;
    if (config.perUserDailyLimit) {
      userDailyUsed = parseFloat(await kv.get(userDailyKey) || "0");
    }

    // ========== 八合里 ==========
    if (id === 'bhl') {
      if (userDailyUsed >= 1) {
        return new Response(JSON.stringify({
          error: "你今天已经在八合里下过单了！明天再来吧",
          dailyUsed: userDailyUsed,
          dailyLimit: 1
        }), { status: 429, headers: corsHeaders() });
      }
      if (delta < 1 || delta > 500) {
        return new Response(JSON.stringify({
          error: "每单金额必须在 1 ~ 500 元之间"
        }), { status: 400, headers: corsHeaders() });
      }
      if (remaining < 1) {
        return new Response(JSON.stringify({ error: "今日八合里已售罄" }), {
          status: 400, headers: corsHeaders()
        });
      }
      const newRemaining = remaining - 1;
      const newSold = sold + delta;
      const newDailyUsed = dailyUsed + delta;
      const newUserDailyUsed = 1;
      await compatPut(kv, id, "remaining", newRemaining);
      await compatPut(kv, id, "sold", newSold);
      await kv.put(`daily_${id}_${today}`, newDailyUsed.toString());
      await kv.put(userDailyKey, newUserDailyUsed.toString());

      return new Response(JSON.stringify({
        ok: true, id, remaining: newRemaining, sold: newSold,
        dailyUsed: newDailyUsed, userDailyUsed: newUserDailyUsed,
        amount: delta, unit: config.unit, name: config.name
      }), { headers: corsHeaders() });
    }

    // ========== 普通商品 ==========
    if (remaining < delta) {
      return new Response(JSON.stringify({
        error: `${config.name}库存不足！当前剩余 ${remaining.toFixed(config.decimals || 0)} ${config.unit}`
      }), { status: 400, headers: corsHeaders() });
    }
    if (dailyUsed + delta > config.dailyLimit) {
      return new Response(JSON.stringify({
        error: `今日${config.name}额度已用完（${dailyUsed.toFixed(config.decimals || 0)}/${config.dailyLimit} ${config.unit}），明天再来！`
      }), { status: 429, headers: corsHeaders() });
    }
    if (config.perUserDailyLimit) {
      if (userDailyUsed + delta > config.perUserDailyLimit) {
        return new Response(JSON.stringify({
          error: `你今天已买 ${userDailyUsed} ${config.unit}，每人每天限 ${config.perUserDailyLimit} ${config.unit}`
        }), { status: 429, headers: corsHeaders() });
      }
    }

    const newRemaining = remaining - delta;
    const newSold = sold + delta;
    const newDailyUsed = dailyUsed + delta;
    const newUserDailyUsed = userDailyUsed + delta;

    await compatPut(kv, id, "remaining", newRemaining);
    await compatPut(kv, id, "sold", newSold);
    await kv.put(`daily_${id}_${today}`, newDailyUsed.toString());
    if (config.perUserDailyLimit) {
      await kv.put(userDailyKey, newUserDailyUsed.toString());
    }

    return new Response(JSON.stringify({
      ok: true, id, remaining: newRemaining, sold: newSold,
      dailyUsed: newDailyUsed, userDailyUsed: newUserDailyUsed,
      dailyLimit: config.dailyLimit,
      perUserDailyLimit: config.perUserDailyLimit || null,
      unit: config.unit, name: config.name
    }), { headers: corsHeaders() });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: corsHeaders()
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function getProductConfig() {
  return {
    estate: {
      id: 'estate', name: '深铁阅云境', unit: '套',
      dailyLimit: 500, totalStock: 11300000000,
      perUserDailyLimit: null, category: '楼盘', type: 'normal'
    },
    xifu: {
      id: 'xifu', name: '深铁熙府', unit: '套',
      dailyLimit: 1000, totalStock: 20000,
      perUserDailyLimit: null, category: '楼盘', type: 'normal'
    },
    yunfan: {
      id: 'yunfan', name: '云帆·闰悦府', unit: '套',
      dailyLimit: 100, totalStock: 45000,
      perUserDailyLimit: null, category: '楼盘', type: 'normal'
    },
    jingyun: {
      id: 'jingyun', name: '景云上辰花园', unit: '套',
      dailyLimit: 100, totalStock: 55000,
      perUserDailyLimit: null, category: '楼盘', type: 'normal'
    },
    jingcheng: {
      id: 'jingcheng', name: '深铁璟城', unit: '套',
      dailyLimit: 100, totalStock: 35000,
      perUserDailyLimit: null, category: '楼盘', type: 'normal'
    },
    longjing: {
      id: 'longjing', name: '深铁珑境', unit: '套',
      dailyLimit: 100, totalStock: 25000,
      perUserDailyLimit: null, category: '楼盘', type: 'normal'
    },
    ruicheng: {
      id: 'ruicheng', name: '深铁瑞城', unit: '套',
      dailyLimit: 100, totalStock: 65000,
      perUserDailyLimit: null, category: '楼盘', type: 'normal'
    },
    huicheng: {
      id: 'huicheng', name: '深铁汇城', unit: '套',
      dailyLimit: 100, totalStock: 25000,
      perUserDailyLimit: null, category: '楼盘', type: 'normal'
    },
    blast: {
      id: 'blast', name: '吵吵吵楼爆破', unit: '%',
      dailyLimit: 1.5, totalStock: 100,
      perUserDailyLimit: null, category: '工程', type: 'normal',
      decimals: 1, step: 0.1
    },
    bombardier: {
      id: 'bombardier', name: '庞巴迪翻新', unit: '%',
      dailyLimit: 1.5, totalStock: 100,
      perUserDailyLimit: null, category: '工程', type: 'normal',
      decimals: 1, step: 0.1
    },
    dogchair: {
      id: 'dogchair', name: '狗椅倒闭', unit: '%',
      dailyLimit: 1.5, totalStock: 99.9999999999,
      perUserDailyLimit: null, category: '工程', type: 'normal',
      decimals: 2, step: 0.01
    },
    mlwz: {
      id: 'mlwz', name: '麻辣王子', unit: '包',
      dailyLimit: 100000, totalStock: 100000,
      perUserDailyLimit: null, category: '饮料零食', type: 'normal'
    },
    bsl: {
      id: 'bsl', name: '补水啦', unit: '瓶',
      dailyLimit: 100000, totalStock: 100000,
      perUserDailyLimit: null, category: '饮料零食', type: 'normal'
    },
    wlj: {
      id: 'wlj', name: '王老吉', unit: '瓶',
      dailyLimit: 100000, totalStock: 100000,
      perUserDailyLimit: null, category: '饮料零食', type: 'normal'
    },
    wxr: {
      id: 'wxr', name: '外星人电解质水', unit: '瓶',
      dailyLimit: 100000, totalStock: 100000,
      perUserDailyLimit: null, category: '饮料零食', type: 'normal'
    },
    ydlm: {
      id: 'ydlm', name: '营多捞面', unit: '包',
      dailyLimit: 100000, totalStock: 100000,
      perUserDailyLimit: null, category: '泡面饮料', type: 'normal'
    },
    ksfpm: {
      id: 'ksfpm', name: '康师傅泡面', unit: '桶',
      dailyLimit: 100000, totalStock: 100000,
      perUserDailyLimit: null, category: '泡面饮料', type: 'normal'
    },
    bxpm: {
      id: 'bxpm', name: '白象泡面', unit: '桶',
      dailyLimit: 100000, totalStock: 100000,
      perUserDailyLimit: null, category: '泡面饮料', type: 'normal'
    },
    bhc: {
      id: 'bhc', name: '冰红茶', unit: '瓶',
      dailyLimit: 100000, totalStock: 100000,
      perUserDailyLimit: null, category: '泡面饮料', type: 'normal'
    },
    jl: {
      id: 'jl', name: '劲凉', unit: '桶',
      dailyLimit: 100000, totalStock: 100000,
      perUserDailyLimit: null, category: '泡面饮料', type: 'normal'
    },
    fxyt: {
      id: 'fxyt', name: '翻新圆坨坨', unit: '辆',
      dailyLimit: 10000, totalStock: 10000,
      perUserDailyLimit: 10, category: '日用品', type: 'normal'
    },
    dycz: {
      id: 'dycz', name: '德祐湿厕纸', unit: '包',
      dailyLimit: 10000, totalStock: 10000,
      perUserDailyLimit: 5, category: '日用品', type: 'normal'
    },
    bhl: {
      id: 'bhl', name: '八合里牛肉火锅', unit: '单',
      dailyLimit: 999999, totalStock: 999999,
      perUserDailyLimit: 1, category: '餐饮', type: 'bhl'
    },
    hdlw: {
      id: 'hdlw', name: '恒大烂尾楼公园', unit: '个',
      dailyLimit: 1000, totalStock: 50000,
      perUserDailyLimit: null, category: '其他', type: 'normal'
    },
    glfe: {
      id: 'glfe', name: '格伦菲尔口腔', unit: '个',
      dailyLimit: 1000, totalStock: 50000,
      perUserDailyLimit: null, category: '其他', type: 'normal'
    },
    ypzp: {
      id: 'ypzp', name: '鱼泡招聘', unit: '个',
      dailyLimit: 1000, totalStock: 50000,
      perUserDailyLimit: null, category: '其他', type: 'normal'
    },
    yjbat: {
      id: 'yjbat', name: '益节补氨糖', unit: '个',
      dailyLimit: 1000, totalStock: 50000,
      perUserDailyLimit: null, category: '保健', type: 'normal'
    },
    '555c': {
      id: '555c', name: '停靠纱织北站的555车', unit: '个',
      dailyLimit: 1000, totalStock: 50000,
      perUserDailyLimit: null, category: '交通', type: 'normal'
    }
  };
}
