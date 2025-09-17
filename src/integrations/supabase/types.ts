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
      characters: {
        Row: {
          agility: number
          character_id: string
          created_at: string
          defense: number
          energy: number
          experience: number
          id: string
          is_active: boolean
          level: number
          name: string
          strength: number
          updated_at: string
          user_id: string
        }
        Insert: {
          agility?: number
          character_id: string
          created_at?: string
          defense?: number
          energy?: number
          experience?: number
          id?: string
          is_active?: boolean
          level?: number
          name: string
          strength?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          agility?: number
          character_id?: string
          created_at?: string
          defense?: number
          energy?: number
          experience?: number
          id?: string
          is_active?: boolean
          level?: number
          name?: string
          strength?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crew_members: {
        Row: {
          agility: number
          created_at: string
          defense: number
          energy: number
          experience: number
          id: string
          is_active: boolean
          level: number
          name: string
          recruitment_cost: number
          role: string
          specialty: string
          strength: number
          updated_at: string
          user_id: string
        }
        Insert: {
          agility?: number
          created_at?: string
          defense?: number
          energy?: number
          experience?: number
          id?: string
          is_active?: boolean
          level?: number
          name: string
          recruitment_cost?: number
          role: string
          specialty: string
          strength?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          agility?: number
          created_at?: string
          defense?: number
          energy?: number
          experience?: number
          id?: string
          is_active?: boolean
          level?: number
          name?: string
          recruitment_cost?: number
          role?: string
          specialty?: string
          strength?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      islands: {
        Row: {
          coordinates: Json
          created_at: string
          description: string
          id: string
          is_discovered: boolean
          level_requirement: number
          name: string
          resources: Json
        }
        Insert: {
          coordinates?: Json
          created_at?: string
          description: string
          id?: string
          is_discovered?: boolean
          level_requirement?: number
          name: string
          resources?: Json
        }
        Update: {
          coordinates?: Json
          created_at?: string
          description?: string
          id?: string
          is_discovered?: boolean
          level_requirement?: number
          name?: string
          resources?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          experience: number
          gold: number
          id: string
          level: number
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          experience?: number
          gold?: number
          id?: string
          level?: number
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          experience?: number
          gold?: number
          id?: string
          level?: number
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      quests: {
        Row: {
          created_at: string
          description: string
          difficulty: string
          id: string
          is_story_quest: boolean
          requirements: Json
          reward_experience: number
          reward_gold: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty: string
          id?: string
          is_story_quest?: boolean
          requirements?: Json
          reward_experience?: number
          reward_gold?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          is_story_quest?: boolean
          requirements?: Json
          reward_experience?: number
          reward_gold?: number
          title?: string
        }
        Relationships: []
      }
      user_island_discoveries: {
        Row: {
          discovered_at: string
          id: string
          island_id: string
          user_id: string
        }
        Insert: {
          discovered_at?: string
          id?: string
          island_id: string
          user_id: string
        }
        Update: {
          discovered_at?: string
          id?: string
          island_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_island_discoveries_island_id_fkey"
            columns: ["island_id"]
            isOneToOne: false
            referencedRelation: "islands"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quest_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          progress: Json
          quest_id: string
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: Json
          quest_id: string
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: Json
          quest_id?: string
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
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
