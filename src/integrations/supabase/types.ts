export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          recipient_id: string | null
          recipient_role: string | null
          scheduled_at: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          recipient_id?: string | null
          recipient_role?: string | null
          scheduled_at?: string | null
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          recipient_id?: string | null
          recipient_role?: string | null
          scheduled_at?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          permissions: string[] | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          permissions?: string[] | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          permissions?: string[] | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      booking_reviews: {
        Row: {
          admin_approved: boolean | null
          admin_notes: string | null
          booking_id: string
          cleaner_id: string | null
          created_at: string
          customer_id: string
          featured_priority: number | null
          id: string
          is_featured: boolean | null
          rating: number
          review_text: string | null
          updated_at: string
        }
        Insert: {
          admin_approved?: boolean | null
          admin_notes?: string | null
          booking_id: string
          cleaner_id?: string | null
          created_at?: string
          customer_id: string
          featured_priority?: number | null
          id?: string
          is_featured?: boolean | null
          rating: number
          review_text?: string | null
          updated_at?: string
        }
        Update: {
          admin_approved?: boolean | null
          admin_notes?: string | null
          booking_id?: string
          cleaner_id?: string | null
          created_at?: string
          customer_id?: string
          featured_priority?: number | null
          id?: string
          is_featured?: boolean | null
          rating?: number
          review_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaner_earnings: {
        Row: {
          amount: number
          cleaner_id: string
          created_at: string
          currency: string | null
          id: string
          order_id: string
          paid_at: string | null
          status: string | null
          stripe_transfer_id: string | null
        }
        Insert: {
          amount: number
          cleaner_id: string
          created_at?: string
          currency?: string | null
          id?: string
          order_id: string
          paid_at?: string | null
          status?: string | null
          stripe_transfer_id?: string | null
        }
        Update: {
          amount?: number
          cleaner_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          order_id?: string
          paid_at?: string | null
          status?: string | null
          stripe_transfer_id?: string | null
        }
        Relationships: []
      }
      cleaner_notifications: {
        Row: {
          cleaner_id: string
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: string
        }
        Insert: {
          cleaner_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type?: string
        }
        Update: {
          cleaner_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      communications: {
        Row: {
          created_at: string
          created_by: string
          id: string
          message: string
          metadata: Json | null
          recipient_id: string | null
          recipient_type: string
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          template_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          message: string
          metadata?: Json | null
          recipient_id?: string | null
          recipient_type: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          message?: string
          metadata?: Json | null
          recipient_id?: string | null
          recipient_type?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_addresses: {
        Row: {
          city: string
          created_at: string
          id: string
          is_default: boolean | null
          label: string
          state: string
          street_address: string
          updated_at: string
          user_id: string
          zip_code: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          label: string
          state: string
          street_address: string
          updated_at?: string
          user_id: string
          zip_code: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          label?: string
          state?: string
          street_address?: string
          updated_at?: string
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          profile_image_url: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      freelancers: {
        Row: {
          availability: Json | null
          bio: string | null
          business_name: string | null
          certifications: string[] | null
          contact_phone: string | null
          created_at: string
          current_active_jobs: number | null
          documents: Json | null
          experience_years: number | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          max_concurrent_jobs: number | null
          profile_image_url: string | null
          rating: number | null
          service_areas: string[]
          services_offered: string[]
          status: string | null
          stripe_account_id: string | null
          total_jobs: number | null
          updated_at: string
          user_id: string
          verification_status: string | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          business_name?: string | null
          certifications?: string[] | null
          contact_phone?: string | null
          created_at?: string
          current_active_jobs?: number | null
          documents?: Json | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          max_concurrent_jobs?: number | null
          profile_image_url?: string | null
          rating?: number | null
          service_areas?: string[]
          services_offered?: string[]
          status?: string | null
          stripe_account_id?: string | null
          total_jobs?: number | null
          updated_at?: string
          user_id: string
          verification_status?: string | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          business_name?: string | null
          certifications?: string[] | null
          contact_phone?: string | null
          created_at?: string
          current_active_jobs?: number | null
          documents?: Json | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          max_concurrent_jobs?: number | null
          profile_image_url?: string | null
          rating?: number | null
          service_areas?: string[]
          services_offered?: string[]
          status?: string | null
          stripe_account_id?: string | null
          total_jobs?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offer_usage: {
        Row: {
          created_at: string
          discount_amount: number
          id: string
          offer_id: string
          order_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          discount_amount: number
          id?: string
          offer_id: string
          order_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          discount_amount?: number
          id?: string
          offer_id?: string
          order_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offer_usage_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "special_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_assignments: {
        Row: {
          accepted_at: string | null
          assigned_at: string
          created_at: string
          freelancer_id: string
          id: string
          order_id: string
          rejected_at: string | null
          status: string | null
        }
        Insert: {
          accepted_at?: string | null
          assigned_at?: string
          created_at?: string
          freelancer_id: string
          id?: string
          order_id: string
          rejected_at?: string | null
          status?: string | null
        }
        Update: {
          accepted_at?: string | null
          assigned_at?: string
          created_at?: string
          freelancer_id?: string
          id?: string
          order_id?: string
          rejected_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_assignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          amount: number
          assigned_freelancer_id: string | null
          assignment_status: string | null
          created_at: string
          currency: string | null
          customer_address_id: string | null
          customer_email: string
          customer_zip_code: string | null
          duration_hours: number | null
          has_membership_discount: boolean | null
          id: string
          is_guest_order: boolean | null
          original_amount: number | null
          payment_method: string | null
          preferred_date: string | null
          preferred_time: string | null
          refund_amount: number | null
          refund_reason: string | null
          selected_addons: Json | null
          service_description: string | null
          service_name: string
          special_instructions: string | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          assigned_freelancer_id?: string | null
          assignment_status?: string | null
          created_at?: string
          currency?: string | null
          customer_address_id?: string | null
          customer_email: string
          customer_zip_code?: string | null
          duration_hours?: number | null
          has_membership_discount?: boolean | null
          id?: string
          is_guest_order?: boolean | null
          original_amount?: number | null
          payment_method?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          selected_addons?: Json | null
          service_description?: string | null
          service_name: string
          special_instructions?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          assigned_freelancer_id?: string | null
          assignment_status?: string | null
          created_at?: string
          currency?: string | null
          customer_address_id?: string | null
          customer_email?: string
          customer_zip_code?: string | null
          duration_hours?: number | null
          has_membership_discount?: boolean | null
          id?: string
          is_guest_order?: boolean | null
          original_amount?: number | null
          payment_method?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          selected_addons?: Json | null
          service_description?: string | null
          service_name?: string
          special_instructions?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_address_id_fkey"
            columns: ["customer_address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_tiers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          membership_discount: number | null
          name: string
          service_multiplier: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          membership_discount?: number | null
          name: string
          service_multiplier?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          membership_discount?: number | null
          name?: string
          service_multiplier?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      service_addons: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price_per_hour: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price_per_hour: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price_per_hour?: number
          updated_at?: string
        }
        Relationships: []
      }
      special_offers: {
        Row: {
          applicable_services: string[] | null
          code: string | null
          created_at: string
          created_by: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_order_amount: number | null
          name: string
          starts_at: string
          type: string
          updated_at: string
          uses_count: number | null
          value: number
        }
        Insert: {
          applicable_services?: string[] | null
          code?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          name: string
          starts_at?: string
          type: string
          updated_at?: string
          uses_count?: number | null
          value: number
        }
        Update: {
          applicable_services?: string[] | null
          code?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          name?: string
          starts_at?: string
          type?: string
          updated_at?: string
          uses_count?: number | null
          value?: number
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          membership_type: string | null
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          membership_type?: string | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          membership_type?: string | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      system_activity_log: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
    }
    Views: {
      freelancer_public_profiles: {
        Row: {
          bio: string | null
          business_name: string | null
          certifications: string[] | null
          created_at: string | null
          experience_years: number | null
          hourly_rate: number | null
          id: string | null
          profile_image_url: string | null
          rating: number | null
          service_areas: string[] | null
          services_offered: string[] | null
          total_jobs: number | null
          user_id: string | null
          verification_status: string | null
        }
        Insert: {
          bio?: string | null
          business_name?: string | null
          certifications?: string[] | null
          created_at?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string | null
          profile_image_url?: string | null
          rating?: number | null
          service_areas?: string[] | null
          services_offered?: string[] | null
          total_jobs?: number | null
          user_id?: string | null
          verification_status?: string | null
        }
        Update: {
          bio?: string | null
          business_name?: string | null
          certifications?: string[] | null
          created_at?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string | null
          profile_image_url?: string | null
          rating?: number | null
          service_areas?: string[] | null
          services_offered?: string[] | null
          total_jobs?: number | null
          user_id?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      auto_assign_order: {
        Args: { order_id: string }
        Returns: boolean
      }
      get_admin_role: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_admin_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin_or_super: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
