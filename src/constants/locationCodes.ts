export const LOCATION_CODES: { [key: string]: string } = {
  // Keyed by friendly name; values are BMKG location codes (example values)
  JAKARTA_PUSAT: '3171010001',
  JAKARTA_UTARA: '3171020001',
  BALI_DENPASAR: '3273010001',
  // Common city codes (examples provided in directive)
  Jakarta: '31.71.03.1001',
  Surabaya: '35.78.15.2006',
  Bandung: '32.73.09.1002',
  Medan: '12.71.05.1003',
  Semarang: '33.74.14.1006'
};

export default LOCATION_CODES;

// Bantul / Pantai Depok code used by the app default
export const BANTUL_PANTAI_DEPOK = '34.04.01.2001';
