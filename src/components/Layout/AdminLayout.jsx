import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="min-h-screen flex bg-canvas dark:bg-canvas-night text-ink dark:text-on-dark transition-colors duration-300">
      {/* Sidebar spacer to hold layout on desktop */}
      <div className="hidden lg:block lg:w-16 shrink-0 transition-all duration-300 ease-in-out" />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-canvas-soft dark:bg-canvas-night-soft border-r border-hairline dark:border-hairline-strong
        transition-all duration-300 ease-in-out group/sidebar overflow-hidden
        ${
          sidebarOpen
            ? 'w-64 translate-x-0'
            : '-translate-x-full lg:translate-x-0 lg:w-16 lg:hover:w-64 lg:hover:shadow-xl'
        }`}
      >
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col flex-1 min-h-0">
            {/* Logo */}
            <div className="p-4 border-b border-hairline dark:border-hairline-strong h-[73px] flex items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-accent-tomato flex items-center justify-center shadow-sm shrink-0">
                  <Shield className="w-4.5 h-4.5 text-white" />
                </div>
                <span
                  className={`text-lg font-bold tracking-tight text-ink dark:text-on-dark transition-opacity duration-300 whitespace-nowrap ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 group-hover/sidebar:opacity-100'
                  }`}
                >
                  Vitality<span className="text-accent-tomato font-medium">Admin</span>
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
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-sm text-sm transition-all duration-200 shrink-0
                    ${
                      isActive
                        ? 'bg-accent-tomato/10 border-l-2 border-accent-tomato text-accent-tomato font-medium'
                        : 'text-ink-mute dark:text-ink-mute-2 hover:bg-hairline-cool dark:hover:bg-canvas-night-soft hover:text-ink dark:hover:text-on-dark'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    <span
                      className={`transition-opacity duration-300 whitespace-nowrap ${
                        sidebarOpen ? 'opacity-100' : 'opacity-0 group-hover/sidebar:opacity-100'
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout */}
          <div className="p-3 border-t border-hairline dark:border-hairline-strong shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-3 py-2.5 rounded-sm text-sm text-accent-tomato hover:bg-accent-tomato/10 transition-colors shrink-0"
            >
              <LogOut className="w-4.5 h-4.5 shrink-0" />
              <span
                className={`transition-opacity duration-300 whitespace-nowrap ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0 group-hover/sidebar:opacity-100'
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-canvas dark:bg-canvas-night">
        {/* Top Bar */}
        <header className="bg-canvas dark:bg-canvas-night border-b border-hairline dark:border-hairline-strong px-6 py-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-sm hover:bg-hairline-cool dark:hover:bg-canvas-night-soft text-ink dark:text-on-dark transition-colors duration-300"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="hidden lg:block">
              <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark">System Administration</h2>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-ink dark:text-on-dark leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-ink-mute dark:text-ink-mute-2">Administrator</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent-tomato flex items-center justify-center text-white shadow-sm">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </header>
        {isApiLoading && <div className="h-[2px] w-full bg-accent-tomato/80" />}

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-canvas-soft dark:bg-canvas-night-soft transition-colors duration-300">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

