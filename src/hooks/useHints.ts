import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Hint {
  id: string;
  milestone_id: string;
  hint_level: number;
  hint_text: string;
  hint_type: 'conceptual' | 'directional' | 'documentation';
}

export function useHints(milestoneId: string) {
  const { user } = useAuth();
  const [hints, setHints] = useState<Hint[]>([]);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHints() {
      try {
        setLoading(true);

        const { data: hintsData, error: hintsError } = await supabase
          .from('hints')
          .select('*')
          .eq('milestone_id', milestoneId)
          .order('hint_level', { ascending: true });

        if (hintsError) throw hintsError;
        setHints(hintsData || []);

        if (user) {
          const { data: usageData, error: usageError } = await supabase
            .from('user_hint_usage')
            .select('hint_id')
            .eq('user_id', user.id)
            .eq('milestone_id', milestoneId);

          if (usageError) throw usageError;
          setUsedHints(usageData?.map(u => u.hint_id) || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (milestoneId) {
      fetchHints();
    }
  }, [milestoneId, user]);

  const markHintUsed = async (hintId: string) => {
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_hint_usage')
      .insert({
        user_id: user.id,
        hint_id: hintId,
        milestone_id: milestoneId,
      });

    if (error && !error.message.includes('duplicate')) {
      throw error;
    }

    setUsedHints([...usedHints, hintId]);
  };

  return { hints, usedHints, loading, error, markHintUsed };
}
