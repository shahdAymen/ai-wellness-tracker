import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils, Plus, CheckCircle } from 'lucide-react';
import { mealsAPI } from '../../API';

export function LogMealModal({ isOpen, onClose }) {
  const [mealType, setMealType] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [isLogged, setIsLogged] = useState(false);

  const mealTypes = [
    { id: 'breakfast', name: 'فطور', icon: '🌅' },
    { id: 'lunch', name: 'غداء', icon: '☀️' },
    { id: 'dinner', name: 'عشاء', icon: '🌙' },
    { id: 'snack', name: 'سناك', icon: '🍎' },
  ];

  const commonFoods = [
    { id: 1, name: 'بيض مسلوق', calories: 78, protein: 6, carbs: 1, fat: 5, unit: 'بيضة' },
    { id: 2, name: 'أرز', calories: 130, protein: 3, carbs: 28, fat: 0.3, unit: 'كوب' },
    { id: 3, name: 'دجاج مشوي', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
    { id: 4, name: 'سلمون', calories: 208, protein: 20, carbs: 0, fat: 13, unit: '100g' },
  ];

  const addFood = (food) => {
    const existing = selectedFoods.find((f) => f.id === food.id);

    if (existing) {
      setSelectedFoods(
        selectedFoods.map((f) =>
          f.id === food.id ? { ...f, quantity: f.quantity + 1 } : f
        )
      );
    } else {
      setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }]);
    }
  };

  const totalCalories = selectedFoods.reduce(
    (sum, food) => sum + food.calories * food.quantity,
    0
  );

  const totalProtein = selectedFoods.reduce(
    (sum, food) => sum + food.protein * food.quantity,
    0
  );

  const handleLogMeal = async () => {
    try {
      setIsLogged(true);

      const totalCarbs = selectedFoods.reduce(
        (sum, food) => sum + (food.carbs || 0) * food.quantity,
        0
      );

      const totalFats = selectedFoods.reduce(
        (sum, food) => sum + (food.fat || 0) * food.quantity,
        0
      );

      const mealData = {
        externalId: crypto.randomUUID(),
        mealName: selectedFoods.map((food) => food.name).join(', '),
        description: `Meal with ${selectedFoods.length} items`,
        mealType: mealType,
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fats: totalFats,
      };

      await mealsAPI.adminAddMeal(mealData);

      setTimeout(() => {
        onClose();
        setIsLogged(false);
        setMealType('');
        setSelectedFoods([]);
      }, 1200);

    } catch (error) {
      console.log('Meal Error:', error);
      setIsLogged(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0A0E27] border-4 border-[#CCFF00] shadow-[16px_16px_0px_0px_rgba(204,255,0,0.5)]"
            >
              {/* Header */}
              <div className="bg-[#CCFF00] p-6 border-b-4 border-black flex items-center justify-between sticky top-0">
                <div className="flex items-center gap-3">
                  <Utensils className="w-8 h-8 text-black" />
                  <h2 className="text-2xl font-black text-black">LOG MEAL</h2>
                </div>

                <button onClick={onClose}>
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {!isLogged ? (
                  <>
                    {/* Meal Types */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {mealTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setMealType(type.id)}
                          className={`p-4 border-4 transition-all ${
                            mealType === type.id
                              ? 'bg-[#CCFF00] text-black'
                              : 'bg-[#151935] text-white'
                          }`}
                        >
                          <div className="text-3xl">{type.icon}</div>
                          <div className="text-sm font-bold">{type.name}</div>
                        </button>
                      ))}
                    </div>

                    {/* Foods */}
                    {mealType && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {commonFoods.map((food) => (
                          <div
                            key={food.id}
                            className="bg-[#151935] border-4 border-gray-700 p-4"
                          >
                            <div className="flex justify-between">
                              <div className="text-white font-bold">
                                {food.name}
                              </div>

                              <button
                                onClick={() => addFood(food)}
                                className="w-8 h-8 bg-[#CCFF00] flex items-center justify-center border-2 border-black"
                              >
                                <Plus className="w-4 h-4 text-black" />
                              </button>
                            </div>

                            <div className="text-gray-400 text-xs mt-2">
                              {food.calories} kcal
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Selected */}
                    {selectedFoods.length > 0 && (
                      <div className="bg-[#151935] border-4 border-[#FF6B35] p-4">
                        <div className="text-white mb-3 font-bold">
                          Selected Foods
                        </div>

                        <div className="space-y-2">
                          {selectedFoods.map((food) => (
                            <div
                              key={food.id}
                              className="flex justify-between text-white"
                            >
                              <span>{food.name}</span>
                              <span>{food.quantity}x</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={handleLogMeal}
                          className="w-full mt-4 bg-[#FF6B35] p-3 font-bold"
                        >
                          تسجيل الوجبة
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-12 flex flex-col items-center">
                    <CheckCircle className="w-20 h-20 text-[#CCFF00]" />
                    <h3 className="text-2xl text-white font-bold mt-4">
                      تم التسجيل!
                    </h3>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}