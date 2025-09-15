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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ad_logs: {
        Row: {
          ad_id: string | null
          created_at: string
          id: string
          reader_id: string
          slide_position: number
          watched: boolean
        }
        Insert: {
          ad_id?: string | null
          created_at?: string
          id?: string
          reader_id: string
          slide_position: number
          watched?: boolean
        }
        Update: {
          ad_id?: string | null
          created_at?: string
          id?: string
          reader_id?: string
          slide_position?: number
          watched?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "ad_logs_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      ads: {
        Row: {
          clicks: number
          created_at: string
          end_date: string
          id: string
          impressions: number
          start_date: string
          video_url: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          end_date: string
          id?: string
          impressions?: number
          start_date: string
          video_url: string
        }
        Update: {
          clicks?: number
          created_at?: string
          end_date?: string
          id?: string
          impressions?: number
          start_date?: string
          video_url?: string
        }
        Relationships: []
      }
      analytics: {
        Row: {
          chapter_id: string | null
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          story_id: string | null
          user_id: string | null
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          story_id?: string | null
          user_id?: string | null
        }
        Update: {
          chapter_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          story_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          chapter_number: number
          content: string
          created_at: string | null
          id: string
          slide_count: number | null
          status: Database["public"]["Enums"]["chapter_status"] | null
          story_id: string | null
          title: string
          updated_at: string | null
          view_count: number | null
          word_count: number | null
        }
        Insert: {
          chapter_number: number
          content: string
          created_at?: string | null
          id?: string
          slide_count?: number | null
          status?: Database["public"]["Enums"]["chapter_status"] | null
          story_id?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
          word_count?: number | null
        }
        Update: {
          chapter_number?: number
          content?: string
          created_at?: string | null
          id?: string
          slide_count?: number | null
          status?: Database["public"]["Enums"]["chapter_status"] | null
          story_id?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          chapter_id: string | null
          content: string
          created_at: string | null
          id: string
          story_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          story_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          story_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      drafts: {
        Row: {
          chapter_id: string | null
          created_at: string
          id: string
          status: string
          story_id: string | null
          text: string
          updated_at: string
          writer_id: string
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          id?: string
          status?: string
          story_id?: string | null
          text: string
          updated_at?: string
          writer_id: string
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          id?: string
          status?: string
          story_id?: string | null
          text?: string
          updated_at?: string
          writer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drafts_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drafts_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      earnings: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          source: string | null
          story_id: string | null
          writer_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          source?: string | null
          story_id?: string | null
          writer_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          source?: string | null
          story_id?: string | null
          writer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "earnings_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      library: {
        Row: {
          created_at: string | null
          id: string
          story_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          story_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          story_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          story_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          story_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          story_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          id: string
          notes: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          seen: boolean
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          seen?: boolean
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          seen?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          status: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          chapter_id: string | null
          id: string
          last_read_at: string | null
          progress_percentage: number | null
          story_id: string | null
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          id?: string
          last_read_at?: string | null
          progress_percentage?: number | null
          story_id?: string | null
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          id?: string
          last_read_at?: string | null
          progress_percentage?: number | null
          story_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_progress_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      reads: {
        Row: {
          chapter_id: string | null
          completed: boolean
          created_at: string
          id: string
          novel_id: string | null
          reader_id: string
          slide_number: number
        }
        Insert: {
          chapter_id?: string | null
          completed?: boolean
          created_at?: string
          id?: string
          novel_id?: string | null
          reader_id: string
          slide_number?: number
        }
        Update: {
          chapter_id?: string | null
          completed?: boolean
          created_at?: string
          id?: string
          novel_id?: string | null
          reader_id?: string
          slide_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "reads_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reads_novel_id_fkey"
            columns: ["novel_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          reason: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          story_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          story_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          story_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      slides: {
        Row: {
          chapter_id: string | null
          content: string
          created_at: string
          id: string
          order_number: number
        }
        Insert: {
          chapter_id?: string | null
          content: string
          created_at?: string
          id?: string
          order_number: number
        }
        Update: {
          chapter_id?: string | null
          content?: string
          created_at?: string
          id?: string
          order_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "slides_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          author_id: string
          comment_count: number | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          genre: string | null
          id: string
          like_count: number | null
          status: Database["public"]["Enums"]["story_status"] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          comment_count?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          like_count?: number | null
          status?: Database["public"]["Enums"]["story_status"] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          comment_count?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          like_count?: number | null
          status?: Database["public"]["Enums"]["story_status"] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      story_tags: {
        Row: {
          id: string
          story_id: string | null
          tag: string
        }
        Insert: {
          id?: string
          story_id?: string | null
          tag: string
        }
        Update: {
          id?: string
          story_id?: string | null
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_tags_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          updated_at: string
          value: string
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          updated_at?: string
          value: string
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          count: number
          created_at: string
          id: string
          name: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      writer_profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          pen_name: string | null
          social_links: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          pen_name?: string | null
          social_links?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          pen_name?: string | null
          social_links?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      chapter_status: "draft" | "published"
      report_status: "pending" | "reviewed" | "resolved"
      story_status: "draft" | "published" | "archived"
      user_role: "reader" | "writer" | "admin"
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
    Enums: {
      chapter_status: ["draft", "published"],
      report_status: ["pending", "reviewed", "resolved"],
      story_status: ["draft", "published", "archived"],
      user_role: ["reader", "writer", "admin"],
    },
  },
} as const
