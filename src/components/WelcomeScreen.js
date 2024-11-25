import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeScreen.css'; // Import CSS for styling

function WelcomeScreen() {
  const navigate = useNavigate();

  // Navigate when the user clicks anywhere on the screen
  const handleScreenClick = () => {
    navigate('/location-permission');
  };

  // Prevent screen navigation when the button is clicked
  const handleGetStarted = (event) => {
    event.stopPropagation(); // Prevents the screen click from firing
    navigate('/location-permission'); // Navigate to the location permission screen
  };

  return (
    <div className="welcome-screen" onClick={handleScreenClick}>
      <h1>Welcome to GoRute!🚗🏞</h1>
      <p className="intro-text">
        Discover voice-based maps, live updates on temperature, rain predictions, and crowd detection.
        Say goodbye to waiting and hello to efficiency!
      </p>
      
      <div className="feature">
        <img src="/efficiency.png" alt="Efficient Travel" className="feature-icon" />
        <div className="feature-content">
          <h2>Efficient Travel</h2>
          <p>No more long waits—arrive on time and save time with real-time updates and intelligent navigation.</p>
        </div>
      </div>

      <div className="feature">
        <img src="/smartphone.png" alt="User-Friendly App" className="feature-icon" />
        <div className="feature-content">
          <h2>User-Friendly App</h2>
          <p>Enjoy an easy-to-use interface for hassle-free navigation.</p>
        </div>
      </div>

      <div className="feature">
        <img src="/thermometer.png" alt="Live Temperature Updates" className="feature-icon" />
        <div className="feature-content">
          <h2>Live Temperature Updates</h2>
          <p>Get instant temperature readings to plan your day better.</p>
        </div>
      </div>

      <div className="feature">
        <img src="/forecast.png" alt="Rain Predictions" className="feature-icon" />
        <div className="feature-content">
          <h2>Rain Predictions</h2>
          <p>Stay prepared with accurate rain forecasts.</p>
        </div>
      </div>

      <div className="feature">
        <img src="/gathering.png" alt="Crowd Detection" className="feature-icon" />
        <div className="feature-content">
          <h2>Crowd Detection</h2>
          <p>Navigate through crowded areas with ease.</p>
        </div>
      </div>

      {/* Button click stops the propagation of the event to prevent unwanted navigation */}
      <button className="get-started-button" onClick={handleGetStarted}>Get Started</button>
    </div>
  );
}

export default WelcomeScreen;
