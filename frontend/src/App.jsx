import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import TimeLog from './pages/TimeLog';
import Trends from './pages/Trends';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';

function ProtectedRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            fontFamily: 'var(--font)',
            fontSize: '0.9rem',
            fontWeight: 500,
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(124,58,237,0.15)',
            border: '1px solid var(--border)',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: 'white' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: 'white' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/time-log" element={<ProtectedRoute><TimeLog /></ProtectedRoute>} />
          <Route path="/trends" element={<ProtectedRoute><Trends /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
