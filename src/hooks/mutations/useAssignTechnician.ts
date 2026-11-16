import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ticketsApi } from '../../api/ticketsApi';
import { ticketKeys } from '../../features/tickets/ticketKeys';
import type { AsignarTecnicoRequest } from '../../types/ticket.types';

export function useAssignTechnician(ticketId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AsignarTecnicoRequest) => ticketsApi.assign(ticketId, request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) }),
        queryClient.invalidateQueries({ queryKey: ticketKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: ticketKeys.metrics() }),
      ]);
      toast.success('Técnico asignado.');
    },
    onError: () => toast.error('No se pudo asignar el técnico.'),
  });
}
