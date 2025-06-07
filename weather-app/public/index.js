let MAPTILER_API_KEY = '';
let WEATHER_API_KEY = '';

fetch('/api/keys')
    .then(res => res.json())
    .then(keys => {
    MAPTILER_API_KEY = keys.maptiler;
    WEATHER_API_KEY = keys.weather;

    maptilersdk.config.apiKey = MAPTILER_API_KEY;

    // Re-initialize the map *after* setting the API key
    initApp();
    }
);

function initApp(){

    const weatherLayers = {
    "precipitation": {
        "layer": null,
        "value": "value",
        "units": " mm"
    },
    "pressure": {
        "layer": null,
        "value": "value",
        "units": " hPa"
    },
    "radar": {
        "layer": null,
        "value": "value",
        "units": " dBZ"
    },
    "temperature": {
        "layer": null,
        "value": "value",
        "units": "°"
    },
    "wind": {
        "layer": null,
        "value": "speedMetersPerSecond",
        "units": " m/s"
    }
    };

    const map = (window.map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.BACKDROP,  // stylesheet location
    zoom: 0,
    center: [0, 0], // Central Africa
    maxZoom: 11.9,
    hash: true,
    projectionControl: true,
    projection: 'globe'
    }));

    //       map._controls
    //   .filter(ctrl => ctrl.constructor.name === 'GeolocateControl')
    //   .forEach(ctrl => map.removeControl(ctrl));


    const initWeatherLayer = "wind";
    const timeInfoContainer = document.getElementById("time-info");
    const timeTextDiv = document.getElementById("time-text");
    const timeSlider = document.getElementById("time-slider");
    const playPauseButton = document.getElementById("play-pause-bt");
    const pointerDataDiv = document.getElementById("pointer-data");
    let pointerLngLat = null;
    let activeLayer = null;
    let isPlaying = false;
    let currentTime = null;

    timeSlider.addEventListener("input", (evt) => {
    const weatherLayer = weatherLayers[activeLayer]?.layer;
    if (weatherLayer) {
        weatherLayer.setAnimationTime(parseInt(timeSlider.value / 1000));
    }
    });

    // When clicking on the play/pause
    playPauseButton.addEventListener("click", () => {
    const weatherLayer = weatherLayers[activeLayer]?.layer;
    if (weatherLayer) {
        if (isPlaying) {
        pauseAnimation(weatherLayer);
        } else {
        playAnimation(weatherLayer);
        }
    }
    });

    function pauseAnimation(weatherLayer) {
    weatherLayer.animateByFactor(0);
    playPauseButton.innerText = "Play 3600x";
    isPlaying = false;
    }

    function playAnimation(weatherLayer) {
    weatherLayer.animateByFactor(3600);
    playPauseButton.innerText = "Pause";
    isPlaying = true;
    }

    map.on('load', function () {
    map.setPaintProperty("Water", 'fill-color', "rgba(0, 0, 0, 0.4)");
    initWeatherMap(initWeatherLayer);
    });

    map.on('mouseout', function(evt) {
    if (!evt.originalEvent.relatedTarget) {
        pointerDataDiv.innerText = "";
        pointerLngLat = null;
    }
    });

    function updatePointerValue(lngLat) {
    if (!lngLat) return;
    pointerLngLat = lngLat;
    const weatherLayer = weatherLayers[activeLayer]?.layer;
    const weatherLayerValue = weatherLayers[activeLayer]?.value;
    const weatherLayerUnits = weatherLayers[activeLayer]?.units;
    if (weatherLayer) {
        const value = weatherLayer.pickAt(lngLat.lng, lngLat.lat);
        if (!value) {
        pointerDataDiv.innerText = "";
        return;
        }
        pointerDataDiv.innerText = `${value[weatherLayerValue].toFixed(1)}${weatherLayerUnits}`
    }
    }

    map.on('mousemove', (e) => {
    updatePointerValue(e.lngLat);
    });

    document.getElementById('buttons').addEventListener('click', function (event) {
    // Change layer based on button id
    changeWeatherLayer(event.target.id);
    });

    function changeWeatherLayer(type) {
    if (type !== activeLayer) {
        if (map.getLayer(activeLayer)) {
        const activeWeatherLayer = weatherLayers[activeLayer]?.layer;
        if (activeWeatherLayer) {
            currentTime = activeWeatherLayer.getAnimationTime();
            map.setLayoutProperty(activeLayer, 'visibility', 'none');
        }
        }
        activeLayer = type;
        const weatherLayer = weatherLayers[activeLayer].layer || createWeatherLayer(activeLayer);
        if (map.getLayer(activeLayer)) {
        map.setLayoutProperty(activeLayer, 'visibility', 'visible');
        } else {
        map.addLayer(weatherLayer, 'Water');
        }
        changeLayerLabel(activeLayer);
        activateButton(activeLayer);
        changeLayerAnimation(weatherLayer);
        return weatherLayer;
    }
    }

    function activateButton(activeLayer) {
    const buttons = document.getElementsByClassName('button');
    for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];
        if (btn.id === activeLayer) {
        btn.classList.add('active');
        } else {
        btn.classList.remove('active');
        }
    }
    }

    function changeLayerAnimation(weatherLayer) {
    weatherLayer.setAnimationTime(parseInt(timeSlider.value / 1000));
    if (isPlaying) {
        playAnimation(weatherLayer);
    } else {
        pauseAnimation(weatherLayer);
    }
    }

    function createWeatherLayer(type){
    let weatherLayer = null;
    switch (type) {
        case 'precipitation':
        weatherLayer = new maptilerweather.PrecipitationLayer({id: 'precipitation'});
        break;
        case 'pressure':
        weatherLayer = new maptilerweather.PressureLayer({
            opacity: 0.8,
            id: 'pressure'
        });
        break;
        case 'radar':
        weatherLayer = new maptilerweather.RadarLayer({
            opacity: 0.8,
            id: 'radar'
        });
        break;
        case 'temperature':
        weatherLayer = new maptilerweather.TemperatureLayer({
            colorramp: maptilerweather.ColorRamp.builtin.TEMPERATURE_3,
            id: 'temperature'
        });
        break;
        case 'wind':
        weatherLayer = new maptilerweather.WindLayer({id: 'wind'});
        break;
    }

    // Called when the animation is progressing
    weatherLayer.on("tick", event => {
        refreshTime();
        updatePointerValue(pointerLngLat);
    });

    // Called when the time is manually set
    weatherLayer.on("animationTimeSet", event => {
        refreshTime();
    });

    // Event called when all the datasource for the next days are added and ready.
    // From now on, the layer nows the start and end dates.
    weatherLayer.on("sourceReady", event => {
        const startDate = weatherLayer.getAnimationStartDate();
        const endDate = weatherLayer.getAnimationEndDate();
        if (timeSlider.min > 0){
        weatherLayer.setAnimationTime(currentTime);
        changeLayerAnimation(weatherLayer);
        } else {
        const currentDate = weatherLayer.getAnimationTimeDate();
        timeSlider.min = +startDate;
        timeSlider.max = +endDate;
        timeSlider.value = +currentDate;
        }
    });

    weatherLayers[type].layer = weatherLayer;
    return weatherLayer;
    }

    // Update the date time display
    function refreshTime() {
    const weatherLayer = weatherLayers[activeLayer]?.layer;
    if (weatherLayer) {
        const d = weatherLayer.getAnimationTimeDate();
        timeTextDiv.innerText = d.toString();
        timeSlider.value = +d;
    }
    }

    function changeLayerLabel(type) {
    document.getElementById("variable-name").innerText = type;
    }

    function initWeatherMap(type) {
    const weatherLayer = changeWeatherLayer(type);
    }

    async function searchCityWeather() {
    const city = document.getElementById('citySearch').value.trim();
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=no`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

    //   const output = `${data.location.name}, ${data.location.country}<br><img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}" style="width: 24px; vertical-align: middle;"> ${data.current.temp_c}°C, ${data.current.condition.text}`;
        document.getElementById('current-location').innerText = `${data.location.name}, ${data.location.country}`;
        document.getElementById('current-condition').innerHTML = `<img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}" style="width: 24px; vertical-align: middle;"> ${data.current.temp_c}°C, ${data.current.condition.text}`;
        document.getElementById('citySearch').value = '';

        // Center map on search result
        centerMapOnLocation(data.location.lon, data.location.lat);
        await getForecast(data.location.name);
        const currentSummary = document.getElementById('current-summary');
        currentSummary.style.display = 'block';
        currentSummary.style.zIndex = '3';       
    } catch (error) {
        document.getElementById('searchResult').innerText = error.message;
    }
    }

    async function getForecast(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=no`;
    const res = await fetch(url);
    const forecast = await res.json();

    if (!forecast.forecast) return;

    const current = forecast.current;
    const summary = `
        <div>Feels Like: ${current.feelslike_c}°C</div>
        <div>Wind: ${current.wind_kph} km/h ${current.wind_dir}</div>
        <div>UV: ${current.uv}</div>
        <div>Visibility: ${current.vis_km} km</div>
        <div>Humidity: ${current.humidity}%</div>
    `;
    document.getElementById('current-extra').innerHTML = summary;

    let table = '<h4 style="margin-top:1rem; font-size: 1rem;">Forecast</h4>';
    table += '<table style="width:100%; color:white; border-collapse: collapse;">';
    table += `<thead><tr>
        <th style="border-bottom: 1px solid #555; padding: 10px;">Day</th>
        <th style="border-bottom: 1px solid #555; padding: 10px;">Condition</th>
        <th style="border-bottom: 1px solid #555; padding: 10px;">High</th>
        <th style="border-bottom: 1px solid #555; padding: 10px;">Low</th>
    </tr></thead><tbody>`;

    forecast.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        table += `<tr>
        <td style="text-align: center; padding: 10px;">${dayName}</td>
        <td style="text-align: center; padding: 10px;">
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" style="width: 24px; vertical-align: middle;"> ${day.day.condition.text}
        </td>
        <td style="text-align: center; padding: 10px;">${day.day.maxtemp_c}°C</td>
        <td style="text-align: center; padding: 10px;">${day.day.mintemp_c}°C</td>
        </tr>`;
    });

        table += '</tbody></table>';
        document.getElementById('forecastResult').innerHTML = table;
    }
    document.getElementById("citySearch").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchCityWeather();
    }
    });
    
    function centerMapOnLocation(lng, lat) {
    map.flyTo({
        center: [lng, lat],
        zoom: 11.9,
        bearing: 0,
        pitch: 90,
        speed: 1.9,
        curve: 1.42,
        easing: t => t
    });
}
}