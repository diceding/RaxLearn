import { Code, Target, Layers, Lightbulb, TrendingUp, ArrowRight, BookOpen, CheckCircle2, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

const features = [
  {
    icon: Target,
    title: 'Career-focused paths',
    description: 'Choose Web Development, Data Analysis, or Mobile Development and learn with projects that match your goals.',
  },
  {
    icon: Layers,
    title: 'Real projects, step by step',
    description: 'Build real applications through clear milestones. No fluff—just hands-on coding and concepts that stick.',
  },
  {
    icon: Lightbulb,
    title: 'Context-aware hints',
    description: 'Stuck? Get conceptual, directional, or documentation hints when you need them—without spoiling the solution.',
  },
  {
    icon: TrendingUp,
    title: 'Progress that follows you',
    description: 'Your progress is saved automatically. Pick up where you left off and see how far you’ve come.',
  },
];

const steps = [
  { step: 1, title: 'Sign up free', body: 'Create your account and tell us your current level.' },
  { step: 2, title: 'Pick your path', body: 'Select a career track that fits your goals.' },
  { step: 3, title: 'Build and learn', body: 'Work through projects and milestones at your own pace.' },
];

export function LandingPage({ onOpenLogin, onOpenSignup }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Code className="w-8 h-8 text-indigo-600 dark:text-indigo-400" aria-hidden />
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">RaxLearn</span>
            </div>
            <nav className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={onOpenLogin}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Log in
              </button>
              <button
                onClick={onOpenSignup}
                className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors px-4 py-2.5 rounded-lg shadow-sm"
              >
                Get started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1]">
              Learn to code by{' '}
              <span className="text-indigo-600 dark:text-indigo-400">building real projects</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              No endless tutorials. Pick a career path, work through real apps with step-by-step milestones, and get hints when you need them. Your progress, your pace.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenSignup}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40"
              >
                Start learning free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                I have an account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 border-t border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Everything you need to level up
            </h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Career paths, real projects, smart hints, and progress tracking—all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex gap-5 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-600/80 bg-gray-50/50 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 hover:border-indigo-200/80 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 bg-[#f8fafc] dark:bg-gray-900 border-t border-gray-200/80 dark:border-gray-700/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              How it works
            </h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get from zero to building real apps in three simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            {steps.map(({ step, title, body }) => (
              <div key={step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-lg mb-5">
                  {step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-indigo-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-14 h-14 text-white/90 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to build your skills?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Join RaxLearn and start your first project in minutes. Free—no credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenSignup}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-indigo-600 dark:text-indigo-700 bg-white hover:bg-gray-100 dark:hover:bg-gray-200 rounded-xl transition-colors"
            >
              Create free account
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto text-base font-semibold text-white/90 hover:text-white transition-colors"
            >
              Log in
            </button>
          </div>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-indigo-100 dark:text-indigo-200">
            <li className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Choose your career path
            </li>
            <li className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Step-by-step milestones
            </li>
            <li className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Hints when you’re stuck
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Code className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden />
            <span className="font-bold text-gray-900 dark:text-white">RaxLearn</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <button onClick={onOpenLogin} className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Log in
            </button>
            <button onClick={onOpenSignup} className="hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
              Sign up
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
