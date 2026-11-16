import { useEffect, useRef, type PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
}

export function TicketDialog({ open, title, onClose, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return <dialog ref={dialogRef} className="ticket-dialog" aria-labelledby="ticket-dialog-title" onClose={onClose} onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="ticket-dialog__header"><div><span className="eyebrow">InteliTickets</span><h2 id="ticket-dialog-title">{title}</h2></div><button className="icon-button" type="button" aria-label="Cerrar" onClick={onClose}>×</button></div>
    {children}
  </dialog>;
}
