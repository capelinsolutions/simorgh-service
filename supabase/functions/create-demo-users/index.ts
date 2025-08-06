import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Creating demo users...');

    // Demo users data
    const demoUsers = [
      {
        email: 'customer@demo.com',
        password: 'demo123456',
        role: 'customer',
        userData: {
          first_name: 'John',
          last_name: 'Customer',
          phone: '(555) 123-4567'
        }
      },
      {
        email: 'cleaner@demo.com',
        password: 'demo123456',
        role: 'cleaner',
        userData: {
          business_name: 'Premium Cleaning Services',
          contact_phone: '(555) 987-6543',
          bio: 'Professional cleaner with 5+ years experience',
          service_areas: ['90210', '90211', '90212'],
          services_offered: ['Deep Cleaning', 'Office Cleaning', 'Residential cleaning'],
          hourly_rate: 45,
          experience_years: 5
        }
      },
      {
        email: 'admin@demo.com',
        password: 'demo123456',
        role: 'admin',
        userData: {}
      }
    ];

    const createdUsers = [];

    for (const user of demoUsers) {
      console.log(`Creating ${user.role} user: ${user.email}`);
      
      // Create user in auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      });

      if (authError) {
        console.error(`Error creating ${user.role} user:`, authError);
        continue;
      }

      const userId = authData.user?.id;
      if (!userId) {
        console.error(`No user ID returned for ${user.role}`);
        continue;
      }

      // Create role-specific profiles
      if (user.role === 'customer') {
        const { error: profileError } = await supabaseAdmin
          .from('customer_profiles')
          .insert({
            user_id: userId,
            first_name: user.userData.first_name,
            last_name: user.userData.last_name,
            phone: user.userData.phone,
            status: 'active'
          });

        if (profileError) {
          console.error('Error creating customer profile:', profileError);
        }
      } else if (user.role === 'cleaner') {
        const { error: freelancerError } = await supabaseAdmin
          .from('freelancers')
          .insert({
            user_id: userId,
            business_name: user.userData.business_name,
            contact_phone: user.userData.contact_phone,
            bio: user.userData.bio,
            service_areas: user.userData.service_areas,
            services_offered: user.userData.services_offered,
            hourly_rate: user.userData.hourly_rate,
            experience_years: user.userData.experience_years,
            is_active: true,
            verification_status: 'approved',
            status: 'active',
            rating: 4.8,
            total_jobs: 25
          });

        if (freelancerError) {
          console.error('Error creating freelancer profile:', freelancerError);
        }
      } else if (user.role === 'admin') {
        const { error: adminError } = await supabaseAdmin
          .from('admin_users')
          .insert({
            user_id: userId,
            role: 'admin',
            permissions: ['manage_users', 'manage_orders', 'manage_services', 'manage_pricing']
          });

        if (adminError) {
          console.error('Error creating admin profile:', adminError);
        }
      }

      createdUsers.push({
        role: user.role,
        email: user.email,
        password: user.password,
        user_id: userId
      });

      console.log(`Successfully created ${user.role} user: ${user.email}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo users created successfully',
        users: createdUsers
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in create-demo-users function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});