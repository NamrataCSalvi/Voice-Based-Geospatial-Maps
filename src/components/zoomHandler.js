import { fromLonLat } from 'ol/proj';

/**
 * Handles zooming in or out to a specific location based on the input command.
 * @param {string} command - The input command containing the location and zoom direction.
 * @param {object} map - The OpenLayers map instance.
 * @returns {void}
 */
export const handleZoomCommand = (command, map) => {
  const commandLower = command.toLowerCase();

  // Define command patterns
  const zoomInPatterns = ['zoom in to', 'zoom into', 'zoom to'];
  const zoomOutPatterns = ['zoom out from', 'zoom out of', 'zoom out on'];

  let zoomLevel = 17; // Default zoom level for zoom in

  // Check if the command includes zoom-in patterns
  if (zoomInPatterns.some(pattern => commandLower.startsWith(pattern))) {
    let location;
    if (commandLower.startsWith('zoom into')) {
      location = commandLower.replace('zoom into', '').trim();
    } else if (commandLower.startsWith('zoom to')) {
      location = commandLower.replace('zoom to', '').trim();
    } else {
      location = commandLower.replace(new RegExp(`^(${zoomInPatterns.join('|')})\\s*`), '').trim();
    }

    console.log('Location to zoom in to:', location); // Debug log

    // Fetch location coordinates from OpenStreetMap
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data); // Debug log

        if (data.length > 0) {
          const lon = parseFloat(data[0].lon);
          const lat = parseFloat(data[0].lat);
          const newCenter = fromLonLat([lon, lat]);

          console.log('New Center:', newCenter); // Debug log

          if (map && map.getView()) {
            const view = map.getView();
            view.setCenter(newCenter);
            view.setZoom(zoomLevel);
          } else {
            console.error('Map or View is not available');
          }
        } else {
          console.warn('Location not found in command:', location);
        }
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
      });

  // Check if the command includes zoom-out patterns
  } else if (zoomOutPatterns.some(pattern => commandLower.startsWith(pattern))) {
    let location;
    if (commandLower.startsWith('zoom out from')) {
      location = commandLower.replace('zoom out from', '').trim();
    } else if (commandLower.startsWith('zoom out of')) {
      location = commandLower.replace('zoom out of', '').trim();
    } else {
      location = commandLower.replace(new RegExp(`^(${zoomOutPatterns.join('|')})\\s*`), '').trim();
    }

    zoomLevel = 14; // Adjust zoom level for zoom out

    console.log('Location to zoom out from:', location); // Debug log

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data); // Debug log

        if (data.length > 0) {
          const lon = parseFloat(data[0].lon);
          const lat = parseFloat(data[0].lat);
          const newCenter = fromLonLat([lon, lat]);

          console.log('New Center:', newCenter); // Debug log

          if (map && map.getView()) {
            const view = map.getView();
            view.setCenter(newCenter);
            view.setZoom(zoomLevel);
          } else {
            console.error('Map or View is not available');
          }
        } else {
          console.warn('Location not found in command:', location);
        }
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
      });
  }
};
