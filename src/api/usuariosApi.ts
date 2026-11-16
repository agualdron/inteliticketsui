import { axiosClient } from './axiosClient';
import type { PageResponse } from '../types/api.types';
import type { Rol, UsuarioResumenResponse } from '../types/ticket.types';

const PAGE_SIZE = 1000;

async function fetchPage(path: '/api/usuarios' | '/api/usuarios/soporte', page: number) {
  const { data } = await axiosClient.get<PageResponse<UsuarioResumenResponse>>(path, {
    params: { page, size: PAGE_SIZE },
  });
  return data;
}

async function fetchAllPages(path: '/api/usuarios' | '/api/usuarios/soporte') {
  const users: UsuarioResumenResponse[] = [];
  let page = 0;
  let last = false;
  while (!last) {
    const response = await fetchPage(path, page);
    users.push(...response.content);
    last = response.last;
    page += 1;
  }
  return users;
}

export const usuariosApi = {
  async listTechnicians(actorRole: Extract<Rol, 'ADMIN' | 'SOPORTE'>) {
    const path = actorRole === 'SOPORTE' ? '/api/usuarios/soporte' : '/api/usuarios';
    const users = await fetchAllPages(path);
    return users.filter((user) => user.rol === 'SOPORTE');
  },
};
