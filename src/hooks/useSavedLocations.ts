import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listSavedLocations,
  addSavedLocation,
  removeSavedLocation,
  toggleFavorite,
  subscribeSavedLocations,
  SavedLocation,
} from '../services/locations/savedLocationsService';

const QUERY_KEY = ['saved_locations'] as const;

export function useSavedLocations() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: listSavedLocations,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    const unsub = subscribeSavedLocations((items) => {
      qc.setQueryData(QUERY_KEY, items);
    });
    return () => unsub();
  }, [qc]);

  const addMutation = useMutation({
    mutationFn: (payload: SavedLocation) => addSavedLocation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeSavedLocation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) => toggleFavorite(id, favorite),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    ...query,
    add: addMutation,
    remove: removeMutation,
    toggleFavorite: toggleMutation,
  };
}
