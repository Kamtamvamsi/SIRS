import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function StorageVault() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: user?.email || '',
    address: '',
    dob: '',
    social: '',
    pan: '',
    aadhaar: '',
    religion: ''
  });
  const [token, setToken] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          data: formData
        })
      });

      const result = await res.json();
      if (result.token) {
        setToken(result.token);
        setSubmitted(true);
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit data.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Storage Vault</h1>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
        {[
          ['Full Name', 'fullName'],
          ['Phone Number', 'phone'],
          ['Email Address', 'email'],
          ['Home Address', 'address'],
          ['Date of Birth', 'dob', 'date'],
          ['Social Media Handles', 'social'],
          ['PAN Card Number', 'pan'],
          ['Aadhaar Card', 'aadhaar'],
          ['Religion', 'religion'],
        ].map(([label, name, type = 'text']) => (
          <div key={name}>
            <label className="block text-gray-700 font-medium">{label}{name !== 'social' ? '*' : ' (optional)'}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required={name !== 'social'}
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
        >
          Generate Token & Submit
        </button>
      </div>

      {submitted && (
        <div className="max-w-xl mx-auto mt-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg">
          <p><strong>Your Access Token:</strong></p>
          <pre className="break-words mt-2 bg-white p-2 rounded border border-gray-200">{token}</pre>
          <p className="text-sm text-gray-600 mt-1">Copy and store this token safely to retrieve your data later.</p>
        </div>
      )}
    </div>
  );
}
