import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWeatherData } from '../services/bmkg/bmkgService';
import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import LOCATION_CODES from '../constants/locationCodes';
import mockBantulWeatherData from '../data/mockWeatherData';

// Default to Bantul (Pantai Depok) per directive when no code is provided
const DEFAULT_BANTUL_CODE = '34.04.01.2001';

export const useWeatherData = (locationCode?: string) => {
  const queryClient = useQueryClient();

  const finalCode = locationCode || DEFAULT_BANTUL_CODE;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) queryClient.invalidateQueries({ queryKey: ['weather', finalCode] });
    });
    return () => unsubscribe();
  }, [queryClient, finalCode]);

  const weatherQuery = useQuery({
    queryKey: ['weather', finalCode],
    queryFn: async () => {
      try {
        const data = await fetchWeatherData(finalCode);
        if (!data || !data.forecasts || data.forecasts.length === 0) {
          // fallback to mock
          return mockBantulWeatherData;
        }
        return data;
      } catch (e) {
        // On any error, return deterministic mock focused on Bantul
        return mockBantulWeatherData;
      }
    },
    staleTime: 3 * 60 * 60 * 1000, // 3 hours
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
    enabled: !!finalCode
  });

  // If we have data (including deterministic mock), prefer showing it rather than an error screen
  const resolvedIsError = !!weatherQuery.data ? false : weatherQuery.isError;

  return {
    weather: weatherQuery.data,
    isLoading: weatherQuery.isLoading,
    isError: resolvedIsError,
    error: weatherQuery.error,
    refetch: weatherQuery.refetch
  };
};
