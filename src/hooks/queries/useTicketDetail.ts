import { useQuery } from '@tanstack/react-query';
import { ticketsApi } from '../../api/ticketsApi';
import { ticketKeys } from '../../features/tickets/ticketKeys';

export function useTicketDetail(id: number) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketsApi.detail(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}
