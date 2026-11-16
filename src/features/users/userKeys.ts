export const userKeys = {
  all: ['users'] as const,
  technicians: (role: 'ADMIN' | 'SOPORTE') => [...userKeys.all, 'technicians', role] as const,
};
