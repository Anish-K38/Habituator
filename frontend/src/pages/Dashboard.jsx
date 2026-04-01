import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Clock, TrendingUp, Trophy, ChevronRight, Zap } from 'lucide-react';

function ScoreRing({ score, color }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const strokeColor = color === 'green' ? 'var(--green)' : color === 'yellow' ? 'var(--yellow)' : 'var(--red)';

  return (
    <div className="score-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--border-subtle)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r}
          fill="none" stroke={strokeColor} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="score-ring-label">
        <span style={{ fontSize: '2rem', fontWeight: 800, color: strokeColor }}>{score}%</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, efficiencyScore, efficiencyLabel, efficiencyColor, todaySpent, todayHours, settings, logout } = useApp();
  const navigate = useNavigate();

  if (!user) { navigate('/', { replace: true }); return null; }

  const badgeClass = `badge badge-${efficiencyColor}`;

  const quickLinks = [
    { to: '/expenses', icon: CreditCard, label: 'Expenses', color: '#7C3AED', bg: 'var(--primary-100)', value: `${settings.currency}${todaySpent.toFixed(0)}`, sub: 'spent today' },
    { to: '/time-log', icon: Clock, label: 'Time Log', color: '#2563EB', bg: '#DBEAFE', value: `${todayHours.toFixed(1)}h`, sub: 'logged today' },
    { to: '/trends', icon: TrendingUp, label: 'Trends', color: '#059669', bg: '#D1FAE5', value: '7-day', sub: 'insights' },
    { to: '/achievements', icon: Trophy, label: 'Achieve', color: '#D97706', bg: '#FEF3C7', value: '🏆', sub: 'badges' },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 style={{ fontSize: '1.4rem' }}>Good {getGreeting()}, {user.name?.split(' ')[0]}! 👋</h1>
          <p className="text-sm text-muted">{new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={logout} className="btn btn-ghost btn-sm">Logout</button>
      </div>

      {/* Efficiency Score Card */}
      <div className="card card-gradient mb-4" style={{
        background: 'var(--gradient-main)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 20px',
        gap: 16,
        textAlign: 'center',
      }}>
        <div className="flex items-center gap-3">
          <Zap size={20} color="rgba(255,255,255,0.7)" />
          <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            EFFICIENCY SCORE
          </span>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '50%',
          padding: 8,
          backdropFilter: 'blur(8px)',
        }}>
          <ScoreRing score={efficiencyScore} color={efficiencyColor} />
        </div>
        <div>
          <span className={badgeClass} style={{ fontSize: '0.8rem', padding: '4px 16px' }}>{efficiencyLabel}</span>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: 12, lineHeight: 1.6 }}>
            You spent <strong style={{ color: 'white' }}>{settings.currency}{todaySpent.toFixed(2)}</strong> today
            and logged <strong style={{ color: 'white' }}>{todayHours.toFixed(1)}</strong> productive hours.
          </p>
        </div>
      </div>

      {/* Quick access grid */}
      <p className="section-title">Quick Access</p>
      <div className="grid-2 mb-4">
        {quickLinks.map(({ to, icon: Icon, label, color, bg, value, sub }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '18px 16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{sub}</div>
              <div style={{ fontSize: '0.8rem', color, fontWeight: 600, marginTop: 4 }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Daily summary */}
      <div className="card" style={{ background: 'var(--gradient-soft)', border: '1px dashed var(--primary-200)' }}>
        <h3 className="mb-3" style={{ color: 'var(--primary)' }}>📊 Today's Summary</h3>
        <p className="text-sm" style={{ lineHeight: 1.8 }}>
          💰 Budget remaining: <strong>{settings.currency}{Math.max(0, settings.dailyBudget - todaySpent).toFixed(2)}</strong><br />
          ⏱️ Hours remaining: <strong>{Math.max(0, settings.dailyHours - todayHours).toFixed(1)} hrs</strong><br />
          ⚡ Efficiency: <strong>{efficiencyScore}%</strong> ({efficiencyLabel})
        </p>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
