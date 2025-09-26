import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours (QueryClient v5 uses gcTime)
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});


const QUERY_PERSIST_KEY = '@react_query_cache_v1';

export async function setupQueryClientPersistence() {
  // restore
  try {
    const raw = await AsyncStorage.getItem(QUERY_PERSIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // naive restore: write queries back into cache
      parsed.queries?.forEach((q: any) => {
        try {
          queryClient.getQueryCache().build(q.state?.queryKey || q.queryKey, q.state || q);
        } catch (e) {
          // ignore individual restore errors
        }
      });
    }
  } catch (e) {
    // ignore restore errors
  }

  // periodic save
  const saveInterval = setInterval(async () => {
    try {
      const cache = queryClient.getQueryCache();
      const serializable = { queries: cache.getAll().map((q: any) => ({ queryKey: q.queryKey, state: q.state })) };
      await AsyncStorage.setItem(QUERY_PERSIST_KEY, JSON.stringify(serializable));
    } catch (e) {
      // ignore
    }
  }, 1000 * 30);

  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      queryClient.invalidateQueries();
    }
  });

  return () => {
    clearInterval(saveInterval as any);
    unsubscribe();
  };
}

export default queryClient;
