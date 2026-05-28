import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Star,
  Leaf,
  Loader2,
  Navigation,
  Phone,
} from 'lucide-react';

import { restaurantAPI } from '../../API';

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    setLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserCoords(coords);
        fetchNearbyRestaurants(coords.lat, coords.lng);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setLocationError('Location denied, using Cairo');

          fetchNearbyRestaurants(30.0444, 31.2357);
        } else {
          setLocationError('Unable to get location');
          setLoading(false);
        }
      }
    );
  };

  const fetchNearbyRestaurants = async (lat, lng) => {
    setLoading(true);

    try {
      const data = await restaurantAPI.getNearby(lat, lng);
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = restaurants.filter((r) => {
    const q = searchQuery.toLowerCase();

    return (
      !q ||
      r.name?.toLowerCase().includes(q) ||
      r.cuisine?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white p-4 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-black">RESTAURANTS</h1>
        <p className="text-gray-400 text-xs">HEALTHY FOOD NEAR YOU</p>
      </div>

      {/* Search + Location */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 py-3 bg-[#151935] border border-gray-700 text-white"
          />
        </div>

        <button
          onClick={requestLocation}
          className="border border-cyan-400 text-cyan-400 px-4"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Error */}
      {locationError && (
        <div className="text-yellow-400 text-xs border border-yellow-500 p-2">
          {locationError}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex gap-2 text-gray-400">
          <Loader2 className="animate-spin w-4 h-4" />
          Loading restaurants...
        </div>
      )}

      {/* Results */}
      {!loading && (
        <>
          {filtered.length === 0 ? (
            <div className="text-gray-500 text-center p-10">
              No restaurants found
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">

              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="border border-gray-700 p-4 hover:border-cyan-400"
                >

                  {/* Name */}
                  <div className="flex justify-between">
                    <div>
                      <h3>{r.name}</h3>
                      <p className="text-xs text-gray-400">{r.cuisine}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{r.rating}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex gap-3 text-xs text-gray-400 mt-2">
                    <span>
                      <MapPin className="w-3 h-3 inline" /> {r.distanceMeters
                        ? `${(r.distanceMeters / 1000).toFixed(1)} km`
                        : r.distance}
                    </span>

                    <span className="text-green-400 flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      {r.healthyOptions}
                    </span>
                  </div>

                  {/* Address */}
                  {r.address && (
                    <p className="text-xs text-gray-600 mt-2">
                      {r.address}
                    </p>
                  )}

                  {/* Phone */}
                  {r.phone && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      {r.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}