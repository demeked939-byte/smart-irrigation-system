const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  mode: { type: String, enum: ['AUTO', 'MANUAL'], default: 'AUTO' },
  status: { type: String, enum: ['ON', 'OFF'], default: 'OFF' }
});

module.exports = mongoose.model('SystemConfig', configSchema);