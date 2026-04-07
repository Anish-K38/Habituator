import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, user, isDarkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in
  if (user) { navigate('/dashboard', { replace: true }); return null; }

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    
    if (result.success) {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      {/* Left side: Branding */}
      <div className="auth-branding">
        <div className="auth-logo-float">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.3)',
            }}>
              <Zap size={24} color="white" fill="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.05em' }}>HABITUATOR</span>
          </div>
        </div>

        <div className="auth-branding-content">
          <h1 className="auth-heading">
            Welcome back to your <br />
            <span style={{ color: 'var(--yellow)' }}>financial clarity.</span>
          </h1>
          <p className="auth-subtext">
            Track money & time, boost efficiency. Re-enter your workspace securely and continue mastering your habits.
          </p>
        </div>
        
        {/* Abstract background circles for flare */}
        <div style={{ 
          position: 'absolute', bottom: '-10%', right: '-10%', 
          width: 400, height: 400, borderRadius: '50%', 
          background: 'rgba(255,255,255,0.05)', filter: 'blur(60px)' 
        }} />
      </div>

      {/* Right side: Form */}
      <div className="auth-form-wrapper">
        <div className="auth-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
             <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.2em' }}>LUXFLOW · ELITE EDITION</div>
             <button onClick={toggleDarkMode} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
               {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>
          </div>

          <div className="mb-8">
            <h1 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: 12 }}>Step into the <br />Elite Circle.</h1>
            <p className="text-secondary">Your ambition, quantified. Your momentum, mastered.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email"
                className="form-input"
                placeholder="your@email.com"
                value={form.email} onChange={handle}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center">
                <label className="form-label" htmlFor="password">Password</label>
                <button type="button" onClick={() => toast('Password reset coming soon!')}
                  style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input" style={{ paddingRight: 44 }}
                  placeholder="••••••••"
                  value={form.password} onChange={handle}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center',
                  }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
              style={{ marginTop: 8 }}>
              {loading ? <span className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} /> : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 mb-6 mt-6">
            <div className="divider" style={{ margin: 0, flex: 1 }} />
            <span className="text-xs text-muted uppercase tracking-wider font-semibold">Or continue with</span>
            <div className="divider" style={{ margin: 0, flex: 1 }} />
          </div>

          <div className="flex gap-3 mb-8">
            {[
              { label: 'Google', emoji: '🌐' },
              { label: 'Apple', emoji: '🍎' },
            ].map(({ label, emoji }) => (
              <button key={label} className="social-btn" onClick={() => toast('Social login coming soon!')}>
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-secondary">
            New here?{' '}
            <Link to="/onboarding" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
