import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Phone, RefreshCw } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { restaurantAPI } from '../../services/api';

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
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-hairline dark:border-hairline-strong pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Manage Restaurants</h1>
          <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
            Read-only admin restaurant management. No create, update, or delete restaurant endpoints are documented.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={load}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <EmptyState title="No restaurants found" />
      ) : (
        <motion.div
          className="grid gap-6 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {restaurants.map((restaurant) => (
            <motion.div key={restaurant.id} variants={itemVariants}>
              <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-hairline dark:border-hairline-strong mb-4">
                    <div>
                      <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark">{restaurant.name}</h2>
                      <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
                        {restaurant.category || 'Restaurant'} · {restaurant.cuisine_type || 'Cuisine'}
                      </p>
                    </div>
                    {restaurant.distance_km != null && (
                      <span className="rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong px-2.5 py-1 text-xs text-ink dark:text-on-dark font-medium shrink-0">
                        {Number(restaurant.distance_km).toFixed(1)} km
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-xs text-ink-mute dark:text-ink-mute-2">
                    {restaurant.address && (
                      <div className="flex gap-2.5 items-start">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="leading-relaxed">
                          {restaurant.address}
                          {restaurant.area ? `, ${restaurant.area}` : ''}
                          {restaurant.city ? `, ${restaurant.city}` : ''}
                        </span>
                      </div>
                    )}
                    {restaurant.phone && (
                      <div className="flex gap-2.5 items-center">
                        <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{restaurant.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {restaurant.website && (
                  <div className="mt-5 pt-4 border-t border-hairline dark:border-hairline-strong">
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Visit Website
                    </a>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
