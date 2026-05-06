import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { articles } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const articlesText = (articles ?? [])
      .map(
        (a: any, i: number) =>
          `[${i + 1}] (${a.source} · ${a.category}) ${a.title}\n${a.excerpt}`
      )
      .join("\n\n");

    const systemPrompt = `Tu es un analyste senior en veille fintech. À partir d'une liste d'articles du jour, tu produis une synthèse concise et exécutive en français, structurée et actionnable. Ton ton est professionnel, neutre, sans emojis.`;

    const userPrompt = `Voici les articles du jour à synthétiser :\n\n${articlesText}\n\nRetourne strictement un JSON via l'outil fourni.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "publish_synthesis",
                description: "Publie la synthèse structurée du jour",
                parameters: {
                  type: "object",
                  properties: {
                    headline: {
                      type: "string",
                      description: "Titre éditorial percutant (max 12 mots)",
                    },
                    overview: {
                      type: "string",
                      description: "Résumé global en 2-3 phrases",
                    },
                    key_points: {
                      type: "array",
                      items: { type: "string" },
                      description: "3 à 5 points clés actionnables",
                    },
                    trends: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          label: { type: "string" },
                          intensity: {
                            type: "string",
                            enum: ["faible", "modérée", "forte"],
                          },
                        },
                        required: ["label", "intensity"],
                      },
                      description: "2-4 tendances détectées",
                    },
                    watchlist: {
                      type: "array",
                      items: { type: "string" },
                      description: "2-3 sujets à surveiller cette semaine",
                    },
                  },
                  required: [
                    "headline",
                    "overview",
                    "key_points",
                    "trends",
                    "watchlist",
                  ],
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "publish_synthesis" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite atteinte, réessayez plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits IA insuffisants." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur passerelle IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    return new Response(JSON.stringify({ synthesis: args }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("synthesize error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
