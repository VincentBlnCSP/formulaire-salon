diff --git a/netlify/functions/pappers.js b/netlify/functions/pappers.js
index 4311c437fcd24fc49996262a81853cf11c8976e2..60896b6dea027b9d7318355f6208f4b0d88ef59a 100644
--- a/netlify/functions/pappers.js
+++ b/netlify/functions/pappers.js
@@ -5,15 +5,50 @@ export async function handler(event) {
       return { statusCode: 500, body: JSON.stringify({ error: "Missing PAPPERS_API_TOKEN" }) };
     }
 
-    const params = new URLSearchParams(event.queryStringParameters);
-    const q = params.get("q") || "";
-    const taille = params.get("taille") || "10";
+    const incomingParams = event.queryStringParameters || {};
+    const allowedParams = [
+      "q",
+      "adresse",
+      "code_postal",
+      "ville",
+      "departement",
+      "region",
+      "code_naf",
+      "page",
+      "tri",
+      "taille",
+      "siren",
+      "siret",
+    ];
+    const searchKeys = new Set(["q", "adresse", "code_postal", "ville", "departement", "region", "siren", "siret"]);
 
-    if (!q || q.trim().length < 2) {
-      return { statusCode: 400, body: JSON.stringify({ error: "query q too short" }) };
+    const params = new URLSearchParams();
+    params.set("api_token", token);
+
+    let hasSearchParam = false;
+
+    for (const key of allowedParams) {
+      const rawValue = incomingParams[key];
+      if (rawValue === undefined || rawValue === null) continue;
+      const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
+      if (!value) continue;
+      if (key === "q" && value.length < 2) continue;
+
+      params.set(key, value);
+      if (searchKeys.has(key)) {
+        hasSearchParam = true;
+      }
+    }
+
+    if (!params.has("taille")) {
+      params.set("taille", "10");
+    }
+
+    if (!hasSearchParam) {
+      return { statusCode: 400, body: JSON.stringify({ error: "Missing search parameters" }) };
     }
 
-    const url = `https://api.pappers.fr/v2/recherche?api_token=${token}&q=${encodeURIComponent(q)}&taille=${encodeURIComponent(taille)}`;
+    const url = `https://api.pappers.fr/v2/recherche?${params.toString()}`;
     const r = await fetch(url);
     const body = await r.text();
 
