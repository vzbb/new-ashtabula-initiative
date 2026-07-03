export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      homeowners: {
        Row: {
          id: string
          email: string
          phone: string | null
          full_name: string | null
          address: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          full_name?: string | null
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          full_name?: string | null
          address?: string | null
          created_at?: string
        }
      }
      contractors: {
        Row: {
          id: string
          email: string
          phone: string | null
          company_name: string | null
          license_number: string | null
          insurance_verified: boolean
          background_check_passed: boolean
          service_radius_miles: number
          base_location: unknown | null
          specialties: string[]
          rating_avg: number
          years_in_business: number
          created_at: string
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          company_name?: string | null
          license_number?: string | null
          insurance_verified?: boolean
          background_check_passed?: boolean
          service_radius_miles?: number
          base_location?: unknown | null
          specialties?: string[]
          rating_avg?: number
          years_in_business?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          company_name?: string | null
          license_number?: string | null
          insurance_verified?: boolean
          background_check_passed?: boolean
          service_radius_miles?: number
          base_location?: unknown | null
          specialties?: string[]
          rating_avg?: number
          years_in_business?: number
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          homeowner_id: string
          category: string
          subcategory: string | null
          description: string | null
          address: unknown | null
          budget_min: number | null
          budget_max: number | null
          urgency: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          homeowner_id: string
          category: string
          subcategory?: string | null
          description?: string | null
          address?: unknown | null
          budget_min?: number | null
          budget_max?: number | null
          urgency?: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          homeowner_id?: string
          category?: string
          subcategory?: string | null
          description?: string | null
          address?: unknown | null
          budget_min?: number | null
          budget_max?: number | null
          urgency?: string
          status?: string
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          project_id: string
          contractor_id: string
          match_score: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          contractor_id: string
          match_score?: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          contractor_id?: string
          match_score?: number
          status?: string
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'homeowner' | 'contractor'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'homeowner' | 'contractor'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'homeowner' | 'contractor'
          created_at?: string
        }
      }
      // Phase 2: Quotes table
      quotes: {
        Row: {
          id: string
          match_id: string
          contractor_id: string
          project_id: string
          price: number | null
          price_type: 'fixed' | 'hourly' | 'estimate'
          estimated_hours: number | null
          hourly_rate: number | null
          description: string | null
          materials_included: boolean
          materials_cost: number | null
          timeline_days: number | null
          start_date: string | null
          expiry_date: string | null
          status: 'draft' | 'submitted' | 'accepted' | 'rejected' | 'expired'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          contractor_id: string
          project_id: string
          price?: number | null
          price_type?: 'fixed' | 'hourly' | 'estimate'
          estimated_hours?: number | null
          hourly_rate?: number | null
          description?: string | null
          materials_included?: boolean
          materials_cost?: number | null
          timeline_days?: number | null
          start_date?: string | null
          expiry_date?: string | null
          status?: 'draft' | 'submitted' | 'accepted' | 'rejected' | 'expired'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          contractor_id?: string
          project_id?: string
          price?: number | null
          price_type?: 'fixed' | 'hourly' | 'estimate'
          estimated_hours?: number | null
          hourly_rate?: number | null
          description?: string | null
          materials_included?: boolean
          materials_cost?: number | null
          timeline_days?: number | null
          start_date?: string | null
          expiry_date?: string | null
          status?: 'draft' | 'submitted' | 'accepted' | 'rejected' | 'expired'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Phase 2: Reviews table
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          reviewer_role: 'homeowner' | 'contractor'
          reviewee_id: string
          reviewee_role: 'homeowner' | 'contractor'
          project_id: string | null
          match_id: string | null
          rating: number
          professionalism: number | null
          quality: number | null
          communication: number | null
          punctuality: number | null
          value: number | null
          title: string | null
          content: string | null
          would_recommend: boolean | null
          verified_hire: boolean
          helpful_count: number
          status: 'pending' | 'published' | 'flagged' | 'removed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          reviewer_role: 'homeowner' | 'contractor'
          reviewee_id: string
          reviewee_role: 'homeowner' | 'contractor'
          project_id?: string | null
          match_id?: string | null
          rating: number
          professionalism?: number | null
          quality?: number | null
          communication?: number | null
          punctuality?: number | null
          value?: number | null
          title?: string | null
          content?: string | null
          would_recommend?: boolean | null
          verified_hire?: boolean
          helpful_count?: number
          status?: 'pending' | 'published' | 'flagged' | 'removed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          reviewer_role?: 'homeowner' | 'contractor'
          reviewee_id?: string
          reviewee_role?: 'homeowner' | 'contractor'
          project_id?: string | null
          match_id?: string | null
          rating?: number
          professionalism?: number | null
          quality?: number | null
          communication?: number | null
          punctuality?: number | null
          value?: number | null
          title?: string | null
          content?: string | null
          would_recommend?: boolean | null
          verified_hire?: boolean
          helpful_count?: number
          status?: 'pending' | 'published' | 'flagged' | 'removed'
          created_at?: string
          updated_at?: string
        }
      }
      // Phase 2: Notifications table
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'quote_received' | 'quote_accepted' | 'quote_rejected' | 'new_match' | 'message' | 'review_received' | 'project_update' | 'milestone' | 'system'
          title: string
          message: string
          data: Json | null
          read: boolean
          read_at: string | null
          action_url: string | null
          priority: 'low' | 'normal' | 'high' | 'urgent'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'quote_received' | 'quote_accepted' | 'quote_rejected' | 'new_match' | 'message' | 'review_received' | 'project_update' | 'milestone' | 'system'
          title: string
          message: string
          data?: Json | null
          read?: boolean
          read_at?: string | null
          action_url?: string | null
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'quote_received' | 'quote_accepted' | 'quote_rejected' | 'new_match' | 'message' | 'review_received' | 'project_update' | 'milestone' | 'system'
          title?: string
          message?: string
          data?: Json | null
          read?: boolean
          read_at?: string | null
          action_url?: string | null
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          created_at?: string
        }
      }
      // Phase 2: Project status tracking (Kanban)
      project_status_history: {
        Row: {
          id: string
          project_id: string
          status: 'posted' | 'quoted' | 'contractor_selected' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
          changed_by: string
          changed_by_role: 'homeowner' | 'contractor' | 'system'
          notes: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          status: 'posted' | 'quoted' | 'contractor_selected' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
          changed_by: string
          changed_by_role: 'homeowner' | 'contractor' | 'system'
          notes?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          status?: 'posted' | 'quoted' | 'contractor_selected' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
          changed_by?: string
          changed_by_role?: 'homeowner' | 'contractor' | 'system'
          notes?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      // Phase 2: Milestones for project tracking
      milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          due_date: string | null
          completed_at: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'overdue'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          due_date?: string | null
          completed_at?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          completed_at?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
