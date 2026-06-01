import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Loader2, MapPin, Navigation, Phone, RefreshCw, Search } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState } from '../../components/UI/StatusStates';
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

export default function Restaurants() {
  const [query, setQuery] = useState('');
  const [coords, setCoords] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRestaurants = useCallback(
    async (location) => {
      if (!location) return;

      setLoading(true);
      setError(null);
      try {
        const data = await restaurantAPI.getNearby(location.lat, location.lng);
        setRestaurants(Array.isArray(data?.restaurants) ? data.restaurants : []);
      } catch (err) {
        setError(err);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const requestLocation = useCallback(() => {
    setError(null);

    if (!navigator.geolocation) {
      setError(new Error('Browser geolocation is not supported on this device.'));
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoords(nextCoords);
        await loadRestaurants(nextCoords);
      },
      (locationError) => {
        setLoading(false);
        setError(new Error(locationError.message || 'Location permission is required to find nearby restaurants.'));
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, [loadRestaurants]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return restaurants;
    return restaurants.filter((restaurant) =>
      [restaurant.name, restaurant.category, restaurant.cuisine_type, restaurant.address, restaurant.area]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [query, restaurants]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-hairline dark:border-hairline-strong pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Restaurants</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Healthy places near you</h1>
          <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
            Uses browser geolocation and the documented nearby restaurant endpoint.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => (coords ? loadRestaurants(coords) : requestLocation())} disabled={loading}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
          <Button onClick={requestLocation} disabled={loading}>
            <Navigation className="h-3.5 w-3.5 mr-1" />
            Use my location
          </Button>
        </div>
      </div>

      <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute dark:text-ink-mute-2" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, category, cuisine, or area..."
            className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft py-2.5 pl-11 pr-4 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
          />
        </div>
      </Card>

      {loading && (
        <div className="flex items-center gap-2 text-ink-mute dark:text-ink-mute-2 text-sm justify-center py-6">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Finding nearby restaurants...
        </div>
      )}

      {error && <ErrorState message={error.message} onRetry={requestLocation} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState title="No restaurants found" message="Try refreshing after allowing location access." />
      )}

      <motion.div
        className="grid gap-6 lg:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filtered.map((restaurant) => (
          <motion.div key={restaurant.id || restaurant.name} variants={itemVariants}>
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
                      {Number(restaurant.distance_km).toFixed(1)} km away
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
    </div>
  );
}
