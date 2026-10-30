export default function Header({ theme, onToggleTheme, storm }) {
  const isDark = theme === 'dark';

  return (
    <header className={`app-header ${storm ? 'storm' : ''}`}>
      <div className="header-inner">
        <div>
          <h1 className="app-title">
            <span className="cyclone" aria-hidden="true">🌀</span> Alerta Ciclónica RD
          </h1>
          <p className="subtitle">
            Sistema de Monitoreo Preventivo y Conciencia Ambiental en la República Dominicana
          </p>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
