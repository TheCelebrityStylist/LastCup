import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const monthly = process.env.STRIPE_PRICE_MONTHLY;
    const lifetime = process.env.STRIPE_PRICE_LIFETIME;

    if (!monthly || !lifetime) {
      return NextResponse.json({ error: "Missing Stripe price IDs" }, { status: 500 });
    }

    const price = plan === "lifetime" ? lifetime : monthly;
    const mode = plan === "lifetime" ? "payment" : "subscription";
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price, quantity: 1 }],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_creation: "always",
      metadata: {
        product: "lastcup",
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
