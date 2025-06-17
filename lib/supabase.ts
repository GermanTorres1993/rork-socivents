import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Supabase configuration with provided credentials
const supabaseUrl = 'https://kgebwnidrzmktkitumsx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZWJ3bmlkcnpta3RraXR1bXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjI2MDEsImV4cCI6MjA2NTU5ODYwMX0.9I4gdcOKR6tzAWuFdbSh6_iQ19V3ls57LTLF7Bi316I';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          photo_url?: string;
          bio?: string;
          city?: string;
          interests?: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          photo_url?: string;
          bio?: string;
          city?: string;
          interests?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          photo_url?: string;
          bio?: string;
          city?: string;
          interests?: string[];
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string;
          date: string;
          time: string;
          location: any; // JSON
          price: number;
          category: string;
          host_id: string;
          host_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url: string;
          date: string;
          time: string;
          location: any;
          price: number;
          category: string;
          host_id: string;
          host_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string;
          date?: string;
          time?: string;
          location?: any;
          price?: number;
          category?: string;
          host_id?: string;
          host_name?: string;
          created_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          purchase_date: string;
          price: number;
          status: string;
          stripe_payment_id?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          purchase_date?: string;
          price: number;
          status?: string;
          stripe_payment_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          purchase_date?: string;
          price?: number;
          status?: string;
          stripe_payment_id?: string;
          created_at?: string;
        };
      };
      chat_rooms: {
        Row: {
          id: string;
          event_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          created_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          chat_room_id: string;
          user_id: string;
          user_name: string;
          user_photo_url?: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_room_id: string;
          user_id: string;
          user_name: string;
          user_photo_url?: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_room_id?: string;
          user_id?: string;
          user_name?: string;
          user_photo_url?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
  storage: {
    Objects: {
      Row: {
        id: string;
        bucket_id: string;
        name: string;
        owner?: string;
        created_at: string;
        updated_at: string;
        last_accessed_at?: string;
        metadata?: Record<string, any>;
      };
      Insert: {
        id?: string;
        bucket_id: string;
        name: string;
        owner?: string;
        created_at?: string;
        updated_at?: string;
        last_accessed_at?: string;
        metadata?: Record<string, any>;
      };
      Update: {
        id?: string;
        bucket_id?: string;
        name?: string;
        owner?: string;
        created_at?: string;
        updated_at?: string;
        last_accessed_at?: string;
        metadata?: Record<string, any>;
      };
    };
  };
};