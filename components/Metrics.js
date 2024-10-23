'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Metrics = () => {
  const [xUrl, setXUrl] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [data, setData] = useState(null);

  const fetchData = async () => {
    // This is where you'd make API calls to fetch real data
    // For now, we'll use mock data
    const mockData = {
      totalFollowers: 10000,
      growthData: [
        { date: '2023-01', x: 5000, linkedin: 4000 },
        { date: '2023-02', x: 5500, linkedin: 4200 },
        { date: '2023-03', x: 6000, linkedin: 4500 },
        { date: '2023-04', x: 6200, linkedin: 4800 },
      ],
    };
    setData(mockData);
  };

  useEffect(() => {
    if (xUrl && linkedInUrl) {
      fetchData();
    }
  }, [xUrl, linkedInUrl]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Social Media Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="X Profile URL"
          value={xUrl}
          onChange={(e) => setXUrl(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="LinkedIn Profile URL"
          value={linkedInUrl}
          onChange={(e) => setLinkedInUrl(e.target.value)}
        />
      </div>
      <button 
        onClick={fetchData} 
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch Data
      </button>

      {data && (
        <>
          <div className="mb-4 bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Total Followers</h2>
            <p className="text-4xl font-bold">{data.totalFollowers}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">Follower Growth Over Time</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="x" stroke="#1DA1F2" name="X" />
                  <Line type="monotone" dataKey="linkedin" stroke="#0077B5" name="LinkedIn" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Metrics;