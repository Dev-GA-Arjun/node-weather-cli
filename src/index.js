#!/usr/bin/env node

const https = require('https');

// ============================================
// CONFIGURATION
// ============================================
const API_KEY = 'a465ff67d8acd1945ea5a8494a449809';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch weather data from OpenWeather API
 * @param {string} city - City name
 * @returns {Promise<Object>} - Weather data
 */
function fetchWeather(city) {
  return new Promise((resolve, reject) => {
    // Edge case: Empty or invalid city name
    if (!city || typeof city !== 'string' || city.trim() === '') {
      reject(new Error('City name is required and must be a non-empty string'));
      return;
    }

    const url = `${BASE_URL}?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric`;

    https
      .get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);

            if (res.statusCode === 200) {
              resolve(jsonData);
            } else if (res.statusCode === 404) {
              reject(new Error(`City "${city}" not found. Please check the spelling.`));
            } else if (res.statusCode === 401) {
              reject(new Error('Invalid API key'));
            } else {
              reject(new Error(`API Error: ${jsonData.message || 'Unknown error'}`));
            }
          } catch (err) {
            reject(new Error('Failed to parse API response'));
          }
        });
      })
      .on('error', (err) => {
        reject(new Error(`Network error: ${err.message}`));
      })
      .on('timeout', () => {
        reject(new Error('Request timeout'));
      });
  });
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

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

// ============================================
// FORMATTING FUNCTIONS
// ============================================

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

// ============================================
// MAIN APPLICATION
// ============================================

async function main() {
  const args = process.argv.slice(2);

  // Edge case: No city provided
  if (args.length === 0) {
    console.error('❌ Error: City name is required');
    console.log('\nUsage: node src/index.js <city_name>');
    console.log('Example: node src/index.js London');
    process.exit(1);
  }

  const city = args.join(' ');

  try {
    console.log(`🔍 Fetching weather for ${city}...`);
    const weatherData = await fetchWeather(city);

    // Edge case: Invalid weather data structure
    if (!isValidWeatherData(weatherData)) {
      throw new Error('Invalid weather data received from API');
    }

    const summary = formatWeather(weatherData);
    console.log(summary);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

// ============================================
// EXPORT FOR TESTING
// ============================================
module.exports = {
  fetchWeather,
  isValidWeatherData,
  formatWeather,
};

// Run main if called directly
if (require.main === module) {
  main();
}
