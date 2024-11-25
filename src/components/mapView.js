import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';




// Define layers
let transportLayer = new TileLayer({
  source: new XYZ({
    url: 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=00ad052bf91a429c8cfe26b976ccdeff',
    maxZoom: 18,
    attributions: '© Thunderforest',
  }),
});

let transportDarkLayer = new TileLayer({
  source: new XYZ({
    url: 'https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=00ad052bf91a429c8cfe26b976ccdeff',
    maxZoom: 18,
    attributions: '© Thunderforest',
  }),
});

// Define layers
let topographicLayer = new TileLayer({
    source: new XYZ({
      url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
      maxZoom: 17,
      attributions: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap',
    }),
  });
  
  let landscapeLayer = new TileLayer({
    source: new XYZ({
      url: 'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=00ad052bf91a429c8cfe26b976ccdeff',
      maxZoom: 18,
      attributions: '© Thunderforest',
    }),
  });

// Function to add transport layer
export const addTransportLayer = (map) => {
  map.addLayer(transportLayer);
};

// Function to add transport dark layer (Dark Mode)
export const addTransportDarkLayer = (map) => {
  map.addLayer(transportDarkLayer);
};



// Function to remove transport layer
export const removeTransportLayer = (map) => {
  map.removeLayer(transportLayer);
};

// Function to remove transport dark layer (Dark Mode)
export const removeTransportDarkLayer = (map) => {
  map.removeLayer(transportDarkLayer);
};

export const addTopographicLayer = (map) => {
    map.addLayer(topographicLayer);
  };
  
  // Function to add landscape layer
  export const addLandscapeLayer = (map) => {
    map.addLayer(landscapeLayer);
  };
  
  // Function to remove topographic layer
  export const removeTopographicLayer = (map) => {
    map.removeLayer(topographicLayer);
  };
  
  // Function to remove landscape layer
  export const removeLandscapeLayer = (map) => {
    map.removeLayer(landscapeLayer);
  };