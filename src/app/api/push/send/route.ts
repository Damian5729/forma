import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createServiceRoleClient } from "@/lib/supabase/service";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const SCHEDULE: Record<number, { title: string; body: string; url: string }> = {
  7:  { title: "Guten Morgen! 🌅",          body: "Frühstück nicht vergessen — jetzt in forma loggen.",      url: "/dashboard" },
  9:  { title: "Wasser getrunken? 💧",       body: "Mindestens 500ml bis jetzt. Bleib hydratisiert!",         url: "/dashboard" },
  10: { title: "Snack-Zeit 🍎",              body: "Ein kleiner Snack hält den Blutzucker stabil.",            url: "/dashboard" },
  12: { title: "Mittagessen 🥗",             body: "Zeit fürs Mittagessen — jetzt eintragen.",                 url: "/dashboard" },
  13: { title: "Bewegungspause 🚶",          body: "Kurz aufstehen und 5 Minuten gehen.",                      url: "/fitness" },
  15: { title: "Nachmittags-Snack 🥜",      body: "Kleiner Hunger? Eintragen nicht vergessen.",               url: "/dashboard" },
  16: { title: "Workout heute? 💪",          body: "Dein Trainingsplan wartet auf dich.",                      url: "/fitness" },
  18: { title: "Abendessen 🍽️",            body: "Abendessen loggen — bleib am Ziel.",                       url: "/dashboard" },
  20: { title: "Tages-Check ✅",            body: "Wie war dein Tag? Schau deine Zusammenfassung an.",        url: "/dashboard" },
  21: { title: "Gute Nacht! 🌙",            body: "Morgen wieder Gas geben. Gut gemacht heute!",              url: "/dashboard" },
};

async function handleSend(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hour = new Date().getUTCHours() + 2; // UTC+2 (Germany)
  const msg = SCHEDULE[hour];
  if (!msg) return NextResponse.json({ sent: 0, reason: "no message for this hour" });

  const svc = createServiceRoleClient();
  const { data: subs } = await svc.from("push_subscriptions").select("*");
  if (!subs?.length) return NextResponse.json({ sent: 0 });

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title: msg.title, body: msg.body, url: msg.url })
      ).catch(async (err) => {
        // Remove invalid/expired subscriptions
        if (err.statusCode === 410 || err.statusCode === 404) {
          await svc.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        }
        throw err;
      })
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ sent, total: subs.length });
}

export const GET = handleSend;
export const POST = handleSend;
