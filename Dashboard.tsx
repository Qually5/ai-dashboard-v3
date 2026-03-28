import React from 'react';
import { LineChart } from 'recharts';

const Dashboard = () => {
    return (
        <div>
            <h1>AI Model Performance Dashboard</h1>
            <LineChart data={[]} />
        </div>
    );
};

export default Dashboard;
