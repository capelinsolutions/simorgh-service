import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AUTO-ASSIGN] ${step}${detailsStr}`);
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

    const { orderId } = await req.json();
    logStep("Processing order assignment", { orderId });

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    logStep("Order found", { orderStatus: order.status, zipCode: order.customer_zip_code });

    // Skip if order is already assigned or completed
    if (order.assignment_status !== 'pending') {
      return new Response(JSON.stringify({ message: 'Order already processed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Find available freelancers in the area
    const { data: freelancers, error: freelancersError } = await supabase
      .from('freelancers')
      .select('user_id, business_name, rating, total_jobs, current_active_jobs, max_concurrent_jobs')
      .eq('is_active', true)
      .eq('verification_status', 'approved')
      .neq('status', 'banned')
      .contains('service_areas', [order.customer_zip_code])
      .order('rating', { ascending: false })
      .order('total_jobs', { ascending: true });

    if (freelancersError) {
      throw new Error('Failed to fetch freelancers');
    }

    if (!freelancers || freelancers.length === 0) {
      logStep("No freelancers found for area", { zipCode: order.customer_zip_code });
      
      // Update order status to indicate no freelancers available
      await supabase
        .from('orders')
        .update({ 
          assignment_status: 'no_freelancers_available',
          admin_notes: 'No freelancers available in the requested area'
        })
        .eq('id', orderId);

      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No freelancers available in this area' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Filter freelancers who aren't overbooked
    const availableFreelancers = freelancers.filter(f => 
      (f.current_active_jobs || 0) < (f.max_concurrent_jobs || 3)
    );

    if (availableFreelancers.length === 0) {
      logStep("All freelancers are overbooked");
      
      await supabase
        .from('orders')
        .update({ 
          assignment_status: 'freelancers_overbooked',
          admin_notes: 'All freelancers in the area are currently overbooked'
        })
        .eq('id', orderId);

      return new Response(JSON.stringify({ 
        success: false, 
        message: 'All freelancers are currently overbooked' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Assign to top 3 available freelancers
    const topFreelancers = availableFreelancers.slice(0, 3);
    logStep("Assigning to top freelancers", { count: topFreelancers.length });

    const assignments = topFreelancers.map(freelancer => ({
      order_id: orderId,
      freelancer_id: freelancer.user_id,
      status: 'offered'
    }));

    const { error: assignmentError } = await supabase
      .from('order_assignments')
      .insert(assignments);

    if (assignmentError) {
      throw new Error('Failed to create assignments');
    }

    // Update order status
    await supabase
      .from('orders')
      .update({ assignment_status: 'assigned' })
      .eq('id', orderId);

    // Send notifications to assigned freelancers
    for (const freelancer of topFreelancers) {
      await supabase.functions.invoke('send-notification', {
        body: {
          userId: freelancer.user_id,
          title: 'New Job Assignment!',
          message: `You have been assigned a new ${order.service_name} job. Check your dashboard to accept or decline.`,
          type: 'job_assignment',
          relatedId: orderId
        }
      });
    }

    // Log successful assignment
    await supabase.from('system_activity_log').insert({
      action: 'auto_assign_order',
      description: `Order ${orderId} assigned to ${topFreelancers.length} freelancers`,
      metadata: { 
        orderId, 
        assignedTo: topFreelancers.map(f => f.user_id),
        service: order.service_name,
        zipCode: order.customer_zip_code
      }
    });

    logStep("Assignment completed successfully", { assignedCount: topFreelancers.length });

    return new Response(JSON.stringify({ 
      success: true, 
      assignedCount: topFreelancers.length 
    }), {
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