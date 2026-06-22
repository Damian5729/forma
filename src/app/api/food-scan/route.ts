import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }, { status: 500 });
  }

  try {
    const { imageBase64, mediaType } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: "Kein Bild" }, { status: 400 });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType ?? "image/jpeg",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `Analysiere dieses Essen-Foto und schätze die Nährwerte. Antworte NUR mit gültigem JSON, ohne Markdown-Blöcke:
{
  "items": [
    { "name": "Produktname auf Deutsch", "calories": 350, "protein": 25, "carbs": 30, "fat": 8, "amount": "200g" }
  ],
  "total": { "calories": 350, "protein": 25, "carbs": 30, "fat": 8 },
  "confidence": "hoch"
}
Schätze realistisch für die sichtbare Portionsgröße. Wenn mehrere Zutaten erkennbar, liste alle auf und summiere total.`,
            },
          ],
        },
      ],
    });

    const text = (response.content[0] as { type: string; text: string }).text.trim();
    // Strip markdown code blocks if present
    const clean = text.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    const data = JSON.parse(clean);
    return NextResponse.json(data);
  } catch (err) {
    console.error("food-scan error:", err);
    return NextResponse.json({ error: "Analyse fehlgeschlagen" }, { status: 500 });
  }
}
