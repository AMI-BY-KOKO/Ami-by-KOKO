/**
 * Auto-generated Supabase database types.
 * Run `npx supabase gen types typescript --local > src/lib/supabase/database.types.ts`
 * to regenerate after schema changes.
 *
 * Hand-authored for MVP — replace with generated output once Supabase project is linked.
 */

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
      profiles: {
        Row: {
          id: string;
          role: "parent" | "school_admin";
          full_name: string;
          school_id: string | null;
          show_on_leaderboard: boolean;
          public_display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role: "parent" | "school_admin";
          full_name: string;
          school_id?: string | null;
          show_on_leaderboard?: boolean;
          public_display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: "parent" | "school_admin";
          full_name?: string;
          school_id?: string | null;
          show_on_leaderboard?: boolean;
          public_display_name?: string | null;
          created_at?: string;
        };
      };
      schools: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          subscription_active: boolean;
          school_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          subscription_active?: boolean;
          school_code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          subscription_active?: boolean;
          school_code?: string | null;
          created_at?: string;
        };
      };
      children: {
        Row: {
          id: string;
          parent_id: string | null;
          school_id: string | null;
          name: string;
          age: number | null;
          avatar_url: string | null;
          class: "sprout_1" | "sprout_2" | "sprout_3" | "stepping_stone" | null;
          term: 1 | 2 | 3 | null;
          student_pin: string | null;
          auth_user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id?: string | null;
          school_id?: string | null;
          name: string;
          age?: number | null;
          avatar_url?: string | null;
          class?: "sprout_1" | "sprout_2" | "sprout_3" | "stepping_stone" | null;
          term?: 1 | 2 | 3 | null;
          student_pin?: string | null;
          auth_user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string | null;
          school_id?: string | null;
          name?: string;
          age?: number | null;
          avatar_url?: string | null;
          class?: "sprout_1" | "sprout_2" | "sprout_3" | "stepping_stone" | null;
          term?: 1 | 2 | 3 | null;
          student_pin?: string | null;
          auth_user_id?: string | null;
          created_at?: string;
        };
      };
      progress: {
        Row: {
          id: string;
          child_id: string;
          language: "english" | "yoruba" | "igbo" | "hausa";
          letter: string;
          heard_count: number;
          traced_count: number;
          mastered: boolean;
          last_activity: string;
          subject: "literacy" | "numeracy" | "world";
          class: "sprout_1" | "sprout_2" | "sprout_3" | "stepping_stone" | null;
          term: 1 | 2 | 3 | null;
        };
        Insert: {
          id?: string;
          child_id: string;
          language: "english" | "yoruba" | "igbo" | "hausa";
          letter: string;
          heard_count?: number;
          traced_count?: number;
          mastered?: boolean;
          last_activity?: string;
          subject?: "literacy" | "numeracy" | "world";
          class?: "sprout_1" | "sprout_2" | "sprout_3" | "stepping_stone" | null;
          term?: 1 | 2 | 3 | null;
        };
        Update: {
          id?: string;
          child_id?: string;
          language?: "english" | "yoruba" | "igbo" | "hausa";
          letter?: string;
          heard_count?: number;
          traced_count?: number;
          mastered?: boolean;
          last_activity?: string;
          subject?: "literacy" | "numeracy" | "world";
          class?: "sprout_1" | "sprout_2" | "sprout_3" | "stepping_stone" | null;
          term?: 1 | 2 | 3 | null;
        };
      };
      assignments: {
        Row: {
          id: string;
          school_id: string;
          class: "sprout_1" | "sprout_2" | "sprout_3" | "stepping_stone";
          subject: "literacy" | "numeracy" | "world";
          term: 1 | 2 | 3;
          title: string;
          description: string | null;
          activity_type: "tracing" | "listening" | "matching" | "counting";
          content_keys: string[];
          due_date: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          class: "sprout_1" | "sprout_2" | "sprout_3" | "stepping_stone";
          subject: "literacy" | "numeracy" | "world";
          term: 1 | 2 | 3;
          title: string;
          description?: string | null;
          activity_type: "tracing" | "listening" | "matching" | "counting";
          content_keys: string[];
          due_date?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          class?: "sprout_1" | "sprout_2" | "sprout_3" | "stepping_stone";
          subject?: "literacy" | "numeracy" | "world";
          term?: 1 | 2 | 3;
          title?: string;
          description?: string | null;
          activity_type?: "tracing" | "listening" | "matching" | "counting";
          content_keys?: string[];
          due_date?: string | null;
          created_by?: string;
          created_at?: string;
        };
      };
      assignment_progress: {
        Row: {
          id: string;
          assignment_id: string;
          child_id: string;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          child_id: string;
          completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          child_id?: string;
          completed?: boolean;
          completed_at?: string | null;
        };
      };
      sessions: {
        Row: {
          id: string;
          child_id: string;
          started_at: string;
          ended_at: string | null;
          mode: "phonics" | "dj_booth" | "story";
        };
        Insert: {
          id?: string;
          child_id: string;
          started_at?: string;
          ended_at?: string | null;
          mode: "phonics" | "dj_booth" | "story";
        };
        Update: {
          id?: string;
          child_id?: string;
          started_at?: string;
          ended_at?: string | null;
          mode?: "phonics" | "dj_booth" | "story";
        };
      };
      subscriptions: {
        Row: {
          id: string;
          profile_id: string;
          plan: "individual" | "school";
          paystack_reference: string | null;
          active: boolean;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          plan: "individual" | "school";
          paystack_reference?: string | null;
          active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          plan?: "individual" | "school";
          paystack_reference?: string | null;
          active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          child_id: string;
          type: "first_steps" | "letter_master" | "number_star" | "world_explorer" | "story_hero" | "assignment_champion" | "weekly_streak";
          earned_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          type: "first_steps" | "letter_master" | "number_star" | "world_explorer" | "story_hero" | "assignment_champion" | "weekly_streak";
          earned_at?: string;
        };
        Update: {
          id?: string;
          child_id?: string;
          type?: "first_steps" | "letter_master" | "number_star" | "world_explorer" | "story_hero" | "assignment_champion" | "weekly_streak";
          earned_at?: string;
        };
      };
      word_builder_progress: {
        Row: {
          id: string;
          user_id: string;
          language: "english" | "yoruba" | "french" | "igbo" | "hausa";
          current_level: number;
          current_word_index: number;
          words_completed: number;
          stars_earned: number;
          streak_count: number;
          last_streak_date: string;
          word_garden_seeds: number;
          daily_word_completed_today: boolean;
          last_daily_word_date: string;
          mastered_words: string[];
          achievements: string[];
          achievements_unlocked_count: number;
          last_achievement_unlock: string | null;
          current_difficulty: string;
          difficulty_changes: number;
          best_streak: number;
          last_activity_date: string | null;
          last_synced: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          language: "english" | "yoruba" | "french" | "igbo" | "hausa";
          current_level?: number;
          current_word_index?: number;
          words_completed?: number;
          stars_earned?: number;
          streak_count?: number;
          last_streak_date?: string;
          word_garden_seeds?: number;
          daily_word_completed_today?: boolean;
          last_daily_word_date?: string;
          mastered_words?: string[];
          achievements?: string[];
          achievements_unlocked_count?: number;
          last_achievement_unlock?: string | null;
          current_difficulty?: string;
          difficulty_changes?: number;
          best_streak?: number;
          last_activity_date?: string | null;
          last_synced?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          language?: "english" | "yoruba" | "french" | "igbo" | "hausa";
          current_level?: number;
          current_word_index?: number;
          words_completed?: number;
          stars_earned?: number;
          streak_count?: number;
          last_streak_date?: string;
          word_garden_seeds?: number;
          daily_word_completed_today?: boolean;
          last_daily_word_date?: string;
          mastered_words?: string[];
          achievements?: string[];
          achievements_unlocked_count?: number;
          last_achievement_unlock?: string | null;
          current_difficulty?: string;
          difficulty_changes?: number;
          best_streak?: number;
          last_activity_date?: string | null;
          last_synced?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      referral_codes: {
        Row: {
          id: string;
          profile_id: string;
          code: string;
          status: "active" | "paused" | "revoked";
          generated_at: string;
          updated_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          profile_id: string;
          code: string;
          status?: "active" | "paused" | "revoked";
          generated_at?: string;
          updated_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          profile_id?: string;
          code?: string;
          status?: "active" | "paused" | "revoked";
          generated_at?: string;
          updated_at?: string;
          notes?: string | null;
        };
      };
      referral_events: {
        Row: {
          id: string;
          referral_code_id: string;
          referred_profile_id: string;
          referrer_profile_id: string;
          attribution_status: "pending" | "confirmed" | "active" | "churned";
          referred_at: string;
          confirmed_at: string | null;
          subscription_activated_at: string | null;
          referrer_ip_hash: string | null;
          referred_ip_hash: string | null;
          user_agent_hash: string | null;
          fraud_score: number;
          fraud_flags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          referral_code_id: string;
          referred_profile_id: string;
          referrer_profile_id: string;
          attribution_status?: "pending" | "confirmed" | "active" | "churned";
          referred_at?: string;
          confirmed_at?: string | null;
          subscription_activated_at?: string | null;
          referrer_ip_hash?: string | null;
          referred_ip_hash?: string | null;
          user_agent_hash?: string | null;
          fraud_score?: number;
          fraud_flags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          referral_code_id?: string;
          referred_profile_id?: string;
          referrer_profile_id?: string;
          attribution_status?: "pending" | "confirmed" | "active" | "churned";
          referred_at?: string;
          confirmed_at?: string | null;
          subscription_activated_at?: string | null;
          referrer_ip_hash?: string | null;
          referred_ip_hash?: string | null;
          user_agent_hash?: string | null;
          fraud_score?: number;
          fraud_flags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      referral_stats: {
        Row: {
          id: string;
          profile_id: string;
          total_codes_generated: number;
          total_referrals_attributed: number;
          confirmed_referrals: number;
          active_subscriptions: number;
          churned_referrals: number;
          last_referral_date: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          total_codes_generated?: number;
          total_referrals_attributed?: number;
          confirmed_referrals?: number;
          active_subscriptions?: number;
          churned_referrals?: number;
          last_referral_date?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          total_codes_generated?: number;
          total_referrals_attributed?: number;
          confirmed_referrals?: number;
          active_subscriptions?: number;
          churned_referrals?: number;
          last_referral_date?: string | null;
          updated_at?: string;
        };
      };
      referral_audit_log: {
        Row: {
          id: string;
          event_type:
            | "code_generated"
            | "referral_attributed"
            | "status_confirmed"
            | "subscription_activated"
            | "fraud_flagged"
            | "code_revoked"
            | "duplicate_attempt"
            | "self_referral_attempt"
            | "invalid_code_attempt";
          referral_event_id: string | null;
          referral_code_id: string | null;
          profile_id: string | null;
          details: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type:
            | "code_generated"
            | "referral_attributed"
            | "status_confirmed"
            | "subscription_activated"
            | "fraud_flagged"
            | "code_revoked"
            | "duplicate_attempt"
            | "self_referral_attempt"
            | "invalid_code_attempt";
          referral_event_id?: string | null;
          referral_code_id?: string | null;
          profile_id?: string | null;
          details?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?:
            | "code_generated"
            | "referral_attributed"
            | "status_confirmed"
            | "subscription_activated"
            | "fraud_flagged"
            | "code_revoked"
            | "duplicate_attempt"
            | "self_referral_attempt"
            | "invalid_code_attempt";
          referral_event_id?: string | null;
          referral_code_id?: string | null;
          profile_id?: string | null;
          details?: Record<string, unknown>;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      generate_referral_code: {
        Args: {
          p_profile_id: string;
        };
        Returns: Array<{
          success: boolean;
          code: string | null;
          error: string | null;
        }>;
      };
      attribute_referral: {
        Args: {
          p_referral_code: string;
          p_referred_profile_id: string;
          p_referrer_ip_hash?: string;
          p_referred_ip_hash?: string;
          p_user_agent_hash?: string;
        };
        Returns: Array<{
          success: boolean;
          referral_event_id: string | null;
          error: string | null;
          fraud_score: number;
        }>;
      };
      confirm_referral_status: {
        Args: {
          p_referred_profile_id: string;
          p_new_status?: string;
        };
        Returns: Array<{
          success: boolean;
          error: string | null;
        }>;
      };
      activate_referral_subscription: {
        Args: {
          p_referred_profile_id: string;
        };
        Returns: Array<{
          success: boolean;
          error: string | null;
        }>;
      };
    };
    Enums: Record<string, never>;
  };
}
