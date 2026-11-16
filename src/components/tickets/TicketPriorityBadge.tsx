import type { PrioridadTicket } from '../../types/ticket.types';

export function TicketPriorityBadge({ priority }: { priority: PrioridadTicket }) {
  return <span className={`ticket-badge ticket-badge--priority ticket-badge--${priority.toLowerCase()}`}>{priority}</span>;
}
