export default function ProvinceCard({ province, index }) {
  const { alert } = province;

  return (
    <article
      className={`province-card ${alert.level}`}
      style={{ '--i': index }}
    >
      <div className="card-header">
        <div>
          <h2 className="province-name">{province.name}</h2>
          <span className="province-region">
            {province.coastal ? '🌊 ' : '⛰️ '}{province.region}
          </span>
        </div>
        <span className={`badge-alert ${alert.level}`}>{alert.label}</span>
      </div>

      <div className="weather-info">
        <div>
          <span className="temp-main">{province.temp}°C</span>
          <div className="weather-desc">{province.description}</div>
        </div>
        <div className="weather-icon" aria-hidden="true">{province.icon}</div>
      </div>

      <div className="weather-stats">
        <span>💨 Viento: {province.windSpeed} km/h</span>
        <span>🌬️ Ráfagas: {province.gust} km/h</span>
        <span>💧 Humedad: {province.humidity}%</span>
        <span>☔ Lluvia: {province.rain.toFixed(1)} mm</span>
      </div>

      <div className="alert-message">{alert.message}</div>
    </article>
  );
}
