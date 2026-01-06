// weather.js - Weather API integration for the Duquesne Incline website
// Uses Open-Meteo API to get weather data for Pittsburgh

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initWeather();
});

const PITTSBURGH_COORDS = {
    latitude: 40.4406,
    longitude: -79.9959
};

// Sanitize text to prevent XSS attacks
function sanitizeText(text) {
    if (text === null || text === undefined) {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

// Validate that a value is a finite number
function isValidNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
}

async function initWeather() {
    try {
        const weatherData = await fetchWeatherData();
        if (!validateWeatherData(weatherData)) {
            throw new Error('Invalid weather data received');
        }
        updateWeatherDisplay(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayWeatherError();
    }
}

// Validate the structure of weather data from the API
function validateWeatherData(data) {
    if (!data || typeof data !== 'object') {
        return false;
    }

    // Validate current weather data
    if (!data.current || typeof data.current !== 'object') {
        return false;
    }

    const current = data.current;
    if (!isValidNumber(current.temperature_2m) ||
        !isValidNumber(current.relative_humidity_2m) ||
        !isValidNumber(current.wind_speed_10m) ||
        !isValidNumber(current.weather_code)) {
        return false;
    }

    // Validate daily forecast data
    if (!data.daily || typeof data.daily !== 'object') {
        return false;
    }

    const daily = data.daily;
    if (!Array.isArray(daily.time) ||
        !Array.isArray(daily.temperature_2m_max) ||
        !Array.isArray(daily.temperature_2m_min) ||
        !Array.isArray(daily.weather_code)) {
        return false;
    }

    return true;
}

async function fetchWeatherData() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${PITTSBURGH_COORDS.latitude}&longitude=${PITTSBURGH_COORDS.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America/New_York`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather API request failed');
        }
        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch weather data');
    }
}

function updateWeatherDisplay(data) {
    updateCurrentWeather(data.current);
    updateForecast(data.daily);
}

function updateCurrentWeather(current) {
    const currentWeatherDiv = document.querySelector('.current-weather');
    if (!currentWeatherDiv) return;

    const weatherCode = current.weather_code;
    const weatherIcon = getWeatherIcon(weatherCode);
    const temperature = Math.round(current.temperature_2m);
    const conditions = sanitizeText(getWeatherDescription(weatherCode));
    const humidity = Math.round(current.relative_humidity_2m);
    // Convert km/h to mph (API returns km/h by default)
    const windSpeedMph = Math.round(current.wind_speed_10m * 0.621371);

    // Build DOM elements instead of using innerHTML with untrusted data
    currentWeatherDiv.innerHTML = '';
    
    const tempDiv = document.createElement('div');
    tempDiv.className = 'temperature';
    tempDiv.textContent = `${temperature}°C`;

    const conditionsDiv = document.createElement('div');
    conditionsDiv.className = 'conditions';
    
    const iconElement = document.createElement('i');
    iconElement.className = weatherIcon;
    iconElement.setAttribute('aria-hidden', 'true');
    
    const conditionSpan = document.createElement('span');
    conditionSpan.textContent = conditions;
    
    conditionsDiv.appendChild(iconElement);
    conditionsDiv.appendChild(conditionSpan);
    tempDiv.appendChild(conditionsDiv);

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'weather-details';
    
    const humidityDiv = document.createElement('div');
    humidityDiv.textContent = `Humidity: ${humidity}%`;
    
    const windDiv = document.createElement('div');
    windDiv.textContent = `Wind: ${windSpeedMph} mph`;
    
    detailsDiv.appendChild(humidityDiv);
    detailsDiv.appendChild(windDiv);

    currentWeatherDiv.appendChild(tempDiv);
    currentWeatherDiv.appendChild(detailsDiv);
}

function updateForecast(daily) {
    const forecastList = document.querySelector('.forecast-list');
    if (!forecastList) return;

    // Clear existing content
    forecastList.innerHTML = '';

    // Get next 3 days (skip today at index 0)
    const daysToShow = Math.min(3, daily.time.length - 1);
    
    for (let i = 0; i < daysToShow; i++) {
        const dateIndex = i + 1;
        const dateStr = daily.time[dateIndex];
        
        if (!dateStr) continue;

        const day = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
        const high = Math.round(daily.temperature_2m_max[dateIndex]);
        const low = Math.round(daily.temperature_2m_min[dateIndex]);
        const weatherCode = daily.weather_code[dateIndex];
        const icon = getWeatherIcon(weatherCode);

        const li = document.createElement('li');
        li.className = 'forecast-item';

        const daySpan = document.createElement('span');
        daySpan.className = 'forecast-day';
        daySpan.textContent = sanitizeText(day);

        const iconSpan = document.createElement('span');
        iconSpan.className = 'forecast-icon';
        
        const iconElement = document.createElement('i');
        iconElement.className = icon;
        iconElement.setAttribute('aria-hidden', 'true');
        iconSpan.appendChild(iconElement);

        const tempSpan = document.createElement('span');
        tempSpan.className = 'forecast-temp';
        tempSpan.textContent = `${high}° / ${low}°`;

        li.appendChild(daySpan);
        li.appendChild(iconSpan);
        li.appendChild(tempSpan);
        forecastList.appendChild(li);
    }
}

function displayWeatherError() {
    const currentWeatherDiv = document.querySelector('.current-weather');
    const forecastList = document.querySelector('.forecast-list');

    const createErrorElement = () => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'weather-error';
        
        const iconElement = document.createElement('i');
        iconElement.className = 'fas fa-exclamation-circle';
        iconElement.setAttribute('aria-hidden', 'true');
        
        const messagePara = document.createElement('p');
        messagePara.textContent = 'Unable to load weather information. Please try again later.';
        
        errorDiv.appendChild(iconElement);
        errorDiv.appendChild(messagePara);
        return errorDiv;
    };

    if (currentWeatherDiv) {
        currentWeatherDiv.innerHTML = '';
        currentWeatherDiv.appendChild(createErrorElement());
    }
    
    if (forecastList) {
        forecastList.innerHTML = '';
        forecastList.appendChild(createErrorElement());
    }
}

function getWeatherIcon(code) {
    // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
    const weatherIcons = {
        0: 'fas fa-sun', // Clear sky
        1: 'fas fa-cloud-sun', // Mainly clear
        2: 'fas fa-cloud-sun', // Partly cloudy
        3: 'fas fa-cloud', // Overcast
        45: 'fas fa-smog', // Foggy
        48: 'fas fa-smog', // Depositing rime fog
        51: 'fas fa-cloud-rain', // Light drizzle
        53: 'fas fa-cloud-rain', // Moderate drizzle
        55: 'fas fa-cloud-rain', // Dense drizzle
        61: 'fas fa-cloud-rain', // Slight rain
        63: 'fas fa-cloud-rain', // Moderate rain
        65: 'fas fa-cloud-showers-heavy', // Heavy rain
        71: 'fas fa-snowflake', // Slight snow
        73: 'fas fa-snowflake', // Moderate snow
        75: 'fas fa-snowflake', // Heavy snow
        77: 'fas fa-snowflake', // Snow grains
        80: 'fas fa-cloud-rain', // Slight rain showers
        81: 'fas fa-cloud-rain', // Moderate rain showers
        82: 'fas fa-cloud-showers-heavy', // Violent rain showers
        85: 'fas fa-snowflake', // Slight snow showers
        86: 'fas fa-snowflake', // Heavy snow showers
        95: 'fas fa-bolt', // Thunderstorm
        96: 'fas fa-bolt', // Thunderstorm with slight hail
        99: 'fas fa-bolt', // Thunderstorm with heavy hail
    };
    return weatherIcons[code] || 'fas fa-cloud';
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light drizzle',
        53: 'Drizzle',
        55: 'Heavy drizzle',
        61: 'Light rain',
        63: 'Rain',
        65: 'Heavy rain',
        71: 'Light snow',
        73: 'Snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Light showers',
        81: 'Rain showers',
        82: 'Heavy showers',
        85: 'Snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown';
}

// Get fake weather data for testing purposes
function getFakeWeatherData() {
    return {
        "latitude": 40.44,
        "longitude": -79.99,
        "generationtime_ms": 0.2510547637939453,
        "utc_offset_seconds": -14400,
        "timezone": "America/New_York",
        "timezone_abbreviation": "EDT",
        "elevation": 232,
        "current_units": {
            "time": "iso8601",
            "interval": "seconds",
            "temperature_2m": "°C",
            "relative_humidity_2m": "%",
            "wind_speed_10m": "km/h",
            "weather_code": "wmo code"
        },
        "current": {
            "time": "2023-05-16T12:15",
            "interval": 900,
            "temperature_2m": 18.6,
            "relative_humidity_2m": 65,
            "wind_speed_10m": 11.9,
            "weather_code": 1
        },
        "daily_units": {
            "time": "iso8601",
            "temperature_2m_max": "°C",
            "temperature_2m_min": "°C",
            "weather_code": "wmo code"
        },
        "daily": {
            "time": [
                "2023-05-16",
                "2023-05-17",
                "2023-05-18",
                "2023-05-19",
                "2023-05-20"
            ],
            "temperature_2m_max": [22.5, 24.1, 21.8, 19.5, 23.0],
            "temperature_2m_min": [12.3, 14.0, 13.2, 11.8, 12.5],
            "weather_code": [1, 2, 61, 3, 0]
        }
    };
}
