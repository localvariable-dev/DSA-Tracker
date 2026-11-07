const OBJECT_KEY = "tracebook/progress-v1.json";
const MAX_BYTES = 256 * 1024;

function json(body, status, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}

function validState(value) {
  return value && typeof value === "object" && value.version === 1 &&
    ["completed", "checks", "logs", "reviews"].every((key) => value[key] && typeof value[key] === "object");
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowedOrigin = env.ALLOWED_ORIGIN || "";
    const cors = origin && origin === allowedOrigin ? {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    } : {};

    if (origin && origin !== allowedOrigin) return json({ error: "Origin not allowed" }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (new URL(request.url).pathname !== "/api/progress") return json({ error: "Not found" }, 404, cors);
    if (!env.PROGRESS || !env.SYNC_TOKEN) return json({ error: "Sync service is not configured" }, 503, cors);

    const supplied = request.headers.get("Authorization") || "";
    if (supplied !== `Bearer ${env.SYNC_TOKEN}`) return json({ error: "Unauthorized" }, 401, cors);

    if (request.method === "GET") {
      const object = await env.PROGRESS.get(OBJECT_KEY);
      if (!object) return json({ error: "No saved progress" }, 404, cors);
      return new Response(object.body, { status: 200, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...cors } });
    }

    if (request.method !== "PUT") return json({ error: "Method not allowed" }, 405, { ...cors, Allow: "GET, PUT, OPTIONS" });
    const length = Number(request.headers.get("Content-Length") || 0);
    if (length > MAX_BYTES) return json({ error: "Progress file is too large" }, 413, cors);

    let state;
    try {
      const text = await request.text();
      if (new TextEncoder().encode(text).byteLength > MAX_BYTES) return json({ error: "Progress file is too large" }, 413, cors);
      state = JSON.parse(text);
    } catch (error) {
      return json({ error: "Invalid JSON" }, 400, cors);
    }
    if (!validState(state)) return json({ error: "Invalid Tracebook progress" }, 400, cors);

    const updatedAt = new Date().toISOString();
    await env.PROGRESS.put(OBJECT_KEY, JSON.stringify({ state, updatedAt }), { httpMetadata: { contentType: "application/json" } });
    return json({ ok: true, updatedAt }, 200, cors);
  },
};
