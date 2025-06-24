import React, { useState } from 'react';
import { loginUser, User } from '../api/userApi';

type LoginModalProps = {
  // onSubmit receives the logged in user for further actions
  onSubmit: (user: User) => void;
};

export default function LoginModal({ onSubmit }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission by calling the login API endpoint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      // Call the login endpoint with the provided credentials
      const response = await loginUser({ email, password });
      // Assume the endpoint returns the authenticated user in response.data
      const user: User = response?.data;
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // If credentials are valid, call onSubmit with the found user
      onSubmit(user);
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}