import { useState, type PropsWithChildren } from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function AppShell({ children }: PropsWithChildren) {
  const { user, logout, hasRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const canSeeMetrics = hasRole('ADMIN', 'SOPORTE');

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${menuOpen ? 'app-sidebar--open' : ''}`} aria-label="Navegación principal">
        <NavLink className="brand app-brand" to="/app/tickets" onClick={closeMenu}>
          <span className="brand__mark">i</span><span>InteliTickets</span>
        </NavLink>
        <span className="app-sidebar__label">Workspace</span>
        <nav className="app-nav">
          <NavLink to="/app/tickets" onClick={closeMenu} className={({ isActive }) => `app-nav__link ${isActive ? 'is-active' : ''}`}>
            <span aria-hidden="true">▦</span> Tickets
          </NavLink>
          {canSeeMetrics && (
            <NavLink to="/app/metrics" onClick={closeMenu} className={({ isActive }) => `app-nav__link ${isActive ? 'is-active' : ''}`}>
              <span aria-hidden="true">▥</span> Métricas
            </NavLink>
          )}
        </nav>
        <div className="app-sidebar__bottom">
          <Badge variant="brand">{user?.rol ?? 'USUARIO'}</Badge>
          <span className="app-sidebar__user">{user?.nombre}</span>
          <span className="app-sidebar__email">{user?.correo}</span>
          <Button variant="outline" type="button" onPress={logout}>Cerrar sesión</Button>
        </div>
      </aside>

      {menuOpen && <button className="app-sidebar__scrim" aria-label="Cerrar menú" onClick={closeMenu} />}
      <div className="app-shell__main">
        <header className="app-topbar">
          <button className="app-menu-button" type="button" aria-expanded={menuOpen} aria-label="Abrir menú" onClick={() => setMenuOpen((open) => !open)}>☰</button>
          <div className="app-topbar__identity"><span className="eyebrow">Centro de soporte</span><strong>InteliTickets</strong></div>
          <div className="app-topbar__actions">
            <Badge variant="brand">{user?.rol ?? 'USUARIO'}</Badge>
            <button className="theme-toggle app-theme-toggle" type="button" onClick={toggleTheme} aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}>
              <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span><span className="theme-toggle__label">{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
            </button>
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
