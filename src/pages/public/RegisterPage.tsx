import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import type { ErrorResponse } from '../../types/api.types';
import { registerSchema, type RegisterFormValues } from '../../features/auth/authSchemas';

function errorMessage(error: unknown): string {
  const response = error as { response?: { data?: Partial<ErrorResponse> } };
  return response.response?.data?.message || 'No pudimos crear tu cuenta. Inténtalo de nuevo.';
}

export function RegisterPage() {
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nombre: '', correo: '', password: '' },
  });
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitRegistration(values: RegisterFormValues) {
    setIsSubmitting(true);
    setServerError('');
    try {
      await createAccount(values);
      navigate('/app/tickets', { replace: true });
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
        <section className="auth-card" aria-labelledby="register-title">
          <div className="auth-card__intro">
            <span className="eyebrow">Empieza en unos minutos</span>
            <h1 id="register-title">Crea tu cuenta</h1>
            <p>Centraliza tus solicitudes y mantente al tanto de cada avance.</p>
          </div>
          <form className="form-stack" onSubmit={handleSubmit(submitRegistration)} noValidate>
            <Input label="Nombre" {...register('nombre')} autoComplete="name" type="text" error={errors.nombre?.message} errorId="register-name-error" aria-describedby={errors.nombre ? 'register-name-error' : undefined} />
            <Input label="Correo electrónico" {...register('correo')} autoComplete="email" type="email" error={errors.correo?.message} errorId="register-email-error" aria-describedby={errors.correo ? 'register-email-error' : undefined} />
            <div className="form-field-group">
              <Input label="Contraseña" {...register('password')} autoComplete="new-password" type="password" error={errors.password?.message} errorId="register-password-error" aria-describedby={errors.password ? 'register-password-error' : undefined} />
              <span className="field-hint">Entre 8 y 72 caracteres.</span>
            </div>
            {serverError && <p className="form-error" role="alert">{serverError}</p>}
            <Button className="button--full" type="submit" isDisabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
            </Button>
          </form>
          <p className="auth-card__foot">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </section>
      </main>
    </div>
  );
}
