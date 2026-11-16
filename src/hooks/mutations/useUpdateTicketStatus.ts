import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ticketsApi } from '../../api/ticketsApi';
import { ticketKeys } from '../../features/tickets/ticketKeys';
import type { ActualizarEstadoRequest } from '../../types/ticket.types';

export function useUpdateTicketStatus(ticketId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: ActualizarEstadoRequest) => ticketsApi.updateStatus(ticketId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) }),
        queryClient.invalidateQueries({ queryKey: ticketKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: ticketKeys.metrics() }),
      ]);
      toast.success('Estado actualizado.');
    },
    onError: () => toast.error('No se pudo actualizar el estado.'),
  });
}
