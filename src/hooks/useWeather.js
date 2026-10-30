import { useEffect, useState } from 'react';
import { loadWeather } from '../services/weather';

const AUTO_REFRESH_MS = 10 * 60 * 1000;

/**
 * Carga el clima de las provincias, lo refresca cada 10 minutos y permite
 * recargarlo manualmente. `loading` es verdadero mientras la última
 * petición solicitada todavía no ha respondido.
 */
export function useWeather(simulateStorm) {
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState({ key: null, data: [], source: null, updatedAt: null });
  const requestKey = `${simulateStorm}-${tick}`;

  useEffect(() => {
    const controller = new AbortController();

    loadWeather({ simulateStorm, signal: controller.signal })
      .then((next) => setResult({ ...next, key: requestKey }))
      .catch(() => {});

    return () => controller.abort();
  }, [simulateStorm, requestKey]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  return {
    data: result.data,
    source: result.source,
    updatedAt: result.updatedAt,
    loading: result.key !== requestKey,
    refresh: () => setTick((t) => t + 1),
  };
}
