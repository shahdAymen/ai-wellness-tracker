import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Store, UtensilsCrossed, Users } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { dashboardAPI, mealsAPI, restaurantAPI, userAPI } from '../../services/api';
import AnimatedNumber from '../../components/UI/AnimatedNumber';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function AdminDashboard() {
  const [data, setData] = useState({
    dashboard: null,
    users: [],
    meals: [],
    restaurants: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboard, users, meals, restaurants] = await Promise.all([
        dashboardAPI.getAdminDashboard(),
        userAPI.getAllUsers(),
        mealsAPI.adminGetMeals(),
        restaurantAPI.adminGetAll(),
      ]);
      setData({
        dashboard,
        users: Array.isArray(users) ? users : [],
        meals: Array.isArray(meals) ? meals : [],
        restaurants: Array.isArray(restaurants) ? restaurants : [],
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <PageLoader label="Loading admin dashboard..." />;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  const cards = [
    { label: 'Total users', value: data.dashboard?.totalUsers ?? data.users.length, icon: Users },
    { label: 'Total meals', value: data.dashboard?.totalMeals ?? data.meals.length, icon: UtensilsCrossed },
    { label: 'Restaurants', value: data.dashboard?.totalRestaurants ?? data.restaurants.length, icon: Store },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b border-hairline dark:border-hairline-strong pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">System Overview</h1>
        <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
          Live admin counters from dashboard, user, meal, and restaurant endpoints.
        </p>
      </div>

      {/* Counters Grid */}
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} variants={itemVariants}>
              <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">{card.label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark font-mono">
                      <AnimatedNumber value={card.value} />
                    </p>
                  </div>
                  <div className="rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong p-2.5 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Details Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
          <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark pb-4 border-b border-hairline dark:border-hairline-strong mb-5">Recent users</h2>
          <div className="space-y-3">
            {data.users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft p-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-tight text-ink dark:text-on-dark truncate">{user.fullName || user.email}</p>
                  <p className="text-xs text-ink-mute dark:text-ink-mute-2 mt-0.5 truncate">{user.email}</p>
                </div>
                <span className="rounded-sm bg-canvas dark:bg-canvas-night border border-hairline dark:border-hairline-strong px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2 shrink-0">
                  {user.role}
                </span>
              </div>
            ))}
            {data.users.length === 0 && (
              <p className="text-xs text-ink-mute dark:text-ink-mute-2">No users recorded in the database.</p>
            )}
          </div>
        </Card>

        <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
          <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark pb-4 border-b border-hairline dark:border-hairline-strong mb-5">Restaurant inventory</h2>
          <div className="space-y-3">
            {data.restaurants.slice(0, 5).map((restaurant) => (
              <div key={restaurant.id} className="rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft p-4">
                <p className="text-sm font-semibold tracking-tight text-ink dark:text-on-dark">{restaurant.name}</p>
                <p className="text-xs text-ink-mute dark:text-ink-mute-2 mt-1">
                  {restaurant.category || 'Restaurant'} · {restaurant.city || restaurant.area || 'Location not set'}
                </p>
              </div>
            ))}
            {data.restaurants.length === 0 && (
              <p className="text-xs text-ink-mute dark:text-ink-mute-2">No restaurants registered in the database.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
