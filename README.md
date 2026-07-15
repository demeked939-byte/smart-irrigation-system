# 🌱 IoT Smart Irrigation System

An IoT-based smart irrigation system that monitors environmental conditions and automatically controls water supply using Arduino sensors and a web-based dashboard.

The system combines **embedded hardware**, **IoT communication**, and **full-stack web development** to provide efficient water management for agriculture.

---

## 📌 Features

- 🌡️ Real-time temperature monitoring
- 💧 Soil moisture monitoring
- 🌧️ Rain detection
- 🚰 Automatic irrigation control
- 🔘 Manual pump ON/OFF control
- 📊 Web dashboard for monitoring system data
- 🔄 Communication between Arduino and backend server
- 🗄️ Data storage using MongoDB

---

## 🏗️ System Architecture

```text
Sensors
   |
   ↓
Arduino Controller
   |
   ↓
Node.js + Express Backend
   |
   ↓
MongoDB Database
   |
   ↓
React Web Dashboard
```

---

## 🔧 Hardware Components

- Arduino board
- Soil moisture sensor
- DHT11 temperature and humidity sensor
- Rain sensor
- Relay module
- Water pump
- Power supply

---

## 💻 Software Technologies

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- REST API

### Embedded System
- Arduino C/C++
- Sensor interfacing

---

## 📂 Project Structure

```text
smart-irrigation-system/

├── backend/
│   ├── server.js
│   ├── models/
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Backend Setup

```bash
cd backend
npm install
npm start
```

Create your own environment file:

```text
backend.env
```

Example:

```env
MONGO_URI=your_database_connection
PORT=5000
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📸 Screenshots

Add screenshots of your project here:

```text
screenshots/

├── dashboard.png
├── hardware.png
└── simulation.png
```

---

## 🚀 Future Improvements

- Mobile application support
- Real-time IoT cloud monitoring
- Weather API integration
- Machine learning based irrigation prediction
- Solar-powered operation

---

## 👨‍💻 Author

**demeked939-byte**

Electrical & Computer Engineering Graduate

Interested in:
- IoT Systems
- Embedded Systems
- Web Development
- Automation
