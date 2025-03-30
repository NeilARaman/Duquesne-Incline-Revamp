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

async function initWeather() {
    try {
        const weatherData = await fetchWeatherData();
        updateWeatherDisplay(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayWeatherError();
    }
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

    const weatherIcon = getWeatherIcon(current.weather_code);
    const temperature = Math.round(current.temperature_2m);
    const conditions = getWeatherDescription(current.weather_code);

    currentWeatherDiv.innerHTML = `
        <div class="temperature">
            ${temperature}°C
            <div class="conditions">
                <i class="${weatherIcon}" aria-hidden="true"></i>
                <span>${conditions}</span>
            </div>
        </div>
        <div class="weather-details">
            <div>Humidity: ${current.relative_humidity_2m}%</div>
            <div>Wind: ${Math.round(current.wind_speed_10m)} mph</div>
        </div>
    `;
}

function updateForecast(daily) {
    const forecastList = document.querySelector('.forecast-list');
    if (!forecastList) return;

    const forecastHTML = daily.time.slice(1, 4).map((date, index) => {
        const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        const high = Math.round(daily.temperature_2m_max[index + 1]);
        const low = Math.round(daily.temperature_2m_min[index + 1]);
        const icon = getWeatherIcon(daily.weather_code[index + 1]);

        return `
            <li class="forecast-item">
                <span class="forecast-day">${day}</span>
                <span class="forecast-icon">
                    <i class="${icon}" aria-hidden="true"></i>
                </span>
                <span class="forecast-temp">${high}° / ${low}°</span>
            </li>
        `;
    }).join('');

    forecastList.innerHTML = forecastHTML;
}

function displayWeatherError() {
    const currentWeatherDiv = document.querySelector('.current-weather');
    const forecastList = document.querySelector('.forecast-list');

    const errorHTML = `
        <div class="weather-error">
            <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
            <p>Unable to load weather information. Please try again later.</p>
        </div>
    `;

    if (currentWeatherDiv) currentWeatherDiv.innerHTML = errorHTML;
    if (forecastList) forecastList.innerHTML = errorHTML;
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
        "hourly_units": {
            "time": "iso8601",
            "temperature_2m": "°C",
            "relative_humidity_2m": "%",
            "wind_speed_10m": "km/h"
        },
        "hourly": {
            "time": [
                "2023-05-16T00:00",
                "2023-05-16T01:00",
                "2023-05-16T02:00",
                "2023-05-16T03:00",
                "2023-05-16T04:00",
                "2023-05-16T05:00",
                "2023-05-16T06:00"
            ],
            "temperature_2m": [
                13.7,
                13.3,
                12.8,
                12.3,
                11.8,
                11.4,
                12.2
            ],
            "relative_humidity_2m": [
                82,
                83,
                86,
                85,
                88,
                88,
                84
            ],
            "wind_speed_10m": [
                3.2,
                3.0,
                3.3,
                3.1,
                3.2,
                3.0,
                3.5
            ]
        }
    };
}
