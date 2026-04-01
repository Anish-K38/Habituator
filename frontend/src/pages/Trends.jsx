import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function TrendChip({ value, suffix = '' }) {
  if (value > 0) return <span className="badge badge-green"><TrendingUp size={12} />+{value}{suffix}</span>;
  if (value < 0) return <span className="badge badge-red"><TrendingDown size={12} />{value}{suffix}</span>;
  return <span className="badge badge-purple"><Minus size={12} />0{suffix}</span>;
}

export default function Trends() {
  const { weeklyStats, weeklySpent, weeklyHours, settings } = useApp();

  const weeklyBudget = settings.dailyBudget * 7;
  const weeklyGoal = settings.dailyHours * 7;

  // Trend vs previous half-week (simple mock)
  const spendTrend = weeklyStats[6]?.spent - weeklyStats[0]?.spent;
  const hoursTrend = +(weeklyStats[6]?.hours - weeklyStats[0]?.hours).toFixed(1);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', boxShadow: 'var(--shadow-sm)' }}>
        <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color, fontSize: '0.85rem' }}>
            {p.name === 'spent' ? `${settings.currency}${p.value?.toFixed(0)}` : `${p.value?.toFixed(1)}h`}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="mb-4">📈 Trends & Insights</h2>

      {/* Summary cards */}
      <div className="grid-2 mb-4">
        <div className="card">
          <p className="text-xs text-muted mb-1" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weekly Spending</p>
          <div className="stat-number">{settings.currency}{weeklySpent.toFixed(0)}</div>
          <p className="text-xs text-muted" style={{ marginTop: 4 }}>of {settings.currency}{weeklyBudget.toLocaleString()}</p>
          <div style={{ marginTop: 8 }}>
            <TrendChip value={Math.round(spendTrend)} suffix="" />
          </div>
        </div>
        <div className="card">
          <p className="text-xs text-muted mb-1" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Productive Hours</p>
          <div className="stat-number">{weeklyHours.toFixed(1)}h</div>
          <p className="text-xs text-muted" style={{ marginTop: 4 }}>of {weeklyGoal}h goal</p>
          <div style={{ marginTop: 8 }}>
            <TrendChip value={hoursTrend} suffix="h" />
          </div>
        </div>
      </div>

      {/* Spending chart */}
      <div className="card mb-4">
        <h3 className="mb-3">Daily Spending (7 days)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="spent" name="spent" fill="url(#spendGrad)" radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hours chart */}
      <div className="card mb-4">
        <h3 className="mb-3">Productive Hours (7 days)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="hours" name="hours" fill="url(#hoursGrad)" radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Day breakdown */}
      <p className="section-title">Daily Breakdown</p>
      {weeklyStats.slice().reverse().map(day => (
        <div key={day.date} className="list-item">
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{day.day} — {day.date}</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="text-sm" style={{ color: 'var(--primary)', fontWeight: 700 }}>{settings.currency}{day.spent.toFixed(0)}</span>
            <span className="text-sm" style={{ color: '#2563EB', fontWeight: 700 }}>{day.hours.toFixed(1)}h</span>
          </div>
        </div>
      ))}
    </div>
  );
}
