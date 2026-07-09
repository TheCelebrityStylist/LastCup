import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook verification failed", error);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email;
      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      const plan = session.metadata?.plan || "unknown";

      if (email && customerId) {
        await supabaseAdmin.from("customers").upsert(
          {
            email,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan,
            entitlement: "premium",
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" }
        );
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await supabaseAdmin
        .from("customers")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("stripe_subscription_id", subscription.id);
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;

      if (subscriptionId) {
        await supabaseAdmin
          .from("customers")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", subscriptionId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handling failed", error);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}
