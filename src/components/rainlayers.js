// Import necessary OpenLayers modules
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';  // Importing fromLonLat for projections

// Replace this with your OpenWeatherMap API key
const apiKey = '02ae08d812696b42721efe383f6c7e42';

// Define cities with their coordinates
const cities = {
  Thane: [72.9781, 19.2183],
  Mumbai: [72.8777, 19.0760],
  Nerul: [73.0297, 19.0330],
};

// Variable to hold the current rain layer
let currentRainLayer = null;

// Function to add rain prediction layer
export const addRainLayer = (map) => {
  // Remove any existing rain layer before adding a new one
  if (currentRainLayer) {
    map.removeLayer(currentRainLayer);
  }

  // Create the rain prediction layer
  currentRainLayer = new TileLayer({
    source: new XYZ({
      url: `https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=${apiKey}`,
      maxZoom: 10, // Adjust as needed
    }),
  });

  // Add the rain prediction layer to the map
  map.addLayer(currentRainLayer);
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

// Function to remove the current rain layer
export const removeRainLayers = (map) => {
  if (currentRainLayer) {
    map.removeLayer(currentRainLayer);
    currentRainLayer = null;  // Reset the rain layer
  }
};
