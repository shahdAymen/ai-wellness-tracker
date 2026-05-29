import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Globe, Loader2, MapPin, Navigation, Phone, RefreshCw, Search } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState } from '../../components/UI/StatusStates';
import { restaurantAPI } from '../../services/api';

export default function Restaurants() {
  const [query, setQuery] = useState('');
  const [coords, setCoords] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRestaurants = useCallback(async (location = coords) => {
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
  }, [coords]);

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Restaurants</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Healthy places near you</h1>
          <p className="mt-2 text-sm text-slate-300">
            Uses browser geolocation and the documented nearby restaurant endpoint.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => (coords ? loadRestaurants(coords) : requestLocation())} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={requestLocation} disabled={loading}>
            <Navigation className="h-4 w-4" />
            Use my location
          </Button>
        </div>
      </div>

      <Card className="border border-slate-700 bg-slate-900">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, category, cuisine, or area"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white"
          />
        </div>
      </Card>

      {loading && (
        <div className="flex items-center gap-2 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          Finding nearby restaurants...
        </div>
      )}

      {error && <ErrorState message={error.message} onRetry={requestLocation} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState title="No restaurants found" message="Try refreshing after allowing location access." />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((restaurant) => (
          <Card key={restaurant.id || restaurant.name} className="border border-slate-700 bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{restaurant.name}</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {restaurant.category || 'Restaurant'} · {restaurant.cuisine_type || 'Cuisine'}
                </p>
              </div>
              {restaurant.distance_km != null && (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                  {Number(restaurant.distance_km).toFixed(1)} km
                </span>
              )}
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-300">
              {restaurant.address && (
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-emerald-400" />
                  <span>
                    {restaurant.address}
                    {restaurant.area ? `, ${restaurant.area}` : ''}
                    {restaurant.city ? `, ${restaurant.city}` : ''}
                  </span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-emerald-400" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              {restaurant.website && (
                <a
                  href={restaurant.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
