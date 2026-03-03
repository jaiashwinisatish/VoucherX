import { useState } from 'react';
import { Repeat, Mail, Lock, User, AtSign, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const [view, setView] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'reset') {
        await resetPassword(email);
        setResetSent(true);
      } else if (view === 'signup') {
        await signUp(email, password, fullName, username || undefined);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setView(view === 'signin' ? 'signup' : 'signin');
    setError('');
    setResetSent(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl mb-4">
              <Repeat className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
              VoucherX
            </h1>
            <p className="text-slate-600">
              {view === 'reset'
                ? 'Reset your password'
                : "Don't let your vouchers expire. Trade. Earn. Repeat."}
            </p>
          </div>

          {view === 'reset' && resetSent ? (
            <div className="space-y-4">
              <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm">
                Password reset link sent! Check your email inbox.
              </div>
              <button
                onClick={() => {
                  setView('signin');
                  setResetSent(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="3-20 chars, letters, numbers, underscore"
                    pattern="[a-zA-Z0-9_]{3,20}"
                    title="Username must be 3-20 characters: letters, numbers, or underscores"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Leave blank to auto-generate from your email
                </p>
              </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {view !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required={view !== 'reset'}
                  minLength={6}
                />
              </div>
            </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading
                ? 'Processing...'
                : view === 'signup'
                ? 'Create Account'
                : view === 'reset'
                ? 'Send Reset Link'
                : 'Sign In'}
            </button>
          </form>
          )}

          <div className="mt-6 text-center space-y-2">
            {view !== 'reset' && (
              <button
                onClick={toggleView}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium block w-full"
              >
                {view === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            )}
            {view === 'signin' && (
              <button
                onClick={() => {
                  setView('reset');
                  setError('');
                }}
                className="text-sm text-slate-500 hover:text-slate-600 block w-full"
              >
                Forgot your password?
              </button>
            )}
            {view === 'reset' && !resetSent && (
              <button
                onClick={() => {
                  setView('signin');
                  setError('');
                }}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center gap-1 w-full"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Sign In
              </button>
            )}
          </div>

          {view === 'signup' && (
            <div className="mt-6 p-4 bg-teal-50 rounded-lg">
              <p className="text-sm text-teal-800 font-medium">
                Get 100 VoucherCoins when you sign up!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
