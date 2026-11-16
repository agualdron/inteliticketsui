import { useQuery } from '@tanstack/react-query';
import { usuariosApi } from '../../api/usuariosApi';
import { userKeys } from '../../features/users/userKeys';
import type { Rol } from '../../types/ticket.types';

export function useTechnicians(actorRole: Rol) {
  const role = actorRole === 'ADMIN' || actorRole === 'SOPORTE' ? actorRole : null;
  return useQuery({
    queryKey: userKeys.technicians(role ?? 'SOPORTE'),
    queryFn: () => role ? usuariosApi.listTechnicians(role) : Promise.resolve([]),
    enabled: role !== null,
  });
}
