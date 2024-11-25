import { fromLonLat } from 'ol/proj';
import { showHighways, hideHighways } from './highwaysHandler';
import { addTemperatureLayer, removeWeatherLayers } from './weatherLayers';

export const handleVoiceCommand = (command, map, view) => {
  if (!command || !map || !view) return;

  const commandLower = command.toLowerCase().trim();

  if (commandLower.startsWith('zoom in to') || commandLower.startsWith('search for')) {
    // Hide highways when a new location search is performed
    hideHighways(map);
    removeWeatherLayers(map); // Hide weather layers during a location search

    const location = commandLower.replace('zoom in to', '').replace('search for', '').trim();
    if (location) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}&limit=1`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const lon = parseFloat(data[0].lon);
            const lat = parseFloat(data[0].lat);
            const newCenter = fromLonLat([lon, lat]);

            view.setCenter(newCenter);
            view.setZoom(18); // Adjust zoom level as needed
          } else {
            console.warn(`Location "${location}" not found.`);
          }
        })
        .catch((error) => {
          console.error('Error fetching location:', error);
        });
    } else {
      console.warn('No location provided for zoom command.');
    }
  } else if (commandLower === 'show highways') {
    // Show highways only when specifically requested
    showHighways(map);
  } else if (commandLower === 'show temperature') {
    // Hide highways and remove existing weather layers before showing new ones
    hideHighways(map);
    removeWeatherLayers(map);

    // Add temperature layer for the current view
    addTemperatureLayer(map);
    console.log(`Temperature layer added.`);
  } else {
    console.warn(`Unrecognized command: "${command}"`);
  }
};
