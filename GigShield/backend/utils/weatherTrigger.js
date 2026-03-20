const cityCoords = {
    'Mumbai': { lat: 19.0760, lon: 72.8777 },
    'Delhi': { lat: 28.7041, lon: 77.1025 },
    'Chennai': { lat: 13.0827, lon: 80.2707 },
    'Bangalore': { lat: 12.9716, lon: 77.5946 },
    'Pune': { lat: 18.5204, lon: 73.8567 },
    'Hyderabad': { lat: 17.3850, lon: 78.4867 }
};

const checkDisruption = async (location, useMockLiveOverride = false) => {
    const coords = cityCoords[location];

    if (!coords) {
        // Fallback logic if city not mapped
        return { isDisrupted: false, disruptionType: 'None' };
    }

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,precipitation`;
        const response = await fetch(url);
        const data = await response.json();

        let temp = data.current.temperature_2m;
        let rain = data.current.precipitation;

        // For demo purposes, allow forcing a disruption if weather is currently mild
        // so the prototype always works when tested, but uses the real API format
        if (useMockLiveOverride) {
            temp = Math.random() > 0.5 ? 42 : temp;
            rain = Math.random() > 0.5 ? 15 : rain;
        }

        if (temp >= 40) {
            return { isDisrupted: true, disruptionType: 'Extreme Heat', severity: temp, detail: `${temp}°C recorded` };
        }
        if (rain >= 10) {
            return { isDisrupted: true, disruptionType: 'Heavy Rain', severity: rain, detail: `${rain}mm rain recorded` };
        }

        return { isDisrupted: false, disruptionType: 'None', detail: `Temp: ${temp}°C, Rain: ${rain}mm` };
    } catch (err) {
        console.error('Weather API Error:', err);
        return { isDisrupted: false, disruptionType: 'API Error' };
    }
};

module.exports = { checkDisruption, cityCoords };
