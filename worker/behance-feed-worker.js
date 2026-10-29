/* Cloudflare Worker (plano gratuito): lê o perfil público do Behance e devolve JSON para a landing page.
   Como usar: Cloudflare > Workers & Pages > Create Worker > cole este código > Deploy.
   Depois copie a URL do Worker (https://nome.seu-usuario.workers.dev) e cole em MAIA.behance.feed na landing page.
   ATENÇÃO: não testado contra o Behance real. O Behance não tem API pública e pode mudar o HTML ou bloquear
   leituras automáticas; se isso acontecer, a landing continua mostrando a lista embutida. */
const PERFIL = "https://www.behance.net/saracaslowdesigner";
const ORIGEM_PERMITIDA = "*"; /* troque pelo domínio do seu site, ex.: "https://studiomaia.com.br" */

export default {
  async fetch(req, env, ctx) {
    const cors = { "Access-Control-Allow-Origin": ORIGEM_PERMITIDA, "Content-Type": "application/json; charset=utf-8" };
    const cache = caches.default;
    const key = new Request(new URL(req.url).origin + "/behance-feed-v1");
    let res = await cache.match(key);
    if (!res) {
      try {
        const r = await fetch(PERFIL, { headers: { "User-Agent": "Mozilla/5.0 (compatible; MAIA-feed)", "Accept-Language": "pt-BR,pt;q=0.9" } });
        if (!r.ok) throw new Error("Behance respondeu " + r.status);
        const projects = parse(await r.text());
        if (!projects.length) throw new Error("nenhum projeto encontrado no HTML");
        res = new Response(JSON.stringify({ updated: new Date().toISOString(), projects }), {
          headers: { ...cors, "Cache-Control": "public, max-age=3600" } /* atualiza no máximo a cada 1 h */
        });
        ctx.waitUntil(cache.put(key, res.clone()));
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e.message || e) }), { status: 502, headers: cors });
      }
    }
    const out = new Response(res.body, res);
    out.headers.set("Access-Control-Allow-Origin", ORIGEM_PERMITIDA);
    return out;
  }
};

function parse(html) {
  html = html.replace(/\\u002F|\\\//g, "/");
  const seen = new Map();
  const re = /\/gallery\/(\d+)\/([A-Za-z0-9%_-]+)/g;
  let m;
  while ((m = re.exec(html)) && seen.size < 24) {
    const id = m[1];
    if (seen.has(id)) continue;
    const near = html.slice(m.index, m.index + 600);
    const t = near.match(/title="Link to project - ([^"]+)"/);
    const title = decode(t ? t[1] : m[2].replace(/-/g, " "));
    const c = html.match(new RegExp("https://mir-s3-cdn-cf\\.behance\\.net/projects/\\d+/[a-z0-9]{6}" + id + "\\.[^\"'\\s,)]+"));
    seen.set(id, { id, title, url: "https://www.behance.net/gallery/" + id + "/" + m[2], cover: c ? c[0] : "" });
  }
  return [...seen.values()];
}
function decode(s) {
  return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
