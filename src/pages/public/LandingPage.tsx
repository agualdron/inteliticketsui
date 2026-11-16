import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { ArchitectureFlow } from '../../components/landing/ArchitectureFlow';
import { HeroInteractiveDemo } from '../../components/landing/HeroInteractiveDemo';
import { RoleComparisonCards } from '../../components/landing/RoleComparisonCards';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const sectionId = location.hash.slice(1);
    requestAnimationFrame(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }));
  }, [location.hash]);

  return (
    <div className="landing-page">
      <PublicNavbar />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="hero-kicker"><span className="hero-kicker__spark">✳</span> Soporte inteligente para equipos</span>
            <h1>Resuelve solicitudes con <span>claridad y velocidad.</span></h1>
            <p className="hero-copy__lead">InteliTickets organiza el soporte técnico con inteligencia artificial, seguimiento transparente y un plan confiable cuando la IA no está disponible.</p>
            <div className="tech-badges" aria-label="Tecnologías">
              <Badge>Spring AI</Badge><Badge>Clasificación inteligente</Badge><Badge>Fallback resiliente</Badge>
            </div>
            <div className="hero-actions">
              <Button to="/signin">Crear cuenta <span aria-hidden="true">→</span></Button>
              <Button to="/login" variant="outline">Iniciar sesión</Button>
            </div>
            <div className="hero-trust"><span className="trust-mark" aria-hidden="true">✓</span><span>Seguimiento claro desde el primer reporte</span></div>
          </div>
          <HeroInteractiveDemo />
          <div className="hero-orb hero-orb--one" aria-hidden="true" />
          <div className="hero-orb hero-orb--two" aria-hidden="true" />
        </section>
        <ArchitectureFlow />
        <RoleComparisonCards />
        <section className="closing-cta">
          <div><span className="eyebrow">Un soporte más organizado empieza aquí</span><h2>Convierte cada solicitud en un avance visible.</h2></div>
          <Button to="/signin" variant="light">Crear cuenta gratis <span aria-hidden="true">→</span></Button>
        </section>
      </main>
      <footer className="site-footer"><Link className="brand" to="/"><span className="brand__mark">i</span><span>InteliTickets</span></Link><span>Soporte claro, decisiones trazables.</span><span>© InteliTickets</span></footer>
    </div>
  );
}
