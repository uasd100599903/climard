export default function SummaryBar({ data }) {
  const count = (level) => data.filter((p) => p.alert.level === level).length;
  const windiest = data.reduce((max, p) => (!max || p.windSpeed > max.windSpeed ? p : max), null);

  return (
    <section className="summary-bar" aria-label="Resumen nacional">
      <div className="summary-tile roja">
        <span className="summary-value">{count('roja')}</span>
        <span className="summary-label">En alerta roja</span>
      </div>
      <div className="summary-tile amarilla">
        <span className="summary-value">{count('amarilla')}</span>
        <span className="summary-label">En alerta amarilla</span>
      </div>
      <div className="summary-tile verde">
        <span className="summary-value">{count('verde')}</span>
        <span className="summary-label">Condiciones normales</span>
      </div>
      <div className="summary-tile neutral">
        <span className="summary-value">{windiest ? `${windiest.windSpeed} km/h` : '—'}</span>
        <span className="summary-label">
          Viento máximo{windiest ? ` · ${windiest.name}` : ''}
        </span>
      </div>
    </section>
  );
}
