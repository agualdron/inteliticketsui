import type { MetricasTicketsResponse } from '../../types/ticket.types';

const groups = [
  { key: 'porEstado', title: 'Tickets por estado', color: 'purple' },
  { key: 'porCategoria', title: 'Tickets por categoría', color: 'mint' },
  { key: 'porPrioridad', title: 'Tickets por prioridad', color: 'amber' },
] as const;

export function TicketMetricsCards({ metrics }: { metrics: MetricasTicketsResponse }) {
  const values = {
    porEstado: metrics.porEstado,
    porCategoria: metrics.porCategoria,
    porPrioridad: metrics.porPrioridad,
  };
  return <section className="metrics-grid" aria-label="Resumen de métricas">
    {groups.map((group) => {
      const entries = Object.entries(values[group.key]).sort(([left], [right]) => left.localeCompare(right));
      const total = entries.reduce((sum, [, count]) => sum + (count ?? 0), 0);
      return <article className={`metric-card metric-card--${group.color}`} key={group.key}>
        <div className="metric-card__heading"><span>{group.title}</span><strong>{total}</strong></div>
        <div className="metric-card__rows">{entries.map(([label, count]) => <div className="metric-row" key={label}><span>{label.replaceAll('_', ' ')}</span><strong>{count ?? 0}</strong></div>)}</div>
      </article>;
    })}
  </section>;
}
