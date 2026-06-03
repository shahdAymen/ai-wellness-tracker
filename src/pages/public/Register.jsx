import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Activity,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

import Button from "../../components/UI/Button";
import { Card } from "../../components/UI/Card";
import { useAuth } from "../../context/AuthContext";


export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // =========================
  // VALIDATE
  // =========================
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // REGISTER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    if (!validateForm()) return;

    try {
      setLoading(true);

      await register({
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/user/complete-profile", { replace: true });
    } catch (error) {
      console.error(error);
      setGeneralError(error.message || "Registration failed. Please check details and try again.");
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
        <Card className="p-8 border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night shadow-md">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-sm bg-ink dark:bg-on-dark flex items-center justify-center shadow-sm">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-ink dark:text-on-dark">
                Vitality<span className="text-primary font-medium">AI</span>
              </span>
            </div>

            <h2 className="text-lg font-semibold tracking-tight text-ink dark:text-on-dark mb-1">
              Create Account
            </h2>

            <p className="text-xs text-ink-mute dark:text-ink-mute-2">
              Start your wellness journey today
            </p>
          </div>

          {generalError && (
            <div className="p-3 mb-4 rounded-sm bg-accent-tomato/10 border border-accent-tomato/20 text-accent-tomato text-xs font-medium">
              {generalError}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="block text-xs font-semibold text-ink-mute dark:text-ink-mute-2 mb-2 uppercase tracking-wide">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute dark:text-ink-mute-2" />

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    });
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder="John Doe"
                  className={`w-full pl-9 pr-4 py-2 border rounded-sm bg-canvas dark:bg-canvas-night-soft text-ink dark:text-on-dark focus:border-primary outline-none transition text-sm ${
                    errors.name
                      ? 'border-accent-tomato focus:border-accent-tomato'
                      : 'border-hairline dark:border-hairline-strong'
                  }`}
                />
              </div>
              {errors.name && (
                <span className="text-accent-tomato text-xs mt-1 block font-medium">
                  {errors.name}
                </span>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-semibold text-ink-mute dark:text-ink-mute-2 mb-2 uppercase tracking-wide">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute dark:text-ink-mute-2" />

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    });
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="example@email.com"
                  className={`w-full pl-9 pr-4 py-2 border rounded-sm bg-canvas dark:bg-canvas-night-soft text-ink dark:text-on-dark focus:border-primary outline-none transition text-sm ${
                    errors.email
                      ? 'border-accent-tomato focus:border-accent-tomato'
                      : 'border-hairline dark:border-hairline-strong'
                  }`}
                />
              </div>
              {errors.email && (
                <span className="text-accent-tomato text-xs mt-1 block font-medium">
                  {errors.email}
                </span>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-semibold text-ink-mute dark:text-ink-mute-2 mb-2 uppercase tracking-wide">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute dark:text-ink-mute-2" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    });
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-9 py-2 border rounded-sm bg-canvas dark:bg-canvas-night-soft text-ink dark:text-on-dark focus:border-primary outline-none transition text-sm ${
                    errors.password
                      ? 'border-accent-tomato focus:border-accent-tomato'
                      : 'border-hairline dark:border-hairline-strong'
                  }`}
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

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-xs font-semibold text-ink-mute dark:text-ink-mute-2 mb-2 uppercase tracking-wide">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute dark:text-ink-mute-2" />

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-9 py-2 border rounded-sm bg-canvas dark:bg-canvas-night-soft text-ink dark:text-on-dark focus:border-primary outline-none transition text-sm ${
                    errors.confirmPassword
                      ? 'border-accent-tomato focus:border-accent-tomato'
                      : 'border-hairline dark:border-hairline-strong'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute dark:text-ink-mute-2 hover:text-ink dark:hover:text-on-dark focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-accent-tomato text-xs mt-1 block font-medium">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>

          </form>

          {/* LOGIN LINK */}
          <div className="mt-6 text-center text-xs">
            <p className="text-ink-mute dark:text-ink-mute-2">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
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

