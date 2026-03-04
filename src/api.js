const https = require('https');

const API_KEY = 'a465ff67d8acd1945ea5a8494a449809';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetch weather data from OpenWeather API
 * @param {string} city - City name
 * @returns {Promise<Object>} - Weather data
 */
function fetchWeather(city) {
  return new Promise((resolve, reject) => {
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
      });
  });
}

module.exports = { fetchWeather };
