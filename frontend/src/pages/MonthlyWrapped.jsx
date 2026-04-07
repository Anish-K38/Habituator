import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, 
  TrendingUp, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  Share2, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Instagram,
  Twitter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * MonthlyWrapped Component
 * A Spotify Wrapped / Instagram Stories style recap for the current month.
 */
export default function MonthlyWrapped() {
  const { expenses, timeLogs, user, settings } = useApp();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- Data Processing Logic ---
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const monthLogs = timeLogs.filter(l => {
      const d = new Date(l.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalSpent = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalHours = monthLogs.reduce((sum, l) => sum + Number(l.hours), 0);

    // Calculate top category
    const categories = {};
    monthExpenses.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + Number(e.amount);
    });
    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    // Calculate best day (most productive)
    const dailyHours = {};
    monthLogs.forEach(l => {
      dailyHours[l.date] = (dailyHours[l.date] || 0) + Number(l.hours);
    });
    const bestDayEntry = Object.entries(dailyHours).sort((a, b) => b[1] - a[1])[0];
    const bestDate = bestDayEntry ? new Date(bestDayEntry[0]).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' }) : 'N/A';
    const bestHours = bestDayEntry ? bestDayEntry[1] : 0;

    return {
      totalSpent,
      totalHours,
      topCategory,
      bestDate,
      bestHours,
      monthName: now.toLocaleString('default', { month: 'long' })
    };
  }, [expenses, timeLogs]);

  // --- Slides Configuration ---
  const slides = [
    {
      id: 'intro',
      background: 'var(--gradient-main)',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white', textAlign: 'center', padding: '2rem' }}>
          <div className="animate-pulse-soft" style={{ marginBottom: '2rem' }}>
             <div style={{
               width: 120, height: 120, borderRadius: '35%', 
               background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               border: '1px solid rgba(255,255,255,0.3)'
             }}>
                <Zap size={70} fill="white" color="white" />
             </div>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 0.9, marginBottom: '1rem' }}>{stats.monthName.toUpperCase()}<br />WRAPPED</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, fontWeight: 500 }}>Ready for your highlight reel, {user?.name?.split(' ')[0]}?</p>
        </div>
      )
    },
    {
      id: 'money',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white', textAlign: 'center', padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.2)' }}>
            <CreditCard size={48} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '0.5rem' }}>The Money Trail</h2>
          <div style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem' }}>{settings.currency}{stats.totalSpent.toFixed(0)}</div>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Total spent in {stats.monthName}</p>
          <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem', width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.7, marginBottom: '0.5rem' }}>BIGGEST CATEGORY</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#a5b4fc', textTransform: 'uppercase' }}>{stats.topCategory}</div>
          </div>
        </div>
      )
    },
    {
      id: 'time',
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white', textAlign: 'center', padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.2)' }}>
            <Clock size={48} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '0.5rem' }}>Productive Soul</h2>
          <div style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem' }}>{stats.totalHours.toFixed(1)}h</div>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Focused hours logged</p>
          <div className="glass-card" style={{ marginTop: '2rem', padding: '1.5rem', width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
             <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.7, marginBottom: '0.5rem' }}>MOST PRODUCTIVE DAY</div>
             <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#6ee7b7', textTransform: 'uppercase' }}>{stats.bestDate}</div>
             <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.25rem' }}>{stats.bestHours} hours of deep work!</div>
          </div>
        </div>
      )
    },
    {
      id: 'summary',
      background: 'var(--bg)',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem' }}>
          <div style={{ marginTop: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary)' }}>Your {stats.monthName} Recap</h2>
            <p style={{ color: 'var(--text-secondary)' }}>You're becoming a beast at habits.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {[
               { icon: <Zap />, label: 'Effort Level', value: 'ADVANCED', bg: '#fef3c7', color: '#d97706' },
               { icon: <Clock />, label: 'Total Production', value: `${stats.totalHours} Hours`, bg: '#dbeafe', color: '#2563eb' },
               { icon: <CreditCard />, label: 'Total Spend', value: `${settings.currency}${stats.totalSpent}`, bg: '#fee2e2', color: '#dc2626' }
             ].map((item, idx) => (
               <div key={idx} style={{ padding: '1.25rem', borderRadius: '1rem', background: 'white', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: item.bg, color: item.color }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.label}</div>
                     <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{item.value}</div>
                  </div>
               </div>
             ))}
          </div>

          <div style={{ marginTop: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn" style={{ flex: 1, background: '#E1306C', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                   <Instagram size={18} /> Story
                </button>
                <button className="btn" style={{ flex: 1, background: '#1DA1F2', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                   <Twitter size={18} /> Post
                </button>
             </div>
             <button onClick={() => navigate('/dashboard')} className="btn btn-ghost" style={{ width: '100%', fontWeight: 800 }}>Close Recap</button>
          </div>
        </div>
      )
    }
  ];

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (currentSlide > 0) {
      setCurrentSlide(s => s - 1);
    }
  };

  return (
    <div 
      style={{ 
        position: 'fixed', inset: 0, zIndex: 1000, 
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: slides[currentSlide].background,
        transition: 'background 0.5s ease',
        fontFamily: 'var(--font)'
      }}
    >
      {/* Progress Bars */}
      <div style={{ display: 'flex', gap: '4px', padding: '24px 12px 12px', zIndex: 1010 }}>
        {slides.map((_, i) => (
          <div key={i} style={{ height: '3px', flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: '99px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', background: 'white', 
                transition: 'width 0.3s ease',
                width: i < currentSlide ? '100%' : i === currentSlide ? '100%' : '0%' 
              }}
            />
          </div>
        ))}
      </div>

      {/* Close Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }}
        style={{ 
          position: 'absolute', top: '48px', right: '16px', zIndex: 1020, 
          padding: '8px', border: 'none', background: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer'
        }}
        onMouseOver={e => e.target.style.color = 'white'}
        onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
      >
        <X size={28} />
      </button>

      {/* Navigation Areas */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 1005 }}>
        <div style={{ width: '30%', height: '100%', cursor: 'pointer' }} onClick={handlePrev} title="Previous Slide" />
        <div style={{ width: '70%', height: '100%', cursor: 'pointer' }} onClick={handleNext} title="Next Slide" />
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1001, animation: 'fadeIn 0.5s ease' }}>
        {slides[currentSlide].content}
      </div>

      {/* Hint */}
      {currentSlide < slides.length - 1 && (
        <div className="animate-pulse-soft" style={{ 
          position: 'absolute', bottom: '40px', left: 0, right: 0, 
          textAlign: 'center', color: 'rgba(255,255,255,0.5)', 
          fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1rem', zIndex: 1010 
        }}>
          TAP TO CONTINUE
        </div>
      )}
    </div>
  );
}
