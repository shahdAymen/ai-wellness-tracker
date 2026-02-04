import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import Button from '../../components/UI/Button';

function ManageRecipes() {
  const recipes = [
    { id: 1, name: 'Salmon Quinoa Bowl', category: 'Lunch', calories: 450, protein: 35 },
    { id: 2, name: 'Greek Yogurt Parfait', category: 'Breakfast', calories: 280, protein: 18 },
    { id: 3, name: 'Chicken Stir Fry', category: 'Dinner', calories: 520, protein: 42 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-2">Manage Recipes</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and edit meal recipes</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Recipe
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-gray-900 dark:text-white mb-1">{recipe.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.category}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Calories</p>
                <p className="text-gray-900 dark:text-white">{recipe.calories} kcal</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Protein</p>
                <p className="text-gray-900 dark:text-white">{recipe.protein}g</p>
              </div>
            </div>
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

export default ManageRecipes;
export { ManageRecipes };