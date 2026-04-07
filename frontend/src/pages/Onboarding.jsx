import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, ChevronLeft, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const STEPS = [
  { title: "Welcome! Let's get started", subtitle: 'Create your account' },
  { title: 'Set your daily goals', subtitle: 'We\'ll track your progress against these' },
  { title: 'Customize your focus', subtitle: 'How should we weigh your efficiency score?' },
];

export default function Onboarding() {
  const { signup, updateSettings, isDarkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', password: '' });
  const [goals, setGoals] = useState({ currency: '₹', dailyBudget: 1000, dailyHours: 6 });
  const [weight, setWeight] = useState(50);
  const [strictMode, setStrictMode] = useState(false);

  const handleProfile = e => setProfile(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleGoals = e => setGoals(f => ({ ...f, [e.target.name]: e.target.value }));

  const validateStep = () => {
    if (step === 0) {
      if (!profile.name || !profile.email || !profile.password) {
        toast.error('Please fill in all fields');
        return false;
      }
      if (profile.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
      }
    }
    if (step === 1) {
      if (!goals.dailyBudget || !goals.dailyHours) {
        toast.error('Please set your goals');
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    
    // Attempt backend signup at end of Step 1
    if (step === 0) {
      setLoading(true);
      const res = await signup(profile.name, profile.email, profile.password);
      setLoading(false);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      setStep(s => s + 1);
      return;
    }
    
    // Step 2 to 3
    if (step < 2) { setStep(s => s + 1); return; }
    
    // Step 3 — finish
    updateSettings({
      currency: goals.currency,
      dailyBudget: Number(goals.dailyBudget),
      dailyHours: Number(goals.dailyHours),
      moneyWeight: weight,
      strictMode: strictMode,
    });
    toast.success(`Welcome, ${profile.name}! 🚀`);
    navigate('/dashboard', { replace: true });
  };

  const progress = ((step + 1) / 3) * 100;

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
            Start your journey to <br />
            <span style={{ color: 'var(--yellow)' }}>peak efficiency.</span>
          </h1>
          <p className="auth-subtext">
            Join thousands of users who track their time and money to build better habits and reach their functional goals.
          </p>
        </div>
        
        {/* Abstract background circles for flare */}
        <div style={{ 
          position: 'absolute', top: '-10%', left: '-10%', 
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

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Step {step + 1} of 3</span>
              <span className="text-xs font-bold text-muted">{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${progress}%`, background: 'var(--gradient-main)' }} />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: 12 }}>{STEPS[step].title}</h1>
            <p className="text-secondary">{STEPS[step].subtitle}</p>
          </div>

          {/* Step content */}
          <div className="flex flex-col gap-5 animate-slideUp" key={step}>
            {step === 0 && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="name" className="form-input" placeholder="John Doe" value={profile.name} onChange={handleProfile} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input name="email" type="email" className="form-input" placeholder="your@email.com" value={profile.email} onChange={handleProfile} />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input name="password" type="password" className="form-input" placeholder="Min. 6 characters" value={profile.password} onChange={handleProfile} />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select name="currency" className="form-select" value={goals.currency} onChange={handleGoals}>
                    <option value="₹">₹ Indian Rupee</option>
                    <option value="$">$ US Dollar</option>
                    <option value="€">€ Euro</option>
                    <option value="£">£ British Pound</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Daily Budget Limit</label>
                  <input name="dailyBudget" type="number" className="form-input" placeholder="1000" value={goals.dailyBudget} onChange={handleGoals} />
                </div>
                <div className="form-group">
                  <label className="form-label">Daily Productive Hours Goal</label>
                  <input name="dailyHours" type="number" className="form-input" placeholder="6" min="1" max="24" value={goals.dailyHours} onChange={handleGoals} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{
                  background: strictMode ? 'rgba(255, 0, 51, 0.05)' : 'var(--gradient-soft)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 24,
                  textAlign: 'center',
                  border: strictMode ? '1px solid rgba(255, 0, 51, 0.2)' : '1px solid transparent',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="flex justify-around items-center mb-4">
                    <div className="flex flex-col items-center">
                       <span className="text-xs font-bold text-muted mb-1">ALPHA (α)</span>
                       <div className="text-2xl font-black" style={{ color: 'var(--primary)' }}>{weight}%</div>
                       <span className="text-xs font-semibold">Money</span>
                    </div>
                    <div className="text-2xl font-light text-muted">+</div>
                    <div className="flex flex-col items-center">
                       <span className="text-xs font-bold text-muted mb-1">BETA (β)</span>
                       <div className="text-2xl font-black" style={{ color: 'var(--primary)' }}>{100 - weight}%</div>
                       <span className="text-xs font-semibold">Time</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 pt-3 border-t border-white" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                    <div style={{ textAlign: 'right' }}>
                       <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: strictMode ? 'var(--neon-red)' : 'var(--text-muted)' }}>
                          Hardcore Mode
                       </span>
                       <p className="text-[10px] text-muted leading-tight">Enables negative scoring</p>
                    </div>
                    <input 
                       type="checkbox" 
                       checked={strictMode} 
                       onChange={e => setStrictMode(e.target.checked)}
                       style={{ width: 22, height: 22, cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">More Money Weight</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">More Time Weight</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={weight}
                    onChange={e => setWeight(Number(e.target.value))}
                    className="slider"
                  />
                </div>

                <div className="card" style={{ background: 'var(--primary-50)', border: '1px dashed var(--primary-200)', padding: '16px' }}>
                  <p className="text-sm text-secondary">
                    💡 <strong>Pro Tip:</strong> α and β balance your priorities. {strictMode ? "Hardcore mode will penalize over-spending with negative scores!" : "Choose a focus that matches your primary goal."}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)} disabled={loading}>
                <ChevronLeft size={20} /> Back
              </button>
            )}
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleNext} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2}} /> : (
                step < 2 ? (
                  <><span>Continue</span><ChevronRight size={20} /></>
                ) : (
                  '🚀 Get Started!'
                )
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
