import { WeatherData } from '../services/api/bmkgService';

// Rich deterministic mock data focused on Pantai Depok, Bantul (code 34.04.01.2001)
export const mockBantulWeatherData: WeatherData = {
  location: {
    village: 'Pantai Depok',
    district: 'Sanden',
    city: 'Bantul',
    province: 'DI Yogyakarta'
  },
  forecasts: [
    {
      datetime: new Date().toISOString(),
      temperature: 28.5,
      humidity: 78,
      weather: 'Cerah Berawan',
      windSpeed: 6.2,
      windDirection: 'Barat Daya'
    },
    {
      datetime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      temperature: 29.0,
      humidity: 76,
      weather: 'Cerah',
      windSpeed: 5.5,
      windDirection: 'Barat'
    },
    {
      datetime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      temperature: 27.8,
      humidity: 82,
      weather: 'Hujan Ringan',
      windSpeed: 7.8,
      windDirection: 'Barat Laut'
    },
    {
      datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      temperature: 27.0,
      humidity: 85,
      weather: 'Hujan Sedang',
      windSpeed: 9.6,
      windDirection: 'Utara'
    },
    {
      datetime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      temperature: 26.5,
      humidity: 88,
      weather: 'Berawan',
      windSpeed: 4.2,
      windDirection: 'Timur'
    }
  ],
  marine: {
    waveHeight: 1.8, // meters
    waveCategory: 'Sedang',
    windSpeed: 6.2, // m/s
    visibility: 'Baik',
    currents: {
      speed: 0.8, // m/s
      direction: 'Barat'
    },
    tide: {
      nextHigh: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      nextLow: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString()
    },
    warnings: [
      {
        id: 'w1',
        severity: 'warning',
        title: 'Gelombang Tinggi',
        message: 'Perkiraan gelombang 2.0-2.5m dalam 6 jam ke depan di area Pantai Depok.',
        area: 'Pantai Depok',
        timestamp: new Date().toISOString()
      }
    ]
  }
  
};

export default mockBantulWeatherData as any;
