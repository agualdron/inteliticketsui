import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { resetAuthRedirectGuard } from '../../api/axiosClient';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import type { ErrorResponse } from '../../types/api.types';
import { loginSchema, type LoginFormValues } from '../../features/auth/authSchemas';

interface LocationState {
  from?: { pathname?: string; search?: string; hash?: string };
}

function errorMessage(error: unknown): string {
  const response = error as { response?: { data?: Partial<ErrorResponse> } };
  if (response.response?.data?.status === 401) return 'Credenciales inválidas.';
  return response.response?.data?.message || 'No pudimos iniciar sesión. Revisa tus credenciales e inténtalo de nuevo.';
}

function safeInternalRedirect(value: string | null): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return null;
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
  let destination = value;
  if (basename && basename !== '/' && (value === basename || value.startsWith(`${basename}/`))) {
    destination = value.slice(basename.length) || '/';
  }
  if (destination.startsWith('//') || destination.includes('\\')) return null;
  return destination;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { register: registerField, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: '', password: '' },
  });
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => resetAuthRedirectGuard(), []);

  async function submitLogin(values: LoginFormValues) {
    setIsSubmitting(true);
    setServerError('');
    try {
      await login(values);
      const queryDestination = safeInternalRedirect(params.get('redirect'));
      const state = location.state as LocationState | null;
      const stateDestination = state?.from?.pathname
        ? `${state.from.pathname}${state.from.search ?? ''}${state.from.hash ?? ''}`
        : null;
      navigate(queryDestination ?? stateDestination ?? '/app/tickets', { replace: true });
    } catch (error) {
      setServerError(errorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <PublicNavbar />
      <main className="auth-main">
        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-card__intro">
            <span className="eyebrow">Tu espacio de soporte</span>
            <h1 id="login-title">Qué bueno tenerte de vuelta</h1>
            <p>Inicia sesión para consultar y gestionar tus solicitudes de soporte.</p>
          </div>
          <form className="form-stack" onSubmit={handleSubmit(submitLogin)} noValidate>
            <Input label="Correo electrónico" {...registerField('correo')} autoComplete="email" type="email" error={errors.correo?.message} errorId="login-email-error" aria-describedby={errors.correo ? 'login-email-error' : undefined} />
            <Input label="Contraseña" {...registerField('password')} autoComplete="current-password" type="password" error={errors.password?.message} errorId="login-password-error" aria-describedby={errors.password ? 'login-password-error' : undefined} />
            {serverError && <p className="form-error" role="alert">{serverError}</p>}
            <Button className="button--full" type="submit" isDisabled={isSubmitting}>
              {isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
            </Button>
          </form>
          <p className="auth-card__foot">¿Aún no tienes cuenta? <Link to="/signin">Crear una cuenta</Link></p>
        </section>
      </main>
    </div>
  );
}
