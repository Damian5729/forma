import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Kein Bild erhalten" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType ?? "image/jpeg",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `Du bist ein Ernährungs- und Supplementexperte. Analysiere dieses Blutbild und empfehle passende Nahrungsergänzungsmittel.

Gib deine Antwort ALS JSON zurück in diesem Format (kein Markdown, nur reines JSON):
{
  "findings": ["Befund 1", "Befund 2"],
  "supplements": [
    { "name": "Vitamin D3", "dose": "2000 IE", "time": "morning", "reason": "Spiegel unter Normbereich", "emoji": "☀️" },
    { "name": "Zink", "dose": "15mg", "time": "evening", "reason": "Leicht erhöhter Bedarf", "emoji": "⚡" }
  ]
}

Mögliche Werte für "time": "morning", "afternoon", "evening", "night"
Empfehle nur was wirklich sinnvoll ist basierend auf den Werten. Falls kein klares Blutbild erkennbar, gib supplements: [] zurück und erkläre in findings was du siehst.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch?.[0] ?? text);
    } catch {
      return NextResponse.json({ findings: ["Konnte Bild nicht auswerten. Bitte deutlicheres Foto hochladen."], supplements: [] });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("bloodtest error:", err);
    return NextResponse.json({ error: "Fehler bei der Auswertung" }, { status: 500 });
  }
}
