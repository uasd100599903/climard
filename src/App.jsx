import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { matchesRegion } from './data/provinces';
import { ALERT_ORDER } from './utils/alerts';
import { useWeather } from './hooks/useWeather';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import AlertBanner from './components/AlertBanner';
import SummaryBar from './components/SummaryBar';
import Controls from './components/Controls';
import ProvinceCard from './components/ProvinceCard';
import AlertLegend from './components/AlertLegend';
import PreventionSection from './components/PreventionSection';
import Footer from './components/Footer';

const SOURCE_TEXT = {
  live: '🟢 Datos en tiempo real',
  storm: '🧪 Simulación de tormenta (datos de prueba)',
  fallback: '🟠 Sin conexión con el servicio meteorológico: mostrando datos simulados',
};

const SORTERS = {
  alerta: (a, b) => ALERT_ORDER[a.alert.level] - ALERT_ORDER[b.alert.level] || b.windSpeed - a.windSpeed,
  nombre: (a, b) => a.name.localeCompare(b.name, 'es'),
  temperatura: (a, b) => b.temp - a.temp,
  viento: (a, b) => b.windSpeed - a.windSpeed,
};

const normalize = (text) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function App() {
  const [region, setRegion] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('alerta');
  const [simulateStorm, setSimulateStorm] = useState(false);
  const [theme, setTheme] = useLocalStorage(
    'climard-tema',
    window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  );

  const { data, source, updatedAt, loading, refresh } = useWeather(simulateStorm);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const visible = useMemo(
    () =>
      data
        .filter((p) => matchesRegion(p, region))
        .filter((p) => normalize(p.name).includes(normalize(query.trim())))
        .sort(SORTERS[sort]),
    [data, region, query, sort]
  );

  const hasData = data.length > 0;

  return (
    <div className={`app ${simulateStorm ? 'storm-mode' : ''}`}>
      <Header
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        storm={simulateStorm}
      />

      <main className="container">
        {hasData && <AlertBanner data={data} />}

        <Controls
          region={region} onRegionChange={setRegion}
          query={query} onQueryChange={setQuery}
          sort={sort} onSortChange={setSort}
          simulateStorm={simulateStorm}
          onToggleStorm={() => setSimulateStorm(!simulateStorm)}
        />

        <div className="status-row" aria-live="polite">
          <span>{loading ? '⏳ Consultando estaciones meteorológicas...' : SOURCE_TEXT[source]}</span>
          <span className="status-actions">
            {updatedAt && !loading && (
              <span>
                Actualizado a las {updatedAt.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button type="button" className="link-button" onClick={refresh} disabled={loading}>
              ↻ Actualizar
            </button>
          </span>
        </div>

        {!hasData ? (
          <div className="skeleton-grid" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => <div className="skeleton-card" key={i} />)}
          </div>
        ) : (
          <>
            <SummaryBar data={data} />

            {visible.length === 0 ? (
              <p className="empty-state">No se encontraron provincias con ese filtro.</p>
            ) : (
              <div className="provinces-grid">
                {visible.map((prov, i) => (
                  <ProvinceCard key={prov.id} province={prov} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        <AlertLegend />
        <PreventionSection />
      </main>

      <Footer />
    </div>
  );
}
