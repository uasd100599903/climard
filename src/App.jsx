import { useState, useEffect } from 'react';
import './App.css';

// Lista de provincias clave con sus coordenadas para consulta exacta vía API
const PROVINCES_DATA = [
  { id: 'santo-domingo', name: 'Santo Domingo', lat: 18.4861, lon: -69.9312, region: 'Sur / Capital' },
  { id: 'san-pedro', name: 'San Pedro de Macorís', lat: 18.4539, lon: -69.3086, region: 'Este / Costera' },
  { id: 'la-altagracia', name: 'La Altagracia (Punta Cana)', lat: 18.5818, lon: -68.4055, region: 'Este / Costera' },
  { id: 'samana', name: 'Samaná', lat: 19.2056, lon: -69.3369, region: 'Nordeste / Bay' },
  { id: 'puerto-plata', name: 'Puerto Plata', lat: 19.7934, lon: -70.6884, region: 'Norte / Costera' },
  { id: 'barahona', name: 'Barahona', lat: 18.2085, lon: -71.1008, region: 'Sur / Costera' },
  { id: 'monte-cristi', name: 'Monte Cristi', lat: 19.8486, lon: -71.6459, region: 'Noroeste / Costera' },
  { id: 'santiago', name: 'Santiago de los Caballeros', lat: 19.4517, lon: -70.6970, region: 'Cibao Central' },
];

// Función para determinar el nivel de alerta según la velocidad del viento (km/h) y la lluvia
function calculateAlertLevel(windSpeed, isStormSimulated = false) {
  if (isStormSimulated || windSpeed > 60) {
    return {
      level: 'roja',
      label: 'Alerta Roja',
      message: '⚠️ Alto riesgo de inundaciones y oleaje peligroso. Evacúe zonas de alto riesgo.'
    };
  } else if (windSpeed > 35) {
    return {
      level: 'amarilla',
      label: 'Alerta Amarilla',
      message: '⚡ Vientos moderados y ráfagas. Asegure techos y vigile cañadas cercanas.'
    };
  }
  return {
    level: 'verde',
    label: 'Alerta Verde',
    message: '✅ Condiciones normales. Manténgase informado sobre los boletines del COE.'
  };
}

export default function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRegion, setFilterRegion] = useState('all');
  const [simulateStorm, setSimulateStorm] = useState(false);

  // Ingrese su API Key de OpenWeatherMap si dispone de una.
  const API_KEY = '';

  useEffect(() => {
    async function fetchWeatherData() {
      setLoading(true);

      // Si no hay API Key o estamos simulando, se generan datos de prueba realistas
      if (!API_KEY || simulateStorm) {
        const simulatedList = PROVINCES_DATA.map((prov) => {
          const wind = simulateStorm ? Math.floor(Math.random() * 50) + 40 : Math.floor(Math.random() * 25) + 10;
          const temp = Math.floor(Math.random() * 5) + 27;
          const alert = calculateAlertLevel(wind, simulateStorm && prov.region.includes('Costera'));

          return {
            ...prov,
            temp,
            windSpeed: wind,
            humidity: simulateStorm ? 90 : 75,
            description: simulateStorm ? 'Lluvias intensas con ráfagas' : 'Parcialmente nublado',
            alert,
          };
        });

        setWeatherData(simulatedList);
        setLoading(false);
        return;
      }

      // Consulta real a OpenWeatherMap
      try {
        const promises = PROVINCES_DATA.map(async (prov) => {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${prov.lat}&lon=${prov.lon}&appid=${API_KEY}&units=metric&lang=es`
          );
          const data = await res.json();
          const windSpeedKmH = Math.round(data.wind.speed * 3.6);
          const alert = calculateAlertLevel(windSpeedKmH);

          return {
            ...prov,
            temp: Math.round(data.main.temp),
            windSpeed: windSpeedKmH,
            humidity: data.main.humidity,
            description: data.weather[0].description,
            alert,
          };
        });

        const results = await Promise.all(promises);
        setWeatherData(results);
      } catch (error) {
        console.error('Error cargando clima:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherData();
  }, [simulateStorm]);

  const filteredProvinces = weatherData.filter((item) =>
    filterRegion === 'all' ? true : item.region.includes(filterRegion)
  );

  return (
    <div>
      <header class="app-header">
        <h1 class="app-title">
          <span>🌀</span> Alerta Ciclónica RD
        </h1>
        <p class="subtitle">Sistema de Monitoreo Preventivo y Conciencia Ambiental en la R.D.</p>
      </header>

      <main class="container">
        {/* Barra de Control */}
        <div class="controls-bar">
          <div>
            <label htmlFor="region-select" style={{ marginRight: '10px' }}>Región:</label>
            <select
              id="region-select"
              class="search-select"
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
            >
              <option value="all">Todas las Regiones</option>
              <option value="Costera">Zonas Costeras</option>
              <option value="Este">Región Este</option>
              <option value="Sur">Región Sur</option>
              <option value="Norte">Región Norte / Cibao</option>
            </select>
          </div>

          <button
            class={`toggle-mode ${simulateStorm ? 'active' : ''}`}
            onClick={() => setSimulateStorm(!simulateStorm)}
          >
            {simulateStorm ? '⚡ Modos de Prueba Activo (Simular Tormenta)' : '🌧️ Simular Alerta Ciclónica'}
          </button>
        </div>

        {/* Carga o Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Consultando estaciones meteorológicas...</p>
        ) : (
          <div class="provinces-grid">
            {filteredProvinces.map((prov) => (
              <div key={prov.id} class={`province-card ${prov.alert.level}`}>
                <div class="card-header">
                  <h2 class="province-name">{prov.name}</h2>
                  <span class={`badge-alert ${prov.alert.level}`}>
                    {prov.alert.label}
                  </span>
                </div>

                <div class="weather-info">
                  <div>
                    <span class="temp-main">{prov.temp}°C</span>
                    <div class="weather-desc">{prov.description}</div>
                  </div>
                  <div style={{ fontSize: '2.5rem' }}>
                    {prov.alert.level === 'roja' ? '⛈️' : prov.alert.level === 'amarilla' ? '🌧️' : '⛅'}
                  </div>
                </div>

                <div class="weather-stats">
                  <span>💨 Viento: {prov.windSpeed} km/h</span>
                  <span>💧 Humedad: {prov.humidity}%</span>
                </div>

                <div class="alert-message">
                  {prov.alert.message}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Módulo de Prevención */}
        <section class="prevention-section">
          <h2>Mochila de Emergencia & Plan Familiar (COE)</h2>
          <p style={{ color: '#cbd5e1' }}>
            La prevención salva vidas. En caso de aviso de tormenta o huracán, asegúrese de contar con lo siguiente:
          </p>

          <div class="prevention-grid">
            <div class="prevention-card">
              <h3>📦 Suministros Básicos</h3>
              <ul>
                <li>Agua potable (mínimo 3 días).</li>
                <li>Alimentos enlatados no perecederos.</li>
                <li>Botiquín de primeros auxilios.</li>
              </ul>
            </div>

            <div class="prevention-card">
              <h3>📻 Comunicación</h3>
              <ul>
                <li>Radio portátil con pilas de repuesto.</li>
                <li>Batería externa (Powerbank) cargada.</li>
                <li>Documentos personales en bolsa plástica.</li>
              </ul>
            </div>

            <div class="prevention-card">
              <h3>🚨 Contactos de Emergencia</h3>
              <ul>
                <li><strong>COE:</strong> 809-472-0909</li>
                <li><strong>Defensa Civil:</strong> 809-682-1788</li>
                <li><strong>Emergencias:</strong> 911</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}