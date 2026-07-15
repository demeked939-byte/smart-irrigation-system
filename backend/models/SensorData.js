const mongoose = require('mongoose');
const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  soilMoisture: Number,
  rainStatus: Boolean,
  pumpStatus: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorData', sensorSchema);