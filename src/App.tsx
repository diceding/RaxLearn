import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Onboarding } from './components/auth/Onboarding';
import { UpdatePassword } from './components/auth/UpdatePassword';
import { Dashboard } from './components/Dashboard';

function App() {
  const { user, profile, loading, isPasswordRecovery } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-200">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (user && isPasswordRecovery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
        <UpdatePassword />
      </div>
    );
  }

  if (!user) {
    if (!showAuth) {
      return (
        <LandingPage
          onOpenLogin={() => { setAuthMode('login'); setShowAuth(true); }}
          onOpenSignup={() => { setAuthMode('signup'); setShowAuth(true); }}
        />
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={() => setShowAuth(false)}
            className="mb-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>
          {authMode === 'login' ? (
            <LoginForm onToggleMode={() => setAuthMode('signup')} />
          ) : (
            <SignupForm onToggleMode={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  if (!profile?.onboarding_completed) {
    return <Onboarding />;
  }

  return <Dashboard />;
}

export default App;
