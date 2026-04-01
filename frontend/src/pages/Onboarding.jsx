import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const STEPS = [
  { title: "Welcome! Let's get started", subtitle: 'Create your account' },
  { title: 'Set your daily goals', subtitle: 'We\'ll track your progress against these' },
  { title: 'Customize your focus', subtitle: 'How should we weigh your efficiency score?' },
];

export default function Onboarding() {
  const { signup, updateSettings } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '', password: '' });
  const [goals, setGoals] = useState({ currency: '₹', dailyBudget: 1000, dailyHours: 6 });
  const [weight, setWeight] = useState(50);

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
    });
    toast.success(`Welcome, ${profile.name}! 🚀`);
    navigate('/dashboard', { replace: true });
  };

  const progress = ((step + 1) / 3) * 100;

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
        padding: '32px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-5">
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--gradient-main)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={20} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>HabitTracker</span>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted">Step {step + 1} of 3</span>
            <span className="text-xs text-muted">{Math.round(progress)}% complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Header */}
        <div className="mb-5">
          <h2 style={{ color: 'var(--text-primary)' }}>{STEPS[step].title}</h2>
          <p className="text-sm text-muted mt-2">{STEPS[step].subtitle}</p>
        </div>

        {/* Step content */}
        <div className="flex flex-col gap-4 animate-slideUp" key={step}>
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
                background: 'var(--gradient-soft)',
                borderRadius: 'var(--radius-lg)',
                padding: 20,
                textAlign: 'center',
              }}>
                <div className="text-3xl font-bold" style={{ color: 'var(--primary)', marginBottom: 4 }}>
                  {weight}% Money / {100 - weight}% Time
                </div>
                <p className="text-sm text-muted">Efficiency score weighting</p>
              </div>

              <div className="form-group">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">💰 Money Focus</span>
                  <span className="text-sm font-semibold">⏰ Time Focus</span>
                </div>
                <input
                  type="range" min="0" max="100" value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="slider"
                />
              </div>

              <div className="card" style={{ background: 'var(--primary-50)', border: '1px dashed var(--primary-200)' }}>
                <p className="text-sm text-secondary">
                  💡 <strong>Tip:</strong> With {weight}% money focus, spending under budget will impact your efficiency score more than productive hours.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          {step > 0 && (
            <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)} disabled={loading}>
              <ChevronLeft size={20} /> Back
            </button>
          )}
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleNext} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : (
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
  );
}
