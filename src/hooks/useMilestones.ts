import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  milestone_order: number;
  instructions: string;
  test_criteria: any;
}

export function useMilestones(projectId: string) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMilestones() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('milestone_order', { ascending: true });

        if (error) throw error;
        setMilestones(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchMilestones();
    }
  }, [projectId]);

  return { milestones, loading, error };
}
