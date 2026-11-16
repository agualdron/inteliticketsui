import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateTicket } from '../../hooks/mutations/useCreateTicket';
import type { CategoriaTicket, PrioridadTicket } from '../../types/ticket.types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { TicketDialog } from './TicketDialog';

const schema = z.object({
  titulo: z.string().min(5, 'Escribe al menos 5 caracteres.').max(100, 'Máximo 100 caracteres.').refine((value) => value.trim().length > 0, 'El título es obligatorio.'),
  descripcion: z.string().min(20, 'Escribe al menos 20 caracteres.').max(2000, 'Máximo 2000 caracteres.').refine((value) => value.trim().length > 0, 'La descripción es obligatoria.'),
});

type FormValues = z.infer<typeof schema>;
const categories: CategoriaTicket[] = ['HARDWARE', 'SOFTWARE', 'CONECTIVIDAD', 'ACCESOS', 'OTRO'];
const priorities: PrioridadTicket[] = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];

export function CreateTicketModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [manual, setManual] = useState(false);
  const [categoria, setCategoria] = useState<CategoriaTicket>('SOFTWARE');
  const [prioridad, setPrioridad] = useState<PrioridadTicket>('MEDIA');
  const createTicket = useCreateTicket();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { titulo: '', descripcion: '' },
  });
  const description = watch('descripcion') ?? '';

  useEffect(() => {
    if (!open) {
      reset({ titulo: '', descripcion: '' });
      setManual(false);
    }
  }, [open, reset]);

  const submit = handleSubmit(async ({ titulo, descripcion }) => {
    await createTicket.mutateAsync({
      titulo,
      descripcion,
      categoria: manual ? categoria : null,
      prioridad: manual ? prioridad : null,
    });
    onClose();
  });

  return <TicketDialog open={open} title="Crear ticket" onClose={onClose}>
    <form className="ticket-form" onSubmit={(event) => { void submit(event); }}>
      <Input label="Título" placeholder="Resume el problema" maxLength={100} error={errors.titulo?.message} {...register('titulo')} />
      <div className="ticket-form__description">
        <TextArea label="Descripción" placeholder="Cuéntanos qué está pasando" rows={5} maxLength={2000} {...register('descripcion')} />
        <div className="ticket-form__meta"><span className={errors.descripcion ? 'field-error' : 'field-hint'}>{errors.descripcion?.message ?? 'Mínimo 20 y máximo 2000 caracteres.'}</span><span>{description.length}/2000</span></div>
      </div>
      {/* <label className="ticket-switch"><input type="checkbox" checked={manual} onChange={(event) => setManual(event.target.checked)} /><span>Especificar categoría y prioridad manualmente</span></label> */}
      {manual ? <div className="ticket-form__selects">
        <label className="ticket-filter"><span>Categoría</span><select value={categoria} onChange={(event) => setCategoria(event.target.value as CategoriaTicket)}>{categories.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label className="ticket-filter"><span>Prioridad</span><select value={prioridad} onChange={(event) => setPrioridad(event.target.value as PrioridadTicket)}>{priorities.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      </div> : <p className="ticket-form__notice">Spring AI analizará el ticket y asignará categoría, prioridad, resumen y etiquetas.</p>}
      <div className="ticket-dialog__actions"><Button type="button" variant="outline" onPress={onClose}>Cancelar</Button><Button type="submit" isDisabled={createTicket.isPending}>{createTicket.isPending ? 'Creando…' : 'Crear ticket'}</Button></div>
    </form>
  </TicketDialog>;
}
