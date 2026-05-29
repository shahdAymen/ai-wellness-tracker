import React, { useEffect, useState } from 'react';
import { Store, UtensilsCrossed, Users } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { dashboardAPI, mealsAPI, restaurantAPI, userAPI } from '../../services/api';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Overview</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Live admin counters from documented dashboard, user, meal, and restaurant endpoints.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <Icon className="h-8 w-8 text-emerald-500" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                {Number(card.value || 0).toLocaleString()}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Recent users</h2>
          <div className="space-y-3">
            {data.users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-slate-700">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user.fullName || user.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-300">{user.role}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Restaurant inventory</h2>
          <div className="space-y-3">
            {data.restaurants.slice(0, 5).map((restaurant) => (
              <div key={restaurant.id} className="rounded-lg bg-gray-50 p-3 dark:bg-slate-700">
                <p className="font-semibold text-gray-900 dark:text-white">{restaurant.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {restaurant.category || 'Restaurant'} · {restaurant.city || restaurant.area || 'Location not set'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
