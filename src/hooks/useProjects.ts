import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Project {
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
}

export function useProjects(careerPathId?: string | null, difficulty?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        let query = supabase
          .from('projects')
          .select('*')
          .order('project_order', { ascending: true });

        if (careerPathId) {
          query = query.eq('career_path_id', careerPathId);
        }

        if (difficulty) {
          query = query.eq('difficulty', difficulty);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [careerPathId, difficulty]);

  return { projects, loading, error };
}

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .maybeSingle();

        if (error) throw error;
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  return { project, loading, error };
}
