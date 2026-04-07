import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateUser, settings, updateSettings, logout, isDarkMode, toggleDarkMode } = useApp();
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

      {/* Theme Mode (Mobile) */}
      <div className="card mb-4 md-hide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="mb-1">🌓 Theme Mode</h3>
            <p className="text-sm text-muted">Switch between Light and Dark mode</p>
          </div>
          <div 
            onClick={toggleDarkMode}
            style={{ 
              width: 60, height: 32, borderRadius: 16, 
              background: isDarkMode ? 'var(--primary)' : '#e5e7eb',
              position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease'
            }}
          >
            <div style={{ 
              width: 24, height: 24, borderRadius: 12, background: 'white',
              position: 'absolute', top: 4, left: isDarkMode ? 32 : 4,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {isDarkMode ? <Moon size={14} color="var(--primary)" /> : <Sun size={14} color="#f59e0b" />}
            </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
           <div>
              <h3 className="mb-1">⚡ Efficiency Calculation</h3>
              <p className="text-sm text-muted">How to weigh your money vs. time focus</p>
           </div>
           <div style={{ textAlign: 'right' }}>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-xs font-bold uppercase tracking-wider" style={{ color: goals.strictMode ? 'var(--neon-red)' : 'var(--text-muted)' }}>
                    Hardcore Mode
                 </span>
                 <input 
                    type="checkbox" 
                    checked={goals.strictMode} 
                    onChange={e => setGoals(g => ({ ...g, strictMode: e.target.checked }))}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                 />
              </div>
              <p className="text-xs text-muted" style={{ maxWidth: 120 }}>Enables negative scoring up to -100%</p>
           </div>
        </div>

        <div style={{
          background: goals.strictMode ? 'rgba(255, 0, 51, 0.05)' : 'var(--gradient-soft)',
          borderRadius: 'var(--radius-lg)',
          padding: 16,
          textAlign: 'center',
          marginBottom: 16,
          border: goals.strictMode ? '1px solid rgba(255, 0, 51, 0.2)' : '1px solid transparent',
          transition: 'all 0.3s ease'
        }}>
          <div className="flex justify-around items-center">
             <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-muted mb-1">ALPHA (α)</span>
                <div className="text-xl font-black" style={{ color: 'var(--primary)' }}>
                   {goals.moneyWeight}%
                </div>
                <span className="text-xs font-semibold">Money</span>
             </div>
             <div className="text-2xl font-light text-muted">+</div>
             <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-muted mb-1">BETA (β)</span>
                <div className="text-xl font-black" style={{ color: 'var(--primary)' }}>
                   {100 - goals.moneyWeight}%
                </div>
                <span className="text-xs font-semibold">Time</span>
             </div>
          </div>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">More Weight on Money</span>
          <span className="text-xs font-bold uppercase tracking-wider text-muted">More Weight on Time</span>
        </div>
        <input
          type="range" min="0" max="100" value={goals.moneyWeight}
          onChange={e => setGoals(g => ({ ...g, moneyWeight: Number(e.target.value) }))}
          className="slider"
          style={{ accentColor: 'var(--primary)' }}
        />
        <p className="text-xs text-center text-muted mt-3 italic">
           The formula balances your budget efficiency (α) with your productivity goals (β).
        </p>
      </div>

      {/* App info */}
      <div className="card mb-4" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
        <p className="text-sm text-secondary" style={{ lineHeight: 1.7 }}>
          🔒 <strong>Local-first:</strong> All data is stored on your device.<br />
          🚀 <strong>Version:</strong> HABITUATOR v1.0<br />
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
