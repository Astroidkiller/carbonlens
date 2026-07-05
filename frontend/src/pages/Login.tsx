import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Leaf, ArrowRight } from 'lucide-react';
import { LiquidCard } from '../components/ui/LiquidCard';
import { LiquidButton } from '../components/ui/LiquidButton';
import { NatureBackground } from '../components/layout/NatureBackground';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);
      login(data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden px-4">
      <NatureBackground />
      
      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <LiquidCard className="p-8 sm:p-10" hover={false}>
          <div className="text-center mb-10">
            <div className="mx-auto h-16 w-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-[inset_0_0_20px_rgba(52,211,153,0.1)] border border-emerald-500/20">
              <Leaf className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-semibold text-[var(--text)] tracking-tight">Welcome back</h1>
            <p className="mt-2 text-[var(--text-muted)] font-medium">Enter your details to sign in to your account</p>
          </div>
          
          {error && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-sm text-center font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-muted)] mb-2 ml-1">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="glass-input w-full px-4 py-3 sm:text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--text-muted)] mb-2 ml-1">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  className="glass-input w-full px-4 py-3 sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <LiquidButton
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full py-3.5"
              >
                {isLoading ? 'Signing in...' : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 ml-1 opacity-70" />
                  </>
                )}
              </LiquidButton>
            </div>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium">
            <span className="text-[var(--text-muted)]">Don't have an account? </span>
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Create one
            </Link>
          </div>
        </LiquidCard>
      </div>
    </main>
  );
};
