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

    console.log('Deleting existing demo users...');
    
    // Delete existing demo users from auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const demoEmails = ['customer@demo.com', 'cleaner@demo.com', 'admin@demo.com', 'test123@gmail.com']
    
    for (const user of existingUsers?.users || []) {
      if (demoEmails.includes(user.email || '')) {
        await supabaseAdmin.auth.admin.deleteUser(user.id)
        console.log(`Deleted user: ${user.email}`)
      }
    }

    console.log('Creating new demo users...');

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
          business_name: 'Elite Cleaning Services',
          contact_phone: '+1-555-0123',
          bio: 'Professional cleaning specialist with 7+ years of experience. I take pride in delivering exceptional cleaning services with attention to detail. Specialized in residential, commercial, and deep cleaning. Eco-friendly cleaning options available. Licensed, insured, and background checked.',
          service_areas: ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010'],
          services_offered: ['Residential Cleaning', 'Deep Cleaning', 'Move-in/Move-out Cleaning', 'Office Cleaning', 'Post-Construction Cleaning'],
          hourly_rate: 50,
          experience_years: 7,
          certifications: ['Certified Professional Cleaner', 'Green Cleaning Specialist', 'IICRC Certified', 'OSHA Safety Certified'],
          max_concurrent_jobs: 8,
          rating: 4.9,
          total_jobs: 150,
          availability: {
            monday: { available: true, hours: '9:00 AM - 6:00 PM' },
            tuesday: { available: true, hours: '9:00 AM - 6:00 PM' },
            wednesday: { available: true, hours: '9:00 AM - 6:00 PM' },
            thursday: { available: true, hours: '9:00 AM - 6:00 PM' },
            friday: { available: true, hours: '9:00 AM - 6:00 PM' },
            saturday: { available: true, hours: '10:00 AM - 4:00 PM' },
            sunday: { available: false, hours: 'Closed' }
          }
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
            certifications: user.userData.certifications,
            max_concurrent_jobs: user.userData.max_concurrent_jobs,
            is_active: true,
            verification_status: 'verified',
            status: 'active',
            rating: user.userData.rating,
            total_jobs: user.userData.total_jobs,
            availability: user.userData.availability,
            current_active_jobs: 0,
            documents: []
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
