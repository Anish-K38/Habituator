import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, user } = useApp();
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
    <div style={{
      minHeight: '100dvh',
      background: 'var(--gradient-main)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="animate-scaleIn" style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 32px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-5">
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'var(--gradient-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
            boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
          }}>
            <Zap size={36} color="white" fill="white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>HabitTracker</h1>
          <p className="text-sm text-muted mt-2">Track money & time, boost efficiency</p>
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
            style={{ marginTop: 4 }}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Login'}
          </button>
        </form>

        <div className="flex items-center gap-3 mb-4 mt-4">
          <div className="divider" style={{ margin: 0, flex: 1 }} />
          <span className="text-xs text-muted">or continue with</span>
          <div className="divider" style={{ margin: 0, flex: 1 }} />
        </div>

        <div className="flex gap-2 mb-5">
          {[
            { label: 'Google', emoji: '🌐' },
            { label: 'Apple', emoji: '🍎' },
            { label: 'Facebook', emoji: '📘' },
          ].map(({ label, emoji }) => (
            <button key={label} className="social-btn" onClick={() => toast('Social login coming soon!')}>
              <span>{emoji}</span>
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-secondary">
          Don't have an account?{' '}
          <Link to="/onboarding" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Get Started
          </Link>
        </p>
      </div>
    </div>
  );
}
