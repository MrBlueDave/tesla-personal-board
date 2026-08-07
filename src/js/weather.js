/**
 * LIVE WEATHER WIDGET (Powered by Open-Meteo API - Free, No Key)
 */

const DEFAULT_LOCATION = { name: "Roma", lat: 41.9028, lon: 12.4964 };
const STORAGE_KEY_LOCATION = 'tesla_board_weather_location';

const WEATHER_CODES = {
  0: { desc: "Sereno", icon: "sun" },
  1: { desc: "Prevalentemente Sereno", icon: "sun" },
  2: { desc: "Parzialmente Nuvoloso", icon: "cloud-sun" },
  3: { desc: "Coperto", icon: "cloud" },
  45: { desc: "Nebbia", icon: "cloud-fog" },
  48: { desc: "Nebbia con brina", icon: "cloud-fog" },
  51: { desc: "Pioggerella leggera", icon: "cloud-drizzle" },
  53: { desc: "Pioggerella moderata", icon: "cloud-drizzle" },
  55: { desc: "Pioggerella densa", icon: "cloud-drizzle" },
  61: { desc: "Pioggia leggera", icon: "cloud-rain" },
  63: { desc: "Pioggia moderata", icon: "cloud-rain" },
  65: { desc: "Pioggia forte", icon: "cloud-rain" },
  71: { desc: "Neve leggera", icon: "snowflake" },
  73: { desc: "Neve moderata", icon: "snowflake" },
  75: { desc: "Neve forte", icon: "snowflake" },
  80: { desc: "Rovesci di pioggia", icon: "cloud-rain" },
  95: { desc: "Temporale", icon: "cloud-lightning" }
};

export function getStoredLocation() {
  const stored = localStorage.getItem(STORAGE_KEY_LOCATION);
  return stored ? JSON.parse(stored) : DEFAULT_LOCATION;
}

export function saveLocation(locObj) {
  localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(locObj));
}

const WEATHER_CACHE_KEY = 'tesla_board_weather_cache';
const WEATHER_CACHE_TTL = 20 * 60 * 1000; // 20 minutes
const WEATHER_MAX_RETRIES = 3;

function getCachedWeather() {
  try {
    const cached = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < WEATHER_CACHE_TTL) {
      return parsed.data;
    }
  } catch (e) { /* ignore */ }
  return null;
}

function setCachedWeather(data) {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch (e) { /* ignore */ }
}

export async function fetchLiveWeather(location = getStoredLocation(), _retryCount = 0) {
  // Return cached data if still fresh
  const cached = getCachedWeather();
  if (cached && _retryCount === 0) return cached;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Meteo API Network Error');
    const data = await response.json();
    
    const currentWeather = data.current_weather;
    const code = currentWeather.weathercode;
    const weatherMeta = WEATHER_CODES[code] || { desc: "Variabile", icon: "cloud" };

    const result = {
      temp: Math.round(currentWeather.temperature),
      windSpeed: currentWeather.windspeed,
      desc: weatherMeta.desc,
      icon: weatherMeta.icon,
      cityName: location.name
    };

    setCachedWeather(result);
    return result;
  } catch (error) {
    console.warn(`Weather fetch failed (attempt ${_retryCount + 1}/${WEATHER_MAX_RETRIES}):`, error.message);

    // Retry with exponential backoff
    if (_retryCount < WEATHER_MAX_RETRIES - 1) {
      const delay = Math.pow(2, _retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchLiveWeather(location, _retryCount + 1);
    }

    // Return stale cached data if available, else fallback
    try {
      const stale = localStorage.getItem(WEATHER_CACHE_KEY);
      if (stale) return JSON.parse(stale).data;
    } catch (e) { /* ignore */ }

    return {
      temp: "--",
      windSpeed: 0,
      desc: "N/D",
      icon: "cloud",
      cityName: location.name
    };
  }
}

export function initGeolocation(onSuccess) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // Try reverse geocode via Open-Meteo Geocoding / Nominatim
        try {
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${lat},${lon}&count=1`);
          const geoData = await geoRes.json();
          const city = (geoData.results && geoData.results[0]) ? geoData.results[0].name : "Posizione Auto";
          const newLoc = { name: city, lat, lon };
          saveLocation(newLoc);
          if (onSuccess) onSuccess(newLoc);
        } catch (e) {
          const newLoc = { name: "Posizione Auto", lat, lon };
          saveLocation(newLoc);
          if (onSuccess) onSuccess(newLoc);
        }
      },
      (error) => {
        console.log("Geolocation permission denied or unavailable:", error);
      }
    );
  }
}
