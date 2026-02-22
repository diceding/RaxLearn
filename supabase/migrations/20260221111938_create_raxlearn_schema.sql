/*
  # RaxLearn Platform Database Schema

  1. New Tables
    - `user_profiles`
      - Extended user profile with career goals and skill levels
      - Links to Supabase auth.users
    
    - `career_paths`
      - Available career paths (Web Developer, Data Analyst, etc.)
      - Each path has specific learning objectives
    
    - `programming_concepts`
      - Knowledge graph nodes (variables, loops, APIs, etc.)
      - Forms the basis of the adaptive learning engine
    
    - `projects`
      - Structured learning projects
      - Aligned with career paths and difficulty levels
    
    - `project_milestones`
      - Individual steps/features within each project
      - Linked to specific programming concepts
    
    - `concept_prerequisites`
      - Defines prerequisite relationships between concepts
      - Builds the knowledge graph
    
    - `user_progress`
      - Tracks user completion of projects and milestones
      - Records performance metrics
    
    - `concept_mastery`
      - Tracks which concepts users have mastered
      - Identifies knowledge gaps
    
    - `hints`
      - Tiered hint system (conceptual, directional, documentation)
      - Context-aware assistance without revealing answers
    
    - `user_hint_usage`
      - Tracks which hints users have requested
      - Helps refine the assistance system

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Public read access for career paths, concepts, projects, and hints
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  career_goal_id uuid,
  current_skill_level text NOT NULL DEFAULT 'beginner' CHECK (current_skill_level IN ('beginner', 'intermediate', 'advanced')),
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Career Paths Table
CREATE TABLE IF NOT EXISTS career_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text DEFAULT 'code',
  learning_objectives text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE career_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view career paths"
  ON career_paths FOR SELECT
  TO authenticated
  USING (true);

-- Add foreign key constraint to user_profiles
ALTER TABLE user_profiles 
  ADD CONSTRAINT fk_career_goal 
  FOREIGN KEY (career_goal_id) 
  REFERENCES career_paths(id) 
  ON DELETE SET NULL;

-- Programming Concepts Table (Knowledge Graph Nodes)
CREATE TABLE IF NOT EXISTS programming_concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category text NOT NULL,
  documentation_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE programming_concepts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view programming concepts"
  ON programming_concepts FOR SELECT
  TO authenticated
  USING (true);

-- Concept Prerequisites (Knowledge Graph Edges)
CREATE TABLE IF NOT EXISTS concept_prerequisites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id uuid NOT NULL REFERENCES programming_concepts(id) ON DELETE CASCADE,
  prerequisite_id uuid NOT NULL REFERENCES programming_concepts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(concept_id, prerequisite_id)
);

ALTER TABLE concept_prerequisites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view concept prerequisites"
  ON concept_prerequisites FOR SELECT
  TO authenticated
  USING (true);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration_hours integer NOT NULL DEFAULT 5,
  career_path_id uuid REFERENCES career_paths(id) ON DELETE SET NULL,
  primary_language text NOT NULL,
  technologies text[] DEFAULT '{}',
  learning_outcomes text[] DEFAULT '{}',
  project_order integer NOT NULL DEFAULT 0,
  starter_code text,
  solution_code text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

-- Project Milestones Table
CREATE TABLE IF NOT EXISTS project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  milestone_order integer NOT NULL DEFAULT 0,
  instructions text NOT NULL,
  test_criteria jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project milestones"
  ON project_milestones FOR SELECT
  TO authenticated
  USING (true);

-- Milestone Concepts (Links milestones to required concepts)
CREATE TABLE IF NOT EXISTS milestone_concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id uuid NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  concept_id uuid NOT NULL REFERENCES programming_concepts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(milestone_id, concept_id)
);

ALTER TABLE milestone_concepts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view milestone concepts"
  ON milestone_concepts FOR SELECT
  TO authenticated
  USING (true);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES project_milestones(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'struggling')),
  code_submitted text,
  attempts integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id, milestone_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Concept Mastery Table
CREATE TABLE IF NOT EXISTS concept_mastery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id uuid NOT NULL REFERENCES programming_concepts(id) ON DELETE CASCADE,
  mastery_level integer NOT NULL DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 100),
  last_practiced timestamptz DEFAULT now(),
  practice_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, concept_id)
);

ALTER TABLE concept_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own concept mastery"
  ON concept_mastery FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own concept mastery"
  ON concept_mastery FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own concept mastery"
  ON concept_mastery FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Hints Table
CREATE TABLE IF NOT EXISTS hints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id uuid NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  hint_level integer NOT NULL CHECK (hint_level BETWEEN 1 AND 3),
  hint_text text NOT NULL,
  hint_type text NOT NULL DEFAULT 'conceptual' CHECK (hint_type IN ('conceptual', 'directional', 'documentation')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hints"
  ON hints FOR SELECT
  TO authenticated
  USING (true);

-- User Hint Usage Table
CREATE TABLE IF NOT EXISTS user_hint_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hint_id uuid NOT NULL REFERENCES hints(id) ON DELETE CASCADE,
  milestone_id uuid NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  used_at timestamptz DEFAULT now()
);

ALTER TABLE user_hint_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own hint usage"
  ON user_hint_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hint usage"
  ON user_hint_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_project_id ON user_progress(project_id);
CREATE INDEX IF NOT EXISTS idx_concept_mastery_user_id ON concept_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_hints_milestone_id ON hints(milestone_id);
CREATE INDEX IF NOT EXISTS idx_user_hint_usage_user_id ON user_hint_usage(user_id);