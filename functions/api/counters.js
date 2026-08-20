export async function onRequestGet(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  
  try {
    const kv = context.env.COUNTER_KV;
    const remaining = parseFloat(await kv.get("remaining") || "11300000000");
    const sold = parseFloat(await kv.get("sold") || "50000000");
    const blast = parseFloat(await kv.get("blast") || "5.0");
    
    return new Response(JSON.stringify({ remaining, sold, blast }), {
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
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  
  try {
    const request = context.request;
    const body = await request.json();
    const id = body.id;
    const delta = parseFloat(body.delta);
    
    if (!id || isNaN(delta)) {
      return new Response(JSON.stringify({ error: "invalid params" }), {
        status: 400,
        headers: corsHeaders
      });
    }
    
    const kv = context.env.COUNTER_KV;
    let remaining = parseFloat(await kv.get("remaining") || "11300000000");
    let sold = parseFloat(await kv.get("sold") || "50000000");
    let blast = parseFloat(await kv.get("blast") || "5.0");
    
    if (id === "estate") {
      const cost = delta * 1000000;
      if (remaining < cost) {
        return new Response(JSON.stringify({ error: "not enough remaining" }), {
          status: 400,
          headers: corsHeaders
        });
      }
      remaining -= cost;
      sold += cost;
      await kv.put("remaining", remaining.toString());
      await kv.put("sold", sold.toString());
    } else if (id === "blast") {
      blast = Math.min(blast + delta, 100);
      await kv.put("blast", blast.toString());
    } else {
      return new Response(JSON.stringify({ error: "unknown id" }), {
        status: 400,
        headers: corsHeaders
      });
    }
    
    return new Response(JSON.stringify({ ok: true, remaining, sold, blast }), {
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
