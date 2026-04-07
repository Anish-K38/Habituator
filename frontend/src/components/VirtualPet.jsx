import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

// ─── Evolution Stage Definitions ──────────────────────────────────────────────
const STAGES = [
  {
    id: 'egg',
    minStreak: 0,
    emoji: '🥚',
    name: 'Egg',
    animClass: 'pet-stage-egg',
    message: 'Start a streak to hatch your companion!',
    bg: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
    color: '#6B7280',
  },
  {
    id: 'hatch',
    minStreak: 1,
    emoji: '🐣',
    name: 'Hatchling',
    animClass: 'pet-stage-hatch',
    message: "You're on your way — keep it up! 🌱",
    bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    color: '#D97706',
  },
  {
    id: 'baby',
    minStreak: 3,
    emoji: '🐥',
    name: 'Baby',
    animClass: 'pet-stage-baby',
    message: 'Your companion is growing stronger! ✨',
    bg: 'linear-gradient(135deg, #FEF9C3 0%, #FDE047 100%)',
    color: '#CA8A04',
  },
  {
    id: 'teen',
    minStreak: 7,
    emoji: '🦅',
    name: 'Teen',
    animClass: 'pet-stage-teen',
    message: "You're soaring! A full week of focus. 🌤️",
    bg: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
    color: '#2563EB',
  },
  {
    id: 'adult',
    minStreak: 14,
    emoji: '🦁',
    name: 'Adult',
    animClass: 'pet-stage-adult',
    message: 'Two weeks strong — you are a legend! 👑',
    bg: 'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 100%)',
    color: '#B45309',
  },
  {
    id: 'legend',
    minStreak: 30,
    emoji: '🐉',
    name: 'Legend',
    animClass: 'pet-stage-legend',
    message: '30-day streak! You have mastered the art. 🔥',
    bg: 'linear-gradient(135deg, #FEE2E2 0%, #EF4444 100%)',
    color: '#B91C1C',
  },
];

const CONFETTI_EMOJIS = ['✨', '🌟', '💫', '⭐', '🎉'];

function getStage(streakCount) {
  // Find the highest stage whose minStreak is satisfied
  let current = STAGES[0];
  for (const stage of STAGES) {
    if (streakCount >= stage.minStreak) current = stage;
  }
  return current;
}

function getNextMilestone(streakCount) {
  for (const stage of STAGES) {
    if (stage.minStreak > streakCount) return stage.minStreak;
  }
  return null; // already at max stage
}

// ─── Compact Variant (Dashboard) ──────────────────────────────────────────────
function PetCompact({ stage, streakCount, emoji, message, bg, isAngry }) {
  const nextMile = getNextMilestone(streakCount);
  return (
    <div className="pet-container">
      <div
        className={`pet-avatar ${stage.animClass} ${isAngry ? 'pet-angry' : ''}`}
        style={{
          width: 72,
          height: 72,
          fontSize: '2.5rem',
          background: bg,
          boxShadow: isAngry ? 'var(--neon-red-glow)' : `0 4px 16px ${stage.color}33`,
        }}
        aria-label={`Your pet: ${stage.name}`}
      >
        {emoji}
        <span className="pet-level-badge">Lv{STAGES.indexOf(stage)}</span>
      </div>
      <span className="pet-name" style={{ color: isAngry ? 'var(--neon-red)' : undefined }}>{isAngry ? 'Frustrated' : stage.name}</span>
      <span className="pet-message">{message}</span>
      {nextMile !== null ? (
        <span className="pet-milestone">
          🔓 Evolves at {nextMile}-day streak ({nextMile - streakCount} to go)
        </span>
      ) : (
        <span className="pet-milestone" style={{ color: 'var(--primary)', fontWeight: 700 }}>
          🏆 Max Evolution!
        </span>
      )}
    </div>
  );
}

