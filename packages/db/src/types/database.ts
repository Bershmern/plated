export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chains: {
        Row: {
          id: string;
          name: string;
          slug: string;
          accent_hex: string;
          accent_ink: string;
          display_name: string;
          logo_url: string | null;
          logo_mono_url: string | null;
          status: 'active' | 'suspended';
          cancel_window: 'incoming_only' | 'through_processing';
          recognition_window_days: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          accent_hex: string;
          accent_ink: string;
          display_name: string;
          logo_url?: string | null;
          logo_mono_url?: string | null;
          status?: 'active' | 'suspended';
          cancel_window?: 'incoming_only' | 'through_processing';
          recognition_window_days?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          accent_hex?: string;
          accent_ink?: string;
          display_name?: string;
          logo_url?: string | null;
          logo_mono_url?: string | null;
          status?: 'active' | 'suspended';
          cancel_window?: 'incoming_only' | 'through_processing';
          recognition_window_days?: number;
          created_at?: string;
        };
      };
      outlets: {
        Row: {
          id: string;
          chain_id: string;
          name: string;
          slug: string;
          address: string | null;
          city: string | null;
          state: string | null;
          timezone: string;
          service_day_start: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          chain_id: string;
          name: string;
          slug: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          timezone?: string;
          service_day_start?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          chain_id?: string;
          name?: string;
          slug?: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          timezone?: string;
          service_day_start?: string;
          is_active?: boolean;
        };
      };
      menu_categories: {
        Row: {
          id: string;
          chain_id: string;
          name: string;
          position: number;
        };
        Insert: {
          id?: string;
          chain_id: string;
          name: string;
          position?: number;
        };
        Update: {
          id?: string;
          chain_id?: string;
          name?: string;
          position?: number;
        };
      };
      menu_items: {
        Row: {
          id: string;
          chain_id: string;
          category_id: string;
          name: string;
          description: string | null;
          price_minor: number;
          currency: string;
          image_url: string | null;
          image_ready: boolean;
          is_active: boolean;
          position: number;
        };
        Insert: {
          id?: string;
          chain_id: string;
          category_id: string;
          name: string;
          description?: string | null;
          price_minor: number;
          currency?: string;
          image_url?: string | null;
          image_ready?: boolean;
          is_active?: boolean;
          position?: number;
        };
        Update: {
          id?: string;
          chain_id?: string;
          category_id?: string;
          name?: string;
          description?: string | null;
          price_minor?: number;
          currency?: string;
          image_url?: string | null;
          image_ready?: boolean;
          is_active?: boolean;
          position?: number;
        };
      };
      option_groups: {
        Row: {
          id: string;
          chain_id: string;
          menu_item_id: string;
          name: string;
          min_select: number;
          max_select: number;
          position: number;
        };
        Insert: {
          id?: string;
          chain_id: string;
          menu_item_id: string;
          name: string;
          min_select?: number;
          max_select?: number;
          position?: number;
        };
        Update: {
          id?: string;
          chain_id?: string;
          menu_item_id?: string;
          name?: string;
          min_select?: number;
          max_select?: number;
          position?: number;
        };
      };
      options: {
        Row: {
          id: string;
          option_group_id: string;
          name: string;
          price_delta_minor: number;
          is_active: boolean;
          position: number;
        };
        Insert: {
          id?: string;
          option_group_id: string;
          name: string;
          price_delta_minor?: number;
          is_active?: boolean;
          position?: number;
        };
        Update: {
          id?: string;
          option_group_id?: string;
          name?: string;
          price_delta_minor?: number;
          is_active?: boolean;
          position?: number;
        };
      };
      outlet_menu_items: {
        Row: {
          outlet_id: string;
          menu_item_id: string;
          is_listed: boolean;
          in_stock: boolean;
          restock_at: string | null;
        };
        Insert: {
          outlet_id: string;
          menu_item_id: string;
          is_listed?: boolean;
          in_stock?: boolean;
          restock_at?: string | null;
        };
        Update: {
          outlet_id?: string;
          menu_item_id?: string;
          is_listed?: boolean;
          in_stock?: boolean;
          restock_at?: string | null;
        };
      };
      diner_devices: {
        Row: {
          id: string;
          first_seen_at: string;
          last_seen_at: string;
        };
        Insert: {
          id?: string;
          first_seen_at?: string;
          last_seen_at?: string;
        };
        Update: {
          id?: string;
          first_seen_at?: string;
          last_seen_at?: string;
        };
      };
      diner_profiles: {
        Row: {
          id: string;
          device_id: string;
          chain_id: string;
          order_count: number;
          last_order_id: string | null;
          first_order_at: string | null;
          last_order_at: string | null;
          last_seen_at: string | null;
        };
        Insert: {
          id?: string;
          device_id: string;
          chain_id: string;
          order_count?: number;
          last_order_id?: string | null;
          first_order_at?: string | null;
          last_order_at?: string | null;
          last_seen_at?: string | null;
        };
        Update: {
          id?: string;
          device_id?: string;
          chain_id?: string;
          order_count?: number;
          last_order_id?: string | null;
          first_order_at?: string | null;
          last_order_at?: string | null;
          last_seen_at?: string | null;
        };
      };
      table_sessions: {
        Row: {
          id: string;
          chain_id: string;
          outlet_id: string;
          table_label: string;
          status: 'open' | 'settled' | 'void';
          cash_collected_minor: number;
          service_day: string;
          opened_at: string;
          settled_at: string | null;
          settled_by: string | null;
        };
        Insert: {
          id?: string;
          chain_id: string;
          outlet_id: string;
          table_label: string;
          status?: 'open' | 'settled' | 'void';
          cash_collected_minor?: number;
          service_day?: string;
          opened_at?: string;
          settled_at?: string | null;
          settled_by?: string | null;
        };
        Update: {
          id?: string;
          chain_id?: string;
          outlet_id?: string;
          table_label?: string;
          status?: 'open' | 'settled' | 'void';
          cash_collected_minor?: number;
          service_day?: string;
          opened_at?: string;
          settled_at?: string | null;
          settled_by?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          chain_id: string;
          outlet_id: string;
          session_id: string;
          diner_profile_id: string;
          status: 'incoming' | 'processing' | 'delivered' | 'cancelled';
          cancel_reason: 'cancelled' | 'wasted' | 'other' | null;
          cancel_note: string | null;
          cancelled_by: string | null;
          subtotal_minor: number;
          total_minor: number;
          currency: string;
          client_created_at: string | null;
          placed_at: string;
          idempotency_key: string;
        };
        Insert: {
          id?: string;
          chain_id: string;
          outlet_id: string;
          session_id: string;
          diner_profile_id: string;
          status?: 'incoming' | 'processing' | 'delivered' | 'cancelled';
          cancel_reason?: 'cancelled' | 'wasted' | 'other' | null;
          cancel_note?: string | null;
          cancelled_by?: string | null;
          subtotal_minor: number;
          total_minor: number;
          currency?: string;
          client_created_at?: string | null;
          placed_at?: string;
          idempotency_key: string;
        };
        Update: {
          id?: string;
          chain_id?: string;
          outlet_id?: string;
          session_id?: string;
          diner_profile_id?: string;
          status?: 'incoming' | 'processing' | 'delivered' | 'cancelled';
          cancel_reason?: 'cancelled' | 'wasted' | 'other' | null;
          cancel_note?: string | null;
          cancelled_by?: string | null;
          subtotal_minor?: number;
          total_minor?: number;
          currency?: string;
          client_created_at?: string | null;
          placed_at?: string;
          idempotency_key?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          qty: number;
          position: number;
          notes: string | null;
          name_snapshot: string;
          price_minor_snapshot: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          qty: number;
          position?: number;
          notes?: string | null;
          name_snapshot: string;
          price_minor_snapshot: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string;
          qty?: number;
          position?: number;
          notes?: string | null;
          name_snapshot?: string;
          price_minor_snapshot?: number;
        };
      };
      order_item_options: {
        Row: {
          id: string;
          order_item_id: string;
          option_id: string;
          name_snapshot: string;
          price_delta_minor_snapshot: number;
        };
        Insert: {
          id?: string;
          order_item_id: string;
          option_id: string;
          name_snapshot: string;
          price_delta_minor_snapshot: number;
        };
        Update: {
          id?: string;
          order_item_id?: string;
          option_id?: string;
          name_snapshot?: string;
          price_delta_minor_snapshot?: number;
        };
      };
      print_jobs: {
        Row: {
          id: string;
          chain_id: string;
          outlet_id: string;
          order_id: string | null;
          session_id: string | null;
          type: 'kitchen_ticket' | 'order_receipt' | 'bill';
          status: 'sent' | 'failed_to_send';
          attempt: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          chain_id: string;
          outlet_id: string;
          order_id?: string | null;
          session_id?: string | null;
          type: 'kitchen_ticket' | 'order_receipt' | 'bill';
          status?: 'sent' | 'failed_to_send';
          attempt?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          chain_id?: string;
          outlet_id?: string;
          order_id?: string | null;
          session_id?: string | null;
          type?: 'kitchen_ticket' | 'order_receipt' | 'bill';
          status?: 'sent' | 'failed_to_send';
          attempt?: number;
          created_at?: string;
        };
      };
      staff_users: {
        Row: {
          id: string;
          chain_id: string;
          outlet_id: string | null;
          role: 'counter' | 'manager' | 'owner';
          name: string;
          is_active: boolean;
        };
        Insert: {
          id: string;
          chain_id: string;
          outlet_id?: string | null;
          role: 'counter' | 'manager' | 'owner';
          name: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          chain_id?: string;
          outlet_id?: string | null;
          role?: 'counter' | 'manager' | 'owner';
          name?: string;
          is_active?: boolean;
        };
      };
      platform_users: {
        Row: {
          id: string;
          name: string;
          role: 'support' | 'admin';
          is_active: boolean;
        };
        Insert: {
          id: string;
          name: string;
          role: 'support' | 'admin';
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          role?: 'support' | 'admin';
          is_active?: boolean;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          chain_id: string;
          tier: 'tablet' | 'software_only';
          setup_fee_minor: number;
          retainer_minor: number;
          outlet_count: number;
          status: 'active' | 'past_due' | 'suspended';
          paystack_customer_id: string | null;
          paystack_subscription_code: string | null;
          paystack_email: string | null;
          current_period_start: string;
          current_period_end: string;
          grace_until: string | null;
          onboarding_until: string | null;
        };
        Insert: {
          id?: string;
          chain_id: string;
          tier: 'tablet' | 'software_only';
          setup_fee_minor: number;
          retainer_minor: number;
          outlet_count: number;
          status?: 'active' | 'past_due' | 'suspended';
          paystack_customer_id?: string | null;
          paystack_subscription_code?: string | null;
          paystack_email?: string | null;
          current_period_start: string;
          current_period_end: string;
          grace_until?: string | null;
          onboarding_until?: string | null;
        };
        Update: {
          id?: string;
          chain_id?: string;
          tier?: 'tablet' | 'software_only';
          setup_fee_minor?: number;
          retainer_minor?: number;
          outlet_count?: number;
          status?: 'active' | 'past_due' | 'suspended';
          paystack_customer_id?: string | null;
          paystack_subscription_code?: string | null;
          paystack_email?: string | null;
          current_period_start?: string;
          current_period_end?: string;
          grace_until?: string | null;
          onboarding_until?: string | null;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          body: string;
          target_chain_id: string | null;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          target_chain_id?: string | null;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          target_chain_id?: string | null;
          created_at?: string;
          expires_at?: string | null;
        };
      };
      invoices: {
        Row: {
          id: string;
          chain_id: string;
          subscription_id: string;
          period_start: string;
          period_end: string;
          amount_minor: number;
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
          due_at: string;
          paid_at: string | null;
          note: string | null;
        };
        Insert: {
          id?: string;
          chain_id: string;
          subscription_id: string;
          period_start: string;
          period_end: string;
          amount_minor: number;
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
          due_at: string;
          paid_at?: string | null;
          note?: string | null;
        };
        Update: {
          id?: string;
          chain_id?: string;
          subscription_id?: string;
          period_start?: string;
          period_end?: string;
          amount_minor?: number;
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
          due_at?: string;
          paid_at?: string | null;
          note?: string | null;
        };
      };
      support_tickets: {
        Row: {
          id: string;
          chain_id: string;
          outlet_id: string | null;
          opened_by: string;
          subject: string;
          body: string;
          status: 'open' | 'pending' | 'resolved';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          chain_id: string;
          outlet_id?: string | null;
          opened_by: string;
          subject: string;
          body: string;
          status?: 'open' | 'pending' | 'resolved';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          chain_id?: string;
          outlet_id?: string | null;
          opened_by?: string;
          subject?: string;
          body?: string;
          status?: 'open' | 'pending' | 'resolved';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          created_at?: string;
          resolved_at?: string | null;
        };
      };
      image_credit_ledger: {
        Row: {
          id: string;
          chain_id: string;
          delta: number;
          reason: 'monthly_grant' | 'purchase' | 'process' | 'adjustment';
          menu_item_id: string | null;
          at: string;
        };
        Insert: {
          id?: string;
          chain_id: string;
          delta: number;
          reason: 'monthly_grant' | 'purchase' | 'process' | 'adjustment';
          menu_item_id?: string | null;
          at?: string;
        };
        Update: {
          id?: string;
          chain_id?: string;
          delta?: number;
          reason?: 'monthly_grant' | 'purchase' | 'process' | 'adjustment';
          menu_item_id?: string | null;
          at?: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          actor_type: 'staff' | 'platform' | 'system';
          actor_id: string;
          chain_id: string | null;
          action: string;
          target_table: string;
          target_id: string | null;
          payload: Json | null;
          at: string;
        };
        Insert: {
          id?: string;
          actor_type: 'staff' | 'platform' | 'system';
          actor_id: string;
          chain_id?: string | null;
          action: string;
          target_table: string;
          target_id?: string | null;
          payload?: Json | null;
          at?: string;
        };
        Update: {
          id?: string;
          actor_type?: 'staff' | 'platform' | 'system';
          actor_id?: string;
          chain_id?: string | null;
          action?: string;
          target_table?: string;
          target_id?: string | null;
          payload?: Json | null;
          at?: string;
        };
      };
    };
  };
}
