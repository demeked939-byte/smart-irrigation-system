import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Droplets, Thermometer, Power, LayoutDashboard, History, LogOut, CloudRain, Waves, Download } from 'lucide-react';

const socket = io('http://localhost:5000');

// --- SUB-COMPONENT: WATER GAUGE ---
const WaterTank = ({ level }) => (
  <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '1px solid #333' }}>
    <Waves color="#00d1ff" size={32} />
    <p style={{ color: '#888', margin: '10px 0' }}>Water Reservoir</p>
    <div style={{ width: '60px', height: '120px', border: '3px solid #444', borderRadius: '10px', margin: '0 auto', position: 'relative', overflow: 'hidden', background: '#111' }}>
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${level}%`, background: 'linear-gradient(transparent, #00d1ff)', transition: 'height 0.5s ease' }} />
    </div>
    <h3 style={{ marginTop: '10px' }}>{level}%</h3>
  </div>
);

// --- PAGE: LOGIN ---
const LoginPage = ({ onLogin }) => {
  const [user, setUser] = useState('');
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#121212' }}>
      <div style={{ background: '#1e1e1e', padding: '40px', borderRadius: '20px', textAlign: 'center', width: '350px', border: '1px solid #333' }}>
        <h2 style={{ color: '#00d1ff' }}>Graduation Project</h2>
        <p style={{ color: '#888' }}>Smart Irrigation System</p>
        <input type="text" placeholder="Username" style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #444', background: '#111', color: 'white' }} onChange={(e) => setUser(e.target.value)} />
        <input type="password" placeholder="Password" style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #444', background: '#111', color: 'white' }} />
        <button onClick={() => onLogin(user)} style={{ width: '100%', padding: '12px', background: '#00d1ff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>LOGIN</button>
      </div>
    </div>
  );
};

// --- PAGE: DASHBOARD (Includes Control & Zoom Chart) ---
const Dashboard = ({ data, config, setSystemMode, systemMode, togglePump }) => {
  const [timeRange, setTimeRange] = useState('all');
  const latest = data[data.length - 1] || { temperature: 0, soilMoisture: 0, humidity: 0, waterLevel: 0, rainDetected: false };
  const filteredData = timeRange === 'hour' ? data.slice(-20) : data;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#00d1ff' }}>Live Command Center</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['hour', 'all'].map(r => (
            <button key={r} onClick={() => setTimeRange(r)} style={{ background: timeRange === r ? '#00d1ff' : '#222', border: 'none', color: timeRange === r ? '#000' : '#fff', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>{r.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
        <div className="card"><Thermometer color="#ff4d4d" /> <p>Temp</p> <h3>{latest.temperature}°C</h3></div>
        <div className="card"><Droplets color="#00d1ff" /> <p>Moisture</p> <h3>{latest.soilMoisture}%</h3></div>
        <div className="card"><Power color={config.status === 'ON' ? '#4aff4a' : '#888'} /> <p>Pump</p> <h3>{config.status}</h3></div>
        <WaterTank level={latest.waterLevel || 0} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '15px', height: '350px', border: '1px solid #333' }}>
          <h3>Moisture Trend  </h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="colorMoist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d1ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00d1ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="timestamp" hide />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ background: '#111', border: 'none' }} />
              <Area type="monotone" dataKey="soilMoisture" stroke="#00d1ff" strokeWidth={3} fill="url(#colorMoist)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
          <h3>Pump Control</h3>
          <button onClick={() => setSystemMode(systemMode === 'AUTO' ? 'MANUAL' : 'AUTO')} style={{ width: '100%', padding: '12px', background: '#333', color: 'white', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer', margin: '20px 0' }}>MODE: {systemMode}</button>
          <div style={{ display: 'flex', gap: '10px' }}>
           <button 
            disabled={systemMode === 'AUTO'} 
            onClick={() => togglePump('ON')} // This is the trigger!
            style={{ flex: 1, padding: '15px', background: '#008000', color: 'white', borderRadius: '8px', opacity: systemMode === 'AUTO' ? 0.3 : 1, cursor: 'pointer' }}
>
          ON
         </button>

<button 
  disabled={systemMode === 'AUTO'} 
  onClick={() => togglePump('OFF')} // This is the trigger!
  style={{ flex: 1, padding: '15px', background: '#800000', color: 'white', borderRadius: '8px', opacity: systemMode === 'AUTO' ? 0.3 : 1, cursor: 'pointer' }}
>
  OFF
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PAGE: HISTORY (Includes CSV Export) ---
const HistoryPage = ({ data }) => {
  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + ["Time,Moisture,Temp,WaterLevel,Pump"].concat(data.map(i => `${i.timestamp},${i.soilMoisture},${i.temperature},${i.waterLevel},${i.pumpStatus}`)).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "irrigation_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Data History</h2>
        <button onClick={downloadCSV} style={{ background: '#00d1ff', color: '#000', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', gap: '8px', fontWeight: 'bold' }}><Download size={18}/> Export CSV</button>
      </div>
      <div style={{ background: '#1e1e1e', borderRadius: '15px', overflow: 'hidden', border: '1px solid #333' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#252525', color: '#00d1ff' }}>
            <tr><th style={{ padding: '15px' }}>Time</th><th>Moisture</th><th>Temp</th><th>Water</th><th>Pump</th></tr>
          </thead>
          <tbody>
            {data.slice().reverse().slice(0, 15).map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '12px' }}>{new Date(item.timestamp).toLocaleTimeString()}</td>
                <td>{item.soilMoisture}%</td><td>{item.temperature}°C</td><td>{item.waterLevel}%</td><td>{item.pumpStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState([]);
  const [systemMode, setSystemMode] = useState('AUTO');
  const [config, setConfig] = useState({ mode: 'AUTO', status: 'OFF' });

  const togglePump = (newStatus) => {
  if (systemMode === 'MANUAL') {
    // Send the command to the backend
    axios.post('http://localhost:5000/api/pump-control', { status: newStatus })
      .then(() => {
        // Update the local state so the UI reflects the change immediately
        setConfig(prev => ({ ...prev, status: newStatus }));
      })
      .catch(err => console.error("Pump control failed", err));
  }
};
  useEffect(() => {
    if (isLoggedIn) {
      axios.get('http://localhost:5000/api/sensor-data').then(res => {
        setData(res.data.history || []);
        setConfig(res.data.config || { mode: 'AUTO', status: 'OFF' });
      });
      socket.on('sensorUpdate', (newData) => setData(prev => [...prev.slice(-49), newData]));
      return () => socket.off('sensorUpdate');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  return (
    <Router>
      <div style={{ display: 'flex', background: '#121212', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <nav style={{ width: '220px', background: '#1e1e1e', padding: '20px', borderRight: '1px solid #333' }}>
          <h2 style={{ color: '#00d1ff', fontSize: '1.2rem', marginBottom: '40px' }}>IRRI-PRO v3.0</h2>
          <Link to="/" className="nav-link"><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/history" className="nav-link"><History size={20} /> History</Link>
          <button onClick={() => setLoggedIn(false)} className="nav-link" style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', marginTop: '40px' }}><LogOut size={20} /> Logout</button>
        </nav>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard data={data} config={config} setSystemMode={setSystemMode} systemMode={systemMode} togglePump={togglePump}/>} />
            <Route path="/history" element={<HistoryPage data={data} />} />
          </Routes>
        </div>
      </div>
      <style>{`.nav-link { display: flex; align-items: center; gap: 12px; color: #ccc; text-decoration: none; padding: 15px; border-radius: 10px; margin-bottom: 5px; }.nav-link:hover { background: #333; color: #00d1ff; }.card { background: #1e1e1e; padding: 15px; border-radius: 15px; border: 1px solid #333; text-align: center; }`}</style>
    </Router>
  );
}

export default App;