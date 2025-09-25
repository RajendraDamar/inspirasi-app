import { useQuery, useQueryClient } from '@tanstack/react-query';
import bmkgService from '../services/api/bmkgService';
import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import LOCATION_CODES from '../constants/locationCodes';

export const useWeatherData = (locationCode?: string) => {
  const queryClient = useQueryClient();

  const finalCode = locationCode || LOCATION_CODES.JAKARTA_PUSAT;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) queryClient.invalidateQueries({ queryKey: ['weather', finalCode] });
    });
    return () => unsubscribe();
  }, [queryClient, finalCode]);

  const weatherQuery = useQuery({
    queryKey: ['weather', finalCode],
    queryFn: () => bmkgService.getWeatherByLocation(finalCode),
    staleTime: 30 * 60 * 1000,
    retry: 2
  });

  return {
    weather: weatherQuery.data,
    isLoading: weatherQuery.isLoading,
    isError: weatherQuery.isError,
    error: weatherQuery.error,
    refetch: weatherQuery.refetch
  };
};
