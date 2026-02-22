import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCareerPaths } from '../../hooks/useCareerPaths';
import { Rocket, Code, TrendingUp } from 'lucide-react';

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'New to programming' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience with coding' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced developer' },
];

export function Onboarding() {
  const { profile, updateProfile } = useAuth();
  const { careerPaths, loading: pathsLoading } = useCareerPaths();
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('beginner');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateProfile({
        career_goal_id: selectedCareer || null,
        current_skill_level: selectedSkillLevel as 'beginner' | 'intermediate' | 'advanced',
        onboarding_completed: true,
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  if (pathsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-200">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="mb-8 text-center">
          <Rocket className="w-16 h-16 text-blue-600 dark:text-indigo-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome to RaxLearn, {profile?.full_name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's personalize your learning journey
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 dark:bg-indigo-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Skill Level</span>
            </div>
            <div className={`w-16 h-0.5 mx-4 ${step >= 2 ? 'bg-blue-600 dark:bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 dark:bg-indigo-600 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Career Path</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
              What's your current skill level?
            </h2>
            <div className="space-y-3">
              {SKILL_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setSelectedSkillLevel(level.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedSkillLevel === level.value
                      ? 'border-blue-600 dark:border-indigo-500 bg-blue-50 dark:bg-indigo-500/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-indigo-500'
                  }`}
                >
                  <div className="flex items-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-indigo-400 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-800 dark:text-white">{level.label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{level.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full mt-6 bg-blue-600 dark:bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-indigo-500 transition-colors font-medium"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
              Choose your career path
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Select the path that aligns with your goals. You can always change this later.
            </p>
            <div className="space-y-3">
              {careerPaths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => setSelectedCareer(path.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedCareer === path.id
                      ? 'border-blue-600 dark:border-indigo-500 bg-blue-50 dark:bg-indigo-500/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-indigo-500'
                  }`}
                >
                  <div className="flex items-start">
                    <Code className="w-6 h-6 text-blue-600 dark:text-indigo-400 mr-3 mt-1" />
                    <div className="text-left flex-1">
                      <div className="font-semibold text-gray-800 dark:text-white mb-1">{path.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{path.description}</div>
                      {selectedCareer === path.id && path.learning_objectives.length > 0 && (
                        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-2">
                          {path.learning_objectives.slice(0, 3).map((obj, idx) => (
                            <li key={idx}>• {obj}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 bg-blue-600 dark:bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-indigo-500 disabled:opacity-50 transition-colors font-medium"
              >
                {loading ? 'Saving...' : 'Get Started'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
