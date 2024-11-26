// Import necessary OpenLayers modules
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';  // Importing fromLonLat for projections

// Replace this with your OpenWeatherMap API key
const apiKey = '';

// Define cities with their coordinates
const cities = {
  Thane: [72.9781, 19.2183],
  Mumbai: [72.8777, 19.0760],
  Nerul: [73.0297, 19.0330],
};

// Variable to hold the current weather layer
let currentWeatherLayer = null;

// Function to create and show the temperature range box
const createTemperatureRangeBox = () => {
  const rangeBoxHTML = `
    <div id="temperature-range" class="temperature-range">
      <div id="temperature-range-label">Temperature Range</div>
      <div id="temperature-range-content">Loading...</div>
      <div id="temperature-color-range">
        <div class="temp-color" style="background-color: blue;">Below 0°C</div>
        <div class="temp-color" style="background-color: lightblue;">0°C - 10°C</div>
        <div class="temp-color" style="background-color: green;">10°C - 20°C</div>
        <div class="temp-color" style="background-color: yellow;">20°C - 30°C</div>
        <div class="temp-color" style="background-color: orange;">30°C - 40°C</div>
        <div class="temp-color" style="background-color: red;">Above 40°C</div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', rangeBoxHTML);
};

// Function to update the temperature range box
const updateTemperatureRange = (minTemperature, maxTemperature) => {
  document.getElementById('temperature-range-content').textContent =
    `Min: ${minTemperature}°C - Max: ${maxTemperature}°C`;
};

// Function to remove the temperature range box
const removeTemperatureRangeBox = () => {
  const rangeBox = document.getElementById('temperature-range');
  if (rangeBox) {
    rangeBox.remove();
  }
};

// Function to add temperature layer (only this layer for now)
export const addTemperatureLayer = (map) => {
  // Remove any existing weather layer before adding a new one
  if (currentWeatherLayer) {
    removeWeatherLayers(map);  // Also removes the range box
  }

  // Create the temperature layer
  currentWeatherLayer = new TileLayer({
    source: new XYZ({
      url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      maxZoom: 10, // Adjust as needed
    }),
  });

  // Add the temperature layer to the map
  map.addLayer(currentWeatherLayer);

  // Show the temperature range box
  createTemperatureRangeBox();
  updateTemperatureRange(-10, 40); // Update with actual temperature range if available
};

// Function to focus on a specific city
export const focusOnCity = (map, view, cityName) => {
  const city = cities[cityName];
  if (city) {
    view.setCenter(fromLonLat(city));  // Use fromLonLat for proper projection
    view.setZoom(10); // Adjust zoom level as needed
  } else {
    console.warn(`City ${cityName} not found in the list.`);
  }
};

// Function to remove the current weather layer
export const removeWeatherLayers = (map) => {
  if (currentWeatherLayer) {
    map.removeLayer(currentWeatherLayer);
    currentWeatherLayer = null;  // Reset the weather layer
    removeTemperatureRangeBox();  // Remove the temperature range box
  }
};
