export async function handler(event, context) {
  try {
    const payload = JSON.parse(event.body);

    // ⚡ Mets ici l’URL de TON webhook Make
    const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/wy3arm5tq2ys5n0ropnrp6hkrg9m3jkg";

    const res = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: res.status,
        body: JSON.stringify({ ok: false, error: text }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message }),
    };
  }
}
