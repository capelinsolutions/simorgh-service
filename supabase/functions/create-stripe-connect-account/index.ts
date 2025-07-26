import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Initialize Supabase with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get user from request
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    const user = userData.user;
    
    // Get freelancer profile
    const { data: freelancer, error: freelancerError } = await supabase
      .from('freelancers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (freelancerError || !freelancer) {
      throw new Error('Freelancer profile not found');
    }

    // Check if Stripe account already exists
    if (freelancer.stripe_account_id) {
      // Return existing account link
      const accountLink = await stripe.accountLinks.create({
        account: freelancer.stripe_account_id,
        refresh_url: `${req.headers.get('origin')}/freelancer/profile?setup=refresh`,
        return_url: `${req.headers.get('origin')}/freelancer/profile?setup=success`,
        type: 'account_onboarding',
      });

      return new Response(JSON.stringify({ url: accountLink.url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Create new Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: user.email,
      business_profile: {
        name: freelancer.business_name || `${user.email} Cleaning Services`,
        product_description: 'Professional cleaning services',
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    console.log('Created Stripe account:', account.id);

    // Update freelancer with Stripe account ID
    const { error: updateError } = await supabase
      .from('freelancers')
      .update({ stripe_account_id: account.id })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating freelancer:', updateError);
      throw updateError;
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.get('origin')}/freelancer/profile?setup=refresh`,
      return_url: `${req.headers.get('origin')}/freelancer/profile?setup=success`,
      type: 'account_onboarding',
    });

    console.log('Created account link:', accountLink.url);

    return new Response(JSON.stringify({ url: accountLink.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in create-stripe-connect-account:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});