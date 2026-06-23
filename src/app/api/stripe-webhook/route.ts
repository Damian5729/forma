import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });

async function getUserIdFromCustomer(customerId: string): Promise<string | null> {
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;
  return (customer as Stripe.Customer).metadata?.supabase_user_id ?? null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const svc = createServiceRoleClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;
      const customerId = session.customer as string;
      const userId = await getUserIdFromCustomer(customerId);
      if (!userId) break;
      await svc.from("user_profiles").upsert({
        id: userId,
        subscription_status: "pro",
        stripe_subscription_id: session.subscription as string,
        stripe_customer_id: customerId,
      }, { onConflict: "id" });
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const status = sub.status === "active" || sub.status === "trialing" ? "pro" : "free";
      const userId = await getUserIdFromCustomer(customerId);
      if (!userId) break;
      await svc.from("user_profiles").upsert({
        id: userId,
        subscription_status: status,
        stripe_subscription_id: sub.id,
        stripe_customer_id: customerId,
        subscription_period_end: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
      }, { onConflict: "id" });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = await getUserIdFromCustomer(sub.customer as string);
      if (!userId) break;
      await svc.from("user_profiles").update({
        subscription_status: "free",
        stripe_subscription_id: null,
        subscription_period_end: null,
      }).eq("id", userId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
