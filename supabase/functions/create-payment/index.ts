import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Create Supabase client using the service role key for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create Supabase client using anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { serviceId, hours = 2, customerEmail, zipCode, specialRequests, isGuest = false } = await req.json();
    logStep("Request data received", { serviceId, hours, customerEmail, zipCode, isGuest });

    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    // Get service details
    const { data: service, error: serviceError } = await supabaseService
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .eq('is_active', true)
      .single();

    if (serviceError || !service) {
      throw new Error("Service not found or inactive");
    }
    logStep("Service details retrieved", { serviceTitle: service.title, regularPrice: service.regular_price });

    let user = null;
    let userEmail = customerEmail;

    // Try to get authenticated user if not a guest checkout
    if (!isGuest) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
        if (!userError && userData.user?.email) {
          user = userData.user;
          userEmail = userData.user.email;
          logStep("User authenticated", { userId: user.id, email: userEmail });
        }
      }
    }

    // Use provided email or default for guest checkout
    if (!userEmail) {
      userEmail = "guest@example.com";
    }

    logStep("Using email for checkout", { email: userEmail, isGuest: !user });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if a Stripe customer record exists for this email
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    } else {
      logStep("No existing Stripe customer found");
    }

    // Calculate total amount (price per hour * hours, converted to cents)
    const totalAmount = Math.round(service.regular_price * hours * 100);
    logStep("Calculated total amount", { pricePerHour: service.regular_price, hours, totalAmountCents: totalAmount });

    // Create order record first
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert({
        user_id: user?.id || null,
        service_name: service.title,
        service_description: service.description,
        amount: totalAmount,
        currency: 'usd',
        duration_hours: hours,
        customer_email: userEmail,
        customer_zip_code: zipCode,
        special_instructions: specialRequests,
        is_guest_order: !user,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }
    logStep("Order created", { orderId: order.id });

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: service.title,
              description: `${hours} hours of ${service.title} service`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/service/${serviceId}`,
      metadata: {
        order_id: order.id,
        service_id: serviceId.toString(),
        hours: hours.toString(),
      },
    });

    logStep("Stripe checkout session created", { sessionId: session.id, url: session.url });

    // Update order with Stripe session ID
    await supabaseService
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    logStep("Order updated with Stripe session ID");

    return new Response(JSON.stringify({ 
      url: session.url,
      orderId: order.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});