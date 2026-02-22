import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Mail, ArrowLeft } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const { signIn, resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordLoading(true);

    try {
      await resetPasswordForEmail(forgotPasswordEmail);
      setForgotPasswordSent(true);
    } catch (err) {
      setForgotPasswordError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setForgotPasswordError('');
    setForgotPasswordSent(false);
  };

  const inputClass = 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center justify-center mb-6">
            <Mail className="w-12 h-12 text-blue-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">
            Reset your password
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-6">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          {forgotPasswordSent ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-sm">
                Check your email for a link to reset your password. If it doesn&apos;t appear in a few minutes, check your spam folder.
              </div>
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center gap-2 text-blue-600 dark:text-indigo-400 hover:text-blue-700 dark:hover:text-indigo-300 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              {forgotPasswordError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-600 dark:text-red-300 text-sm">
                  {forgotPasswordError}
                </div>
              )}

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className={labelClass}>
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="w-full bg-blue-600 dark:bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {forgotPasswordLoading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex items-center justify-center mb-6">
          <LogIn className="w-12 h-12 text-blue-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Welcome Back to RaxLearn
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-600 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 dark:text-indigo-400 hover:text-blue-700 dark:hover:text-indigo-300 font-medium"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 dark:bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-blue-600 dark:text-indigo-400 hover:text-blue-700 dark:hover:text-indigo-300 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
