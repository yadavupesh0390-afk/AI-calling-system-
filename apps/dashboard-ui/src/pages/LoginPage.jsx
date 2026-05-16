import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const response = await api.post(
        '/auth/login',
        formData
      );

      localStorage.setItem(
        'token',
        response.data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      );

      navigate('/dashboard');

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Login failed'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 top-0 left-0"></div>
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 bottom-0 right-0"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
            <span className="text-4xl">📞</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-white text-center mb-2">
          AI Calling System
        </h1>

        <p className="text-center text-purple-100 mb-8">
          Smart Lead Generation Dashboard
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-5 py-3 rounded-xl bg-white/20 border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-5 py-3 rounded-xl bg-white/20 border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center text-sm text-purple-100">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>

            <button
              type="button"
              className="hover:text-cyan-300 transition"
            >
              Forgot Password?
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition-transform duration-300 text-white font-bold shadow-lg"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-purple-100 text-sm">
          Powered by AI Automation 🚀
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
