'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SegmentedControl, RoleOption } from '../../components/SegmentedControl';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [role, setRole] = useState<RoleOption>('cashier');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Cashier specific state
  const [cashierName, setCashierName] = useState('');
  const [cashierId, setCashierId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const supabase = createClient();

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Dev bypass: immediate login for local development
    if (email.trim().toLowerCase() === 'admin@gmail.com' && (password === '1234' || password === 'password1234')) {
      document.cookie = `plated_dev_user=${encodeURIComponent(JSON.stringify({ email: 'admin@gmail.com', role: 'admin', name: 'Admin User' }))}; path=/; max-age=86400; SameSite=Lax`;
      window.location.href = '/admin';
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        window.location.href = '/admin';
      }
    } catch (err: any) {
      setError(err?.message || "Failed to reach authentication server.");
      setLoading(false);
    }
  };

  const handleCashierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!cashierId || !cashierName) {
      setError("Please provide both Name and ID Number.");
      setLoading(false);
      return;
    }

    // Dev bypass: immediate login for local development
    if (cashierId.trim() === '1234' || cashierName.trim().toLowerCase() === 'admin') {
      const targetRole = role; // 'cashier' | 'kitchen'
      document.cookie = `plated_dev_user=${encodeURIComponent(JSON.stringify({ email: 'admin@gmail.com', role: targetRole, name: cashierName.trim() }))}; path=/; max-age=86400; SameSite=Lax`;
      window.location.href = targetRole === 'kitchen' ? '/kds' : '/';
      return;
    }

    let mappedEmail = `${cashierId.trim()}@cashier.plated.local`;
    let loginPassword = cashierId.trim();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: mappedEmail,
        password: loginPassword,
      });

      if (error) {
        setError("Invalid Name or ID Number.");
        setLoading(false);
      } else {
        window.location.href = role === 'kitchen' ? '/kds' : '/';
      }
    } catch {
      setError("Failed to reach authentication server.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-surface-primary">
      {/* LEFT PANEL - Branding (Burnt Orange/Brand Accent) */}
      <section className="md:flex-1 bg-action-primary flex flex-col justify-between p-8 md:p-16 text-surface-primary relative overflow-hidden">
        {/* Subtle background pattern could go here */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           {/* Placeholder for floating brand elements / origami birds from inspiration */}
        </div>

        <div className="relative z-10">
          <p className="text-16 mb-2 opacity-90 font-medium">With your account you</p>
          <h1 className="text-32 md:text-4xl font-bold leading-tight mb-12">
            Get access to all<br />Plated tools
          </h1>
        </div>

        {/* Logos section - mimicking inspiration image */}
        <div className="relative z-10 grid grid-cols-2 gap-8 items-center max-w-sm mt-auto pb-8 md:pb-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-primary/20 flex items-center justify-center">🍽️</div>
            <span className="font-bold tracking-tight text-14">Plated Diner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-primary/20 flex items-center justify-center">📱</div>
            <span className="font-bold tracking-tight text-14">Plated Till</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-primary/20 flex items-center justify-center">📈</div>
            <span className="font-bold tracking-tight text-14">Plated Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-primary/20 flex items-center justify-center">🛠️</div>
            <span className="font-bold tracking-tight text-14">Plated Ops</span>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL - Authentication Form */}
      <section className="md:flex-1 bg-surface-primary flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <h2 className="text-28 font-bold text-text-primary mb-8">Sign In</h2>
          
          <SegmentedControl active={role} onChange={setRole} />

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-13">
              {error}
            </div>
          )}

          {role === 'admin' ? (
            /* ADMIN LOGIN FORM */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-13 font-semibold text-text-primary mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-border-default bg-surface-secondary text-text-primary focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all text-14"
                  placeholder="manager@restaurant.com"
                  required
                />
              </div>
              <div>
                <label className="block text-13 font-semibold text-text-primary mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-border-default bg-surface-secondary text-text-primary focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all text-14"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-action-primary text-surface-primary rounded-md font-bold text-16-tight hover:bg-action-primary-hover transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {loading ? 'Signing in...' : 'Sign in with Email'}
                </button>
              </div>
              
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-border-default"></div>
                <span className="flex-shrink-0 mx-4 text-text-tertiary text-12 uppercase tracking-wide">Or</span>
                <div className="flex-grow border-t border-border-default"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3 bg-surface-secondary text-text-primary border border-border-default rounded-md font-semibold text-14 hover:bg-surface-tertiary transition-colors flex justify-center items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </form>
          ) : (
            /* CASHIER / KITCHEN LOGIN FORM */
            <form onSubmit={handleCashierSubmit} className="space-y-4">
              <div>
                <label className="block text-13 font-semibold text-text-primary mb-1">Staff Name</label>
                <input
                  type="text"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-border-default bg-surface-secondary text-text-primary focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all text-14"
                  placeholder="e.g. Chidi"
                  required
                />
              </div>
              <div>
                <label className="block text-13 font-semibold text-text-primary mb-1">ID Number</label>
                <input
                  type="text"
                  value={cashierId}
                  onChange={(e) => setCashierId(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-border-default bg-surface-secondary text-text-primary focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all text-14 font-mono tracking-wider"
                  placeholder="e.g. 1234"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-action-primary text-surface-primary rounded-md font-bold text-16-tight hover:bg-action-primary-hover transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {loading ? 'Signing in...' : `Sign in as ${role === 'kitchen' ? 'Kitchen Staff' : 'Cashier'}`}
                </button>
              </div>
            </form>
          )}

          <div className="mt-12 text-center">
             <p className="text-12 text-text-tertiary">
               Protected by Plated OS • <a href="#" className="underline hover:text-text-primary">Help</a>
             </p>
          </div>
        </div>
      </section>
    </main>
  );
}
