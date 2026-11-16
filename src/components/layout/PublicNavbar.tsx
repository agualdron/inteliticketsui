import { Link } from 'react-router';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

export function PublicNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="public-header">
      <div className="public-header__inner">
        <Link className="brand" to="/" aria-label="InteliTickets, inicio">
          <span className="brand__mark" aria-hidden="true">i</span>
          <span>InteliTickets</span>
        </Link>
        <nav className="public-nav" aria-label="Navegación pública">
          <Link to="/#como-funciona">Cómo funciona</Link>
          <Link to="/#roles-gobernanza">Roles y Gobernanza</Link>
        </nav>
        <div className="public-header__actions">
          <Button variant="plain" className="theme-toggle" onPress={toggleTheme} aria-label={`Activar tema ${theme === 'light' ? 'oscuro' : 'claro'}`}>
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
            <span className="theme-toggle__label">{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
          </Button>
          <Link className="header-login" to="/login">Iniciar sesión</Link>
          <Button to="/signin" variant="small">Crear cuenta</Button>
        </div>
      </div>
    </header>
  );
}
