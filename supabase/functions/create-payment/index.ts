import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serviceName, serviceDescription, amount, isGuest, customerEmail, zipCode } = await req.json();

    // Create Supabase client using service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    let user = null;
    let email = customerEmail;

    // Try to get authenticated user if not guest
    if (!isGuest) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        user = data.user;
        email = user?.email || customerEmail;
      }
    }

    if (!email) {
      throw new Error("Email is required");
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: serviceName,
              description: serviceDescription,
            },
            unit_amount: Math.round(amount), // Amount already in cents from frontend
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-cancelled`,
    });

    // Record the order in database
    const { data: orderData, error: orderError } = await supabaseClient.from("orders").insert({
      user_id: user?.id || null,
      customer_email: email,
      customer_zip_code: zipCode,
      service_name: serviceName,
      service_description: serviceDescription,
      stripe_session_id: session.id,
      amount,
      status: "pending",
      assignment_status: "pending",
      is_guest_order: isGuest,
    }).select().single();

    if (orderError) {
      console.error("Failed to create order:", orderError);
    } else if (orderData && zipCode) {
      // Trigger auto-assignment if zip code is provided
      try {
        console.log("Triggering auto-assignment for order:", orderData.id);
        const assignmentResponse = await supabaseClient.functions.invoke('auto-assign-order', {
          body: { orderId: orderData.id }
        });
        console.log("Auto-assignment response:", assignmentResponse);
      } catch (assignError) {
        console.error("Auto-assignment failed:", assignError);
        // Don't fail the payment if assignment fails
      }
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});