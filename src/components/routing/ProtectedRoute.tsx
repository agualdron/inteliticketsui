import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import type { Rol } from '../../types/ticket.types';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Rol[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <main className="route-loading" aria-live="polite">Verificando tu sesión…</main>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !hasRole(...allowedRoles)) {
    return <Navigate to="/app/tickets" replace />;
  }

  return children;
}
