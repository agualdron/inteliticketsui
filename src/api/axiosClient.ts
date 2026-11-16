import axios, { type AxiosError } from 'axios';
import { toast } from 'sonner';
import { authEvents } from './authEvents';
import { queryClient } from './queryClient';
import type { ErrorResponse } from '../types/api.types';

export const AUTH_TOKEN_KEY = 'intelitickets_token';
export const AUTH_USER_KEY = 'intelitickets_user';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || undefined,
  headers: { 'Content-Type': 'application/json' },
});

let isRedirecting = false;

export function resetAuthRedirectGuard(): void {
  isRedirecting = false;
}

function authRoute(url: string): boolean {
  return url.includes('/api/auth/login') || url.includes('/api/auth/register');
}

function routerBasePath(): string {
  const basePath = import.meta.env.BASE_URL || '/';
  return basePath === '/' ? '' : basePath.replace(/\/$/, '');
}

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';

    if (status === 401 && !authRoute(requestUrl) && !isRedirecting) {
      isRedirecting = true;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      queryClient.clear();
      authEvents.dispatchEvent(new Event('auth:logout'));

      const currentPath = window.location.pathname + window.location.search;
      const redirectParam = encodeURIComponent(currentPath);
      window.location.replace(
        `${routerBasePath()}/login?redirect=${redirectParam}`,
      );
    }

    if (status === 403) {
      toast.error(
        error.response?.data?.message ||
          'No tienes permisos para realizar esta acción.',
      );
    }

    return Promise.reject(error);
  },
);
