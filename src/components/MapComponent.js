import React, { useEffect, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import MicButton from './MicButton';
import { handleZoomCommand } from './zoomHandler';
import { handleVoiceCommand } from './voiceCommand';
import { busyTimings } from '../components/busyTimings';
import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';
import { showHighways,hideHighways } from './highwaysHandler';
import { addRainLayer , removeRainLayers } from './rainlayers';
import { addTemperatureLayer, removeWeatherLayers } from './weatherLayers'; // Path to your temperature layer handler file
import {   
  addTransportLayer, 
  addTransportDarkLayer,  
  removeTransportLayer, 
  removeTransportDarkLayer,
  addTopographicLayer, 
  addLandscapeLayer, 
  removeTopographicLayer, 
  removeLandscapeLayer,

} from './mapView';



const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [view, setView] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchMarker, setSearchMarker] = useState(null);
  const [busyInfo, setBusyInfo] = useState('');
  const [infoVisible, setInfoVisible] = useState(false); // State to manage the visibility of busy info
  const [clickCount, setClickCount] = useState(0); // State to track the number of clicks
  const [previousSearches, setPreviousSearches] = useState([]); // State to store previous searches

  useEffect(() => {
    const initialView = new View({
      center: fromLonLat([0, 0]),
      zoom: 2,
    });

    const initialMap = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: initialView,
      controls: [],
    });

    setMap(initialMap);
    setView(initialView);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = fromLonLat([longitude, latitude]);
        setCurrentLocation(location);

        // Update the view to the user's current location
        initialView.setCenter(location);
        initialView.setZoom(14);
      },
      (error) => {
        console.error('Error getting location:', error);
        if (error.code === error.PERMISSION_DENIED) {
          alert('Please enable location services to use this feature.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert('Location services are not available.');
        } else if (error.code === error.TIMEOUT) {
          alert('Timeout: unable to retrieve location.');
        }
      }
    );

    return () => {
      if (initialMap) initialMap.setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (map && currentLocation) {
      const feature = new Feature({
        geometry: new Point(currentLocation),
      });

      const vectorSource = new VectorSource({ features: [feature] });
      const layer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: 'rgba(0, 0, 255, 0.6)' }),
            stroke: new Stroke({ color: 'blue', width: 2 }),
          }),
        }),
      });

      map.addLayer(layer);
    }
  }, [map, currentLocation]);

  const handleSearch = () => {
    if (searchLocation && map) {
      // Save the search location to the history
      setPreviousSearches(prev => [searchLocation, ...prev.slice(0, 4)]); // Keep the last 5 searches

      // Get the user's current location for prioritizing nearby locations
      const [currentLon, currentLat] = fromLonLat([currentLocation[0], currentLocation[1]]).toString().split(',').map(Number);

      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}&limit=5&addressdetails=1&extratags=1&priority=1&lat=${currentLat}&lon=${currentLon}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const lon = parseFloat(data[0].lon);
            const lat = parseFloat(data[0].lat);
            const newCenter = fromLonLat([lon, lat]);

            if (map && map.getView()) {
              const view = map.getView();
              view.setCenter(newCenter);
              view.setZoom(12);
            }

            // Remove previous search marker if exists
            if (searchMarker) {
              map.removeLayer(searchMarker);
            }

            const feature = new Feature({
              geometry: new Point(newCenter),
            });

            const vectorSource = new VectorSource({ features: [feature] });
            const layer = new VectorLayer({
              source: vectorSource,
              style: new Style({
                image: new CircleStyle({
                  radius: 10,
                  fill: new Fill({ color: 'rgba(255, 0, 0, 0.6)' }),
                  stroke: new Stroke({ color: 'red', width: 2 }),
                }),
              }),
            });

            map.addLayer(layer);
            setSearchMarker(layer);

            // Add click event listener to the marker
            const selectInteraction = new Select({
              condition: click,
              layers: [layer],
            });

            selectInteraction.on('select', (event) => {
              const selectedFeature = event.selected[0];
              if (selectedFeature) {
                const locationName = searchLocation.toLowerCase();
                const busyInfo = Object.keys(busyTimings).find(key => locationName.includes(key.toLowerCase()));

                // Toggle busy info visibility based on click count
                if (clickCount % 2 === 0) {
                  setBusyInfo(busyInfo ? busyTimings[busyInfo] : 'No busy timing info available');
                  setInfoVisible(true);
                } else {
                  setInfoVisible(false);
                }

                setClickCount(prevCount => prevCount + 1); // Increment click count
              }
            });

            map.addInteraction(selectInteraction);
          } else {
            alert('Location not found');
          }

          // Hide suggestions after search
          setShowSuggestions(false);
        })
        .catch((error) => {
          console.error('Error fetching location:', error);
        });
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchLocation(query);

    if (query.length > 2) {
      const [currentLon, currentLat] = fromLonLat([currentLocation[0], currentLocation[1]]).toString().split(',').map(Number);

      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&addressdetails=1&extratags=1&priority=1&lat=${currentLat}&lon=${currentLon}`)
        .then((response) => response.json())
        .then((data) => {
          const filteredSuggestions = data.filter(d => d.display_name.toLowerCase().includes(query.toLowerCase()));
          setSuggestions([...previousSearches.filter(search => search.toLowerCase().includes(query.toLowerCase())), ...filteredSuggestions]);
          setShowSuggestions(true);
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const searchLocationLower = searchLocation.toLowerCase();
  
      if (searchLocationLower.startsWith('zoom in to') ||
          searchLocationLower.startsWith('zoom into ') ||
          searchLocationLower.startsWith('zoom out from') ||
          searchLocationLower.startsWith('zoom out of') ||
          searchLocationLower.startsWith('zoom out on') ||
          searchLocationLower.startsWith('zoom to')) {
        handleZoomCommand(searchLocation, map); // Handles all zoom in/out commands
  
      } else if (searchLocationLower === 'show highways') {
        showHighways(map);
  
      } else if (searchLocationLower === 'show temperature ') {
        addTemperatureLayer(map); // Adds the temperature layer
  
      } else if (searchLocationLower === 'show 3d landmarks') {
        handleVoiceCommand('show 3d landmarks', map, view);
  
      } else if (searchLocationLower === 'show rain') {
        addRainLayer(map); // Adds the rain layer
  
      } else if (searchLocationLower === 'remove rain') {
        removeRainLayers(map); // Removes the rain layer
  
      } else if (searchLocationLower === 'remove temperature') {
        removeWeatherLayers(map); // Removes the temperature layer
  
      } else if (searchLocationLower === 'remove highways') {
        hideHighways(map); // Removes the highways layer
  
      } else if (searchLocationLower === 'show topographic layer') {
        addTopographicLayer(map); // Adds the topographic layer
  
      } else if (searchLocationLower === 'remove topographic layer') {
        removeTopographicLayer(map); // Removes the topographic layer
  
      } else if (searchLocationLower === 'show landscape layer') {
        addLandscapeLayer(map); // Adds the landscape layer
  
      } else if (searchLocationLower === 'remove landscape layer') {
        removeLandscapeLayer(map); // Removes the landscape layer
  
      } else if (searchLocationLower === 'show transport layer') {
        addTransportLayer(map); // Adds the transport layer
  
      } else if (searchLocationLower === 'remove transport layer') {
        removeTransportLayer(map); // Removes the transport layer
  
      } else if (searchLocationLower === 'change to dark mode') {
        addTransportDarkLayer(map); // Adds the transport dark mode layer
  
      } else if (searchLocationLower === 'remove dark mode') {
        removeTransportDarkLayer(map); // Removes the dark mode layer
  
      } else {
        handleSearch();
      }
    }
  };
  
  
  
  
  

  const handleSuggestionClick = (suggestion) => {
    setSearchLocation(suggestion.display_name);
    setShowSuggestions(false);
    handleSearch();
  };

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>

      <input
        type="text"
        id="location-input"
        value={searchLocation}
        placeholder="Search location..."
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        style={{
          position: 'absolute',
          top: '10px',
          right: '60px',
          padding: '6px',
          fontSize: '17px',
          borderRadius: '4px',
          zIndex: 100,
          width: '300px',
        }}
      />

      <button
        onClick={handleSearch}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '6px 12px',
          fontSize: '17px',
          borderRadius: '4px',
          zIndex: 100,
        }}
      >
        Search
      </button>

      <MicButton
        map={map}
        onResult={(result) => {
          setSearchLocation(result);
          handleVoiceCommand(result, map, view);
        }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '380px',
          zIndex: 100,
        }}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '40px',
            right: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            zIndex: 100,
            width: '300px',
            listStyle: 'none',
            padding: '0',
            margin: '0',
            maxHeight: '150px',
            overflowY: 'auto',
          }}
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #ddd',
              }}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}

      {infoVisible && busyInfo && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: '10px', // Changed from right to left
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            zIndex: 100,
            width: '300px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <strong>Busy Timing Info:</strong>
          <p>{busyInfo}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
