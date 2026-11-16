import { axiosClient } from './axiosClient';
import type {
  ActualizarEstadoRequest,
  AsignarTecnicoRequest,
  CrearTicketRequest,
  EstadoTicket,
  MetricasTicketsResponse,
  TicketDetalleResponse,
  TicketFilters,
  TicketResponse,
} from '../types/ticket.types';
import type { PageResponse } from '../types/api.types';

function paramsFromFilters(filters: TicketFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.estado) params.set('estado', filters.estado);
  if (filters.categoria) params.set('categoria', filters.categoria);
  if (filters.prioridad) params.set('prioridad', filters.prioridad);
  if (filters.q?.trim()) params.set('q', filters.q.trim());
  params.set('page', String(filters.page ?? 0));
  params.set('size', String(filters.size ?? 10));
  return params;
}

export const ticketsApi = {
  async list(filters: TicketFilters): Promise<PageResponse<TicketResponse>> {
    const { data } = await axiosClient.get<PageResponse<TicketResponse>>('/api/tickets', {
      params: paramsFromFilters(filters),
    });
    return data;
  },
  async create(request: CrearTicketRequest): Promise<TicketResponse> {
    const { data } = await axiosClient.post<TicketResponse>('/api/tickets', request);
    return data;
  },
  async remove(id: number): Promise<void> {
    await axiosClient.delete(`/api/tickets/${id}`);
  },
  async detail(id: number): Promise<TicketDetalleResponse> {
    const { data } = await axiosClient.get<TicketDetalleResponse>(`/api/tickets/${id}`);
    return data;
  },
  async updateStatus(id: number, request: ActualizarEstadoRequest): Promise<TicketResponse> {
    const { data } = await axiosClient.patch<TicketResponse>(`/api/tickets/${id}/estado`, request);
    return data;
  },
  async assign(id: number, request: AsignarTecnicoRequest): Promise<TicketResponse> {
    const { data } = await axiosClient.patch<TicketResponse>(`/api/tickets/${id}/asignar`, request);
    return data;
  },
  async metrics(estado?: EstadoTicket): Promise<MetricasTicketsResponse> {
    const { data } = await axiosClient.get<MetricasTicketsResponse>('/api/tickets/metricas', {
      params: estado ? { estado } : undefined,
    });
    return data;
  },
};
