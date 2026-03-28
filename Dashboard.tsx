import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './AIDashboard.css'; // Assuming a CSS file for styling

interface MetricData {
  timestamp: string; // Using string for simplicity, could be Date object
  value: number;
  threshold?: number; // For drift detection
}

interface ModelStatus {
  modelName: string;
  version: string;
  status: 'online' | 'offline' | 'degraded';
  lastUpdated: string;
}

const generateRandomData = (length: number, min: number, max: number, trend: number = 0): MetricData[] => {
  const data: MetricData[] = [];
  let currentValue = (min + max) / 2;
  for (let i = 0; i < length; i++) {
    currentValue += (Math.random() - 0.5) * (max - min) / 10 + trend;
    currentValue = Math.max(min, Math.min(max, currentValue));
    data.push({
      timestamp: `Day ${i + 1}`,
      value: parseFloat(currentValue.toFixed(2)),
    });
  }
  return data;
};

const AIDashboard: React.FC = () => {
  const [accuracyData, setAccuracyData] = useState<MetricData[]>([]);
  const [latencyData, setLatencyData] = useState<MetricData[]>([]);
  const [driftData, setDriftData] = useState<MetricData[]>([]);
  const [modelStatus, setModelStatus] = useState<ModelStatus[]>([
    { modelName: 'FraudDetector v2.1', version: '2.1.5', status: 'online', lastUpdated: '2026-03-20' },
    { modelName: 'Recommendation v3.0', version: '3.0.2', status: 'online', lastUpdated: '2026-03-25' },
    { modelName: 'ChurnPredictor v1.2', version: '1.2.1', status: 'degraded', lastUpdated: '2026-03-27' },
  ]);

  const fetchData = useCallback(() => {
    setAccuracyData(generateRandomData(30, 85, 95, 0.1)); // Accuracy trending up slightly
    setLatencyData(generateRandomData(30, 50, 150, -0.5)); // Latency trending down slightly
    const newDriftData = generateRandomData(30, 0.05, 0.3, 0.01); // Drift trending up
    setDriftData(newDriftData.map(d => ({ ...d, threshold: 0.25 }))); // Add a static threshold
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh data every minute
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="ai-dashboard-container">
      <header className="dashboard-header">
        <h1>AI Model Operations Dashboard</h1>
        <p>Real-time monitoring of model performance, latency, and data drift.</p>
      </header>

      <section className="model-status-section">
        <h2>Model Health Overview</h2>
        <div className="model-cards">
          {modelStatus.map((model, index) => (
            <div key={index} className={`model-card ${model.status}`}>
              <h3>{model.modelName}</h3>
              <p>Version: {model.version}</p>
              <p>Status: <strong>{model.status.toUpperCase()}</strong></p>
              <p>Last Updated: {model.lastUpdated}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="metrics-section">
        <h2>Key Performance Indicators</h2>
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Model Accuracy (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={{ r: 8 }} name="Accuracy" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Prediction Latency (ms)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" name="Latency" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Data Drift (KL Divergence)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={driftData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#ffc658" name="Drift Score" />
                <Line type="monotone" dataKey="threshold" stroke="#ff0000" strokeDasharray="5 5" name="Threshold" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>&copy; 2026 AI Ops Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AIDashboard;
