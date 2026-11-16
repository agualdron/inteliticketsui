import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { authEvents } from '../api/authEvents';
import { queryClient } from '../api/queryClient';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../api/axiosClient';
import type { LoginRequest, RegisterRequest, UsuarioResumen } from '../types/auth.types';
import { authApi, type AuthSession } from '../features/auth/authApi';
import type { Rol } from '../types/ticket.types';

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UsuarioResumen | null;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: Rol[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const validRoles: Rol[] = ['USUARIO', 'SOPORTE', 'ADMIN'];

function isUsuarioResumen(value: unknown): value is UsuarioResumen {
  if (!value || typeof value !== 'object') return false;
  const user = value as Partial<UsuarioResumen>;
  return typeof user.id === 'number'
    && typeof user.nombre === 'string'
    && typeof user.correo === 'string'
    && validRoles.includes(user.rol as Rol);
}

function readStoredSession(): UsuarioResumen | null {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (!token || !storedUser) return null;
    const user: unknown = JSON.parse(storedUser);
    return isUsuarioResumen(user) ? user : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UsuarioResumen | null>(null);

  useEffect(() => {
    const restoredUser = readStoredSession();
    if (restoredUser) {
      setUser(restoredUser);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
    setIsLoading(false);

    const handleUnauthorized = () => setUser(null);
    authEvents.addEventListener('auth:logout', handleUnauthorized);
    return () => authEvents.removeEventListener('auth:logout', handleUnauthorized);
  }, []);

  const acceptSession = useCallback((session: AuthSession) => {
    setUser(session.user);
  }, []);

  const login = useCallback(async (request: LoginRequest) => {
    acceptSession(await authApi.login(request));
  }, [acceptSession]);

  const register = useCallback(async (request: RegisterRequest) => {
    acceptSession(await authApi.register(request));
  }, [acceptSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    queryClient.clear();
    authEvents.dispatchEvent(new Event('auth:logout'));
  }, []);

  const hasRole = useCallback((...roles: Rol[]) => Boolean(user && roles.includes(user.rol)), [user]);
  const value = useMemo(() => ({
    isLoading,
    isAuthenticated: Boolean(user),
    user,
    login,
    register,
    logout,
    hasRole,
  }), [hasRole, isLoading, login, logout, register, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}
