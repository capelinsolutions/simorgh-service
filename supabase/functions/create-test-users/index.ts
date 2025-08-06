import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[CREATE-TEST-USERS] Function started');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const testUsers = [
      {
        email: 'admin@test.com',
        password: 'admin123456',
        role: 'admin',
        user_metadata: {
          first_name: 'Admin',
          last_name: 'User'
        }
      },
      {
        email: 'freelancer@test.com',
        password: 'freelancer123456',
        role: 'freelancer',
        user_metadata: {
          first_name: 'Test',
          last_name: 'Freelancer'
        }
      },
      {
        email: 'user@test.com',
        password: 'user123456',
        role: 'customer',
        user_metadata: {
          first_name: 'Test',
          last_name: 'User'
        }
      }
    ];

    const createdUsers = [];

    for (const testUser of testUsers) {
      console.log(`[CREATE-TEST-USERS] Creating user: ${testUser.email}`);

      // Create user with admin privileges
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
        user_metadata: testUser.user_metadata
      });

      if (authError) {
        console.error(`[CREATE-TEST-USERS] Error creating ${testUser.email}:`, authError);
        continue;
      }

      const userId = authData.user.id;
      console.log(`[CREATE-TEST-USERS] Created user ${testUser.email} with ID: ${userId}`);

      // Set up role-specific data
      if (testUser.role === 'admin') {
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert({
            user_id: userId,
            role: 'admin',
            permissions: ['all']
          });

        if (adminError) {
          console.error('[CREATE-TEST-USERS] Error creating admin role:', adminError);
        }
      }

      if (testUser.role === 'freelancer') {
        const { error: freelancerError } = await supabase
          .from('freelancers')
          .insert({
            user_id: userId,
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
          console.error('[CREATE-TEST-USERS] Error creating freelancer profile:', freelancerError);
        }
      }

      if (testUser.role === 'customer') {
        const { error: customerError } = await supabase
          .from('customer_profiles')
          .insert({
            user_id: userId,
            first_name: testUser.user_metadata.first_name,
            last_name: testUser.user_metadata.last_name,
            phone: '+1987654321',
            status: 'active'
          });

        if (customerError) {
          console.error('[CREATE-TEST-USERS] Error creating customer profile:', customerError);
        }

        // Add default address
        const { error: addressError } = await supabase
          .from('customer_addresses')
          .insert({
            user_id: userId,
            label: 'Home',
            street_address: '123 Test Street',
            city: 'New York',
            state: 'NY',
            zip_code: '10001',
            is_default: true
          });

        if (addressError) {
          console.error('[CREATE-TEST-USERS] Error creating customer address:', addressError);
        }
      }

      createdUsers.push({
        email: testUser.email,
        role: testUser.role,
        id: userId
      });
    }

    console.log('[CREATE-TEST-USERS] All users created successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Test users created successfully',
        users: createdUsers,
        credentials: {
          admin: { email: 'admin@test.com', password: 'admin123456' },
          freelancer: { email: 'freelancer@test.com', password: 'freelancer123456' },
          customer: { email: 'user@test.com', password: 'user123456' }
        }
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error('[CREATE-TEST-USERS] ERROR:', error);
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