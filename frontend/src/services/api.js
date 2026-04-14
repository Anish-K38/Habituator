const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function apiSignup(name, email, password) {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Signup failed');
  return data;
}

export async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  return data;
}

export async function apiLogout(token) {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || 'Logout failed');
  }
  return true;
}

// ----- Application Data & Syncing -----

export async function apiFetchAppData(token) {
  const res = await fetch(`${API_BASE_URL}/api/v1/data/all`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
}

export async function apiCreateExpense(token, expenseData) {
  const res = await fetch(`${API_BASE_URL}/api/v1/data/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(expenseData)
  });
  if (!res.ok) throw new Error('Failed to create expense');
  return res.json();
}

export async function apiDeleteExpense(token, expenseId) {
  const res = await fetch(`${API_BASE_URL}/api/v1/data/expenses/${expenseId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete expense');
  return true;
}

export async function apiCreateTimeLog(token, logData) {
  const res = await fetch(`${API_BASE_URL}/api/v1/data/timelogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(logData)
  });
  if (!res.ok) throw new Error('Failed to create timelog');
  return res.json();
}

export async function apiDeleteTimeLog(token, logId) {
  const res = await fetch(`${API_BASE_URL}/api/v1/data/timelogs/${logId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete timelog');
  return true;
}

export async function apiUpdateSettings(token, settingsData) {
  const res = await fetch(`${API_BASE_URL}/api/v1/data/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(settingsData)
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export async function apiUpdateStats(token, statsData) {
  const res = await fetch(`${API_BASE_URL}/api/v1/data/stats`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(statsData)
  });
  if (!res.ok) throw new Error('Failed to update stats');
  return res.json();
}

export async function apiCreateReminder(token, reminderData) {
  const res = await fetch(`${API_BASE_URL}/api/v1/data/reminders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reminderData)
  });
  if (!res.ok) throw new Error('Failed to create reminder');
  return res.json();
}

export async function apiDeleteReminder(token, reminderId) {
  const res = await fetch(`${API_BASE_URL}/api/v1/data/reminders/${reminderId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete reminder');
  return true;
}
