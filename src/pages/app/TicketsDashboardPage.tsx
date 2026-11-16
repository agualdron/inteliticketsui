import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useDeleteTicket } from '../../hooks/mutations/useDeleteTicket';
import { useTicketMetrics } from '../../hooks/queries/useTicketMetrics';
import { useTickets } from '../../hooks/queries/useTickets';
import type { CategoriaTicket, EstadoTicket, PrioridadTicket } from '../../types/ticket.types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { TicketCategoryBadge } from '../../components/tickets/TicketCategoryBadge';
import { ConfirmDeleteTicketDialog } from '../../components/tickets/ConfirmDeleteTicketDialog';
import { CreateTicketModal } from '../../components/tickets/CreateTicketModal';
import { TicketFiltersBar } from '../../components/tickets/TicketFiltersBar';
import { TicketPriorityBadge } from '../../components/tickets/TicketPriorityBadge';
import { TicketStatusBadge } from '../../components/tickets/TicketStatusBadge';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(value));
}

export function TicketsDashboardPage() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const isAdmin = hasRole('ADMIN');
  const canSeeMetrics = hasRole('ADMIN', 'SOPORTE');
  const [query, setQuery] = useState('');
  const [state, setState] = useState<EstadoTicket | ''>('');
  const [category, setCategory] = useState<CategoriaTicket | ''>('');
  const [priority, setPriority] = useState<PrioridadTicket | ''>('');
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTicketId, setDeleteTicketId] = useState<number | null>(null);
  const filters = useMemo(() => ({
    ...(state ? { estado: state } : {}),
    ...(category ? { categoria: category } : {}),
    ...(priority ? { prioridad: priority } : {}),
    q: query,
    page,
    size: 10,
  }), [category, page, priority, query, state]);
  const tickets = useTickets(filters);
  const metrics = useTicketMetrics(undefined, canSeeMetrics);
  const deleteTicket = useDeleteTicket();
  const rows = tickets.data?.content ?? [];
  const pageCount = tickets.data?.totalPages ?? 0;

  function updateFilter<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setPage(0);
  }

  return <>
    <section className="page-heading">
      <div><span className="eyebrow">Hola, {user?.nombre}</span><h1>Tickets</h1><p>Consulta y gestiona las solicitudes de soporte.</p></div>
      {hasRole('USUARIO') && <Button type="button" onPress={() => setCreateOpen(true)}>＋ Nuevo ticket</Button>}
    </section>

    {canSeeMetrics && <section className="quick-metrics" aria-label="Métricas rápidas">
      <div><span>Total de tickets</span><strong>{metrics.data ? Object.values(metrics.data.porEstado).reduce((sum, count) => sum + (count ?? 0), 0) : '—'}</strong></div>
      {(['ABIERTO', 'EN_PROCESO', 'RESUELTO'] as const).map((item) => <div key={item}><span>{item.replace('_', ' ')}</span><strong>{metrics.data?.porEstado[item] ?? '—'}</strong></div>)}
    </section>}

    <section className="ticket-panel">
      <div className="ticket-panel__heading"><div><h2>{hasRole('USUARIO') ? 'Mis tickets' : 'Cola de tickets'}</h2><p>{tickets.data?.totalElements ?? 0} resultados</p></div>
        {isAdmin && <Badge variant="brand">Vista administrativa</Badge>}
      </div>
      <TicketFiltersBar role={user?.rol ?? 'USUARIO'} query={query} state={state} category={category} priority={priority}
        onQueryChange={(value) => updateFilter(setQuery, value)} onStateChange={(value) => updateFilter(setState, value)}
        onCategoryChange={(value) => updateFilter(setCategory, value)} onPriorityChange={(value) => updateFilter(setPriority, value)} />

      {tickets.isPending ? <div className="ticket-state" role="status">Cargando tickets…</div>
        : tickets.isError ? <div className="ticket-state ticket-state--error" role="alert">No se pudieron cargar los tickets. Intenta de nuevo.</div>
          : rows.length === 0 ? <div className="ticket-state"><strong>No hay tickets para mostrar</strong><span>Ajusta los filtros o crea una nueva solicitud.</span></div>
            : <div className="ticket-table-wrap"><table className="ticket-table"><thead><tr><th>Ticket</th><th>Categoría</th><th>Prioridad</th><th>Estado</th><th>Solicitante</th><th>Actualizado</th><th><span className="sr-only">Acciones</span></th></tr></thead>
              <tbody>{rows.map((ticket) => <tr key={ticket.id}>
                <td><Link className="ticket-table__title" to={`/app/tickets/${ticket.id}`}>#{ticket.id} · {ticket.titulo}</Link><span className="ticket-table__description">{ticket.descripcion}</span></td>
                <td><TicketCategoryBadge category={ticket.categoria} /></td><td><TicketPriorityBadge priority={ticket.prioridad} /></td><td><TicketStatusBadge status={ticket.estado} /></td>
                <td>{ticket.usuarioSolicitante.nombre}</td><td>{formatDate(ticket.fechaActualizacion)}</td>
                <td className="ticket-table__actions"><Button variant="plain" type="button" onPress={() => navigate(`/app/tickets/${ticket.id}`)}>Abrir</Button>
                  {isAdmin && ticket.estado !== 'ELIMINADO' && <Button variant="plain" type="button" isDisabled={deleteTicket.isPending} onPress={() => setDeleteTicketId(ticket.id)}>Eliminar</Button>}
                </td>
              </tr>)}</tbody></table></div>}

      <div className="ticket-pagination"><span>Página {page + 1} de {Math.max(pageCount, 1)}</span><div>
        <Button variant="outline" type="button" isDisabled={page <= 0 || tickets.isFetching} onPress={() => setPage((current) => Math.max(0, current - 1))}>Anterior</Button>
        <Button variant="outline" type="button" isDisabled={page + 1 >= pageCount || tickets.isFetching} onPress={() => setPage((current) => current + 1)}>Siguiente</Button>
      </div></div>
    </section>
    <CreateTicketModal open={createOpen} onClose={() => setCreateOpen(false)} />
    <ConfirmDeleteTicketDialog ticketId={deleteTicketId} open={deleteTicketId !== null} isPending={deleteTicket.isPending}
      onClose={() => setDeleteTicketId(null)} onConfirm={() => { if (deleteTicketId !== null) deleteTicket.mutate(deleteTicketId, { onSuccess: () => setDeleteTicketId(null) }); }} />
  </>;
}
