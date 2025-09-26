import apiService from '../api/bmkgService';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds
const RATE_LIMIT_MAX = 60; // 60 requests per window

let requestTimestamps: number[] = [];

export interface WeatherData {
  location: {
    village?: string;
    district?: string;
    city?: string;
    province?: string;
  };
  forecasts: Array<{
    datetime?: string;
    temperature?: number;
    humidity?: number;
    weather?: string;
    windSpeed?: number;
    windDirection?: string;
    [key: string]: any;
  }>;
}

function enforceRateLimit() {
  const now = Date.now();
  // drop old timestamps
  requestTimestamps = requestTimestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (requestTimestamps.length >= RATE_LIMIT_MAX) {
    const err: any = new Error('BMKG rate limit exceeded');
    err.code = 'BMKG_RATE_LIMIT';
    throw err;
  }
  requestTimestamps.push(now);
}

export const fetchWeatherData = async (locationCode: string): Promise<WeatherData> => {
  enforceRateLimit();
  // Reuse existing api layer which already implements caching & transform
  const data: any = await apiService.getWeatherByLocation(locationCode);

  // Return as-is but ensure it matches the WeatherData interface expected by UI
  const normalized: WeatherData = {
    location: {
      village: data?.location?.village ?? data?.location?.desa,
      district: data?.location?.district ?? data?.location?.kecamatan,
      city: data?.location?.city ?? data?.location?.kota,
      province: data?.location?.province ?? data?.location?.provinsi
    },
    forecasts: (data?.forecasts || []).map((f: any) => ({
      datetime: f?.datetime || f?.local_datetime || f?.utc_datetime,
      temperature: f?.temperature ?? f?.t,
      humidity: f?.humidity ?? f?.hu,
      weather: f?.weather || f?.weather_desc,
      windSpeed: f?.windSpeed ?? f?.ws,
      windDirection: f?.windDirection ?? f?.wd,
      ...f
    }))
  };

  return normalized;
};

export default { fetchWeatherData };
