import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface WeatherData {
  location: {
    village?: string;
    district?: string;
    city?: string;
    province?: string;
  };
  forecasts: Array<{
    datetime: string;
    temperature?: number;
    humidity?: number;
    weather?: string;
    windSpeed?: number;
    windDirection?: string;
  }>;
  marine?: any;
}

class BMKGService {
  private baseURL = 'https://api.bmkg.go.id/publik/prakiraan-cuaca';
  private marineURL = 'https://peta-maritim.bmkg.go.id/public_api/perairan';
  private cacheKeyPrefix = '@weather_cache_';
  private cacheExpiry = 3 * 60 * 60 * 1000; // 3 hours

  async getWeatherByLocation(locationCode: string): Promise<WeatherData> {
    const cacheKey = `${this.cacheKeyPrefix}${locationCode}`;

    const netInfo = await NetInfo.fetch();
    const cached = await this.getCachedData(cacheKey);

    if (!netInfo.isConnected && cached) {
      return cached.data;
    }

    if (cached && !this.isCacheExpired(cached.timestamp)) {
      return cached.data;
    }

    try {
      const resp = await fetch(`${this.baseURL}?adm4=${locationCode}`, { signal: AbortSignal.timeout(10000) });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const raw = await resp.json();
      const data = this.transformBMKGData(raw);
      await this.cacheData(cacheKey, data);
      return data;
    } catch (error) {
      if (cached) return cached.data;
      throw error;
    }
  }

  private transformBMKGData(raw: any): WeatherData {
    return {
      location: {
        village: raw.lokasi?.desa || '',
        district: raw.lokasi?.kecamatan || '',
        city: raw.lokasi?.kota || '',
        province: raw.lokasi?.provinsi || ''
      },
      forecasts: raw.data?.map((d: any) => ({
        datetime: d.local_datetime || d.datetime || '',
        temperature: d.t,
        humidity: d.hu,
        weather: d.weather_desc || d.weather,
        windSpeed: d.ws,
        windDirection: d.wd
      })) || []
    };
  }

  private async getCachedData(key: string) {
    try {
      const s = await AsyncStorage.getItem(key);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }

  private async cacheData(key: string, data: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (e) {
      // ignore
    }
  }

  private isCacheExpired(timestamp: number) {
    return Date.now() - timestamp > this.cacheExpiry;
  }

  async getMarineConditions(lat: number, lon: number) {
    const cacheKey = `${this.cacheKeyPrefix}marine_${lat}_${lon}`;
    const cached = await this.getCachedData(cacheKey);
    try {
      const resp = await fetch(`${this.marineURL}?lat=${lat}&lon=${lon}`, { signal: AbortSignal.timeout(10000) });
      if (!resp.ok) throw new Error('marine API');
      const raw = await resp.json();
      await this.cacheData(cacheKey, raw);
      return this.transformMarineData(raw);
    } catch (e) {
      if (cached) return this.transformMarineData(cached.data);
      throw e;
    }
  }

  private transformMarineData(raw: any) {
    return {
      waveHeight: raw.tinggi_gelombang || 0,
      waveCategory: this.getWaveCategory(raw.tinggi_gelombang || 0),
      windSpeed: raw.kecepatan_angin || 0,
      visibility: raw.jarak_pandang || 'Good',
      warnings: raw.peringatan || []
    };
  }

  private getWaveCategory(height: number) {
    if (height < 0.5) return 'Tenang';
    if (height < 1.25) return 'Rendah';
    if (height < 2.5) return 'Sedang';
    if (height < 4.0) return 'Tinggi';
    return 'Sangat Tinggi';
  }
}

export default new BMKGService();
