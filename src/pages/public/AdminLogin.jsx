import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

import { useAuth } from '../../context/AuthContext';


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
    <div className="min-h-screen bg-canvas dark:bg-canvas-night flex items-center justify-center p-6 transition-colors duration-300">


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 border border-accent-tomato/20 bg-canvas-soft dark:bg-canvas-night-soft shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-accent-tomato" />
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-sm bg-accent-tomato flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-ink dark:text-on-dark">
                Vitality<span className="text-accent-tomato font-medium">Admin</span>
              </span>
            </div>
            <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark mb-1">System Administration</h2>
            <p className="text-xs text-ink-mute dark:text-ink-mute-2">Authorized personnel only</p>
          </div>

          {generalError && (
            <div className="p-3 mb-4 rounded-sm bg-accent-tomato/15 border border-accent-tomato/20 text-accent-tomato text-xs font-medium">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-mute dark:text-ink-mute-2 mb-2 uppercase tracking-wide">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute dark:text-ink-mute-2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full pl-9 pr-4 py-2 border rounded-sm bg-canvas dark:bg-canvas-night text-ink dark:text-on-dark focus:border-accent-tomato outline-none transition text-sm ${
                    errors.email
                      ? 'border-accent-tomato focus:border-accent-tomato'
                      : 'border-hairline dark:border-hairline-strong'
                  }`}
                  placeholder="admin email"
                />
              </div>
              {errors.email && (
                <span className="text-accent-tomato text-xs mt-1 block font-medium">
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-mute dark:text-ink-mute-2 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute dark:text-ink-mute-2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  className={`w-full pl-9 pr-9 py-2 border rounded-sm bg-canvas dark:bg-canvas-night text-ink dark:text-on-dark focus:border-accent-tomato outline-none transition text-sm ${
                    errors.password
                      ? 'border-accent-tomato focus:border-accent-tomato'
                      : 'border-hairline dark:border-hairline-strong'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute dark:text-ink-mute-2 hover:text-ink dark:hover:text-on-dark focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-accent-tomato text-xs mt-1 block font-medium">
                  {errors.password}
                </span>
              )}
            </div>

            <Button type="submit" variant="danger" className="w-full mt-2" size="lg" disabled={loading}>
              {loading ? 'Accessing Admin Panel...' : 'Access Admin Panel'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-ink-mute dark:text-ink-mute-2 hover:underline text-xs"
            >
              Back to Home
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
