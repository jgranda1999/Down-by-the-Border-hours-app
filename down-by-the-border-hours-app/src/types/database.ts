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
      hour_logs: {
        Row: {
          id: string
          volunteer_id: string
          event_name: string
          event_date: string
          sign_in_time: string
          sign_out_time: string | null
          hours: number
          notes: string | null
          verification_photo_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          volunteer_id: string
          event_name: string
          event_date: string
          sign_in_time: string
          sign_out_time?: string | null
          hours: number
          notes?: string | null
          verification_photo_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          volunteer_id?: string
          event_name?: string
          event_date?: string
          sign_in_time?: string
          sign_out_time?: string | null
          hours?: number
          notes?: string | null
          verification_photo_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'hour_logs_volunteer_id_fkey'
            columns: ['volunteer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          school: string | null
          title: string | null
          parent_name: string | null
          parent_phone: string | null
          parent_email: string | null
          role: 'volunteer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string
          last_name?: string
          email: string
          phone?: string | null
          school?: string | null
          title?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_email?: string | null
          role?: 'volunteer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          school?: string | null
          title?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_email?: string | null
          role?: 'volunteer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
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

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type HourLog = Database['public']['Tables']['hour_logs']['Row']
export type HourLogInsert = Database['public']['Tables']['hour_logs']['Insert']
export type HourLogUpdate = Database['public']['Tables']['hour_logs']['Update']
