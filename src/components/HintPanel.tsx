import { useState } from 'react';
import { useHints } from '../hooks/useHints';
import { Lightbulb, Lock, ExternalLink } from 'lucide-react';

interface HintPanelProps {
  milestoneId: string;
}

export function HintPanel({ milestoneId }: HintPanelProps) {
  const { hints, usedHints, loading, markHintUsed } = useHints(milestoneId);
  const [revealedHints, setRevealedHints] = useState<string[]>(usedHints);

  const handleRevealHint = async (hintId: string) => {
    if (!revealedHints.includes(hintId)) {
      try {
        await markHintUsed(hintId);
        setRevealedHints([...revealedHints, hintId]);
      } catch (error) {
        console.error('Error marking hint as used:', error);
      }
    }
  };

  const getHintTypeIcon = () => {
    return <Lightbulb className="w-5 h-5" />;
  };

  const getHintTypeLabel = (type: string) => {
    switch (type) {
      case 'conceptual':
        return 'Conceptual Hint';
      case 'directional':
        return 'Directional Guidance';
      case 'documentation':
        return 'Documentation Link';
      default:
        return 'Hint';
    }
  };

  const getHintTypeColor = (type: string) => {
    switch (type) {
      case 'conceptual':
        return 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300';
      case 'directional':
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300';
      case 'documentation':
        return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading hints...</div>;
  }

  if (hints.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-amber-900/30 border border-yellow-200 dark:border-amber-700 rounded-lg p-4 text-center text-gray-600 dark:text-gray-400">
        No hints available for this milestone yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Hints are revealed progressively. Try to solve the problem before requesting hints!
      </p>

      {hints.map((hint, index) => {
        const isRevealed = revealedHints.includes(hint.id);
        const canReveal = index === 0 || revealedHints.includes(hints[index - 1].id);

        return (
          <div
            key={hint.id}
            className={`border-2 rounded-lg p-4 transition-colors ${getHintTypeColor(hint.hint_type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                {getHintTypeIcon()}
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold">
                      Level {hint.hint_level} - {getHintTypeLabel(hint.hint_type)}
                    </span>
                  </div>

                  {isRevealed ? (
                    <div className="text-sm">
                      {hint.hint_type === 'documentation' && hint.hint_text.includes('http') ? (
                        <a
                          href={hint.hint_text.match(/https?:\/\/[^\s]+/)?.[0] || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 dark:text-indigo-400 hover:text-blue-700 dark:hover:text-indigo-300 underline"
                        >
                          {hint.hint_text.split('http')[0].trim()}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <p>{hint.hint_text}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">Hint locked</span>
                    </div>
                  )}
                </div>
              </div>

              {!isRevealed && (
                <button
                  onClick={() => handleRevealHint(hint.id)}
                  disabled={!canReveal}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-800 dark:text-gray-200"
                >
                  Reveal
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
