import { PROVINCES } from '../data/provinces';
import { calculateAlertLevel, describeWeatherCode } from '../utils/alerts';

const API_URL = 'https://api.open-meteo.com/v1/forecast';

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Clima en tiempo real desde Open-Meteo (gratuito y sin API key).
 * Hace una sola petición con las coordenadas de todas las provincias.
 */
export async function fetchLiveWeather(signal) {
  const params = new URLSearchParams({
    latitude: PROVINCES.map((p) => p.lat).join(','),
    longitude: PROVINCES.map((p) => p.lon).join(','),
    current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m',
    wind_speed_unit: 'kmh',
    timezone: 'America/Santo_Domingo',
  });

  const response = await fetch(`${API_URL}?${params}`, { signal });
  if (!response.ok) throw new Error(`Open-Meteo respondió ${response.status}`);

  const json = await response.json();
  const locations = Array.isArray(json) ? json : [json];

  return PROVINCES.map((province, index) => {
    const current = locations[index]?.current;
    if (!current) throw new Error(`Sin datos para ${province.name}`);

    const wind = Math.round(current.wind_speed_10m);
    const gust = Math.round(current.wind_gusts_10m);
    const rain = Number(current.precipitation) || 0;
    const { description, icon } = describeWeatherCode(current.weather_code);

    return {
      ...province,
      temp: Math.round(current.temperature_2m),
      windSpeed: wind,
      gust,
      rain,
      humidity: Math.round(current.relative_humidity_2m),
      description,
      icon,
      alert: calculateAlertLevel({ wind, gust, rain }),
    };
  });
}

/**
 * Datos simulados. Con `storm = true` representa el paso de un ciclón:
 * viento fuerte, lluvia intensa y las zonas costeras en alerta roja.
 */
export function buildSimulatedWeather({ storm = false } = {}) {
  return PROVINCES.map((province) => {
    const wind = storm
      ? randomBetween(province.coastal ? 55 : 38, province.coastal ? 105 : 70)
      : randomBetween(8, 28);
    const gust = Math.round(wind * (1.3 + Math.random() * 0.3));
    const rain = storm ? randomBetween(6, 32) : randomBetween(0, 1);
    const { description, icon } = storm
      ? { description: 'Lluvias intensas con ráfagas', icon: '⛈️' }
      : describeWeatherCode(randomBetween(1, 2));

    return {
      ...province,
      temp: randomBetween(27, 32),
      windSpeed: wind,
      gust,
      rain,
      humidity: storm ? randomBetween(88, 97) : randomBetween(68, 80),
      description,
      icon,
      alert: calculateAlertLevel({ wind, gust, rain, forceRed: storm && province.coastal }),
    };
  });
}

/**
 * Punto de entrada: devuelve los datos y de dónde provienen.
 * source: 'live' | 'storm' | 'fallback' (sin conexión, datos simulados)
 */
export async function loadWeather({ simulateStorm, signal }) {
  if (simulateStorm) {
    return { data: buildSimulatedWeather({ storm: true }), source: 'storm', updatedAt: new Date() };
  }

  try {
    const data = await fetchLiveWeather(signal);
    return { data, source: 'live', updatedAt: new Date() };
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.warn('No se pudo consultar el clima en vivo, se usan datos simulados.', error);
    return { data: buildSimulatedWeather(), source: 'fallback', updatedAt: new Date() };
  }
}
