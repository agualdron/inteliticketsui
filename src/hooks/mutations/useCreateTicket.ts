import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ticketsApi } from '../../api/ticketsApi';
import { ticketKeys } from '../../features/tickets/ticketKeys';
import type { CrearTicketRequest } from '../../types/ticket.types';

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CrearTicketRequest) => ticketsApi.create(request),
    onSuccess: async (ticket) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ticketKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: ticketKeys.metrics() }),
      ]);
      toast.success(`Ticket creado: ${ticket.categoria} · ${ticket.prioridad}`);
    },
    onError: () => toast.error('No se pudo crear el ticket. Revisa los datos e inténtalo de nuevo.'),
  });
}
