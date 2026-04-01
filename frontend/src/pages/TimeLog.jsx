import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, RotateCcw, Plus, Trash2, X, Bell, Clock, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function TimeLog() {
  const { todayHours, todayLogs, reminders, settings, addTimeLog, deleteTimeLog, addReminder, deleteReminder } = useApp();
  
  // Timer State
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [modal, setModal] = useState(false);
  const [activity, setActivity] = useState('');
  const intervalRef = useRef(null);

  // Manual Log State
  const [manualModal, setManualModal] = useState(false);
  const [manualActivity, setManualActivity] = useState('');
  const [manualHours, setManualHours] = useState('');

  // Reminder State
  const [remTitle, setRemTitle] = useState('');
  const [remTime, setRemTime] = useState('');

  // Live Timer Effect
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  // Reminder Watcher Effect
  useEffect(() => {
    const watcher = setInterval(() => {
      const now = new Date();
      // Ensure we only fire at the exact 0th second of the minute to prevent duplicate toasts
      if (now.getSeconds() === 0) {
        const hm = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        reminders.forEach(r => {
          if (r.time === hm) {
            toast('⏰ Reminder: ' + r.title, { 
                icon: '🔔',
                duration: 8000,
                style: { background: 'var(--primary)', color: 'white', fontWeight: 'bold' }
            });
          }
        });
      }
    }, 1000);
    return () => clearInterval(watcher);
  }, [reminders]);

  // Actions
  const handleStop = () => {
    setRunning(false);
    if (elapsed > 0) setModal(true);
  };

  const handleSaveTimer = () => {
    if (!activity.trim()) { toast.error('Enter activity name'); return; }
    const hours = +(elapsed / 3600).toFixed(2);
    addTimeLog({ activity, hours, duration: formatTime(elapsed) });
    toast.success(`⏱️ ${formatTime(elapsed)} logged!`);
    setElapsed(0);
    setActivity('');
    setModal(false);
  };

  const handleSaveManual = () => {
    if (!manualActivity.trim() || !manualHours) { toast.error('Please fill all fields'); return; }
    const hrs = parseFloat(manualHours);
    if (isNaN(hrs) || hrs <= 0) { toast.error('Enter a valid time in hours'); return; }
    
    // Convert float hours to visual duration (e.g. 1.5h -> 01:30:00)
    const secs = Math.round(hrs * 3600);
    
    addTimeLog({ activity: manualActivity, hours: hrs, duration: formatTime(secs) });
    toast.success('Manual log added!');
    setManualActivity('');
    setManualHours('');
    setManualModal(false);
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!remTitle.trim() || !remTime) { toast.error('Please fill all fields'); return; }
    addReminder({ title: remTitle.trim(), time: remTime });
    toast.success('Reminder Set!');
    setRemTitle('');
    setRemTime('');
  };

  const handleReset = () => { setRunning(false); setElapsed(0); };

  const hoursPct = Math.min(100, (todayHours / settings.dailyHours) * 100);

  return (
    <div className="animate-fadeIn">
      <h2 className="mb-4">⏱️ Time Tracker</h2>

      {/* Hours progress card */}
      <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)', border: 'none', color: 'white' }}>
        <div className="flex justify-between items-end mb-3">
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 500 }}>TODAY'S PRODUCTIVE HOURS</p>
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{todayHours.toFixed(1)}h</div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>of {settings.dailyHours}h goal</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Remaining</p>
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{Math.max(0, settings.dailyHours - todayHours).toFixed(1)}h</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: '#6EE7B7',
            width: `${hoursPct}%`,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', marginTop: 8 }}>
           {hoursPct.toFixed(0)}% of daily goal
        </p>
      </div>

      {/* Live Timer */}
      <div className="card mb-4 text-center">
        <p className="text-xs text-muted mb-3" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Live Timer</p>
        <div className="timer-display mb-4">{formatTime(elapsed)}</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className={`btn ${running ? 'btn-danger' : 'btn-primary'}`} onClick={running ? handleStop : () => setRunning(true)}>
            {running ? <><Pause size={18} /> Stop</> : <><Play size={18} fill="white" /> Start</>}
          </button>
          <button className="btn btn-ghost" onClick={handleReset}>
            <RotateCcw size={18} /> Reset
          </button>
        </div>
        {running && (
          <p className="text-xs text-primary-color mt-3" style={{ animation: 'pulse 2s infinite', fontWeight: 600 }}>
            ● Recording...
          </p>
        )}
      </div>

      {/* Task Reminders Module */}
      <div className="card mb-5">
        <div className="flex items-center gap-2 mb-3">
            <Bell size={18} color="var(--primary)" />
            <h3 className="section-title" style={{ margin: 0 }}>Task Reminders</h3>
        </div>
        
        <form onSubmit={handleAddReminder} className="flex gap-2 mb-4">
            <input type="text" className="form-input" placeholder="Task name..." value={remTitle} onChange={e => setRemTitle(e.target.value)} style={{ flex: 1 }} />
            <input type="time" className="form-input" value={remTime} onChange={e => setRemTime(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 12px' }}><Plus size={18} /></button>
        </form>

        <div className="flex flex-col gap-2">
            {reminders.length === 0 ? (
                <p className="text-xs text-muted text-center py-2">No active reminders</p>
            ) : (
                reminders.map(r => (
                    <div key={r.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg" style={{ border: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-2">
                            <Clock size={14} color="var(--text-muted)" />
                            <span className="font-semibold text-sm">{r.time}</span>
                            <span className="text-sm text-secondary">— {r.title}</span>
                        </div>
                        <button type="button" onClick={() => deleteReminder(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Manual / Today Log Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
            <p className="section-title" style={{ marginBottom: 0 }}>Today's Log</p>
            <span className="badge badge-purple">{todayLogs.length}</span>
        </div>
        <button className="btn btn-ghost text-xs" onClick={() => setManualModal(true)} style={{ padding: '4px 8px' }}>
            <Edit3 size={14} /> Add Manual
        </button>
      </div>

      {/* Today Logs List */}
      {todayLogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⏰</div>
          <h3>No sessions yet</h3>
          <p className="text-sm text-muted">Use the timer or add manually!</p>
        </div>
      ) : (
        todayLogs.map(log => (
          <div key={log.id} className="list-item animate-slideUp">
            <div className="list-icon" style={{ background: '#DBEAFE', fontSize: '1.2rem' }}>⏱️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.activity}</div>
              <div className="text-xs text-muted">{log.duration}</div>
            </div>
            <div style={{ fontWeight: 700, color: '#2563EB', fontSize: '1rem' }}>+{log.hours}h</div>
            <button onClick={() => deleteTimeLog(log.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))
      )}

      {/* Save Modal (Live Timer) */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 className="modal-title mb-4">Save Session — {formatTime(elapsed)}</h3>
            <div className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Activity Name</label>
                <input type="text" className="form-input" placeholder="e.g. Study, Work, Exercise..."
                  value={activity} onChange={e => setActivity(e.target.value)} autoFocus />
              </div>
              <button className="btn btn-primary btn-full" onClick={handleSaveTimer}>
                <Plus size={18} /> Save Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal (Manual Entry) */}
      {manualModal && (
        <div className="modal-overlay" onClick={() => setManualModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 className="modal-title mb-4">Add Manual Time Log</h3>
            <div className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Activity Name</label>
                <input type="text" className="form-input" placeholder="What did you do?"
                  value={manualActivity} onChange={e => setManualActivity(e.target.value)} autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Hours</label>
                <input type="number" step="0.5" className="form-input" placeholder="e.g., 1.5, 2, 0.25"
                  value={manualHours} onChange={e => setManualHours(e.target.value)} />
              </div>
              <button className="btn btn-primary btn-full" onClick={handleSaveManual}>
                <Plus size={18} /> Save Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
