import React, { useEffect, useState } from 'react';
import { Globe, MapPin, Phone, RefreshCw } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { restaurantAPI } from '../../services/api';

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await restaurantAPI.adminGetAll();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <PageLoader label="Loading restaurants..." />;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Restaurants</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Read-only admin restaurant management. No create, update, or delete restaurant endpoints are documented.
          </p>
        </div>
        <Button variant="outline" onClick={load}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {restaurants.length === 0 ? (
        <EmptyState title="No restaurants found" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{restaurant.name}</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {restaurant.category || 'Restaurant'} · {restaurant.cuisine_type || 'Cuisine'}
                  </p>
                </div>
                {restaurant.distance_km != null && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {Number(restaurant.distance_km).toFixed(1)} km
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {restaurant.address && (
                  <div className="flex gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>
                      {restaurant.address}
                      {restaurant.area ? `, ${restaurant.area}` : ''}
                      {restaurant.city ? `, ${restaurant.city}` : ''}
                    </span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
                {restaurant.website && (
                  <a href={restaurant.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
