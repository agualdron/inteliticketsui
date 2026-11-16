import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTicketMetrics } from '../../hooks/queries/useTicketMetrics';
import { TicketMetricsCards } from '../../components/tickets/TicketMetricsCards';

export function MetricsPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');
  const [deletedOnly, setDeletedOnly] = useState(false);
  const metrics = useTicketMetrics(deletedOnly && isAdmin ? 'ELIMINADO' : undefined, true);

  return <>
    <section className="page-heading"><div><span className="eyebrow">Visión general</span><h1>Métricas</h1><p>Distribución de tickets por estado, categoría y prioridad.</p></div></section>
    {isAdmin && <label className="ticket-switch metrics-filter"><input type="checkbox" checked={deletedOnly} onChange={(event) => setDeletedOnly(event.target.checked)} /><span>Mostrar métricas de tickets eliminados</span></label>}
    {metrics.isPending ? <div className="ticket-state" role="status">Cargando métricas…</div>
      : metrics.isError || !metrics.data ? <div className="ticket-state ticket-state--error" role="alert">No se pudieron cargar las métricas.</div>
        : <TicketMetricsCards metrics={metrics.data} />}
  </>;
}
