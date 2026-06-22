import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UserContext {
  goal?: string;
  weight?: number;
  height?: number;
  bodyFat?: number;
  dailyCalories?: number;
  proteinGoal?: number;
  name?: string;
}

export async function POST(request: Request) {
  try {
    const { messages, userContext }: { messages: Message[]; userContext: UserContext } =
      await request.json();

    const {
      name = "User",
      goal = "–",
      weight = "–",
      height = "–",
      bodyFat = "–",
      dailyCalories = "–",
      proteinGoal = "–",
    } = userContext ?? {};

    const systemPrompt = `Du bist ein professioneller Sport- und Ernährungscoach in der App 'Forma'. Du antwortest auf Deutsch. Du kennst den User: ${name}, Ziel: ${goal}, Gewicht: ${weight}kg, Größe: ${height}cm, Körperfett: ${bodyFat}%, Kalorienziel: ${dailyCalories} kcal, Proteinziel: ${proteinGoal}g. Erstelle auf Anfrage präzise Trainingspläne (als Markdown-Tabelle oder Liste), beantworte Fragen zu Sport, Ernährung und Regeneration. Sei motivierend aber direkt. Maximal 400 Wörter pro Antwort.`;

    const client = new Anthropic();

    const stream = await client.messages.stream({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }
        } catch (e) {
          controller.enqueue(new TextEncoder().encode(`\n[Fehler: ${e instanceof Error ? e.message : "Unbekannt"}]`));
        } finally {
          controller.close();
        }
      },
      cancel() {
        stream.abort();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Serverfehler" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
