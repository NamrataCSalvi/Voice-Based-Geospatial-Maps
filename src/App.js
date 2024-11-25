// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import LocationPermissionScreen from './components/LocationPermissionScreen';
import MapComponent from './components/MapComponent';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Splash screen route */}
          <Route path="/" element={<SplashScreen />} />

          {/* Welcome screen route */}
          <Route path="/welcome" element={<WelcomeScreen />} />

          {/* Location permission screen route */}
          <Route path="/location-permission" element={<LocationPermissionScreen />} />

          {/* Map screen route */}
          <Route path="/map" element={<MapComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
