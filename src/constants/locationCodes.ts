// Centralized BMKG location codes used across the app
// Codes are strings per BMKG (example format). Add more as needed.
export type LocationCode = string;

// Single source of truth for BMKG location codes used in the app.
export const LOCATION_CODES: Record<string, LocationCode> = {
  JAKARTA_PUSAT: '3171010001', // Jakarta Pusat (example)
  JAKARTA_UTARA: '3171020001',
  JAKARTA_SELATAN: '3171010002',
  JAKARTA_TIMUR: '3171010003',
  BALI_DENPASAR: '3273010001',
};

export const DEFAULT_LOCATION: LocationCode = LOCATION_CODES.JAKARTA_PUSAT;

export default LOCATION_CODES;
