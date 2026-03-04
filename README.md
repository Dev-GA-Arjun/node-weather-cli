# Weather CLI

A simple command-line interface to fetch and display weather information using the OpenWeatherMap API.

## Features

- **Simple CLI Interface**: Pass city name as an argument
- **User-Friendly Output**: Formatted weather summary with emojis
- **Comprehensive Weather Data**: Temperature, humidity, wind speed, pressure, cloud coverage
- **Error Handling**: Handles invalid cities, network errors, and API issues
- **No Dependencies**: Uses only Node.js built-in modules
- **Test Suite**: Custom test runner to validate edge cases

## Installation

```bash
npm install
```

## Usage

```bash
node src/index.js <city_name>
```

### Examples

```bash
# Single word city
node src/index.js London

# Multi-word city
node src/index.js "New York"

# City with special characters
node src/index.js "São Paulo"
```

### Output Example

```
🔍 Fetching weather for London...

╔════════════════════════════════════════════════════╗
║                   WEATHER SUMMARY                  ║
╚════════════════════════════════════════════════════╝

📍 Location: London, GB
🌡️  Temperature: 15°C (feels like 14°C)
🌤️  Condition: Cloudy
💨 Wind Speed: 5.5 m/s
💧 Humidity: 70%
☁️  Cloud Coverage: 60%
🔽 Pressure: 1013 hPa

╚════════════════════════════════════════════════════╝
```

## Running Tests

```bash
npm test
```

### Test Coverage

The test suite validates:

1. **Weather Data Validation**
   - Valid data acceptance
   - Invalid data rejection
   - Missing required fields detection
   - Null/undefined handling

2. **Weather Formatting**
   - Correct city name display
   - Proper temperature formatting
   - All required fields included
   - Special characters support

3. **Edge Cases**
   - Extreme temperatures (-50°C)
   - Maximum humidity (100%)
   - Zero wind speed
   - High pressure values
   - Long city names with special characters

## Project Structure

```
weather-cli/
├── src/
│   ├── index.js          # CLI entry point
│   ├── api.js            # OpenWeatherMap API integration
│   └── weather.js        # Weather data formatting & validation
├── test/
│   └── test.js           # Test suite
├── package.json
└── README.md
```

## API Key

The OpenWeatherMap API key is configured in `src/api.js`. The current key is active and ready to use.

## Error Messages

The CLI provides helpful error messages for common issues:

- **City not found**: "City 'xyz' not found. Please check the spelling."
- **Invalid city input**: "City name is required and must be a non-empty string"
- **Network error**: "Network error: [error details]"
- **Invalid API key**: "Invalid API key"
- **API error**: "API Error: [error details]"

## Notes

- The CLI uses metric units (Celsius, m/s)
- Wind speed is displayed in meters per second
- Pressure is displayed in hectopascals (hPa)
- All requests are made via HTTPS
- No external dependencies required
