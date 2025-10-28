export async function handler(event) {
  try {
    const token = process.env.PAPPERS_API_TOKEN;
    if (!token) {
      return { statusCode: 500, body: JSON.stringify({ error: "Missing PAPPERS_API_TOKEN" }) };
    }

    const params = new URLSearchParams(event.queryStringParameters);
    const q = params.get("q") || "";
    const taille = params.get("taille") || "10";

    if (!q || q.trim().length < 2) {
      return { statusCode: 400, body: JSON.stringify({ error: "query q too short" }) };
    }

    const url = `https://api.pappers.fr/v2/recherche?api_token=${token}&q=${encodeURIComponent(q)}&taille=${encodeURIComponent(taille)}`;
    const r = await fetch(url);
    const body = await r.text();

    return {
      statusCode: r.status,
      headers: { "Content-Type": "application/json" },
      body,
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
