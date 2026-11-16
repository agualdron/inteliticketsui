import type { HistorialEstadoResponse } from '../../types/ticket.types';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function TicketHistoryTimeline({ history }: { history: HistorialEstadoResponse[] }) {
  if (!history.length) return <p className="ticket-empty-inline">Aún no hay movimientos registrados.</p>;
  return <ol className="ticket-timeline">
    {history.map((entry) => <li className="ticket-timeline__item" key={entry.id}>
      <span className="ticket-timeline__dot" aria-hidden="true" />
      <div className="ticket-timeline__body">
        <div className="ticket-timeline__heading"><strong>{entry.estadoAnterior ? `${entry.estadoAnterior.replace('_', ' ')} → ${entry.estadoNuevo.replace('_', ' ')}` : entry.estadoNuevo.replace('_', ' ')}</strong><time dateTime={entry.fechaCambio}>{formatDate(entry.fechaCambio)}</time></div>
        <p className="ticket-timeline__actor">Por {entry.usuarioModificador.nombre}</p>
        {entry.comentario?.trim() && <blockquote>{entry.comentario}</blockquote>}
      </div>
    </li>)}
  </ol>;
}
