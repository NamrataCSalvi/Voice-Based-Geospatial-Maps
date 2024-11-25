import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import { Style, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';

let highwayLayer = null; // Initialize as null

const highwaysData = [
  {
    name: 'NH 48', 
    coordinates: [
      [72.8777, 19.0760], // Mumbai
      [73.8567, 18.5204], // Pune
      [74.6018, 16.9944], // Belgaum
      [77.5946, 12.9716]  // Bangalore
    ],
  },
  {
    name: 'NH 66', 
    coordinates: [
      [73.8567, 18.5204], // Pune
      [73.8553, 15.2993], // Goa
      [74.8352, 12.9141], // Mangalore
      [76.2711, 9.9312]   // Kochi
    ],
  },
  {
    name: 'NH 44', 
    coordinates: [
      [77.1025, 28.7041], // Delhi
      [75.8577, 25.3176], // Kota
      [78.4867, 17.3850], // Hyderabad
      [79.0882, 21.1458]  // Nagpur
    ],
  },
  {
    name: 'NH 16', 
    coordinates: [
      [80.2707, 13.0827], // Chennai
      [81.6820, 16.3067], // Vijayawada
      [83.2185, 17.6868], // Visakhapatnam
      [85.8315, 20.2961]  // Bhubaneswar
    ],
  },
  {
    name: 'NH 19', 
    coordinates: [
      [88.3639, 22.5726], // Kolkata
      [85.8190, 25.5941], // Patna
      [83.0104, 26.8467], // Lucknow
      [77.1025, 28.7041]  // Delhi
    ],
  },
  {
    name: 'NH 27', 
    coordinates: [
      [89.4167, 26.2006], // Siliguri
      [85.8286, 25.6022], // Muzaffarpur
      [80.9345, 26.8500], // Kanpur
      [75.8069, 26.4499]  // Ajmer
    ],
  },
  {
    name: 'NH 30', 
    coordinates: [
      [81.6296, 21.2514], // Raipur
      [82.9739, 23.2234], // Bilaspur
      [85.5174, 25.6090], // Arrah
      [85.3230, 23.6345]  // Ranchi
    ],
  },
  // Add more highways with paths
];

// Function to display the highways on the map
export const showHighways = (map) => {
  if (highwayLayer) {
    map.removeLayer(highwayLayer); // Remove existing layer if any
  }

  const highwayFeatures = highwaysData.map((highway) => {
    const highwayFeature = new Feature({
      geometry: new LineString(
        highway.coordinates.map(coord => fromLonLat(coord))
      ),
      name: highway.name,
    });

    return highwayFeature;
  });

  const vectorSource = new VectorSource({
    features: highwayFeatures,
  });

  highwayLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: 'orange',
        width: 4,
      }),
    }),
  });

  map.addLayer(highwayLayer);
};

// Function to hide the highways from the map
export const hideHighways = (map) => {
  if (highwayLayer) {
    map.removeLayer(highwayLayer);
    highwayLayer = null; // Set to null after removal
  }
};
