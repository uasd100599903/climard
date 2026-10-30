import { useLocalStorage } from '../hooks/useLocalStorage';

const KIT = [
  {
    id: 'suministros',
    title: '📦 Suministros Básicos',
    items: [
      'Agua potable (mínimo 3 días).',
      'Alimentos enlatados no perecederos.',
      'Botiquín de primeros auxilios.',
    ],
  },
  {
    id: 'comunicacion',
    title: '📻 Comunicación',
    items: [
      'Radio portátil con pilas de repuesto.',
      'Batería externa (powerbank) cargada.',
      'Documentos personales en bolsa plástica.',
    ],
  },
];

const TOTAL_ITEMS = KIT.reduce((sum, group) => sum + group.items.length, 0);

const CONTACTS = [
  { name: 'COE', phone: '809-472-0909' },
  { name: 'Defensa Civil', phone: '809-682-1788' },
  { name: 'Emergencias', phone: '911' },
];

export default function PreventionSection() {
  const [checked, setChecked] = useLocalStorage('climard-mochila', []);
  const percent = Math.round((checked.length / TOTAL_ITEMS) * 100);

  const toggle = (key) =>
    setChecked((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
    );

  return (
    <section className="prevention-section">
      <h2>Mochila de Emergencia &amp; Plan Familiar (COE)</h2>
      <p className="prevention-intro">
        La prevención salva vidas. En caso de aviso de tormenta o huracán, asegúrese de contar con lo siguiente.
        Marque lo que ya tiene listo:
      </p>

      <div className="progress" aria-label="Progreso de la mochila de emergencia">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="progress-text">
          {checked.length} de {TOTAL_ITEMS} listos ({percent}%)
          {checked.length > 0 && (
            <button type="button" className="link-button" onClick={() => setChecked([])}>
              Reiniciar
            </button>
          )}
        </span>
      </div>

      <div className="prevention-grid">
        {KIT.map((group) => (
          <div className="prevention-card" key={group.id}>
            <h3>{group.title}</h3>
            <ul className="checklist">
              {group.items.map((item) => {
                const key = `${group.id}:${item}`;
                return (
                  <li key={key}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checked.includes(key)}
                        onChange={() => toggle(key)}
                      />
                      <span>{item}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="prevention-card">
          <h3>🚨 Contactos de Emergencia</h3>
          <ul className="contacts">
            {CONTACTS.map((c) => (
              <li key={c.name}>
                <strong>{c.name}:</strong> <a href={`tel:${c.phone.replace(/-/g, '')}`}>{c.phone}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
