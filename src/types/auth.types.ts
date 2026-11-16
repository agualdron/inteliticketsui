import type { Rol } from './ticket.types';

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  password: string;
}

/** Wire response from AuthController; the user fields are returned flat. */
export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
}

/** Normalized identity shape stored in localStorage and exposed by AuthContext. */
export interface UsuarioResumen {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
}
