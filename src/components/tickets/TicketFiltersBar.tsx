import type { CategoriaTicket, EstadoTicket, PrioridadTicket, Rol } from '../../types/ticket.types';

const states: EstadoTicket[] = ['ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO', 'ELIMINADO'];
const categories: CategoriaTicket[] = ['HARDWARE', 'SOFTWARE', 'CONECTIVIDAD', 'ACCESOS', 'OTRO'];
const priorities: PrioridadTicket[] = ['CRITICA', 'ALTA', 'MEDIA', 'BAJA'];

interface Props {
  role: Rol;
  query: string;
  state: EstadoTicket | '';
  category: CategoriaTicket | '';
  priority: PrioridadTicket | '';
  onQueryChange: (value: string) => void;
  onStateChange: (value: EstadoTicket | '') => void;
  onCategoryChange: (value: CategoriaTicket | '') => void;
  onPriorityChange: (value: PrioridadTicket | '') => void;
}

export function TicketFiltersBar(props: Props) {
  const isAdmin = props.role === 'ADMIN';
  const isAdvanced = props.role === 'ADMIN' || props.role === 'SOPORTE';
  return (
    <div className="ticket-filters" aria-label="Filtros de tickets">
      <label className="ticket-filter ticket-filter--search">
        <span>Buscar</span>
        <input type="search" value={props.query} onChange={(event) => props.onQueryChange(event.target.value)} placeholder="Título o descripción" />
      </label>
      <label className="ticket-filter">
        <span>Estado</span>
        <select value={props.state} onChange={(event) => props.onStateChange(event.target.value as EstadoTicket | '')}>
          <option value="">Todos</option>
          {states.filter((state) => state !== 'ELIMINADO' || isAdmin).map((state) => <option key={state} value={state}>{state.replace('_', ' ')}</option>)}
        </select>
      </label>
      {isAdvanced && <label className="ticket-filter"><span>Categoría</span><select value={props.category} onChange={(event) => props.onCategoryChange(event.target.value as CategoriaTicket | '')}><option value="">Todas</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>}
      {isAdvanced && <label className="ticket-filter"><span>Prioridad</span><select value={props.priority} onChange={(event) => props.onPriorityChange(event.target.value as PrioridadTicket | '')}><option value="">Todas</option>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>}
    </div>
  );
}
