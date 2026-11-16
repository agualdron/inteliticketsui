import type { EstadoTicket } from '../../types/ticket.types';

const labels: Record<EstadoTicket, string> = {
  ABIERTO: 'Abierto', EN_PROCESO: 'En proceso', RESUELTO: 'Resuelto', CERRADO: 'Cerrado', ELIMINADO: 'Eliminado',
};

export function TicketStatusBadge({ status }: { status: EstadoTicket }) {
  return <span className={`ticket-badge ticket-badge--status ticket-badge--${status.toLowerCase()}`}>{labels[status]}</span>;
}
