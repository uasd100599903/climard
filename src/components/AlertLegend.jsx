import { THRESHOLDS } from '../utils/alerts';

const { amarilla, roja } = THRESHOLDS;

export default function AlertLegend() {
  return (
    <section className="legend" aria-label="Cómo se calculan las alertas">
      <h2>¿Cómo se calculan las alertas?</h2>
      <ul>
        <li>
          <span className="badge-alert verde">Verde</span>
          Viento y lluvia por debajo de los umbrales. Condiciones normales.
        </li>
        <li>
          <span className="badge-alert amarilla">Amarilla</span>
          Viento &gt; {amarilla.wind} km/h, ráfagas &gt; {amarilla.gust} km/h o lluvia ≥ {amarilla.rain} mm.
        </li>
        <li>
          <span className="badge-alert roja">Roja</span>
          Viento &gt; {roja.wind} km/h, ráfagas &gt; {roja.gust} km/h o lluvia ≥ {roja.rain} mm.
        </li>
      </ul>
    </section>
  );
}
