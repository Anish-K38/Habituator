import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Clock, TrendingUp, Trophy, ChevronRight, Zap } from 'lucide-react';
import VirtualPet from '../components/VirtualPet';

function ScoreRing({ score, trueScore, color }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  
  // Normalization for the main progress arc
  const displayScore = Math.max(0, Math.min(100, trueScore));
  const offset = circ - (displayScore / 100) * circ;
  
  // Secondary arc for over-performance (>100%)
  const overflowScore = trueScore > 100 ? Math.min(100, trueScore - 100) : 0;
  const overflowOffset = circ - (overflowScore / 100) * circ;

  let strokeColor = 'var(--primary)';
  if (color === 'gold') strokeColor = 'var(--gold)';
  else if (color === 'green') strokeColor = 'var(--green)';
  else if (color === 'yellow') strokeColor = 'var(--yellow)';
  else if (color === 'neon-red') strokeColor = 'var(--neon-red)';
  else strokeColor = 'var(--red)';

  return (
    <div className="score-ring-wrap" style={{ position: 'relative' }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--border-subtle)" strokeWidth="10" />
        
        {/* Main Arc */}
        <circle
          cx="70" cy="70" r={r}
          fill="none" stroke={strokeColor} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ 
            transition: 'stroke-dashoffset 1s ease, stroke 0.3s ease',
            filter: color === 'neon-red' ? 'drop-shadow(0 0 5px var(--neon-red))' : 'none'
          }}
        />

        {/* Overflow Arc (Golden Layer) */}
        {trueScore > 100 && (
          <circle
            cx="70" cy="70" r={r}
            fill="none" stroke="var(--gold)" strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={overflowOffset}
            strokeLinecap="round"
            style={{ 
               transition: 'stroke-dashoffset 1.5s ease',
               filter: 'drop-shadow(0 0 8px var(--gold))'
            }}
          />
        )}
      </svg>
      <div className="score-ring-label" style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none'
      }}>
        <span style={{ 
          fontSize: '1.8rem', 
          fontWeight: 900, 
          color: 'white',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          lineHeight: 1
        }}>
          {trueScore}%
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { 
    user, 
    efficiencyScore = 0, 
    trueEfficiency = 0, 
    moneyScore = 0, 
    timeScore = 0, 
    efficiencyLabel = 'Loading...', 
    efficiencyColor = 'red', 
    todaySpent = 0, 
    todayHours = 0, 
    settings = { currency: '₹', dailyBudget: 1000, dailyHours: 6 }, 
    logout 
  } = useApp();
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Good {getGreeting()}, {user.name?.split(' ')[0]}! 👋</h1>
          <p className="text-xs text-muted font-medium uppercase tracking-wider">{new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={logout} className="btn btn-ghost btn-sm" style={{ background: 'var(--primary-100)', color: 'var(--primary)' }}>Logout</button>
      </div>

      <div className="bento-grid">
        {/* BIG CARD: Efficiency Score (2x2) */}
        <div className="glass-card span-col-2 span-row-2 card-gradient" style={{
          background: efficiencyColor === 'neon-red' ? 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)' : 'var(--gradient-main)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '32px 24px', gap: 20, textAlign: 'center', overflow: 'hidden'
        }}>
          <div className="flex items-center gap-2 opacity-80">
            <Zap size={18} color="white" fill="white" />
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>EFFICIENCY</span>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '50%',
            padding: 12,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <ScoreRing score={efficiencyScore} trueScore={trueEfficiency} color={efficiencyColor} />
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <span className={badgeClass} style={{ 
              fontSize: '0.75rem', padding: '6px 20px', fontWeight: 800,
              background: efficiencyColor === 'gold' ? 'var(--gold)' : undefined,
              color: efficiencyColor === 'gold' ? 'black' : undefined,
              boxShadow: efficiencyColor === 'gold' ? 'var(--gold-glow)' : undefined
            }}>
              {efficiencyLabel.toUpperCase()}
            </span>
            
            <div className="flex justify-center gap-3 w-full">
              <div className="glass-bg" style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: 12, flex: 1 }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 800, marginBottom: 2 }}>MONEY</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>{Math.round(moneyScore)}%</div>
              </div>
              <div className="glass-bg" style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: 12, flex: 1 }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', fontWeight: 800, marginBottom: 2 }}>TIME</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>{Math.round(timeScore)}%</div>
              </div>
            </div>

            {trueEfficiency <= -100 && (
               <div className="animate-pulse-soft" style={{ 
                 padding: '12px', borderRadius: 12, 
                 background: 'rgba(255,0,51,0.25)', border: '1px solid var(--neon-red)',
                 color: 'white', fontSize: '0.8rem', fontWeight: 700
               }}>
                 ⚠️ CRITICAL INEFFICIENCY
               </div>
            )}
          </div>
        </div>

        {/* COMPANION CARD (2x1) */}
        <div className="glass-card span-col-2" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 20 }}>
          <VirtualPet variant="compact" />
          <div style={{ flex: 1 }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: 4, fontSize: '1rem', fontWeight: 800 }}>Companion</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
              Your streak of <strong>{useApp().streak?.count || 0} days</strong> is powering evolution!
            </p>
            <Link to="/achievements" className="flex items-center gap-1 mt-2 font-bold color-primary" style={{ fontSize: '0.75rem', textDecoration: 'none', color: 'var(--primary)' }}>
              Check Evolution <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* SUMMARY CARD (2x1) */}
        <div className="glass-card span-col-2" style={{ 
          padding: '24px', background: 'var(--gradient-soft)', border: '1px dashed var(--primary-200)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: 12, fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            📊 TODAY'S SUMMARY
          </h3>
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
               <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                 Remaining: <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{settings.currency}{Math.max(0, settings.dailyBudget - todaySpent).toFixed(0)}</span>
               </div>
               <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                 Work needed: <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{Math.max(0, settings.dailyHours - todayHours).toFixed(1)}h</span>
               </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{efficiencyScore}%</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>AVG EFFICIENCY</div>
            </div>
          </div>
        </div>

        {/* QUICK ACCESS (1x1 each) */}
        {quickLinks.map(({ to, icon: Icon, label, color, bg, value, sub }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }} className="bento-item">
            <div className="glass-card" style={{ padding: '20px ripple', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>{label.toUpperCase()}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Monthly Wrapped Feature Teaser */}
      <div className="glass-card mt-6 p-6 flex items-center justify-between" style={{ background: 'var(--gradient-card)', color: 'white', border: 'none' }}>
        <div>
          <h4 style={{ fontWeight: 800, marginBottom: 4 }}>Monthly Wrapped is Here! 🎬</h4>
          <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>See your highs and lows from last month in a stunning recap.</p>
        </div>
        <Link to="/wrapped" className="btn btn-sm" style={{ background: 'white', color: 'var(--primary)', fontWeight: 800, padding: '8px 16px' }}>
          VIEW RECAP
        </Link>
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
