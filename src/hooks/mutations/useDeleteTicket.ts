import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ticketsApi } from '../../api/ticketsApi';
import { ticketKeys } from '../../features/tickets/ticketKeys';

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ticketsApi.remove(id),
    onSuccess: async (_result, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ticketKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: ticketKeys.metrics() }),
      ]);
      toast.success('El ticket se marcó como eliminado.');
    },
    onError: () => toast.error('No se pudo eliminar el ticket.'),
  });
}
