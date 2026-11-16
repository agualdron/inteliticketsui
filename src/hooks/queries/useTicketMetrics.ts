import { useQuery } from '@tanstack/react-query';
import { ticketsApi } from '../../api/ticketsApi';
import { ticketKeys } from '../../features/tickets/ticketKeys';
import type { EstadoTicket } from '../../types/ticket.types';

export function useTicketMetrics(estado?: EstadoTicket, enabled = true) {
  return useQuery({
    queryKey: estado ? ticketKeys.metricsByState(estado) : ticketKeys.metrics(),
    queryFn: () => ticketsApi.metrics(estado),
    enabled,
  });
}
