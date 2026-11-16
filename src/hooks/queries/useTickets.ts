import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ticketsApi } from '../../api/ticketsApi';
import { ticketKeys } from '../../features/tickets/ticketKeys';
import type { TicketFilters } from '../../types/ticket.types';

export function useTickets(filters: TicketFilters, enabled = true) {
  const [debouncedQuery, setDebouncedQuery] = useState(filters.q ?? '');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(filters.q ?? ''), 300);
    return () => window.clearTimeout(timer);
  }, [filters.q]);

  const queryFilters = { ...filters, q: debouncedQuery };
  return useQuery({
    queryKey: ticketKeys.list(queryFilters),
    queryFn: () => ticketsApi.list(queryFilters),
    placeholderData: keepPreviousData,
    enabled,
  });
}