// ─── Full Variant (Achievements) ───────────────────────────────────────────────
function PetFull({ stage, streakCount, emoji, message, bg, isAngry }) {
  const nextMile = getNextMilestone(streakCount);
  const stageIndex = STAGES.indexOf(stage);

  return (
    <div className="pet-container">
      <div
        className={`pet-avatar ${stage.animClass} ${isAngry ? 'pet-angry' : ''}`}
        style={{
          width: 96,
          height: 96,
          fontSize: '3.5rem',
          background: bg,
          boxShadow: isAngry ? 'var(--neon-red-glow)' : `0 6px 24px ${stage.color}44`,
        }}
        aria-label={`Your pet: ${stage.name}`}
      >
        {emoji}
        <span className="pet-level-badge" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>
          Lv{stageIndex} · {isAngry ? 'Upset' : stage.name}
        </span>
      </div>

      <span className="pet-message" style={{ fontSize: '0.8rem', maxWidth: 220 }}>
        {message}
      </span>

      {nextMile !== null ? (
        <span className="pet-milestone">
          Next evolution at {nextMile} days · {nextMile - streakCount} days to go
        </span>
      ) : (
        <span className="pet-milestone" style={{ color: 'var(--primary)', fontWeight: 700 }}>
          🐉 Max Evolution Reached!
        </span>
      )}

      {/* Evolution Timeline */}
      <div className="pet-timeline" style={{ width: '100%', maxWidth: 320 }}>
        {STAGES.map((s, idx) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: idx < STAGES.length - 1 ? 1 : 0 }}>
            <div className={`pet-timeline-step${streakCount >= s.minStreak ? ' reached' : ''}`}>
              <span style={{ fontSize: '1.1rem' }}>{s.emoji}</span>
              <div className="step-dot" />
              <span className="step-label">{s.name}<br />{s.minStreak}d</span>
            </div>
            {idx < STAGES.length - 1 && (
              <div className={`pet-timeline-line${streakCount >= STAGES[idx + 1].minStreak ? ' filled' : ''}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────────
export default function VirtualPet({ variant = 'compact' }) {
  const { streak, trueEfficiency } = useApp();
  const streakCount = streak?.count ?? 0;
  const stage = getStage(streakCount);
  const isAngry = trueEfficiency < 0;

  // Level-up burst: detect when stage changes
  const prevStageRef = useRef(stage.id);
  const [showBurst, setShowBurst] = useState(false);
  const [confetti, setConfetti] = useState([]);

  // Override stage info if angry
  const displayEmoji = isAngry ? '😡' : stage.emoji;
  const displayMessage = isAngry 
    ? "Your companion is upset! Improve your habits to calm them down. 😤" 
    : stage.message;
  const displayBg = isAngry 
    ? 'linear-gradient(135deg, #450a0a 0%, #991b1b 100%)' 
    : stage.bg;

  useEffect(() => {
    if (prevStageRef.current !== stage.id) {
      // Trigger level-up animation
      setShowBurst(true);
      setConfetti(
        Array.from({ length: 7 }, (_, i) => ({
          id: i,
          emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
          x: Math.random() * 80 - 40,
          delay: i * 0.08,
        }))
      );
      const t1 = setTimeout(() => setShowBurst(false), 900);
      const t2 = setTimeout(() => setConfetti([]), 1000);
      prevStageRef.current = stage.id;
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [stage.id]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Level-up burst overlay */}
      {showBurst && <div className="pet-evolve-ring" />}

      {/* Confetti particles */}
      {confetti.map(p => (
        <span
          key={p.id}
          className="pet-confetti"
          style={{
            left: `calc(50% + ${p.x}px)`,
            top: '0',
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}

      {variant === 'full'
        ? <PetFull stage={stage} streakCount={streakCount} emoji={displayEmoji} message={displayMessage} bg={displayBg} isAngry={isAngry} />
        : <PetCompact stage={stage} streakCount={streakCount} emoji={displayEmoji} message={displayMessage} bg={displayBg} isAngry={isAngry} />
      }
    </div>
  );
}
