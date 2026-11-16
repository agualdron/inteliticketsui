const roles = [
  {
    name: 'USUARIO',
    label: 'Solicita y consulta',
    tone: 'role-card--user',
    points: ['Consulta sus propios tickets', 'Agrega comentarios cuando el estado del ticket lo permite', 'Sigue el historial de cada cambio'],
  },
  {
    name: 'SOPORTE',
    label: 'Atiende y resuelve',
    tone: 'role-card--support',
    points: ['Gestiona la cola global de tickets', 'Actualiza estados y asigna técnicos', 'Colabora en el hilo de comentarios'],
  },
  {
    name: 'ADMIN',
    label: 'Gobierna la operación',
    tone: 'role-card--admin',
    points: ['Incluye las capacidades de SOPORTE', 'Consulta tickets eliminados', 'Ejecuta borrado lógico auditado'],
  },
];

export function RoleComparisonCards() {
  return (
    <section className="section roles-section" id="roles-gobernanza">
      <div className="section-heading">
        <span className="eyebrow">Roles y gobernanza</span>
        <h2>Responsabilidades claras. Historial siempre trazable.</h2>
        <p>Los permisos se ajustan a cada responsabilidad y los cambios dejan una trazabilidad inmutable.</p>
      </div>
      <div className="role-grid">
        {roles.map((role, index) => (
          <article className={`role-card ${role.tone}`} key={role.name}>
            <div className="role-card__header">
              <div className="role-avatar" aria-hidden="true">{role.name.slice(0, 1)}</div>
              <span className="role-card__index">0{index + 1}</span>
            </div>
            <span className="role-card__label">{role.label}</span>
            <h3>{role.name}</h3>
            <ul>{role.points.map((point) => <li key={point}><span aria-hidden="true">✓</span>{point}</li>)}</ul>
          </article>
        ))}
      </div>
      <p className="governance-note"><span aria-hidden="true">◉</span> Los tickets se eliminan de forma lógica y auditable; su historial permanece disponible según los permisos.</p>
    </section>
  );
}
