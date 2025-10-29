export async function handler(event) {
  try {
    const token = process.env.PAPPERS_API_TOKEN;
    if (!token) {
      return { statusCode: 500, body: JSON.stringify({ error: "Missing PAPPERS_API_TOKEN" }) };
    }

    const incomingParams = event.queryStringParameters || {};
    const allowedParams = [
      "q",
      "adresse",
      "code_postal",
      "ville",
      "departement",
      "region",
      "code_naf",
      "page",
      "tri",
      "taille",
      "siren",
      "siret",
    ];
    const searchKeys = new Set(["q", "adresse", "code_postal", "ville", "departement", "region", "siren", "siret"]);

    const params = new URLSearchParams();
    params.set("api_token", token);

    let hasSearchParam = false;

    for (const key of allowedParams) {
      const rawValue = incomingParams[key];
      if (rawValue === undefined || rawValue === null) continue;
      const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
      if (!value) continue;
      if (key === "q" && value.length < 1) continue;

      params.set(key, value);
      if (searchKeys.has(key)) {
        hasSearchParam = true;
      }
    }

    if (!params.has("taille")) {
      params.set("taille", "10");
    }

    if (!hasSearchParam) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing search parameters" }) };
    }

    const url = `https://api.pappers.fr/v2/recherche?${params.toString()}`;
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
