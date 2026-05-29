import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Dumbbell,
  Store,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../UI/ThemeToggle';
import { useGlobalLoading } from '../../context/LoadingContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isApiLoading } = useGlobalLoading();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Manage Users', path: '/admin/users' },
    { icon: UtensilsCrossed, label: 'Manage Recipes', path: '/admin/recipes' },
    { icon: Dumbbell, label: 'Manage Workouts', path: '/admin/workouts' },
    { icon: Store, label: 'Manage Restaurants', path: '/admin/restaurants' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-app text-app transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-app-surface border-r border-app transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-app transition-colors duration-300">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-emerald-500" />
              <span className="text-xl text-app">Admin Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto transition-colors duration-300">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors duration-300 ${
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
          <div className="p-4 border-t border-app transition-colors duration-300">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen transition-colors duration-300">
        {/* Top Bar */}
        <header className="bg-app-surface border-b border-app px-6 py-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-300"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden lg:block">
              <h2 className="text-app">Admin Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-app">{user?.name}</p>
                  <p className="text-xs text-app-muted">Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </header>
        {isApiLoading && <div className="h-1 w-full bg-emerald-500/80" />}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto transition-colors duration-300">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
