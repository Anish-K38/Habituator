import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  Trophy, 
  Settings, 
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses', icon: CreditCard, label: 'Expenses' },
  { to: '/time-log', icon: Clock, label: 'Time Log' },
  { to: '/trends', icon: TrendingUp, label: 'Trends' },
  { to: '/achievements', icon: Trophy, label: 'Achieve' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomNav() {
  const { isDarkMode, toggleDarkMode } = useApp();
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {/* Logo (desktop only) */}
      <div className="nav-logo">
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: 'var(--gradient-main)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(124,58,237,0.2)',
        }}>
          <Zap size={22} color="white" fill="white" />
        </div>
        <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem', letterSpacing: '0.05em' }}>HABITUATOR</span>
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

      {/* Theme Toggle (Desktop Sidebar Bottom) */}
      <div className="nav-theme-toggle md-show">
        <button 
          onClick={toggleDarkMode}
          className="nav-item"
          style={{ 
            marginTop: 'auto', 
            width: '100%', 
            border: 'none', 
            background: 'none', 
            cursor: 'pointer',
            color: 'inherit'
          }}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </nav>
  );
}
