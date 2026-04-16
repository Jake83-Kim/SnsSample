"use client";

import React from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;