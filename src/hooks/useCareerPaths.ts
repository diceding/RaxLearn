import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CareerPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  learning_objectives: string[];
}

export function useCareerPaths() {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCareerPaths() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('career_paths')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        setCareerPaths(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCareerPaths();
  }, []);

  return { careerPaths, loading, error };
}
