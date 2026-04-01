import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateUser, settings, updateSettings, logout } = useApp();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [goals, setGoals] = useState({ ...settings });

  const handleSave = () => {
    updateUser(profile);
    updateSettings(goals);
    toast.success('Settings saved! ✅');
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="mb-4">⚙️ Settings</h2>

      {/* Profile */}
      <div className="card mb-4">
        <h3 className="mb-3">👤 Profile</h3>
        <div className="flex flex-col gap-3">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="card mb-4">
        <h3 className="mb-3">🎯 Daily Goals</h3>
        <div className="flex flex-col gap-3">
          <div className="form-group">
            <label className="form-label">Currency</label>
            <select className="form-select" value={goals.currency} onChange={e => setGoals(g => ({ ...g, currency: e.target.value }))}>
              <option value="₹">₹ Indian Rupee</option>
              <option value="$">$ US Dollar</option>
              <option value="€">€ Euro</option>
              <option value="£">£ British Pound</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Daily Budget</label>
            <input className="form-input" type="number" value={goals.dailyBudget} onChange={e => setGoals(g => ({ ...g, dailyBudget: Number(e.target.value) }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Daily Productive Hours Goal</label>
            <input className="form-input" type="number" min="1" max="24" value={goals.dailyHours} onChange={e => setGoals(g => ({ ...g, dailyHours: Number(e.target.value) }))} />
          </div>
        </div>
      </div>

      {/* Efficiency Weighting */}
      <div className="card mb-4">
        <h3 className="mb-1">⚡ Efficiency Calculation</h3>
        <p className="text-sm text-muted mb-3">How to weigh your efficiency score</p>
        <div style={{
          background: 'var(--gradient-soft)',
          borderRadius: 'var(--radius-lg)',
          padding: 16,
          textAlign: 'center',
          marginBottom: 16,
        }}>
          <div className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
            💰 {goals.moneyWeight}% Money / ⏰ {100 - goals.moneyWeight}% Time
          </div>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold">Money Focus</span>
          <span className="text-sm font-semibold">Time Focus</span>
        </div>
        <input
          type="range" min="0" max="100" value={goals.moneyWeight}
          onChange={e => setGoals(g => ({ ...g, moneyWeight: Number(e.target.value) }))}
          className="slider"
        />
      </div>

      {/* App info */}
      <div className="card mb-4" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
        <p className="text-sm text-secondary" style={{ lineHeight: 1.7 }}>
          🔒 <strong>Local-first:</strong> All data is stored on your device.<br />
          🚀 <strong>Version:</strong> HabitTracker v1.0<br />
          📱 <strong>Mobile:</strong> Install as PWA or use the app
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button className="btn btn-primary btn-full" onClick={handleSave}>
          <Save size={18} /> Save Settings
        </button>
        <button className="btn btn-danger btn-full" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
