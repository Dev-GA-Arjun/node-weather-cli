/**
 * Format weather data into a user-friendly summary
 * @param {Object} data - Weather data from API
 * @returns {string} - Formatted weather summary
 */
function formatWeather(data) {
  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity, pressure },
    weather,
    wind: { speed },
    clouds: { all: cloudiness },
  } = data;

  const description = weather[0].main;
  const icon = weather[0].icon;

  const summary = `
╔════════════════════════════════════════════════════╗
║                   WEATHER SUMMARY                  ║
╚════════════════════════════════════════════════════╝

📍 Location: ${name}, ${country}
🌡️  Temperature: ${temp}°C (feels like ${feels_like}°C)
🌤️  Condition: ${description}
💨 Wind Speed: ${speed} m/s
💧 Humidity: ${humidity}%
☁️  Cloud Coverage: ${cloudiness}%
🔽 Pressure: ${pressure} hPa

╚════════════════════════════════════════════════════╝
`;

  return summary;
}

/**
 * Validate weather data structure
 * @param {Object} data - Weather data
 * @returns {boolean} - True if valid
 */
function isValidWeatherData(data) {
  // Check if data exists and is an object
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check all required fields - convert to boolean
  return !!(typeof data.name === 'string' &&
    data.name.trim().length > 0 &&
    data.sys &&
    typeof data.sys === 'object' &&
    typeof data.sys.country === 'string' &&
    data.sys.country.length > 0 &&
    data.main &&
    typeof data.main === 'object' &&
    typeof data.main.temp === 'number' &&
    typeof data.main.feels_like === 'number' &&
    typeof data.main.humidity === 'number' &&
    typeof data.main.pressure === 'number' &&
    data.weather &&
    Array.isArray(data.weather) &&
    data.weather.length > 0 &&
    data.wind &&
    typeof data.wind === 'object' &&
    typeof data.wind.speed === 'number' &&
    data.clouds &&
    typeof data.clouds === 'object' &&
    typeof data.clouds.all === 'number');
}

module.exports = { formatWeather, isValidWeatherData };
