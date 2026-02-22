import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useProjects } from '../hooks/useProjects';
import { useProgress } from '../hooks/useProgress';
import { Code, Clock, TrendingUp, LogOut, BookOpen, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { ProjectView } from './ProjectView';

export function Dashboard() {
  const { profile, signOut } = useAuth();
  const { projects, loading: projectsLoading } = useProjects(profile?.career_goal_id);
  const { progress } = useProgress();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { theme, toggleTheme } = useTheme();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-amber-900/40 dark:text-amber-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getProjectProgress = (projectId: string) => {
    const projectProgress = progress.filter(p => p.project_id === projectId);
    if (projectProgress.length === 0) return 0;
    const completed = projectProgress.filter(p => p.status === 'completed').length;
    return projectProgress.length > 0 ? Math.round((completed / projectProgress.length) * 100) : 0;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (selectedProject) {
    return <ProjectView projectId={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  const inProgressCount = progress.filter(p => p.status === 'in_progress').length;
  const completedCount = progress.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background: image + gradient overlay + subtle pattern */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-sky-50 via-blue-50/95 to-indigo-50/90 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200"
        aria-hidden
      />
      <div
        className="fixed inset-0 -z-10 opacity-[0.35] dark:opacity-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80)`,
        }}
        aria-hidden
      />
      <div
        className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="fixed inset-0 -z-10 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.06) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
        aria-hidden
      />

      <nav className="sticky top-0 z-40 border-b border-gray-200/80 dark:border-gray-700/80 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 transition-transform duration-200 hover:opacity-90">
              <Code className="w-8 h-8 text-blue-600 dark:text-indigo-400 mr-2" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">RaxLearn</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-white">{profile?.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{profile?.current_skill_level}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 opacity-0 animate-fade-in-up [animation-fill-mode:forwards]">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Your Learning Journey
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Build real projects and master programming through hands-on experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Projects Available', value: projects.length, Icon: BookOpen, color: 'blue', delay: 0 },
            { label: 'In Progress', value: inProgressCount, Icon: Clock, color: 'yellow', delay: 100 },
            { label: 'Completed', value: completedCount, Icon: TrendingUp, color: 'green', delay: 200 },
          ].map(({ label, value, Icon, color, delay }) => (
            <div
              key={label}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-600/80 p-6 opacity-0 animate-fade-in-up [animation-fill-mode:forwards] transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-200/80 dark:hover:border-indigo-500/50 hover:bg-white dark:hover:bg-gray-800 cursor-default"
              style={{ animationDelay: `${delay}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 ${color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-indigo-500/20 dark:text-indigo-400' : color === 'yellow' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-600/80 p-6 opacity-0 animate-fade-in-up [animation-fill-mode:forwards] [animation-delay:200ms]">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Available Projects</h2>

          {projectsLoading ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No projects available yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => {
                const progressPercent = getProjectProgress(project.id);
                return (
                  <div
                    key={project.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-xl p-5 opacity-0 animate-fade-in-up [animation-fill-mode:forwards] transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-200 dark:hover:border-indigo-500/50 cursor-pointer bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
                    style={{ animationDelay: `${280 + index * 60}ms` }}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {project.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium transition-colors duration-200 ${getDifficultyColor(project.difficulty)}`}>
                        {project.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Clock className="w-4 h-4 mr-1" />
                      {project.estimated_duration_hours}h
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded transition-colors duration-200"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {progressPercent > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
