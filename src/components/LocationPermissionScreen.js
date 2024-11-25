import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LocationPermissionScreen.css'; // Import CSS for styling

function LocationPermissionScreen() {
  const navigate = useNavigate();

  const handleAllowLocation = () => {
    // Request for geolocation access
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Navigate to map screen and pass latitude and longitude as state
          navigate('/map', { state: { latitude, longitude } });
        },
        (error) => {
          alert('Failed to get your location. Please allow location access.');
          console.error(error);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleDenyLocation = () => {
    alert('Location access is required to use this app.');
  };

  return (
    <div className="location-permission-screen">
      <h1>Enable Location Services 📍</h1>
      <p>
        To provide you with real-time public transport information, we need to access your location.
      </p>
      
      <div className="location-image-container">
        <img src="/location-image.jpg" alt="Location Access" className="location-image" /> {/* Add your image */}
      </div>

      <p>
        Allow GoRute to access your device's location so we can show you nearby bus stops, routes, and estimated arrival times.
      </p>

      <div className="button-group">
        <button className="allow-button" onClick={handleAllowLocation}>Allow Location Access</button>
        <button className="deny-button" onClick={handleDenyLocation}>Don't Allow</button>
      </div>
    </div>
  );
}

export default LocationPermissionScreen;
