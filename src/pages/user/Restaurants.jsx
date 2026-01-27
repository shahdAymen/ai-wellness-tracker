import React, { useState } from 'react';
import { Search, MapPin, Star, Leaf } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';

export function Restaurants() {
  const [searchQuery, setSearchQuery] = useState('');

  const restaurants = [
    {
      id: 1,
      name: 'Green Leaf Bistro',
      cuisine: 'Vegan',
      rating: 4.8,
      distance: '1.2 km',
      healthyOptions: 24,
    },
    {
      id: 2,
      name: 'Protein Palace',
      cuisine: 'Healthy Fast Food',
      rating: 4.6,
      distance: '2.5 km',
      healthyOptions: 18,
    },
    {
      id: 3,
      name: 'Mediterranean Kitchen',
      cuisine: 'Mediterranean',
      rating: 4.9,
      distance: '3.1 km',
      healthyOptions: 32,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 dark:text-white mb-2">Healthy Restaurants</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Discover nutritious dining options near you
        </p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants or cuisine..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <Button variant="outline">
          <MapPin className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-gray-900 dark:text-white mb-1">{restaurant.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.cuisine}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm text-gray-900 dark:text-white">{restaurant.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-emerald-500" />
                <span>{restaurant.healthyOptions} healthy options</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

}
export default Restaurants;


