import { axiosClient, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../../api/axiosClient';
import type { AuthResponse, LoginRequest, RegisterRequest, UsuarioResumen } from '../../types/auth.types';

export interface AuthSession {
  token: string;
  user: UsuarioResumen;
}

function normalizeSession(response: AuthResponse): AuthSession {
  return {
    token: response.token,
    user: {
      id: response.id,
      nombre: response.nombre,
      correo: response.correo,
      rol: response.rol,
    },
  };
}

function persistSession(session: AuthSession): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, session.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
  } catch (error) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    throw error;
  }
}

async function authenticate(path: string, payload: LoginRequest | RegisterRequest): Promise<AuthSession> {
  const { data } = await axiosClient.post<AuthResponse>(path, payload);
  const session = normalizeSession(data);
  persistSession(session);
  return session;
}

export const authApi = {
  login: (payload: LoginRequest) => authenticate('/api/auth/login', payload),
  register: (payload: RegisterRequest) => authenticate('/api/auth/register', payload),
};
