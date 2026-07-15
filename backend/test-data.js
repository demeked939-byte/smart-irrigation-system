const axios = require('axios');

const sendData = () => {
  const mock = {
    temperature: (20 + Math.random() * 15).toFixed(1), // 20-35°C
        humidity: (40 + Math.random() * 20).toFixed(1),    // 40-60%
        soilMoisture: (Math.random() * 100).toFixed(1),   // 0-100%
        waterLevel: (50 + Math.random() * 50).toFixed(1),  // 50-100%
        rainDetected: Math.random() > 0.8,                // 20% chance of rain
        pumpStatus: Math.random() > 0.5 ? "ON" : "OFF"

  axios.post('http://localhost:5000/api/sensor-data', mock)
    .then(() => console.log("Sent Mock Data:", mock))
    .catch(err => console.log("Error: Is your backend running?"));
};

// Send data every 2 seconds
setInterval(sendData, 2000);