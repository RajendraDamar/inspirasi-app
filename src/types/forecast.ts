export type WindForecast = { speedKt: number; directionDeg: number; gustKt?: number };
export type WaveForecast = { heightM: number; periodS?: number };
export type CurrentForecast = { speedKt: number; directionDeg: number };
export type TidePoint = { timeISO: string; heightM: number; state: 'rising' | 'falling' | 'high' | 'low' };
export type MarineForecast = { wind?: WindForecast; waves?: WaveForecast; currents?: CurrentForecast; tides?: TidePoint[] };

export default MarineForecast;
