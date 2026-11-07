const OWNER_OBJECT_KEY = "tracebook/progress-v1.json";
const OTTER_OBJECT_KEY = "Otter/progress-v1.json";
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
    const allowedOrigins = (env.ALLOWED_ORIGIN || "").split(",").map((value) => value.trim()).filter(Boolean);
    const originAllowed = origin && allowedOrigins.includes(origin);
    const cors = originAllowed ? {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    } : {};

    if (origin && !originAllowed) return json({ error: "Origin not allowed" }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (new URL(request.url).pathname !== "/api/progress") return json({ error: "Not found" }, 404, cors);
    const supplied = request.headers.get("Authorization") || "";
    let objectKey = null;
    if (env.SYNC_TOKEN && supplied === `Bearer ${env.SYNC_TOKEN}`) objectKey = OWNER_OBJECT_KEY;
    else if (env.OTTER_SYNC_TOKEN && supplied === `Bearer ${env.OTTER_SYNC_TOKEN}`) objectKey = OTTER_OBJECT_KEY;
    if (!env.PROGRESS || !objectKey) return json({ error: objectKey ? "Sync service is not configured" : "Unauthorized" }, objectKey ? 503 : 401, cors);

    if (request.method === "GET") {
      const object = await env.PROGRESS.get(objectKey);
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
    await env.PROGRESS.put(objectKey, JSON.stringify({ state, updatedAt }), { httpMetadata: { contentType: "application/json" } });
    return json({ ok: true, updatedAt }, 200, cors);
  },
};
