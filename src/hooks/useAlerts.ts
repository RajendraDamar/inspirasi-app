import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listAlerts, subscribeAlerts, AlertItem } from '../services/notifications/alertsService';

const QUERY_KEY = ['alerts'] as const;

export function useAlerts() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: listAlerts,
    staleTime: 1000 * 30, // 30s
  });

  useEffect(() => {
    const unsub = subscribeAlerts((items) => {
      qc.setQueryData(QUERY_KEY, items);
    });
    return () => unsub();
  }, [qc]);

  return query as { data?: AlertItem[]; isLoading: boolean } & typeof query;
}
