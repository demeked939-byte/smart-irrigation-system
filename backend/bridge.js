const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

// Listen to COM2 (Proteus is on COM1)
const port = new SerialPort({ path: 'COM2', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

console.log("🚀 Bridge started! Waiting for Proteus data...");

parser.on('data', (data) => {
    console.log("📥 Raw data from Proteus:", data);
    
    // Assuming your Arduino sends: temp,moisture,waterLevel
    const [temp, moist, water] = data.split(',');

    const payload = {
        temperature: parseFloat(temp),
        soilMoisture: parseFloat(moist),
        waterLevel: parseFloat(water)
    };

    // Send to your existing backend API
    axios.post('http://localhost:5000/api/sensor-data', payload)
        .then(() => console.log("📤 Data synced to Cloud & Dashboard"))
        .catch(err => console.log("❌ Server Error: Check if server.js is running"));
});