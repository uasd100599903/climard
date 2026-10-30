// Provincias monitoreadas. Las coordenadas se usan para consultar el clima exacto
// de cada zona. `zone` sirve para filtrar por región y `coastal` marca las zonas
// con mayor exposición al oleaje y a las marejadas ciclónicas.
export const PROVINCES = [
  { id: 'santo-domingo', name: 'Santo Domingo', lat: 18.4861, lon: -69.9312, zone: 'sur', coastal: true, region: 'Sur / Capital' },
  { id: 'san-pedro', name: 'San Pedro de Macorís', lat: 18.4539, lon: -69.3086, zone: 'este', coastal: true, region: 'Este / Costera' },
  { id: 'la-romana', name: 'La Romana', lat: 18.4273, lon: -68.9728, zone: 'este', coastal: true, region: 'Este / Costera' },
  { id: 'la-altagracia', name: 'La Altagracia (Punta Cana)', lat: 18.5818, lon: -68.4055, zone: 'este', coastal: true, region: 'Este / Costera' },
  { id: 'samana', name: 'Samaná', lat: 19.2056, lon: -69.3369, zone: 'norte', coastal: true, region: 'Nordeste / Bahía' },
  { id: 'puerto-plata', name: 'Puerto Plata', lat: 19.7934, lon: -70.6884, zone: 'norte', coastal: true, region: 'Norte / Costera' },
  { id: 'monte-cristi', name: 'Monte Cristi', lat: 19.8486, lon: -71.6459, zone: 'norte', coastal: true, region: 'Noroeste / Costera' },
  { id: 'santiago', name: 'Santiago de los Caballeros', lat: 19.4517, lon: -70.697, zone: 'norte', coastal: false, region: 'Cibao Central' },
  { id: 'la-vega', name: 'La Vega', lat: 19.2207, lon: -70.5289, zone: 'norte', coastal: false, region: 'Cibao Central' },
  { id: 'barahona', name: 'Barahona', lat: 18.2085, lon: -71.1008, zone: 'sur', coastal: true, region: 'Sur / Costera' },
  { id: 'pedernales', name: 'Pedernales', lat: 18.0386, lon: -71.7444, zone: 'sur', coastal: true, region: 'Suroeste / Costera' },
  { id: 'san-juan', name: 'San Juan de la Maguana', lat: 18.8059, lon: -71.2299, zone: 'sur', coastal: false, region: 'Valle de San Juan' },
];

// Opciones del selector de región.
export const REGION_FILTERS = [
  { value: 'all', label: 'Todas las regiones' },
  { value: 'costera', label: 'Zonas costeras' },
  { value: 'este', label: 'Región Este' },
  { value: 'sur', label: 'Región Sur' },
  { value: 'norte', label: 'Región Norte / Cibao' },
];

export function matchesRegion(province, filter) {
  if (filter === 'all') return true;
  if (filter === 'costera') return province.coastal;
  return province.zone === filter;
}
