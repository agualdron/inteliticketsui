import { Navigate, Outlet, Route, Routes } from 'react-router';
import type { ReactNode } from 'react';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MetricsPage } from './pages/app/MetricsPage';
import { TicketDetailPage } from './pages/app/TicketDetailPage';
import { TicketsDashboardPage } from './pages/app/TicketsDashboardPage';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

function PublicAuthRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <main className="route-loading" aria-live="polite">Verificando tu sesión…</main>;
  return isAuthenticated ? <Navigate to="/app/tickets" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicAuthRoute><LoginPage /></PublicAuthRoute>} />
        <Route path="/signin" element={<PublicAuthRoute><RegisterPage /></PublicAuthRoute>} />
        <Route path="/register" element={<PublicAuthRoute><RegisterPage /></PublicAuthRoute>} />
        <Route element={<ProtectedRoute><AppShell><Outlet /></AppShell></ProtectedRoute>}>
          <Route path="/app/tickets" element={<TicketsDashboardPage />} />
          <Route path="/app/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/app/metrics" element={<ProtectedRoute allowedRoles={['ADMIN', 'SOPORTE']}><MetricsPage /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
