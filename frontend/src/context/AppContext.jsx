import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  apiSignup, apiLogin, apiLogout, 
  apiFetchAppData, apiCreateExpense, apiDeleteExpense, 
  apiCreateTimeLog, apiDeleteTimeLog, apiUpdateSettings, apiUpdateStats,
  apiCreateReminder, apiDeleteReminder
} from '../services/api';

const AppContext = createContext(null);

// We keep token and user in localStorage so they persist across reloads
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}

export function AppProvider({ children }) {
  const [user, setUser] = useLocalStorage('ht_user', null);
  const [token, setToken] = useLocalStorage('ht_token', null);
  
  // App data now lives purely in React state, hydrated from PostgreSQL
  const [expenses, setExpenses] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [settings, setSettings] = useState({
    currency: '₹',
    dailyBudget: 1000,
    dailyHours: 6,
    moneyWeight: 50,
    strictMode: false,
  });
  const [achievements, setAchievements] = useState({
    firstExpense: false,
    budgetSaver: false,
    timemaster: false,
    streakWeek: false,
    efficient: false,
    goalSetter: false,
  });
  const [streak, setStreak] = useState({ count: 0, lastDate: null });
  const [isDarkMode, setIsDarkMode] = useLocalStorage('ht_dark_mode', false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Sync color scheme with document element
  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, [setIsDarkMode]);

  // Hydrate Data on Login
  useEffect(() => {
    if (token && user && !isDataLoaded) {
      apiFetchAppData(token).then(data => {
        if (data.expenses) setExpenses(data.expenses);
        if (data.timeLogs) setTimeLogs(data.timeLogs);
        if (data.reminders) setReminders(data.reminders);
        if (data.settings) setSettings({
          currency: data.settings.currency || '₹',
          dailyBudget: data.settings.daily_budget || 1000,
          dailyHours: data.settings.daily_hours || 6,
          moneyWeight: data.settings.money_weight || 50,
          strictMode: data.settings.strict_mode || false,
        });
        if (data.stats) {
          setStreak({
            count: data.stats.streak_count || 0,
            lastDate: data.stats.streak_last_date || null
          });
          setAchievements({
            firstExpense: data.stats.first_expense || false,
            budgetSaver: data.stats.budget_saver || false,
            timemaster: data.stats.timemaster || false,
            streakWeek: data.stats.streak_week || false,
            efficient: data.stats.efficient || false,
            goalSetter: data.stats.goal_setter || false,
          });
        }
        setIsDataLoaded(true);
      }).catch(err => {
        console.error("Failed to hydrate user data from backend", err);
        // If unauthorized, token might be expired
        if (err.message.includes("401")) {
            logout();
        }
      });
    }
  }, [token, user, isDataLoaded]);

  // Auth methods
  const login = useCallback(async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      setUser(data.user);
      setToken(data.access_token);
      setIsDataLoaded(false); // trigger re-fetch
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    try {
      await apiSignup(name, email, password);
      const loginRes = await apiLogin(email, password);
      setUser(loginRes.user);
      setToken(loginRes.access_token);
      setIsDataLoaded(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try { await apiLogout(token); } catch (e) {}
    }
    setUser(null);
    setToken(null);
    setExpenses([]);
    setTimeLogs([]);
    setReminders([]);
    setIsDataLoaded(false);
  }, [token]);

  // ======= COMPUTED FIELDS (Identical to previous) =======
  const today = new Date().toISOString().slice(0, 10);
  const todayExpenses = expenses.filter(e => e.date === today);
  const todaySpent = todayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const todayLogs = timeLogs.filter(l => l.date === today);
  const todayHours = todayLogs.reduce((sum, l) => sum + Number(l.hours), 0);

  // Advanced Formula: α(Money) + β(Time)
  // Allow for negative and overflow scores
  const moneyScore = settings.dailyBudget > 0
    ? ((settings.dailyBudget - todaySpent) / settings.dailyBudget) * 100
    : 100;
  const timeScore = settings.dailyHours > 0
    ? (todayHours / settings.dailyHours) * 100
    : 0;

  const mw = settings.moneyWeight / 100;
  const tw = 1 - mw;

  // Internal "True" score with full range
  let rawScore = Math.round(moneyScore * mw + timeScore * tw);

  // Apply strictMode limits (No negative unless enabled, Cap at -100)
  const trueEfficiency = settings.strictMode 
    ? Math.max(-100, rawScore) 
    : Math.max(0, rawScore);

  // Visual/Normalized score (Capped 0-100 for basic ring UI)
  const efficiencyScore = Math.max(0, Math.min(100, trueEfficiency));

  const efficiencyLabel = trueEfficiency >= 100 ? 'Peak Excellence' : trueEfficiency >= 70 ? 'Efficient' : trueEfficiency >= 40 ? 'Moderate' : trueEfficiency < 0 ? 'Inefficient (Hardcore)' : 'Needs Work';
  const efficiencyColor = trueEfficiency >= 100 ? 'gold' : trueEfficiency >= 70 ? 'green' : trueEfficiency >= 40 ? 'yellow' : trueEfficiency < 0 ? 'neon-red' : 'red';

  const weeklyStats = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayExpenses = expenses.filter(e => e.date === dateStr);
    const dayLogs = timeLogs.filter(l => l.date === dateStr);
    return {
      date: dateStr,
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      spent: dayExpenses.reduce((s, e) => s + Number(e.amount), 0),
      hours: dayLogs.reduce((s, l) => s + Number(l.hours), 0),
    };
  });
  const weeklySpent = weeklyStats.reduce((s, d) => s + d.spent, 0);
  const weeklyHours = weeklyStats.reduce((s, d) => s + d.hours, 0);

  // ======= ACTIONS (Optimistic UI sync to Backend) =======

  const addExpense = useCallback(async (expense) => {
    const expPayload = { ...expense, date: today };
    // Optimistic UI update
    const tempId = Date.now();
    setExpenses(prev => [{...expPayload, id: tempId}, ...prev]);
    
    // Background API Sync
    if (token) {
        try {
            const saved = await apiCreateExpense(token, expPayload);
            // Replace temporary ID with real Database ID
            setExpenses(prev => prev.map(e => e.id === tempId ? saved : e));
            
            // Check achievement
            if (!achievements.firstExpense) {
               const newAchs = { ...achievements, firstExpense: true };
               setAchievements(newAchs);
               apiUpdateStats(token, { ...streak, streak_count: streak.count, streak_last_date: streak.lastDate, ...newAchs });
            }
        } catch( err ) {
            console.error("Failed to save expense", err);
            // Revert optimistic if failed
            setExpenses(prev => prev.filter(e => e.id !== tempId));
        }
    }
  }, [today, token, achievements, streak]);

  const deleteExpense = useCallback(async (id) => {
    const expToDel = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    if (token && id && expToDel) {
        try {
            await apiDeleteExpense(token, id);
        } catch (err) {
            console.error("Failed", err);
            setExpenses(prev => [expToDel, ...prev]);
        }
    }
  }, [token, expenses]);

  const addTimeLog = useCallback(async (log) => {
    const logPayload = { ...log, date: today };
    const tempId = Date.now();
    setTimeLogs(prev => [{...logPayload, id: tempId}, ...prev]);

    if (token) {
        try {
            const saved = await apiCreateTimeLog(token, logPayload);
            setTimeLogs(prev => prev.map(l => l.id === tempId ? saved : l));
        } catch(err) {
            console.error("Failed", err);
            setTimeLogs(prev => prev.filter(l => l.id !== tempId));
        }
    }
  }, [today, token]);

  const deleteTimeLog = useCallback(async (id) => {
    const logToDel = timeLogs.find(l => l.id === id);
    setTimeLogs(prev => prev.filter(l => l.id !== id));
    if (token && id && logToDel) {
        try {
            await apiDeleteTimeLog(token, id);
        } catch (err) {
            setTimeLogs(prev => [logToDel, ...prev]);
        }
    }
  }, [token, timeLogs]);

  const addReminder = useCallback(async (reminder) => {
    const tempId = Date.now();
    setReminders(prev => [...prev, { ...reminder, id: tempId }]);
    if (token) {
        try {
            const saved = await apiCreateReminder(token, reminder);
            setReminders(prev => prev.map(r => r.id === tempId ? saved : r));
        } catch(err) {
            console.error("Failed to add reminder", err);
            setReminders(prev => prev.filter(r => r.id !== tempId));
        }
    }
  }, [token]);

  const deleteReminder = useCallback(async (id) => {
    const rToDel = reminders.find(r => r.id === id);
    setReminders(prev => prev.filter(r => r.id !== id));
    if (token && id && rToDel) {
        try {
            await apiDeleteReminder(token, id);
        } catch (err) {
            setReminders(prev => [...prev, rToDel]);
        }
    }
  }, [token, reminders]);

  const updateSettings = useCallback(async (newSettings) => {
    const combined = { ...settings, ...newSettings };
    setSettings(combined);
    
    if (token) {
        const payload = {
            currency: combined.currency,
            daily_budget: combined.dailyBudget,
            daily_hours: combined.dailyHours,
            money_weight: combined.moneyWeight
        };
        try {
            await apiUpdateSettings(token, payload);
            if (!achievements.goalSetter) {
                const newAchs = { ...achievements, goalSetter: true };
                setAchievements(newAchs);
                await apiUpdateStats(token, { ...streak, streak_count: streak.count, streak_last_date: streak.lastDate, ...newAchs });
            }
        } catch(err) { console.error("Setting sync failed", err); }
    }
  }, [settings, token, achievements, streak]);

  const updateUser = useCallback((data) => {
    setUser(prev => ({ ...prev, ...data }));
  }, []);

  // Sync Achievements
  useEffect(() => {
    if (!token || !isDataLoaded) return;
    let changed = false;
    const updated = { ...achievements };
    
    if (efficiencyScore >= 80 && !updated.efficient) { updated.efficient = true; changed = true; }
    if (todaySpent < settings.dailyBudget * 0.5 && todaySpent > 0 && !updated.budgetSaver) { updated.budgetSaver = true; changed = true; }
    if (todayHours >= settings.dailyHours && todayHours > 0 && !updated.timemaster) { updated.timemaster = true; changed = true; }
    
    if (changed) {
        setAchievements(updated);
        apiUpdateStats(token, { ...streak, streak_count: streak.count, streak_last_date: streak.lastDate, ...updated }).catch(console.error);
    }
  }, [efficiencyScore, todaySpent, todayHours, token, isDataLoaded]);

  // Sync Streak
  useEffect(() => {
    if (!token || !isDataLoaded) return;
    if (efficiencyScore >= 60) {
      const last = streak.lastDate;
      if (last !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().slice(0, 10);
        
        const newCount = last === yStr ? streak.count + 1 : 1;
        const newStreak = { count: newCount, lastDate: today };
        setStreak(newStreak);
        
        const newAchs = { ...achievements };
        if (newCount >= 7 && !newAchs.streakWeek) newAchs.streakWeek = true;
        setAchievements(newAchs);

        apiUpdateStats(token, {
            streak_count: newStreak.count,
            streak_last_date: newStreak.lastDate,
            ...newAchs
        }).catch(console.error);
      }
    }
  }, [efficiencyScore, token, isDataLoaded]);

  const value = {
    user, token, login, signup, logout, updateUser,
    expenses, addExpense, deleteExpense, todayExpenses, todaySpent,
    timeLogs, addTimeLog, deleteTimeLog, todayLogs, todayHours,
    reminders, addReminder, deleteReminder,
    settings, updateSettings,
    achievements, setAchievements,
    streak,
    efficiencyScore, trueEfficiency, moneyScore, timeScore, efficiencyLabel, efficiencyColor,
    weeklyStats, weeklySpent, weeklyHours,
    today, isDataLoaded,
    isDarkMode, toggleDarkMode
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
