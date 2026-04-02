// ============================================================
// types.ts — Supabase Database type definitions
// Generated manually to match 001_schema.sql
// ============================================================

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          duration_minutes: number;
          price_cents: number;
          active: boolean;
          order_index: number;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          duration_minutes: number;
          price_cents: number;
          active?: boolean;
          order_index?: number;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          duration_minutes?: number;
          price_cents?: number;
          active?: boolean;
          order_index?: number;
          image_url?: string | null;
          created_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string | null;
          photo_url: string | null;
          active: boolean;
          order_index: number;
          services: string[];
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          bio?: string | null;
          photo_url?: string | null;
          active?: boolean;
          order_index?: number;
          services?: string[];
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          bio?: string | null;
          photo_url?: string | null;
          active?: boolean;
          order_index?: number;
          services?: string[];
        };
      };
      schedule: {
        Row: {
          id: string;
          day_of_week: number;
          open_time: string | null;
          close_time: string | null;
          is_closed: boolean;
        };
        Insert: {
          id?: string;
          day_of_week: number;
          open_time?: string | null;
          close_time?: string | null;
          is_closed?: boolean;
        };
        Update: {
          id?: string;
          day_of_week?: number;
          open_time?: string | null;
          close_time?: string | null;
          is_closed?: boolean;
        };
      };
      schedule_exceptions: {
        Row: {
          id: string;
          date: string;
          is_closed: boolean;
          open_time: string | null;
          close_time: string | null;
          note: string | null;
        };
        Insert: {
          id?: string;
          date: string;
          is_closed?: boolean;
          open_time?: string | null;
          close_time?: string | null;
          note?: string | null;
        };
        Update: {
          id?: string;
          date?: string;
          is_closed?: boolean;
          open_time?: string | null;
          close_time?: string | null;
          note?: string | null;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string;
          whatsapp_opt_in: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone: string;
          whatsapp_opt_in?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string;
          whatsapp_opt_in?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          customer_id: string | null;
          service_id: string;
          team_member_id: string | null;
          date: string;
          start_time: string;
          end_time: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
          notes: string | null;
          price_cents: number;
          payment_status: 'pending' | 'paid' | 'refunded';
          confirmation_sent_at: string | null;
          reminder_sent_at: string | null;
          source: 'web' | 'whatsapp' | 'admin' | 'phone';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          service_id: string;
          team_member_id?: string | null;
          date: string;
          start_time: string;
          end_time: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
          notes?: string | null;
          price_cents: number;
          payment_status?: 'pending' | 'paid' | 'refunded';
          confirmation_sent_at?: string | null;
          reminder_sent_at?: string | null;
          source?: 'web' | 'whatsapp' | 'admin' | 'phone';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          service_id?: string;
          team_member_id?: string | null;
          date?: string;
          start_time?: string;
          end_time?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
          notes?: string | null;
          price_cents?: number;
          payment_status?: 'pending' | 'paid' | 'refunded';
          confirmation_sent_at?: string | null;
          reminder_sent_at?: string | null;
          source?: 'web' | 'whatsapp' | 'admin' | 'phone';
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          customer_id: string | null;
          reservation_id: string | null;
          rating: number;
          comment: string | null;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          reservation_id?: string | null;
          rating: number;
          comment?: string | null;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          reservation_id?: string | null;
          rating?: number;
          comment?: string | null;
          published?: boolean;
          created_at?: string;
        };
      };
      whatsapp_conversations: {
        Row: {
          id: string;
          phone: string;
          state: string;
          context: Record<string, unknown>;
          last_message_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          state?: string;
          context?: Record<string, unknown>;
          last_message_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          state?: string;
          context?: Record<string, unknown>;
          last_message_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_url: string | null;
          published: boolean;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          cover_url?: string | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_url?: string | null;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      get_available_slots: {
        Args: {
          p_date: string;
          p_service_id: string;
        };
        Returns: { slot_time: string }[];
      };
    };
    Enums: Record<string, never>;
  };
}

// ============================================================
// Helper types — use these in application code
// ============================================================

type Tables = Database['public']['Tables'];

export type Service              = Tables['services']['Row'];
export type ServiceInsert        = Tables['services']['Insert'];
export type ServiceUpdate        = Tables['services']['Update'];

export type TeamMember           = Tables['team_members']['Row'];
export type TeamMemberInsert     = Tables['team_members']['Insert'];
export type TeamMemberUpdate     = Tables['team_members']['Update'];

export type Schedule             = Tables['schedule']['Row'];
export type ScheduleInsert       = Tables['schedule']['Insert'];
export type ScheduleUpdate       = Tables['schedule']['Update'];

export type ScheduleException       = Tables['schedule_exceptions']['Row'];
export type ScheduleExceptionInsert = Tables['schedule_exceptions']['Insert'];
export type ScheduleExceptionUpdate = Tables['schedule_exceptions']['Update'];

export type Customer             = Tables['customers']['Row'];
export type CustomerInsert       = Tables['customers']['Insert'];
export type CustomerUpdate       = Tables['customers']['Update'];

export type Reservation          = Tables['reservations']['Row'];
export type ReservationInsert    = Tables['reservations']['Insert'];
export type ReservationUpdate    = Tables['reservations']['Update'];

export type Review               = Tables['reviews']['Row'];
export type ReviewInsert         = Tables['reviews']['Insert'];
export type ReviewUpdate         = Tables['reviews']['Update'];

export type WhatsappConversation       = Tables['whatsapp_conversations']['Row'];
export type WhatsappConversationInsert = Tables['whatsapp_conversations']['Insert'];
export type WhatsappConversationUpdate = Tables['whatsapp_conversations']['Update'];

export type Post                 = Tables['posts']['Row'];
export type PostInsert           = Tables['posts']['Insert'];
export type PostUpdate           = Tables['posts']['Update'];
