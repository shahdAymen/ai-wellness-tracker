import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/UI/ThemeToggle';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    if (!validateForm()) return;

    try {
      setLoading(true);
      const loggedInUser = await login(email, password);
      const isAdmin = (loggedInUser?.roles || []).some((role) => role?.toLowerCase?.() === 'admin');

      if (!isAdmin) {
        await logout();
        throw new Error('This account does not have admin access.');
      }

      navigate('/admin', { replace: true });
    } catch (err) {
      console.error(err);
      setGeneralError(err.message || 'Login failed. Please check your admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md bg-slate-800 border border-slate-700">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-red-500" />
            <span className="text-2xl text-white">Admin Access</span>
          </div>
          <h2 className="text-white mb-2">System Administration</h2>
          <p className="text-gray-400">Authorized personnel only</p>
        </div>

        {generalError && (
          <div className="p-4 mb-4 rounded-xl bg-red-950/20 border border-red-900/50 text-red-400 text-sm font-medium">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-300">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-600'
                }`}
                placeholder="admin email"
              />
            </div>
            {errors.email && (
              <span className="text-red-400 text-xs mt-1 block font-medium">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-600'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-400 text-xs mt-1 block font-medium">
                {errors.password}
              </span>
            )}
          </div>

          <Button type="submit" variant="danger" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Accessing Admin Panel...' : 'Access Admin Panel'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:underline text-sm"
          >
            Back to Home
          </button>
        </div>
      </Card>
    </div>
  );
}

export default AdminLogin;
