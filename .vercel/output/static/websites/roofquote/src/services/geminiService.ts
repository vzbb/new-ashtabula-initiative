import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeRoof(images: { base64: string; mimeType: string }[]): Promise<string> {
  const parts = images.map((img) => ({
    inlineData: {
      data: img.base64,
      mimeType: img.mimeType,
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

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [...parts, { text: prompt }],
    },
  });

  return response.text || "No analysis generated.";
}
