import { useApp } from '../context/AppContext';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import VirtualPet from '../components/VirtualPet';

const BADGE_DEFS = [
  {
    key: 'firstExpense',
    emoji: '💸',
    title: 'First Spend',
    desc: 'Logged your first expense',
    bg: '#FEF3C7',
  },
  {
    key: 'budgetSaver',
    emoji: '🏦',
    title: 'Budget Saver',
    desc: 'Spent less than 50% of budget',
    bg: '#D1FAE5',
  },
  {
    key: 'timemaster',
    emoji: '⏰',
    title: 'Time Master',
    desc: 'Hit your daily hours goal',
    bg: '#DBEAFE',
  },
  {
    key: 'streakWeek',
    emoji: '🔥',
    title: '7-Day Streak',
    desc: 'Efficient 7 days in a row',
    bg: '#FEE2E2',
  },
  {
    key: 'efficient',
    emoji: '⚡',
    title: 'High Performer',
    desc: 'Efficiency score above 80%',
    bg: '#EDE9FE',
  },
  {
    key: 'goalSetter',
    emoji: '🎯',
    title: 'Goal Setter',
    desc: 'Customized your goals',
    bg: '#F3F4F6',
  },
];

export default function Achievements() {
  const { achievements, streak, efficiencyScore } = useApp();

  const unlocked = BADGE_DEFS.filter(b => achievements[b.key]).length;

  return (
    <div className="animate-fadeIn">
      <h2 className="mb-2">🏆 Achievements</h2>
      <p className="text-sm text-muted mb-4">{unlocked} of {BADGE_DEFS.length} unlocked</p>

      {/* Overall progress */}
      <div className="card mb-4" style={{ background: 'var(--gradient-soft)', border: '1px dashed var(--primary-200)' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Achievement Progress</span>
          <span className="badge badge-purple">{unlocked}/{BADGE_DEFS.length}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(unlocked / BADGE_DEFS.length) * 100}%` }} />
        </div>
      </div>

      {/* Virtual Pet — full evolution panel */}
      <div className="card mb-4" style={{
        background: 'var(--gradient-soft)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '28px 20px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            🐾 Your Companion · {streak.count} day streak
          </span>
        </div>
        <VirtualPet variant="full" />
      </div>

      {/* Badges grid */}
      <p className="section-title">Badges</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {BADGE_DEFS.map(badge => {
          const isUnlocked = achievements[badge.key];
          return (
            <div key={badge.key} className={`achievement-badge${isUnlocked ? ' unlocked' : ''}`}
              style={{ opacity: isUnlocked ? 1 : 0.5 }}>
              <div className="achievement-icon" style={{ background: isUnlocked ? badge.bg : 'var(--border-subtle)', fontSize: '1.8rem' }}>
                {isUnlocked ? badge.emoji : '🔒'}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {badge.title}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                {badge.desc}
              </span>
              {isUnlocked && <span className="badge badge-green" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>Unlocked!</span>}
            </div>
          );
        })}
      </div>

      {unlocked === 0 && (
        <div className="empty-state mt-4">
          <div className="empty-icon">🏅</div>
          <h3>No badges yet</h3>
          <p className="text-sm text-muted">Start tracking to unlock your first achievement!</p>
        </div>
      )}
    </div>
  );
}
