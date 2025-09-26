import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWeatherData } from '../services/bmkg/bmkgService';
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
    queryFn: () => fetchWeatherData(finalCode),
    staleTime: 3 * 60 * 60 * 1000, // 3 hours
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    enabled: !!finalCode
  });

  return {
    weather: weatherQuery.data,
    isLoading: weatherQuery.isLoading,
    isError: weatherQuery.isError,
    error: weatherQuery.error,
    refetch: weatherQuery.refetch
  };
};
