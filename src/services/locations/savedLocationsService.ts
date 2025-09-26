import { collection, addDoc, deleteDoc, doc, getDocs, onSnapshot, query, where, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/config';

export type SavedLocation = {
  id?: string;
  name: string;
  code?: string; // BMKG adm4 or location code
  favorite?: boolean;
  createdAt?: string;
};

const COLLECTION = 'saved_locations';

export async function listSavedLocations(): Promise<SavedLocation[]> {
  // Try to read from Firestore emulator first
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    const items: SavedLocation[] = [];
    snap.forEach((d) => {
      const data = d.data() as any;
      items.push({ id: d.id, name: data.name, code: data.code, favorite: !!data.favorite, createdAt: data.createdAt });
    });
    // Cache locally for offline read
    await AsyncStorage.setItem('@saved_locations_cache', JSON.stringify(items));
    return items;
  } catch (e) {
    // Fallback to AsyncStorage cache
    try {
      const raw = await AsyncStorage.getItem('@saved_locations_cache');
      if (raw) return JSON.parse(raw) as SavedLocation[];
    } catch (ee) {
      // ignore
    }
    return [];
  }
}

export async function addSavedLocation(item: SavedLocation): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      name: item.name,
      code: item.code || null,
      favorite: !!item.favorite,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (e) {
    console.warn('addSavedLocation failed', String(e));
    return null;
  }
}

export async function removeSavedLocation(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    return true;
  } catch (e) {
    console.warn('removeSavedLocation failed', String(e));
    return false;
  }
}

export async function toggleFavorite(id: string, favorite: boolean): Promise<boolean> {
  try {
    await updateDoc(doc(db, COLLECTION, id), { favorite });
    return true;
  } catch (e) {
    console.warn('toggleFavorite failed', String(e));
    return false;
  }
}

// Real-time listener helper - returns an unsubscribe function
export function subscribeSavedLocations(onChange: (items: SavedLocation[]) => void) {
  const q = query(collection(db, COLLECTION));
  const unsub = onSnapshot(q, (snap) => {
    const items: SavedLocation[] = [];
    snap.forEach((d) => {
      const data = d.data() as any;
      items.push({ id: d.id, name: data.name, code: data.code, favorite: !!data.favorite, createdAt: data.createdAt });
    });
    onChange(items);
  }, (err) => {
    console.warn('subscribeSavedLocations error', String(err));
  });
  return unsub;
}
