export type Rol = 'ADMIN' | 'SOPORTE' | 'USUARIO';

export type CategoriaTicket =
  | 'HARDWARE'
  | 'SOFTWARE'
  | 'CONECTIVIDAD'
  | 'ACCESOS'
  | 'OTRO';

export type PrioridadTicket = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type EstadoTicket =
  | 'ABIERTO'
  | 'EN_PROCESO'
  | 'RESUELTO'
  | 'CERRADO'
  | 'ELIMINADO';

export interface TicketFilters {
  estado?: EstadoTicket;
  categoria?: CategoriaTicket;
  prioridad?: PrioridadTicket;
  q?: string;
  page?: number;
  size?: number;
}

export interface UsuarioResumenResponse {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
}

export interface CrearTicketRequest {
  titulo: string;
  descripcion: string;
  usuarioId?: number | null;
  categoria?: CategoriaTicket | null;
  prioridad?: PrioridadTicket | null;
}

export interface ActualizarEstadoRequest {
  estado: EstadoTicket;
  comentario?: string | null;
}

export interface AsignarTecnicoRequest {
  tecnicoId: number;
}

export interface TicketResponse {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: CategoriaTicket;
  prioridad: PrioridadTicket;
  estado: EstadoTicket;
  usuarioSolicitante: UsuarioResumenResponse;
  tecnicoAsignado: UsuarioResumenResponse | null;
  resumenIA: string | null;
  etiquetasIA: string[] | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface HistorialEstadoResponse {
  id: number;
  estadoAnterior: EstadoTicket | null;
  estadoNuevo: EstadoTicket;
  usuarioModificador: UsuarioResumenResponse;
  comentario: string | null;
  fechaCambio: string;
}

export interface TicketDetalleResponse extends TicketResponse {
  historial: HistorialEstadoResponse[];
}

export interface MetricasTicketsResponse {
  porEstado: Partial<Record<EstadoTicket, number>>;
  porCategoria: Partial<Record<CategoriaTicket, number>>;
  porPrioridad: Partial<Record<PrioridadTicket, number>>;
}
