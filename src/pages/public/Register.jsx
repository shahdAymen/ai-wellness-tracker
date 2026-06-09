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
import { authAPI } from "../../services/api";



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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-hairline dark:border-hairline-strong"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-canvas dark:bg-canvas-night px-2 text-ink-mute dark:text-ink-mute-2 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            type="button"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              window.location.href = authAPI.getGoogleLoginUrl(window.location.origin + '/register');
            }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.6h3.28c1.92,-1.77 3.03,-4.37 3.03,-7.4C21.65,11.8 21.55,11.4 21.35,11.1z" fill="#4285F4" />
                <path d="M12,20.5c2.3,0 4.23,-0.76 5.64,-2.1l-3.28,-2.6c-0.9,0.6 -2.07,0.98 -3.42,0.98 -2.63,0 -4.85,-1.78 -5.64,-4.17H1.92v2.7c1.44,2.87 4.41,4.72 7.82,4.72z" fill="#34A853" />
                <path d="M6.36,12.6c-0.2,-0.6 -0.31,-1.24 -0.31,-1.9s0.11,-1.3 0.31,-1.9V6.1H1.92c-0.69,1.38 -1.08,2.93 -1.08,4.6s0.39,3.22 1.08,4.6l4.44,-3.3z" fill="#FBBC05" />
                <path d="M12,5.62c1.25,0 2.37,0.43 3.25,1.27l2.43,-2.43C16.22,3.06 14.29,2.3 12,2.3 8.59,2.3 5.62,4.15 4.18,7.02l4.44,3.3C9.41,7.92 11.63,5.62 12,5.62z" fill="#EA4335" />
              </g>
            </svg>
            Sign up with Google
          </Button>

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

