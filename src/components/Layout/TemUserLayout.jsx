import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Activity,
  BarChart3,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  Watch,
} from 'lucide-react';
import { UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../UI/ThemeToggle';
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
    { icon: LayoutDashboard, label: 'Dashboard', path: '' },
    { icon: CalendarDays, label: 'AI Planner', path: 'planner' },
    { icon: Activity, label: 'Tracker', path: 'tracker' },
    { icon: BarChart3, label: 'Analytics', path: 'analytics' },
    { icon: MapPin, label: 'Restaurants', path: 'restaurants' },
    { icon: Watch, label: 'Google Fit', path: 'device-sync' },
    { icon: UserCircle, label: 'Complete Profile', path: 'complete-profile' },
    { icon: Settings, label: 'Settings', path: 'settings' },
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
    if (!hasCompletedProfile && location.pathname !== '/user/complete-profile') {
      navigate('/user/complete-profile', { replace: true });
    }
  }, [hasCompletedProfile, location.pathname, navigate]);

  return (
    <div className="min-h-screen flex bg-app text-app">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-app-surface border-r border-app
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-app">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-emerald-500" />
              <span className="text-xl text-app">
                VitalityAI
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.path === ''
                  ? location.pathname === '/user'
                  : location.pathname.includes(item.path);

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors
                  ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      : 'text-app-muted hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-app">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">       
        {/* Top Bar */}
        <header className="bg-app-surface border-b border-app px-6 py-4">
          <div className="flex items-center">
            {/* Left (menu button) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Right */}
            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />

              <button
                onClick={() => setIsVigoOpen(true)}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-app-muted hover:text-emerald-500 transition-colors relative"
                title="Open Vigo AI Coach"
              >
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-app">
                    {user?.name}
                  </p>
                  <p className="text-xs text-app-muted">
                    {user?.email}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  {getInitials(user?.name)}
                </div>
              </div>
            </div>
          </div>
        </header>
        {isApiLoading && <div className="h-1 w-full bg-emerald-500/80" />}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-app">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Vigo AI Wellness Coach */}
      <VigoCoach isOpen={isVigoOpen} onClose={() => setIsVigoOpen(false)} />

      {/* Vigo Floating Toggle Action Button */}
      {!isVigoOpen && (
        <button
          onClick={() => setIsVigoOpen(true)}
          className="vigo-float-btn animate-fade-in"
          title="Chat with Vigo AI Coach"
        >
          <Sparkles size={24} />
        </button>
      )}
    </div>
  );
}
