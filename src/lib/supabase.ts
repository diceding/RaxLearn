import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string)?.trim() || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim() || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file in the project root, then restart the dev server (npm run dev).'
  );
}

// Add this BEFORE the createClient call
console.log('ENV CHECK:', {
  url: import.meta.env.VITE_SUPABASE_URL ? 'EXISTS' : 'MISSING',
  urlLength: import.meta.env.VITE_SUPABASE_URL?.length,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING',
  keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length,
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string;
          career_goal_id: string | null;
          current_skill_level: 'beginner' | 'intermediate' | 'advanced';
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          career_goal_id?: string | null;
          current_skill_level?: 'beginner' | 'intermediate' | 'advanced';
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          career_goal_id?: string | null;
          current_skill_level?: 'beginner' | 'intermediate' | 'advanced';
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      career_paths: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          learning_objectives: string[];
          created_at: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          estimated_duration_hours: number;
          career_path_id: string | null;
          primary_language: string;
          technologies: string[];
          learning_outcomes: string[];
          project_order: number;
          starter_code: string | null;
          solution_code: string | null;
          created_at: string;
        };
      };
      project_milestones: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string;
          milestone_order: number;
          instructions: string;
          test_criteria: any;
          created_at: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          milestone_id: string | null;
          status: 'not_started' | 'in_progress' | 'completed' | 'struggling';
          code_submitted: string | null;
          attempts: number;
          time_spent_minutes: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          milestone_id?: string | null;
          status?: 'not_started' | 'in_progress' | 'completed' | 'struggling';
          code_submitted?: string | null;
          attempts?: number;
          time_spent_minutes?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'not_started' | 'in_progress' | 'completed' | 'struggling';
          code_submitted?: string | null;
          attempts?: number;
          time_spent_minutes?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      hints: {
        Row: {
          id: string;
          milestone_id: string;
          hint_level: number;
          hint_text: string;
          hint_type: 'conceptual' | 'directional' | 'documentation';
          created_at: string;
        };
      };
      concept_mastery: {
        Row: {
          id: string;
          user_id: string;
          concept_id: string;
          mastery_level: number;
          last_practiced: string;
          practice_count: number;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
