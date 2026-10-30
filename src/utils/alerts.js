// Umbrales del semáforo de alertas (viento y ráfagas en km/h, lluvia en mm).
export const THRESHOLDS = {
  amarilla: { wind: 35, gust: 60, rain: 2.5 },
  roja: { wind: 60, gust: 90, rain: 10 },
};

export const ALERT_ORDER = { roja: 0, amarilla: 1, verde: 2 };

const MESSAGES = {
  roja: '⚠️ Alto riesgo de inundaciones y oleaje peligroso. Evacúe zonas de alto riesgo y siga las instrucciones del COE.',
  amarilla: '⚡ Vientos moderados y ráfagas. Asegure techos y vigile cañadas cercanas.',
  verde: '✅ Condiciones normales. Manténgase informado sobre los boletines del COE.',
};

const LABELS = { roja: 'Alerta Roja', amarilla: 'Alerta Amarilla', verde: 'Alerta Verde' };

/**
 * Determina el nivel de alerta de una provincia a partir del viento sostenido,
 * las ráfagas y la lluvia acumulada. `forceRed` permite el modo de simulación.
 */
export function calculateAlertLevel({ wind = 0, gust = 0, rain = 0, forceRed = false }) {
  let level = 'verde';
  const { roja, amarilla } = THRESHOLDS;

  if (forceRed || wind > roja.wind || gust > roja.gust || rain >= roja.rain) {
    level = 'roja';
  } else if (wind > amarilla.wind || gust > amarilla.gust || rain >= amarilla.rain) {
    level = 'amarilla';
  }

  return { level, label: LABELS[level], message: MESSAGES[level] };
}

// Códigos WMO de estado del tiempo → descripción en español e ícono.
export function describeWeatherCode(code) {
  if (code === 0) return { description: 'Cielo despejado', icon: '☀️' };
  if (code === 1) return { description: 'Mayormente despejado', icon: '🌤️' };
  if (code === 2) return { description: 'Parcialmente nublado', icon: '⛅' };
  if (code === 3) return { description: 'Nublado', icon: '☁️' };
  if (code === 45 || code === 48) return { description: 'Neblina', icon: '🌫️' };
  if (code >= 51 && code <= 57) return { description: 'Llovizna', icon: '🌦️' };
  if (code >= 61 && code <= 67) return { description: 'Lluvia', icon: '🌧️' };
  if (code >= 80 && code <= 82) return { description: 'Chubascos', icon: '🌧️' };
  if (code >= 95) return { description: 'Tormenta eléctrica', icon: '⛈️' };
  return { description: 'Parcialmente nublado', icon: '⛅' };
}
