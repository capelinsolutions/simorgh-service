import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-ACTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase client with service role key
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
    logStep("User authenticated", { userId: user.id });

    // Check if user is admin
    const { data: isUserAdmin, error: adminError } = await supabase.rpc('is_admin', { user_id: user.id });
    if (adminError || !isUserAdmin) {
      throw new Error('User is not authorized as admin');
    }

    logStep("Admin status verified");

    const { action, ...params } = await req.json();
    logStep("Action requested", { action, params });

    switch (action) {
      case 'getDashboardStats':
        return await getDashboardStats(supabase);
      case 'banUser':
        return await banUser(supabase, params.userId, params.reason);
      case 'approveFreelancer':
        return await approveFreelancer(supabase, params.freelancerId);
      case 'rejectFreelancer':
        return await rejectFreelancer(supabase, params.freelancerId, params.reason);
      case 'processRefund':
        return await processRefund(supabase, params.orderId, params.amount, params.reason);
      case 'sendAnnouncement':
        return await sendAnnouncement(supabase, user.id, params);
      case 'manageTestimonial':
        return await manageTestimonial(supabase, params.reviewId, params.approved, params.featured);
      case 'createSpecialOffer':
        return await createSpecialOffer(supabase, user.id, params);
      case 'updatePricingTier':
        return await updatePricingTier(supabase, params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function getDashboardStats(supabase: any) {
  logStep("Fetching dashboard stats");

  const [
    { data: customers, error: customersError },
    { data: freelancers, error: freelancersError },
    { data: orders, error: ordersError },
    { data: reviews, error: reviewsError },
    { data: subscribers, error: subscribersError }
  ] = await Promise.all([
    supabase.from('customer_profiles').select('id'),
    supabase.from('freelancers').select('id'),
    supabase.from('orders').select('amount, status'),
    supabase.from('booking_reviews').select('rating'),
    supabase.from('subscribers').select('subscribed')
  ]);

  if (customersError || freelancersError || ordersError || reviewsError || subscribersError) {
    throw new Error('Failed to fetch dashboard statistics');
  }

  const totalRevenue = orders?.reduce((sum: number, order: any) => sum + (order.amount || 0), 0) || 0;
  const pendingOrders = orders?.filter((order: any) => order.status === 'pending').length || 0;
  const completedOrders = orders?.filter((order: any) => order.status === 'completed').length || 0;
  const activeSubscriptions = subscribers?.filter((sub: any) => sub.subscribed).length || 0;
  const averageRating = reviews?.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.length 
    : 0;

  const stats = {
    totalCustomers: customers?.length || 0,
    totalFreelancers: freelancers?.length || 0,
    totalOrders: orders?.length || 0,
    totalRevenue,
    pendingOrders,
    activeSubscriptions,
    averageRating,
    completedOrders,
  };

  logStep("Dashboard stats calculated", stats);

  return new Response(JSON.stringify(stats), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function banUser(supabase: any, userId: string, reason: string) {
  logStep("Banning user", { userId, reason });

  // Update user status in both customer and freelancer tables
  await Promise.all([
    supabase.from('customer_profiles').update({ status: 'banned' }).eq('user_id', userId),
    supabase.from('freelancers').update({ status: 'banned' }).eq('user_id', userId)
  ]);

  // Log the action
  await supabase.from('system_activity_log').insert({
    action: 'ban_user',
    description: `User banned: ${reason}`,
    user_id: userId,
    metadata: { reason }
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function approveFreelancer(supabase: any, freelancerId: string) {
  logStep("Approving freelancer", { freelancerId });

  const { error } = await supabase
    .from('freelancers')
    .update({ verification_status: 'approved', is_active: true })
    .eq('user_id', freelancerId);

  if (error) throw error;

  // Send notification to freelancer
  await supabase.functions.invoke('send-notification', {
    body: {
      userId: freelancerId,
      title: 'Application Approved!',
      message: 'Congratulations! Your cleaner application has been approved. You can now start receiving job assignments.',
      type: 'approval'
    }
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function rejectFreelancer(supabase: any, freelancerId: string, reason: string) {
  logStep("Rejecting freelancer", { freelancerId, reason });

  const { error } = await supabase
    .from('freelancers')
    .update({ verification_status: 'rejected', is_active: false })
    .eq('user_id', freelancerId);

  if (error) throw error;

  // Send notification to freelancer
  await supabase.functions.invoke('send-notification', {
    body: {
      userId: freelancerId,
      title: 'Application Update',
      message: `Unfortunately, your cleaner application was not approved. Reason: ${reason}`,
      type: 'rejection'
    }
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function processRefund(supabase: any, orderId: string, amount: number, reason: string) {
  logStep("Processing refund", { orderId, amount, reason });

  // Update order with refund information
  const { error } = await supabase
    .from('orders')
    .update({ 
      refund_amount: amount,
      refund_reason: reason,
      status: 'refunded'
    })
    .eq('id', orderId);

  if (error) throw error;

  // Note: In a real implementation, you would integrate with Stripe's refund API here

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function sendAnnouncement(supabase: any, adminId: string, params: any) {
  const { title, message, recipientRole, scheduledAt } = params;
  logStep("Sending announcement", { title, recipientRole });

  const { error } = await supabase
    .from('admin_notifications')
    .insert({
      title,
      message,
      recipient_role: recipientRole,
      scheduled_at: scheduledAt || null,
      created_by: adminId
    });

  if (error) throw error;

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function manageTestimonial(supabase: any, reviewId: string, approved: boolean, featured: boolean) {
  logStep("Managing testimonial", { reviewId, approved, featured });

  const { error } = await supabase
    .from('booking_reviews')
    .update({ 
      admin_approved: approved,
      is_featured: featured,
      featured_priority: featured ? 1 : 0
    })
    .eq('id', reviewId);

  if (error) throw error;

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function createSpecialOffer(supabase: any, adminId: string, params: any) {
  const { name, description, type, value, code, minOrderAmount, maxUses, expiresAt, applicableServices } = params;
  logStep("Creating special offer", { name, type, value });

  const { error } = await supabase
    .from('special_offers')
    .insert({
      name,
      description,
      type,
      value,
      code,
      min_order_amount: minOrderAmount || 0,
      max_uses: maxUses,
      expires_at: expiresAt,
      applicable_services: applicableServices || [],
      created_by: adminId
    });

  if (error) throw error;

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

async function updatePricingTier(supabase: any, params: any) {
  const { id, name, description, serviceMultiplier, membershipDiscount, isActive } = params;
  logStep("Updating pricing tier", { id, name });

  if (id) {
    // Update existing
    const { error } = await supabase
      .from('pricing_tiers')
      .update({
        name,
        description,
        service_multiplier: serviceMultiplier,
        membership_discount: membershipDiscount,
        is_active: isActive
      })
      .eq('id', id);

    if (error) throw error;
  } else {
    // Create new
    const { error } = await supabase
      .from('pricing_tiers')
      .insert({
        name,
        description,
        service_multiplier: serviceMultiplier,
        membership_discount: membershipDiscount,
        is_active: isActive
      });

    if (error) throw error;
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}