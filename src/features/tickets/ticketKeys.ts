import type { EstadoTicket, TicketFilters } from '../../types/ticket.types';

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters: TicketFilters) => [...ticketKeys.lists(), filters] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: number) => [...ticketKeys.details(), id] as const,
  metrics: () => [...ticketKeys.all, 'metrics'] as const,
  metricsByState: (estado: EstadoTicket) => [...ticketKeys.metrics(), estado] as const,
};

