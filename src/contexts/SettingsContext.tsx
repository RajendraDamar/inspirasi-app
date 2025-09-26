import React, { createContext, ReactNode, useContext } from 'react';
import AuthContext from './AuthContext';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { Preferences } from '../services/userPreferencesService';

type SettingsContextType = {
  prefs?: Preferences | null;
  loading: boolean;
  save: (partial: Partial<Preferences>) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children?: ReactNode }) => {
  const auth = useContext(AuthContext);
  const userId = auth?.user?.uid ?? 'guest';

  const { data, isLoading, save } = useUserPreferences(userId);

  const saveWrap = async (partial: Partial<Preferences>) => {
    try {
      await save.mutateAsync(partial);
    } catch (e) {
      console.warn('saveWrap error', String(e));
    }
  };

  return (
    <SettingsContext.Provider value={{ prefs: data ?? null, loading: !!isLoading, save: saveWrap }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

export default SettingsContext;
