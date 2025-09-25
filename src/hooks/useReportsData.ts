import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase/config';

type Report = {
  id: string;
  title?: string;
  description?: string;
  createdAt?: any;
};

async function fetchRecentReports(): Promise<Report[]> {
  try {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(10));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch (e) {
    console.warn('Failed to fetch reports', e);
    // Fallback to empty list
    return [];
  }
}

export default function useReportsData() {
  return useQuery({
    queryKey: ['reports', 'recent'],
    queryFn: fetchRecentReports,
  staleTime: 1000 * 60 * 5,
  });
}
