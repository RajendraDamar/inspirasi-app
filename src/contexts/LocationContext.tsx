import React, { createContext, useContext, useState } from 'react';
import { BANTUL_PANTAI_DEPOK } from '../constants/locationCodes';

type LocationContextShape = {
  locationCode: string;
  setLocationCode: (code: string) => void;
};

const LocationContext = createContext<LocationContextShape | undefined>(undefined);

export const LocationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [locationCode, setLocationCode] = useState<string>(BANTUL_PANTAI_DEPOK);
  return <LocationContext.Provider value={{ locationCode, setLocationCode }}>{children}</LocationContext.Provider>;
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
};

export default LocationContext;
