import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Progress {
  id: string;
  user_id: string;
  project_id: string;
  milestone_id: string | null;
  status: 'not_started' | 'in_progress' | 'completed' | 'struggling';
  code_submitted: string | null;
  attempts: number;
  time_spent_minutes: number;
  completed_at: string | null;
}

export function useProgress(projectId?: string, milestoneId?: string) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    if (!user) {
      setProgress([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      if (milestoneId) {
        query = query.eq('milestone_id', milestoneId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProgress(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user, projectId, milestoneId]);

  const updateProgress = async (
    projectId: string,
    milestoneId: string | null,
    updates: Partial<Progress>
  ) => {
    if (!user) throw new Error('Not authenticated');

    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .eq('milestone_id', milestoneId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('user_progress')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          project_id: projectId,
          milestone_id: milestoneId,
          ...updates,
        });

      if (error) throw error;
    }

    await fetchProgress();
  };

  return { progress, loading, error, updateProgress, refetch: fetchProgress };
}
