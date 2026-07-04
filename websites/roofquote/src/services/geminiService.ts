const OPENROUTER_API_KEY = (import.meta.env.VITE_OPENROUTER_API_KEY || "").trim();
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "google/gemini-2.5-flash-lite";
const HTTP_REFERER = typeof window !== "undefined" ? window.location.origin : "https://openrouter.ai";
const APP_TITLE = "RoofQuote";

export async function analyzeRoof(images: { base64: string; mimeType: string }[]): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    return "AI is disabled on this deployment (missing VITE_OPENROUTER_API_KEY).";
  }

  const content = images.map((img) => ({
    type: "image_url" as const,
    image_url: {
      url: `data:${img.mimeType};base64,${img.base64}`,
    },
  }));

  const prompt = `You are an expert roofing estimator. I am providing you with a comprehensive set of 15+ images of a property to help you analyze the roof from every possible angle.
The images include:
- 2 top-down satellite views (close-up and context).
- 1 roadmap view for neighborhood context.
- 1 topological/terrain view for elevation context.
- 8 oblique aerial views from 8 different compass headings (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°) at a 45-degree tilt.
- Up to 3 street view snapshots (directly facing the home and from adjacent positions down the street).

Please analyze this extensive visual dataset to estimate the following:
1. Roof complexity (e.g., simple gable, complex hip and valley, flat).
2. Approximate roof pitch (e.g., low, medium, steep).
3. Estimated square footage of the roof (make a reasonable guess based on the footprint of the house and typical proportions).
4. Potential obstacles (e.g., chimneys, skylights, trees overhanging, solar panels).
5. A rough cost estimate for a full roof replacement, assuming standard architectural shingles (provide a range).

Explain your spatial reasoning by cross-referencing the various perspectives (e.g., "The street view confirms a steep pitch that was suggested by the southern oblique aerial"). Format your response in Markdown.`;

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": HTTP_REFERER,
      "X-Title": APP_TITLE,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "user",
          content: [...content, { type: "text", text: prompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No analysis generated.";
}
