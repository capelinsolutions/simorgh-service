import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AUTO-ASSIGN] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Auto-assignment function started");

    const { orderId } = await req.json();
    
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // Use service role key to access all data
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    logStep("Getting order details", { orderId });

    // Get order details
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) {
      throw new Error(`Failed to fetch order: ${orderError.message}`);
    }

    if (!order) {
      throw new Error("Order not found");
    }

    logStep("Order found", { 
      orderZip: order.customer_zip_code, 
      serviceName: order.service_name,
      currentStatus: order.assignment_status 
    });

    // Skip if order is already assigned or no zip code
    if (order.assignment_status !== 'pending' || !order.customer_zip_code) {
      logStep("Skipping assignment", { 
        reason: order.assignment_status !== 'pending' ? 'Already assigned' : 'No zip code' 
      });
      return new Response(JSON.stringify({ 
        success: false, 
        reason: order.assignment_status !== 'pending' ? 'Order already assigned' : 'No zip code provided'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Find available freelancers in the area
    logStep("Searching for freelancers", { zipCode: order.customer_zip_code });

    const { data: freelancers, error: freelancersError } = await supabaseClient
      .from("freelancers")
      .select("user_id, business_name, service_areas, services_offered, rating, total_jobs")
      .eq("is_active", true);

    if (freelancersError) {
      throw new Error(`Failed to fetch freelancers: ${freelancersError.message}`);
    }

    logStep("Found freelancers", { count: freelancers?.length || 0 });

    // Filter freelancers by zip code and service type
    const availableFreelancers = freelancers?.filter(freelancer => {
      const servesArea = freelancer.service_areas?.includes(order.customer_zip_code);
      const offersService = !freelancer.services_offered?.length || 
                           freelancer.services_offered?.includes(order.service_name);
      
      logStep("Checking freelancer", {
        freelancerId: freelancer.user_id,
        businessName: freelancer.business_name,
        servesArea,
        offersService,
        serviceAreas: freelancer.service_areas,
        servicesOffered: freelancer.services_offered
      });

      return servesArea && offersService;
    }) || [];

    logStep("Filtered available freelancers", { count: availableFreelancers.length });

    if (availableFreelancers.length === 0) {
      logStep("No available freelancers found");
      return new Response(JSON.stringify({ 
        success: false, 
        reason: 'No available freelancers in the area' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Sort by rating (desc) then by total jobs (asc) to prefer higher-rated, less busy freelancers
    availableFreelancers.sort((a, b) => {
      if (b.rating !== a.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      return (a.total_jobs || 0) - (b.total_jobs || 0);
    });

    // Assign to top 3 freelancers (or all if less than 3)
    const assignmentCount = Math.min(3, availableFreelancers.length);
    const assignments = [];

    logStep("Creating assignments", { count: assignmentCount });

    for (let i = 0; i < assignmentCount; i++) {
      const freelancer = availableFreelancers[i];
      
      const { data: assignment, error: assignmentError } = await supabaseClient
        .from("order_assignments")
        .insert({
          order_id: orderId,
          freelancer_id: freelancer.user_id,
          status: 'offered'
        })
        .select()
        .single();

      if (assignmentError) {
        logStep("Assignment creation failed", { 
          freelancerId: freelancer.user_id, 
          error: assignmentError.message 
        });
        continue;
      }

      assignments.push(assignment);
      logStep("Assignment created", {
        assignmentId: assignment.id,
        freelancerId: freelancer.user_id,
        businessName: freelancer.business_name
      });
    }

    if (assignments.length > 0) {
      // Update order status
      const { error: updateError } = await supabaseClient
        .from("orders")
        .update({ 
          assignment_status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (updateError) {
        logStep("Order status update failed", { error: updateError.message });
      } else {
        logStep("Order status updated to assigned");
      }
    }

    logStep("Auto-assignment completed", { 
      assignmentsCreated: assignments.length,
      orderId: orderId
    });

    return new Response(JSON.stringify({
      success: true,
      assignmentsCreated: assignments.length,
      assignments: assignments.map(a => ({
        id: a.id,
        freelancerId: a.freelancer_id,
        status: a.status
      }))
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    logStep("ERROR in auto-assign", { message: error.message });
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});