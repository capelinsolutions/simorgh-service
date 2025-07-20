import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientType, subject, message, type = 'email' } = await req.json();

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

    console.log("Admin verified for communication:", { userId: user.id, role: adminData.role });

    // Get recipients based on type
    let recipients: string[] = [];
    
    switch (recipientType) {
      case 'all':
        // Get all user emails (this would need a different approach in production)
        const { data: allUsers } = await supabaseClient.auth.admin.listUsers();
        recipients = allUsers.users?.map(u => u.email).filter(Boolean) || [];
        break;
      
      case 'customers':
        const { data: customerSubs } = await supabaseClient
          .from('subscribers')
          .select('email')
          .eq('membership_type', 'customer');
        recipients = customerSubs?.map(s => s.email) || [];
        break;
      
      case 'freelancers':
        const { data: freelancerSubs } = await supabaseClient
          .from('subscribers')
          .select('email')
          .eq('membership_type', 'freelancer');
        recipients = freelancerSubs?.map(s => s.email) || [];
        break;
      
      case 'subscribers':
        const { data: allSubs } = await supabaseClient
          .from('subscribers')
          .select('email')
          .eq('subscribed', true);
        recipients = allSubs?.map(s => s.email) || [];
        break;
      
      default:
        throw new Error("Invalid recipient type");
    }

    console.log(`Found ${recipients.length} recipients for ${recipientType}`);

    if (recipients.length === 0) {
      throw new Error("No recipients found for the specified type");
    }

    let result;
    
    if (type === 'email') {
      // Initialize Resend
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (!resendKey) {
        throw new Error("Resend API key not configured");
      }

      const resend = new Resend(resendKey);

      // Send emails (in batches to avoid rate limits)
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < recipients.length; i += batchSize) {
        batches.push(recipients.slice(i, i + batchSize));
      }

      let sentCount = 0;
      const errors: string[] = [];

      for (const batch of batches) {
        try {
          const { data, error } = await resend.emails.send({
            from: 'Simorgh Service Group <admin@simorgh.com>',
            to: batch,
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Simorgh Service Group</h1>
                </div>
                <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-radius: 0 0 10px 10px;">
                  <h2 style="color: #333; margin-top: 0;">${subject}</h2>
                  <div style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</div>
                  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e1e5e9;">
                  <p style="color: #888; font-size: 14px; margin: 0;">
                    This message was sent by the Simorgh Service Group admin team.
                    <br>If you have any questions, please contact our support team.
                  </p>
                </div>
              </div>
            `,
          });

          if (error) {
            console.error("Resend error for batch:", error);
            errors.push(`Batch error: ${error.message}`);
          } else {
            sentCount += batch.length;
            console.log(`Successfully sent to batch of ${batch.length} recipients`);
          }
        } catch (batchError: any) {
          console.error("Batch sending error:", batchError);
          errors.push(`Batch error: ${batchError.message}`);
        }
      }

      result = {
        type: 'email',
        totalRecipients: recipients.length,
        sentCount,
        errors: errors.length > 0 ? errors : undefined
      };
    }

    // Log the communication in database
    const { data: commLog, error: logError } = await supabaseClient
      .from("communications")
      .insert({
        type,
        recipient_type: recipientType,
        subject,
        message,
        status: result?.sentCount > 0 ? 'sent' : 'failed',
        sent_at: new Date().toISOString(),
        created_by: user.id,
        metadata: result
      })
      .select()
      .single();

    if (logError) {
      console.error("Failed to log communication:", logError);
    }

    console.log("Communication completed:", result);

    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error in send-communication:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});