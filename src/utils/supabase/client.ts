import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

const supabaseUrl = `https://${projectId}.supabase.co`
const supabaseAnonKey = publicAnonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      professors: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          title: string
          department: string
          email: string | null
          office_location: string | null
          courses: string[] | null
          bio: string | null
          average_rating: number | null
          total_reviews: number
          created_by: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          title: string
          department: string
          email?: string | null
          office_location?: string | null
          courses?: string[] | null
          bio?: string | null
          average_rating?: number | null
          total_reviews?: number
          created_by: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          title?: string
          department?: string
          email?: string | null
          office_location?: string | null
          courses?: string[] | null
          bio?: string | null
          average_rating?: number | null
          total_reviews?: number
          created_by?: string
        }
      }
      professor_ratings: {
        Row: {
          id: string
          created_at: string
          professor_id: string
          user_id: string
          rating: number
          review: string | null
          course: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          professor_id: string
          user_id: string
          rating: number
          review?: string | null
          course?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          professor_id?: string
          user_id?: string
          rating?: number
          review?: string | null
          course?: string | null
        }
      }
      saved_professors: {
        Row: {
          id: string
          created_at: string
          user_id: string
          professor_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          professor_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          professor_id?: string
        }
      }
    }
  }
}