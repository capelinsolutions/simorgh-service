import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-ACTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Admin action function started");

    const { action, data } = await req.json();
    
    if (!action) {
      throw new Error("Action is required");
    }

    // Use service role key to access all data
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify admin access
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Authentication required");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user) throw new Error("Invalid authentication");

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabaseClient
      .from("admin_users")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (adminError || !adminData) {
      throw new Error("Admin access required");
    }

    logStep("Admin verified", { userId: user.id, role: adminData.role });

    let result;

    switch (action) {
      case "update_subscription":
        result = await updateSubscription(supabaseClient, data);
        break;
      
      case "refund_payment":
        result = await refundPayment(supabaseClient, data);
        break;
      
      case "send_communication":
        result = await sendCommunication(supabaseClient, data, user.id);
        break;
      
      case "update_user_status":
        result = await updateUserStatus(supabaseClient, data);
        break;
      
      case "update_system_setting":
        result = await updateSystemSetting(supabaseClient, data, user.id);
        break;
      
      case "get_dashboard_stats":
        result = await getDashboardStats(supabaseClient);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    logStep("Admin action completed", { action, success: true });

    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    logStep("ERROR in admin-action", { message: error.message });
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function updateSubscription(supabaseClient: any, data: any) {
  const { subscriptionId, updates } = data;
  
  const { data: result, error } = await supabaseClient
    .from("subscribers")
    .update(updates)
    .eq("id", subscriptionId)
    .select()
    .single();

  if (error) throw error;
  return result;
}

async function refundPayment(supabaseClient: any, data: any) {
  const { orderId, amount, reason } = data;
  
  // Update order with refund information
  const { data: result, error } = await supabaseClient
    .from("orders")
    .update({
      refund_amount: amount,
      refund_reason: reason,
      status: "refunded",
      updated_at: new Date().toISOString()
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  
  // Here you would also integrate with Stripe to process the actual refund
  // const stripeRefund = await stripe.refunds.create({ ... });
  
  return result;
}

async function sendCommunication(supabaseClient: any, data: any, adminId: string) {
  const { type, recipientType, subject, message, recipientId } = data;
  
  const { data: result, error } = await supabaseClient
    .from("communications")
    .insert({
      type,
      recipient_type: recipientType,
      recipient_id: recipientId || null,
      subject,
      message,
      status: "sent",
      sent_at: new Date().toISOString(),
      created_by: adminId
    })
    .select()
    .single();

  if (error) throw error;
  
  // Here you would integrate with your email service (Resend, etc.)
  // await sendActualEmail(result);
  
  return result;
}

async function updateUserStatus(supabaseClient: any, data: any) {
  const { userId, isActive } = data;
  
  // Update freelancer status if applicable
  const { data: freelancerResult } = await supabaseClient
    .from("freelancers")
    .update({ is_active: isActive })
    .eq("user_id", userId)
    .select();

  return { freelancerUpdated: !!freelancerResult };
}

async function updateSystemSetting(supabaseClient: any, data: any, adminId: string) {
  const { key, value, description } = data;
  
  const { data: result, error } = await supabaseClient
    .from("system_settings")
    .upsert({
      key,
      value: JSON.stringify(value),
      description,
      updated_by: adminId,
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' })
    .select()
    .single();

  if (error) throw error;
  return result;
}

async function getDashboardStats(supabaseClient: any) {
  const [
    { count: totalUsers },
    { count: totalFreelancers },
    { data: orders },
    { count: activeSubscriptions }
  ] = await Promise.all([
    supabaseClient.from('admin_users').select('id', { count: 'exact', head: true }),
    supabaseClient.from('freelancers').select('id', { count: 'exact', head: true }),
    supabaseClient.from('orders').select('amount, status'),
    supabaseClient.from('subscribers').select('id', { count: 'exact', head: true }).eq('subscribed', true)
  ]);

  const totalRevenue = orders?.reduce((sum: number, order: any) => sum + (order.amount || 0), 0) || 0;
  const pendingOrders = orders?.filter((order: any) => order.status === 'pending').length || 0;

  return {
    totalUsers: totalUsers || 0,
    totalFreelancers: totalFreelancers || 0,
    totalOrders: orders?.length || 0,
    totalRevenue: totalRevenue / 100, // Convert from cents
    activeSubscriptions: activeSubscriptions || 0,
    pendingOrders
  };
}