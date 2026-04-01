import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { emoji: '☕', label: 'Coffee', bg: '#FEF3C7', color: '#D97706' },
  { emoji: '🚗', label: 'Uber', bg: '#EDE9FE', color: '#7C3AED' },
  { emoji: '🍽️', label: 'Lunch', bg: '#D1FAE5', color: '#059669' },
  { emoji: '💪', label: 'Gym', bg: '#FEE2E2', color: '#EF4444' },
  { emoji: '🛍️', label: 'Shopping', bg: '#DBEAFE', color: '#2563EB' },
  { emoji: '➕', label: 'Custom', bg: '#F3F4F6', color: '#6B7280' },
];

export default function Expenses() {
  const { todaySpent, todayExpenses, settings, addExpense, deleteExpense } = useApp();
  const [modal, setModal] = useState(null); // null | { category, emoji }
  const [form, setForm] = useState({ amount: '', description: '' });

  const budgetPct = Math.min(100, (todaySpent / settings.dailyBudget) * 100);
  const barColor = budgetPct < 70 ? 'green' : budgetPct < 90 ? 'yellow' : 'red';
  const remaining = Math.max(0, settings.dailyBudget - todaySpent);

  const openModal = (cat) => {
    setModal(cat);
    setForm({ amount: '', description: '' });
  };

  const handleAdd = () => {
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    addExpense({
      category: modal.label,
      emoji: modal.emoji,
      amount: Number(form.amount),
      description: form.description || modal.label,
    });
    toast.success(`${modal.emoji} ${modal.label} added!`);
    setModal(null);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="mb-4">💰 Expense Tracker</h2>

      {/* Budget card */}
      <div className="card mb-4" style={{ background: 'var(--gradient-main)', border: 'none', color: 'white' }}>
        <div className="flex justify-between items-end mb-3">
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 500 }}>TODAY'S BUDGET</p>
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
              {settings.currency}{todaySpent.toFixed(2)}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>of {settings.currency}{settings.dailyBudget.toLocaleString()}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Remaining</p>
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{settings.currency}{remaining.toFixed(2)}</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: barColor === 'red' ? '#FCA5A5' : barColor === 'yellow' ? '#FCD34D' : '#6EE7B7',
            width: `${budgetPct}%`,
            transition: 'width 0.6s ease',
          }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', marginTop: 8 }}>
          {budgetPct.toFixed(0)}% of daily budget used
        </p>
      </div>

      {/* Quick Add */}
      <p className="section-title">Quick Add</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button key={cat.label} className="quick-tile" onClick={() => openModal(cat)}>
            <div className="quick-tile-icon" style={{ background: cat.bg }}>
              {cat.emoji}
            </div>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* History */}
      <div className="flex justify-between items-center mb-3">
        <p className="section-title" style={{ marginBottom: 0 }}>Today's Expenses</p>
        <span className="badge badge-purple">{todayExpenses.length} items</span>
      </div>

      {todayExpenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <h3>No expenses yet</h3>
          <p className="text-sm text-muted">Add your first expense using the tiles above</p>
        </div>
      ) : (
        todayExpenses.map(exp => (
          <div key={exp.id} className="list-item animate-slideUp">
            <div className="list-icon" style={{ background: CATEGORIES.find(c => c.label === exp.category)?.bg || '#F3F4F6', fontSize: '1.3rem' }}>
              {exp.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{exp.description}</div>
              <div className="text-xs text-muted">{exp.category}</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--red)', fontSize: '1rem' }}>
              -{settings.currency}{Number(exp.amount).toFixed(2)}
            </div>
            <button onClick={() => { deleteExpense(exp.id); toast.success('Removed'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))
      )}

      {/* Add Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="modal-title" style={{ margin: 0 }}>{modal.emoji} Add {modal.label}</h3>
              <button onClick={() => setModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Amount ({settings.currency})</label>
                <input
                  type="number" className="form-input" placeholder="0.00"
                  value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <input
                  type="text" className="form-input" placeholder={modal.label}
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <button className="btn btn-primary btn-full" onClick={handleAdd}>
                <Plus size={18} /> Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
