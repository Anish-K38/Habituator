import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Clock, TrendingUp, Trophy, Settings, Zap } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses', icon: CreditCard, label: 'Expenses' },
  { to: '/time-log', icon: Clock, label: 'Time Log' },
  { to: '/trends', icon: TrendingUp, label: 'Trends' },
  { to: '/achievements', icon: Trophy, label: 'Achieve' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {/* Logo (desktop only) */}
      <div className="nav-logo" style={{ display: 'none' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--gradient-main)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Zap size={20} color="white" fill="white" />
        </div>
        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>HabitTracker</span>
      </div>

      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          aria-label={label}
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
