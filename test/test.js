const { isValidWeatherData, formatWeather } = require('../src/index');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

let testsPassed = 0;
let testsFailed = 0;

/**
 * Test assertion helper
 * @param {string} testName - Name of the test
 * @param {boolean} condition - Test condition
 * @param {string} message - Optional message
 */
function assert(testName, condition, message = '') {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    testsPassed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    if (message) console.log(`  ${message}`);
    testsFailed++;
  }
}

/**
 * Valid weather data for testing
 */
const validWeatherData = {
  name: 'London',
  sys: { country: 'GB' },
  main: {
    temp: 15,
    feels_like: 14,
    humidity: 70,
    pressure: 1013,
  },
  weather: [{ main: 'Cloudy' }],
  wind: { speed: 5.5 },
  clouds: { all: 60 },
};

// ============================================
// TEST CASE 1: Validate Valid Weather Data
// ============================================
console.log(`\n${colors.yellow}TEST CASE 1: Validate Valid Weather Data${colors.reset}`);
console.log('─'.repeat(50));

assert(
  'Valid weather data should pass validation',
  isValidWeatherData(validWeatherData) === true,
  'Expected valid data to return true'
);

// ============================================
// TEST CASE 2: Reject Invalid Weather Data
// ============================================
console.log(`\n${colors.yellow}TEST CASE 2: Reject Invalid Weather Data${colors.reset}`);
console.log('─'.repeat(50));

const invalidData = {
  name: 'Paris',
  // Missing required sys field
  main: { temp: 20, feels_like: 19, humidity: 65, pressure: 1015 },
  weather: [{ main: 'Sunny' }],
  wind: { speed: 3 },
  clouds: { all: 20 },
};

assert(
  'Invalid weather data should fail validation',
  isValidWeatherData(invalidData) === false,
  'Expected invalid data to return false'
);

// ============================================
// TEST CASE 3: Format Valid Weather Data
// ============================================
console.log(`\n${colors.yellow}TEST CASE 3: Format Valid Weather Data${colors.reset}`);
console.log('─'.repeat(50));

try {
  const formatted = formatWeather(validWeatherData);
  
  assert(
    'Formatted output should contain city name',
    formatted.includes('London'),
    'Expected "London" in output'
  );

  assert(
    'Formatted output should contain temperature',
    formatted.includes('15°C'),
    'Expected "15°C" in output'
  );

  assert(
    'Formatted output should contain humidity',
    formatted.includes('70%'),
    'Expected "70%" in output'
  );

  assert(
    'Formatted output should contain weather condition',
    formatted.includes('Cloudy'),
    'Expected "Cloudy" in output'
  );
} catch (error) {
  assert('Weather formatting should not throw', false, error.message);
}

// ============================================
// TEST CASE 4: Handle Edge Cases
// ============================================
console.log(`\n${colors.yellow}TEST CASE 4: Handle Edge Cases${colors.reset}`);
console.log('─'.repeat(50));

// Null/undefined edge case
assert(
  'Null data should be rejected',
  isValidWeatherData(null) === false,
  'Expected null to return false'
);

// Empty object edge case
assert(
  'Empty object should be rejected',
  isValidWeatherData({}) === false,
  'Expected empty object to return false'
);

// Very high temperature edge case
const extremeTempData = {
  ...validWeatherData,
  main: { ...validWeatherData.main, temp: 55, feels_like: 56 },
};

try {
  const formatted = formatWeather(extremeTempData);
  assert(
    'Should handle extreme temperatures (55°C)',
    formatted.includes('55°C'),
    'Expected "55°C" in output'
  );
} catch (error) {
  assert('Should handle extreme temperatures', false, error.message);
}

// ============================================
// TEST RESULTS
// ============================================
console.log(`\n${colors.yellow}Test Results Summary${colors.reset}`);
console.log('─'.repeat(50));
console.log(`${colors.green}Passed: ${testsPassed}${colors.reset}`);
console.log(`${colors.red}Failed: ${testsFailed}${colors.reset}`);
console.log(`Total: ${testsPassed + testsFailed}\n`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log(`${colors.green}All tests passed!${colors.reset}\n`);
  process.exit(0);
}
