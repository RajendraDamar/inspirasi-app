import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { readPreferences, writePreferences, subscribePreferences, Preferences } from '../services/userPreferencesService';

const KEY = (userId: string) => ['user_preferences', userId] as const;

export function useUserPreferences(userId: string) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY(userId),
    queryFn: () => readPreferences(userId),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const unsub = subscribePreferences(userId, (prefs) => qc.setQueryData(KEY(userId), prefs));
    return () => unsub();
  }, [qc, userId]);

  const save = useMutation({
    mutationFn: (payload: Partial<Preferences>) => writePreferences(userId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY(userId) }),
  });

  return {
    ...query,
    save,
  };
}
