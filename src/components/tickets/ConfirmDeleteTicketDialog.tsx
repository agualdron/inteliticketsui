import { Button } from '../ui/Button';
import { TicketDialog } from './TicketDialog';

interface Props {
  ticketId: number | null;
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteTicketDialog({ ticketId, open, isPending, onClose, onConfirm }: Props) {
  return <TicketDialog open={open} title="Eliminar ticket" onClose={onClose}>
    <div className="ticket-confirm-dialog">
      <p>¿Confirmas la eliminación lógica del ticket #{ticketId}? El registro se conservará en el historial como eliminado.</p>
      <div className="ticket-dialog__actions"><Button type="button" variant="outline" onPress={onClose}>Cancelar</Button><Button type="button" className="button--danger" isDisabled={isPending} onPress={onConfirm}>{isPending ? 'Eliminando…' : 'Eliminar ticket'}</Button></div>
    </div>
  </TicketDialog>;
}
