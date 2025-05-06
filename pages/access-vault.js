import React, { useState } from 'react';

export default function AccessVault() {
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const handleFetchData = async () => {
    if (!token) {
      setError("Please enter a token.");
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/access-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const result = await res.json();

      if (result.data) {
        setUserData(result.data);
        setError('');
      } else {
        setUserData(null);
        setError('Invalid token or data not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching data.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Access Vault</h1>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Enter Token</label>
          <input
            type="text"
            value={token}
            onChange={handleTokenChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your token"
          />
        </div>

        <button
          onClick={handleFetchData}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
        >
          Retrieve Data
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}

        {userData && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">User Data</h2>
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">Field</th>
                  <th className="border px-4 py-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(userData.data).map(([key, value]) => (
                  <tr key={key}>
                    <td className="border px-4 py-2">{key}</td>
                    <td className="border px-4 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
