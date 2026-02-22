import { useState, useEffect } from 'react';
import { useProject } from '../hooks/useProjects';
import { useMilestones } from '../hooks/useMilestones';
import { useProgress } from '../hooks/useProgress';
import { ArrowLeft, CheckCircle, Circle, Lightbulb } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { HintPanel } from './HintPanel';

interface ProjectViewProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectView({ projectId, onBack }: ProjectViewProps) {
  const { project, loading: projectLoading } = useProject(projectId);
  const { milestones, loading: milestonesLoading } = useMilestones(projectId);
  const { progress, updateProgress } = useProgress(projectId);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (milestones.length > 0 && !selectedMilestone) {
      const firstIncomplete = milestones.find(m => {
        const milestoneProgress = progress.find(p => p.milestone_id === m.id);
        return !milestoneProgress || milestoneProgress.status !== 'completed';
      });
      setSelectedMilestone(firstIncomplete?.id || milestones[0].id);
    }
  }, [milestones, progress, selectedMilestone]);

  useEffect(() => {
    if (project?.starter_code) {
      setCode(project.starter_code);
    }
  }, [project]);

  const getMilestoneStatus = (milestoneId: string) => {
    const milestoneProgress = progress.find(p => p.milestone_id === milestoneId);
    return milestoneProgress?.status || 'not_started';
  };

  const handleMilestoneComplete = async (milestoneId: string) => {
    try {
      await updateProgress(projectId, milestoneId, {
        status: 'completed',
        code_submitted: code,
        completed_at: new Date().toISOString(),
      });

      const currentIndex = milestones.findIndex(m => m.id === milestoneId);
      if (currentIndex < milestones.length - 1) {
        setSelectedMilestone(milestones[currentIndex + 1].id);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleCodeChange = async (newCode: string) => {
    setCode(newCode);
    if (selectedMilestone) {
      try {
        await updateProgress(projectId, selectedMilestone, {
          status: 'in_progress',
          code_submitted: newCode,
        });
      } catch (error) {
        console.error('Error saving code:', error);
      }
    }
  };

  if (projectLoading || milestonesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-gray-600 dark:text-gray-400">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-gray-600 dark:text-gray-400">Project not found</div>
      </div>
    );
  }

  const currentMilestone = milestones.find(m => m.id === selectedMilestone);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mr-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{project.title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{project.primary_language}</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-6 border border-gray-200 dark:border-gray-700 transition-colors">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Milestones</h2>
              <div className="space-y-2">
                {milestones.map((milestone, index) => {
                  const status = getMilestoneStatus(milestone.id);
                  const isSelected = selectedMilestone === milestone.id;

                  return (
                    <button
                      key={milestone.id}
                      onClick={() => setSelectedMilestone(milestone.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-indigo-500/20 border-2 border-blue-600 dark:border-indigo-500'
                          : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-start">
                        {status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 dark:text-white">
                            {index + 1}. {milestone.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Not Started'}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {currentMilestone && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        {currentMilestone.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{currentMilestone.description}</p>
                    </div>
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-amber-500/20 text-yellow-700 dark:text-amber-300 rounded-lg hover:bg-yellow-100 dark:hover:bg-amber-500/30 transition-colors"
                    >
                      <Lightbulb className="w-5 h-5" />
                      Hints
                    </button>
                  </div>

                  <div className="bg-blue-50 dark:bg-indigo-500/10 border-l-4 border-blue-600 dark:border-indigo-500 p-4 rounded transition-colors">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Instructions</h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentMilestone.instructions}</p>
                  </div>

                  {showHints && (
                    <div className="mt-4">
                      <HintPanel milestoneId={currentMilestone.id} />
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Code Editor</h3>
                    <button
                      onClick={() => handleMilestoneComplete(currentMilestone.id)}
                      disabled={getMilestoneStatus(currentMilestone.id) === 'completed'}
                      className="px-4 py-2 bg-green-600 dark:bg-emerald-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {getMilestoneStatus(currentMilestone.id) === 'completed' ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                  <CodeEditor
                    value={code}
                    onChange={handleCodeChange}
                    language={project.primary_language.toLowerCase()}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
