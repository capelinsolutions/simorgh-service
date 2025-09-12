import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      throw new Error('Missing Stripe signature');
    }

    // Verify webhook signature (you'll need to set STRIPE_WEBHOOK_SECRET)
    let event;
    try {
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      if (!webhookSecret) {
        logStep("Warning: STRIPE_WEBHOOK_SECRET not set, skipping signature verification");
        event = JSON.parse(body);
      } else {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      }
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    logStep("Event received", { type: event.type, id: event.id });

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      logStep("Processing payment success", { sessionId: session.id });

      // Get order from session metadata or by session ID
      const orderId = session.metadata?.order_id;
      let order;
      
      if (orderId) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        order = data;
      } else {
        // Fallback: find order by session ID
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_session_id', session.id)
          .single();
        order = data;
      }

      if (!order) {
        logStep("Order not found", { sessionId: session.id, orderId });
        return new Response('Order not found', { status: 404 });
      }

      logStep("Order found", { orderId: order.id, status: order.status });

      // Update order status to confirmed
      await supabase
        .from('orders')
        .update({ 
          status: 'confirmed',
          payment_method: 'stripe'
        })
        .eq('id', order.id);

      logStep("Order status updated to confirmed");

      // Trigger auto-assignment if ZIP code is available
      if (order.customer_zip_code) {
        logStep("Triggering auto-assignment", { orderId: order.id, zipCode: order.customer_zip_code });
        
        try {
          const { data: assignmentResult, error: assignmentError } = await supabase.functions.invoke('auto-assign-order', {
            body: { orderId: order.id }
          });

          if (assignmentError) {
            logStep("Auto-assignment failed", { error: assignmentError });
          } else {
            logStep("Auto-assignment completed", assignmentResult);
          }
        } catch (error) {
          logStep("Auto-assignment error", { error: error.message });
        }
      } else {
        logStep("No ZIP code available, skipping auto-assignment");
      }

      // Log the successful payment processing
      await supabase.from('system_activity_log').insert({
        action: 'payment_confirmed',
        description: `Payment confirmed for order ${order.id}`,
        metadata: { 
          orderId: order.id,
          sessionId: session.id,
          amount: session.amount_total,
          service: order.service_name
        }
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});