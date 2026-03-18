// Service to handle data fetching from NOAA and NWS
const PROXY_URL = "https://api.allorigins.win/get?url=";

export async function fetchBuoyData(stationId = "45005") {
  const url = `https://www.ndbc.noaa.gov/data/realtime2/${stationId}.txt`;
  const res = await fetch(`${PROXY_URL}${encodeURIComponent(url)}`);
  const data = await res.json();
  if (!data.contents) throw new Error("No data received");
  return parseNdbcData(data.contents, stationId);
}

export async function fetchForecast(zoneId = "LEZ148") {
  const url = `https://tgftp.nws.noaa.gov/data/forecasts/marine/near_shore/le/${zoneId.toLowerCase()}.txt`;
  const res = await fetch(`${PROXY_URL}${encodeURIComponent(url)}`);
  const data = await res.json();
  if (!data.contents) throw new Error("No forecast received");
  return parseNwsForecast(data.contents);
}

export async function fetchSunriseSunset(lat = 41.865, lng = -80.789) {
  try {
    const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
    const data = await res.json();
    if (data.status !== "OK") throw new Error("Failed to fetch sun data");
    return {
      sunrise: new Date(data.results.sunrise),
      sunset: new Date(data.results.sunset)
    };
  } catch (e) {
    console.error("Sunrise/Sunset fetch failed", e);
    return null;
  }
}

function parseNdbcData(text, stationId) {
  const lines = text.trim().split('\n');
  if (lines.length < 3) return null;
  const headers = lines[0].trim().split(/\s+/);
  const latest = lines[2].trim().split(/\s+/);
  
  const getValue = (name) => {
    const idx = headers.indexOf(name);
    if (idx === -1 || !latest[idx] || latest[idx] === 'MM') return null;
    return parseFloat(latest[idx]);
  };

  const toFahrenheit = (c) => (c !== null ? (c * 9/5 + 32).toFixed(1) : null);
  const toKnots = (ms) => (ms !== null ? (ms * 1.94384).toFixed(1) : null);
  const toFeet = (m) => (m !== null ? (m * 3.28084).toFixed(1) : null);

  return {
    stationId,
    timestamp: new Date().toISOString(),
    windDirection: getValue('WDIR'),
    windSpeed: toKnots(getValue('WSPD')),
    windGust: toKnots(getValue('GST')),
    waveHeight: toFeet(getValue('WVHT')),
    wavePeriod: getValue('DPD'),
    airTemp: toFahrenheit(getValue('ATMP')),
    waterTemp: toFahrenheit(getValue('WTMP')),
    pressure: getValue('PRES')
  };
}

function parseNwsForecast(content) {
  const periods = [];
  const matches = content.split(/\.(?=[A-Z]{3,})/);
  matches.forEach(m => {
    if (m.includes("...")) {
      const [name, ...descParts] = m.split("...");
      if (name && descParts.length > 0) {
        periods.push({ name, description: descParts.join(" ").trim() });
      }
    }
  });
  return periods.slice(0, 5);
}
