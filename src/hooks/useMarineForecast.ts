import { useWeatherData } from './useWeatherData';
import type { MarineForecast, WindForecast, WaveForecast, CurrentForecast, TidePoint } from '../types/forecast';

export const useMarineForecast = (locationCode?: string) => {
  const { weather, isLoading, isError, refetch } = useWeatherData(locationCode);

  const forecasts = (weather && (weather as any).forecasts) || [];

  const marine: MarineForecast = {};

  // Map available forecast entries to typed marine shapes when possible
  const maybeWind = forecasts[1];
  if (maybeWind && (maybeWind.windSpeed !== undefined || maybeWind.windDirection !== undefined)) {
    const w: WindForecast = {
      speedKt: Number(maybeWind.windSpeed || 0),
      directionDeg: Number(maybeWind.windDirection || 0)
    };
    marine.wind = w;
  }

  const maybeWaves = forecasts[2];
  if (maybeWaves && (maybeWaves.waveHeight !== undefined || maybeWaves.significantWaveHeight !== undefined)) {
    const wf: WaveForecast = {
      heightM: Number(maybeWaves.waveHeight || maybeWaves.significantWaveHeight || 0),
      periodS: maybeWaves.period || undefined
    };
    marine.waves = wf;
  }

  const maybeCurrents = forecasts[3];
  if (maybeCurrents && (maybeCurrents.currentSpeed !== undefined || maybeCurrents.currentDirection !== undefined)) {
    const cf: CurrentForecast = {
      speedKt: Number(maybeCurrents.currentSpeed || 0),
      directionDeg: Number(maybeCurrents.currentDirection || 0)
    };
    marine.currents = cf;
  }

  const maybeTides = (weather && (weather as any).tides) || null;
  if (Array.isArray(maybeTides)) {
    const t: TidePoint[] = maybeTides.map((pt: any) => ({ timeISO: String(pt.time || pt.datetime || pt.timeISO), heightM: Number(pt.height || pt.level || 0), state: pt.state || 'rising' }));
    marine.tides = t;
  }

  return { marine, isLoading, isError, refetch } as const;
};

export default useMarineForecast;
