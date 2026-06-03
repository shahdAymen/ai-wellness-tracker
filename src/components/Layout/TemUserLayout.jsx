import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Activity,
  BarChart3,
  MapPin,
  Settings,
  Dumbbell,
  LogOut,
  Menu,
  X,
  Watch,
} from 'lucide-react';
import { UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { useGlobalLoading } from '../../context/LoadingContext';
import VigoCoach from '../Chat/VigoCoach';
import { Sparkles } from 'lucide-react';

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVigoOpen, setIsVigoOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasCompletedProfile } = useAuth();
  const { isApiLoading } = useGlobalLoading();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/user' },
    { icon: CalendarDays, label: 'AI Planner', path: '/user/planner' },
    { icon: Activity, label: 'Tracker', path: '/user/tracker' },
    { icon: Dumbbell, label: 'Workouts', path: '/user/workouts' },
    { icon: BarChart3, label: 'Analytics', path: '/user/analytics' },
    { icon: MapPin, label: 'Restaurants', path: '/user/restaurants' },
    { icon: Watch, label: 'Google Fit', path: '/user/device-sync' },
    { icon: UserCircle, label: 'Complete Profile', path: '/user/complete-profile' },
    { icon: Settings, label: 'Settings', path: '/user/settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  React.useEffect(() => {
    if (!hasCompletedProfile) {
      navigate('/user/complete-profile', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCompletedProfile]);

  return (
    <div className="min-h-screen flex bg-canvas dark:bg-canvas-night text-ink dark:text-on-dark transition-colors duration-300">
      {/* Sidebar spacer to hold layout on desktop */}
      <div className="hidden lg:block lg:w-16 shrink-0 transition-all duration-300 ease-in-out" />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-canvas-soft dark:bg-canvas-night-soft border-r border-hairline dark:border-hairline-strong
        transition-all duration-300 ease-in-out group/sidebar overflow-hidden
        ${sidebarOpen
            ? 'w-64 translate-x-0'
            : '-translate-x-full lg:translate-x-0 lg:w-16 lg:hover:w-64 lg:hover:shadow-xl'
          }`}
      >
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col flex-1 min-h-0">
            {/* Logo */}
            <div className="p-4 border-b border-hairline dark:border-hairline-strong h-[73px] flex items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-ink dark:bg-on-dark flex items-center justify-center shadow-sm shrink-0">
                  <Activity className="w-4.5 h-4.5 text-primary" />
                </div>
                <span
                  className={`text-lg font-bold tracking-tight text-ink dark:text-on-dark transition-opacity duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 group-hover/sidebar:opacity-100'
                    }`}
                >
                  Vitality<span className="text-primary font-medium">AI</span>
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 overflow-y-auto space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => {
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-sm text-sm transition-all duration-200 shrink-0
                    ${isActive
                        ? ' text-primary font-medium'
                        : 'text-ink-mute dark:text-ink-mute-2 hover:bg-hairline-cool dark:hover:bg-canvas-night-soft hover:text-ink dark:hover:text-on-dark'
                      }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    <span
                      className={`transition-opacity duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 group-hover/sidebar:opacity-100'
                        }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile Info */}
          <div className="p-3 border-t border-hairline dark:border-hairline-strong flex items-center gap-3 shrink-0 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-ink font-semibold text-xs shadow-sm shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className={`transition-opacity duration-300 min-w-0 ${sidebarOpen ? 'opacity-100' : 'opacity-0 group-hover/sidebar:opacity-100'}`}>
              <p className="text-xs font-semibold text-ink dark:text-on-dark leading-tight truncate">
                {user?.name}
              </p>
              <p className="text-[10px] text-ink-mute dark:text-ink-mute-2 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Logout */}
          <div className="p-3 border-t border-hairline dark:border-hairline-strong shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-3 py-2.5 rounded-sm text-sm text-accent-tomato hover:bg-accent-tomato/10 transition-colors shrink-0"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0" />
              <span
                className={`transition-opacity duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 group-hover/sidebar:opacity-100'
                  }`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 lg:hidden p-2.5 rounded-full bg-canvas/80 dark:bg-canvas-night/80 border border-hairline dark:border-hairline-strong shadow-md text-ink dark:text-on-dark hover:bg-hairline-cool dark:hover:bg-canvas-night-soft transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Floating AI Coach Trigger */}
      <motion.button
        onClick={() => setIsVigoOpen(true)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-24 z-[9999] p-3.5 rounded-full shadow-lg transition-all duration-300 
                   bg-canvas/80 dark:bg-canvas-night/80 backdrop-blur-md 
                   border border-hairline dark:border-hairline-strong 
                   text-primary hover:shadow-xl hover:border-hairline-strong dark:hover:border-on-dark
                   focus:outline-none focus:ring-2 focus:ring-primary/50"
        title="Open Vigo AI Coach"
      >
        <div className="relative w-6 h-6 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary fill-primary/10" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </motion.button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-canvas dark:bg-canvas-night">
        {isApiLoading && <div className="h-[2px] w-full bg-primary/80" />}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-canvas-soft dark:bg-canvas-night-soft">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Vigo AI Wellness Coach */}
      <VigoCoach isOpen={isVigoOpen} onClose={() => setIsVigoOpen(false)} />

    </div>
  );
}

