export default function AlertBanner({ data }) {
  const red = data.filter((p) => p.alert.level === 'roja');
  const yellow = data.filter((p) => p.alert.level === 'amarilla');

  let level = 'verde';
  let text = 'Sin alertas activas. Las condiciones son normales en todas las provincias monitoreadas.';

  if (red.length > 0) {
    level = 'roja';
    text = `Alerta roja en ${red.map((p) => p.name).join(', ')}. Siga las instrucciones del COE y esté listo para evacuar.`;
  } else if (yellow.length > 0) {
    level = 'amarilla';
    text = `Alerta amarilla en ${yellow.map((p) => p.name).join(', ')}. Vigile los boletines oficiales.`;
  }

  return (
    <div className={`alert-banner ${level}`} role="status" aria-live="polite">
      <span className="alert-banner-dot" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}
