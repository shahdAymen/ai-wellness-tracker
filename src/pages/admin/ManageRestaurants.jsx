import React from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import Button from '../../components/UI/Button';

export default function ManageRestaurants() {
  const restaurants = [
    { id: 1, name: 'Green Leaf Bistro', location: 'Downtown', cuisine: 'Vegan', rating: 4.8 },
    { id: 2, name: 'Protein Palace', location: 'Mall Area', cuisine: 'Healthy Fast Food', rating: 4.6 },
    { id: 3, name: 'Mediterranean Kitchen', location: 'Beach Road', cuisine: 'Mediterranean', rating: 4.9 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-2">Manage Restaurants</h2>
          <p className="text-gray-600 dark:text-gray-400">Add and manage restaurant database</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Restaurant
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-gray-900 dark:text-white mb-1">{restaurant.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.location}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 rounded-full text-sm">
                ★ {restaurant.rating}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{restaurant.cuisine}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
