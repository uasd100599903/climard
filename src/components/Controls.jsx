import { REGION_FILTERS } from '../data/provinces';

export const SORT_OPTIONS = [
  { value: 'alerta', label: 'Mayor alerta' },
  { value: 'nombre', label: 'Nombre (A-Z)' },
  { value: 'temperatura', label: 'Temperatura' },
  { value: 'viento', label: 'Viento' },
];

export default function Controls({
  region, onRegionChange,
  query, onQueryChange,
  sort, onSortChange,
  simulateStorm, onToggleStorm,
}) {
  return (
    <div className="controls-bar">
      <div className="controls-group">
        <label className="field">
          <span>Región</span>
          <select className="search-select" value={region} onChange={(e) => onRegionChange(e.target.value)}>
            {REGION_FILTERS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Buscar</span>
          <input
            type="search"
            className="search-select"
            placeholder="Provincia..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Ordenar por</span>
          <select className="search-select" value={sort} onChange={(e) => onSortChange(e.target.value)}>
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        className={`toggle-mode ${simulateStorm ? 'active' : ''}`}
        onClick={onToggleStorm}
        aria-pressed={simulateStorm}
      >
        {simulateStorm ? '⚡ Modo de prueba activo (clic para volver al clima real)' : '🌧️ Simular alerta ciclónica'}
      </button>
    </div>
  );
}
