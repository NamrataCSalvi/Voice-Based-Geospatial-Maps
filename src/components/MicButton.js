// src/components/MicButton.js
import React, { useState } from 'react';

const MicButton = ({ onResult, style }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    setIsListening(true);

    // Check if the browser supports speech recognition
    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognition) {
      alert('Speech recognition is not supported in this browser.');
      setIsListening(false);
      return;
    }

    const recognitionInstance = new recognition();
    recognitionInstance.lang = 'en-US';
    recognitionInstance.interimResults = false;

    recognitionInstance.onresult = (event) => {
      const result = event.results[0][0].transcript;
      onResult(result);
      setIsListening(false);
    };

    recognitionInstance.onerror = () => {
      setIsListening(false);
    };

    recognitionInstance.start();
  };

  return (
    <button
      onClick={startListening}
      style={{
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        ...style,
      }}
    >
      {isListening ? '🔊' : '🎙️'}
    </button>
  );
};

export default MicButton;
