import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const status = sub.status === "active" ? "pro" : "free";

    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const userId = customer.metadata?.supabase_user_id;
    if (userId) {
      await supabase.from("user_profiles").update({
        subscription_status: status,
        stripe_subscription_id: sub.id,
        subscription_period_end: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
      }).eq("id", userId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    const userId = customer.metadata?.supabase_user_id;
    if (userId) {
      await supabase.from("user_profiles").update({
        subscription_status: "free",
        stripe_subscription_id: null,
        subscription_period_end: null,
      }).eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
