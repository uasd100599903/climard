export default function Footer() {
  return (
    <footer className="app-footer">
      <p>
        Datos meteorológicos de{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo.com</a>{' '}
        (CC BY 4.0). Esta app es un proyecto educativo: consulte siempre los boletines oficiales
        del COE y de la ONAMET.
      </p>
      <p>Reto 6 · ClimaRD — Proyecto Grupal: Innovación Dominicana 2025 · INF5160</p>
    </footer>
  );
}
