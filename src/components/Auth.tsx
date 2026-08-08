import { useState } from 'react';
import { Repeat, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const [view, setView] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'signup') {
        await signUp(email, password, fullName);
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
  };

  return (
    <div className="min-h-screen bg-gradient-page flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card backdrop-blur-md rounded-2xl shadow-xl p-8 border border-main-border">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-brand rounded-2xl mb-4 shadow-lg">
              <Repeat className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-brand bg-clip-text text-transparent mb-2">
              VoucherX
            </h1>
            <p className="text-muted-text">Don't let your vouchers expire. Trade. Earn. Repeat.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-main-text mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dim" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-muted-bg border border-main-border text-main-text rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-main-text mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dim" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-muted-bg border border-main-border text-main-text rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-main-text mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dim" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-muted-bg border border-main-border text-main-text rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="bg-status-error/10 text-status-error p-3 rounded-lg text-sm border border-status-error/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-brand text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
            >
              {loading ? 'Processing...' : view === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleView}
              className="text-sm text-brand-primary hover:text-brand-primary/80 font-medium transition-colors"
            >
              {view === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {view === 'signup' && (
            <div className="mt-6 p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
              <p className="text-sm text-brand-primary font-bold">
                Get 100 VoucherCoins when you sign up!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
