require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const SensorData = require('./models/SensorData');
const SystemConfig = require('./models/SystemConfig');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

io.on('connection', (socket) => {
  console.log('📱 Frontend Connected:', socket.id);
});

app.get('/api/sensor-data', async (req, res) => {
  try {
    const history = await SensorData.find().sort({ timestamp: -1 }).limit(20);
    let config = await SystemConfig.findOne();
    if (!config) config = await SystemConfig.create({ mode: 'AUTO', status: 'OFF' });
    res.json({ history: history.reverse(), config });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sensor-data', async (req, res) => {
  try {
    const config = await SystemConfig.findOne();
    const newData = await SensorData.create({ ...req.body, pumpStatus: config.status });
    io.emit('sensorUpdate', newData);
    res.json({ pumpState: config.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));