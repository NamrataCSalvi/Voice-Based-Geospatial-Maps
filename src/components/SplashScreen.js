import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Set a timeout to navigate to the welcome screen after 3 seconds
    const timer = setTimeout(() => {
      navigate('/welcome'); // Update to navigate to the welcome screen
    }, 3000);

    // Clear timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="logo-container">
          <img src="/logo.jpg" alt="App Logo" className="splash-logo" />
        </div>
        <div className="splash-text">
          <h1>Welcome to GoRute!🚗🏞</h1>
          <p>Explore voice-based maps, live updates on temperature, rain predictions, and busy timings.</p>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
