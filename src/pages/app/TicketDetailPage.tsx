import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useAssignTechnician } from '../../hooks/mutations/useAssignTechnician';
import { useDeleteTicket } from '../../hooks/mutations/useDeleteTicket';
import { useUpdateTicketStatus } from '../../hooks/mutations/useUpdateTicketStatus';
import { useTechnicians } from '../../hooks/queries/useTechnicians';
import { useTicketDetail } from '../../hooks/queries/useTicketDetail';
import type { EstadoTicket } from '../../types/ticket.types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TicketCategoryBadge } from '../../components/tickets/TicketCategoryBadge';
import { ConfirmDeleteTicketDialog } from '../../components/tickets/ConfirmDeleteTicketDialog';
import { TicketHistoryTimeline } from '../../components/tickets/TicketHistoryTimeline';
import { TicketPriorityBadge } from '../../components/tickets/TicketPriorityBadge';
import { TicketStatusBadge } from '../../components/tickets/TicketStatusBadge';

function nextStates(state: EstadoTicket): EstadoTicket[] {
  if (state === 'ABIERTO') return ['EN_PROCESO'];
  if (state === 'EN_PROCESO') return ['RESUELTO'];
  if (state === 'RESUELTO') return ['CERRADO'];
  return [];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value));
}

export function TicketDetailPage() {
  const params = useParams();
  const ticketId = Number(params.id);
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const ticketQuery = useTicketDetail(ticketId);
  const ticket = ticketQuery.data;
  const canManage = hasRole('ADMIN', 'SOPORTE');
  const isAdmin = hasRole('ADMIN');
  const actorRole = user?.rol ?? 'USUARIO';
  const technicianQuery = useTechnicians(actorRole);
  const statusMutation = useUpdateTicketStatus(ticketId);
  const assignMutation = useAssignTechnician(ticketId);
  const deleteMutation = useDeleteTicket();
  const [nextState, setNextState] = useState<EstadoTicket | ''>('');
  const [comment, setComment] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const transitions = useMemo(() => ticket ? nextStates(ticket.estado) : [], [ticket]);

  if (ticketQuery.isPending) return <div className="ticket-state" role="status">Cargando ticket…</div>;
  if (ticketQuery.isError || !ticket) return <div className="ticket-state ticket-state--error" role="alert"><strong>No se pudo cargar el ticket.</strong><Link to="/app/tickets">Volver a tickets</Link></div>;

  const classification = ticket.etiquetasIA?.includes('clasificacion-manual')
    ? 'Clasificación manual'
    : ticket.etiquetasIA?.includes('analisis-heuristico') ? 'Análisis heurístico' : null;
  const canAssign = canManage && ticket.estado !== 'ELIMINADO';

  return <>
    <div className="detail-back"><Link to="/app/tickets">← Volver a tickets</Link><span>Ticket #{ticket.id}</span></div>
    <div className="ticket-detail-layout">
      <article className="ticket-detail-main">
        <section className="ticket-panel ticket-detail-card">
          <div className="ticket-detail__top"><span className="eyebrow">Solicitud #{ticket.id}</span><TicketStatusBadge status={ticket.estado} /></div>
          <h1>{ticket.titulo}</h1>
          <p className="ticket-detail__description">{ticket.descripcion}</p>
          <div className="ticket-detail__metadata"><div><span>Categoría</span><TicketCategoryBadge category={ticket.categoria} /></div><div><span>Prioridad</span><TicketPriorityBadge priority={ticket.prioridad} /></div><div><span>Solicitante</span><strong>{ticket.usuarioSolicitante.nombre}</strong></div><div><span>Técnico asignado</span><strong>{ticket.tecnicoAsignado?.nombre ?? 'Sin asignar'}</strong></div></div>
          <p className="ticket-date">Creado {formatDate(ticket.fechaCreacion)} · Actualizado {formatDate(ticket.fechaActualizacion)}</p>
        </section>

        <section className="ticket-panel ticket-ai-card">
          <div className="ticket-panel__heading"><div><span className="eyebrow">Análisis del ticket</span><h2>Resumen de IA</h2></div>{classification && <Badge variant="brand">{classification}</Badge>}</div>
          <p>{ticket.resumenIA || 'No hay resumen disponible para este ticket.'}</p>
          <div className="ticket-ai-tags">{(ticket.etiquetasIA ?? []).map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
        </section>

        <section className="ticket-panel">
          <div className="ticket-panel__heading"><div><span className="eyebrow">Trazabilidad</span><h2>Historial y comentarios</h2></div></div>
          <TicketHistoryTimeline history={ticket.historial} />
        </section>
      </article>

      <aside className="ticket-detail-side">
        <section className="ticket-panel ticket-owner-card"><span className="eyebrow">Responsables</span><h2>Seguimiento</h2><p>Solicitante</p><strong>{ticket.usuarioSolicitante.nombre}</strong><p>Técnico asignado</p><strong>{ticket.tecnicoAsignado?.nombre ?? 'Sin asignar'}</strong></section>
        {canManage && <section className="ticket-panel ticket-management">
          <span className="eyebrow">Gestión</span><h2>Acciones del ticket</h2>
          {transitions.length > 0 && <form className="ticket-form" onSubmit={(event) => {
            event.preventDefault();
            if (!nextState) return;
            statusMutation.mutate({ estado: nextState, ...(comment.trim() ? { comentario: comment.trim() } : {}) }, { onSuccess: () => { setComment(''); setNextState(''); } });
          }}>
            <label className="ticket-filter"><span>Cambiar estado</span><select value={nextState} onChange={(event) => setNextState(event.target.value as EstadoTicket | '')} required><option value="">Selecciona un estado</option>{transitions.map((state) => <option key={state} value={state}>{state.replace('_', ' ')}</option>)}</select></label>
            <label className="ticket-filter"><span>Comentario del cambio (opcional)</span><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={255} rows={3} placeholder="Añade contexto a este cambio de estado" /><small>{comment.length}/255</small></label>
            <Button type="submit" isDisabled={!nextState || statusMutation.isPending}>{statusMutation.isPending ? 'Actualizando…' : 'Actualizar estado'}</Button>
          </form>}
          {canAssign && <form className="ticket-form ticket-form--divider" onSubmit={(event) => {
            event.preventDefault();
            if (technicianId) assignMutation.mutate({ tecnicoId: Number(technicianId) });
          }}>
            <label className="ticket-filter"><span>Asignar técnico</span><select value={technicianId} onChange={(event) => setTechnicianId(event.target.value)} required><option value="">Selecciona un técnico</option>{(technicianQuery.data ?? []).map((technician) => <option key={technician.id} value={technician.id}>{technician.nombre}</option>)}</select></label>
            {technicianQuery.isPending && <small role="status">Cargando técnicos…</small>}
            {technicianQuery.isError && <small className="field-error" role="alert">No se pudo cargar el directorio de técnicos.</small>}
            <Button type="submit" variant="outline" isDisabled={!technicianId || assignMutation.isPending || technicianQuery.isPending}>{assignMutation.isPending ? 'Asignando…' : 'Asignar técnico'}</Button>
          </form>}
          {isAdmin && ticket.estado !== 'ELIMINADO' && <div className="ticket-delete-action"><Button type="button" className="button--danger" onPress={() => setDeleteOpen(true)}>Eliminar ticket</Button></div>}
        </section>}
      </aside>
    </div>
    <ConfirmDeleteTicketDialog ticketId={ticket.id} open={deleteOpen} isPending={deleteMutation.isPending} onClose={() => setDeleteOpen(false)}
      onConfirm={() => deleteMutation.mutate(ticket.id, { onSuccess: () => { setDeleteOpen(false); navigate('/app/tickets'); } })} />
  </>;
}
