import type { CategoriaTicket } from '../../types/ticket.types';

const icons: Record<CategoriaTicket, string> = {
  HARDWARE: '⌘', SOFTWARE: '⌘', CONECTIVIDAD: '⌁', ACCESOS: '◉', OTRO: '◇',
};

export function TicketCategoryBadge({ category }: { category: CategoriaTicket }) {
  return <span className="ticket-category"><span aria-hidden="true">{icons[category]}</span>{category}</span>;
}
