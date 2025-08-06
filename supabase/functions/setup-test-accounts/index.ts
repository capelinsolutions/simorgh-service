import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SetupRequest {
  adminEmail: string;
  freelancerEmail: string;
  userEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[SETUP-TEST-ACCOUNTS] Function started');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { adminEmail, freelancerEmail, userEmail }: SetupRequest = await req.json();

    console.log('[SETUP-TEST-ACCOUNTS] Setting up accounts for:', { adminEmail, freelancerEmail, userEmail });

    // Get user IDs by email
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      console.error('[SETUP-TEST-ACCOUNTS] Error fetching users:', usersError);
      throw usersError;
    }

    const adminUser = users.users.find(u => u.email === adminEmail);
    const freelancerUser = users.users.find(u => u.email === freelancerEmail);
    const regularUser = users.users.find(u => u.email === userEmail);

    if (!adminUser || !freelancerUser || !regularUser) {
      const missing = [];
      if (!adminUser) missing.push(adminEmail);
      if (!freelancerUser) missing.push(freelancerEmail);
      if (!regularUser) missing.push(userEmail);
      
      return new Response(
        JSON.stringify({ 
          error: `Users not found for emails: ${missing.join(', ')}. Please create these accounts first through signup.` 
        }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log('[SETUP-TEST-ACCOUNTS] Found all users, setting up roles...');

    // Set up admin user
    const { error: adminError } = await supabase
      .from('admin_users')
      .upsert({
        user_id: adminUser.id,
        role: 'admin',
        permissions: ['all']
      });

    if (adminError) {
      console.error('[SETUP-TEST-ACCOUNTS] Error creating admin:', adminError);
    } else {
      console.log('[SETUP-TEST-ACCOUNTS] Admin user created');
    }

    // Set up freelancer profile
    const { error: freelancerError } = await supabase
      .from('freelancers')
      .upsert({
        user_id: freelancerUser.id,
        business_name: 'Test Cleaning Services',
        contact_phone: '+1234567890',
        service_areas: ['10001', '10002', '10003'],
        services_offered: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning'],
        hourly_rate: 25.00,
        experience_years: 3,
        bio: 'Professional cleaner with 3+ years experience',
        is_active: true,
        verification_status: 'approved',
        rating: 4.8,
        total_jobs: 25
      });

    if (freelancerError) {
      console.error('[SETUP-TEST-ACCOUNTS] Error creating freelancer:', freelancerError);
    } else {
      console.log('[SETUP-TEST-ACCOUNTS] Freelancer profile created');
    }

    // Set up customer profile
    const { error: customerError } = await supabase
      .from('customer_profiles')
      .upsert({
        user_id: regularUser.id,
        first_name: 'Test',
        last_name: 'Customer',
        phone: '+1987654321',
        status: 'active'
      });

    if (customerError) {
      console.error('[SETUP-TEST-ACCOUNTS] Error creating customer:', customerError);
    } else {
      console.log('[SETUP-TEST-ACCOUNTS] Customer profile created');
    }

    // Add a default address for the customer
    const { error: addressError } = await supabase
      .from('customer_addresses')
      .upsert({
        user_id: regularUser.id,
        label: 'Home',
        street_address: '123 Test Street',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        is_default: true
      });

    if (addressError) {
      console.error('[SETUP-TEST-ACCOUNTS] Error creating address:', addressError);
    } else {
      console.log('[SETUP-TEST-ACCOUNTS] Customer address created');
    }

    console.log('[SETUP-TEST-ACCOUNTS] Setup completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Test accounts set up successfully',
        accounts: {
          admin: { email: adminEmail, id: adminUser.id },
          freelancer: { email: freelancerEmail, id: freelancerUser.id },
          customer: { email: userEmail, id: regularUser.id }
        }
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error('[SETUP-TEST-ACCOUNTS] ERROR:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);