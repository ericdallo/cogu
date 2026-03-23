interface Env {
  MELHOR_ENVIO_TOKEN: string;
  ALLOWED_ORIGINS: string;
}

const ME_API = "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate";

// Only return quotes from these carriers
const ALLOWED_CARRIERS = ["Correios", "Jadlog", "Loggi"];

function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function getAllowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  return allowed.includes(origin) ? origin : null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = getAllowedOrigin(request, env);

    if (!origin) {
      return new Response("Forbidden", { status: 403 });
    }

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders(origin),
      });
    }

    try {
      const body = await request.text();

      const meResponse = await fetch(ME_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${env.MELHOR_ENVIO_TOKEN}`,
          "User-Agent": "Cogu/1.0 (contato@cogupaper.com)",
        },
        body,
      });

      const data = await meResponse.text();

      // Filter quotes to only include allowed carriers
      let filteredData = data;
      try {
        const quotes = JSON.parse(data);
        if (Array.isArray(quotes)) {
          filteredData = JSON.stringify(
            quotes.filter((q: { company?: { name?: string } }) =>
              ALLOWED_CARRIERS.includes(q.company?.name ?? "")
            )
          );
        }
      } catch {
        // If parsing fails, return the raw response as-is
      }

      return new Response(filteredData, {
        status: meResponse.status,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(origin),
        },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Erro ao calcular frete" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(origin),
        },
      });
    }
  },
} satisfies ExportedHandler<Env>;
