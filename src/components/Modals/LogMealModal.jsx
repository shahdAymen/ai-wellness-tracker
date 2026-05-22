import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils, Plus, Minus, CheckCircle } from 'lucide-react';

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
    { id: 5, name: 'خبز أسمر', calories: 80, protein: 4, carbs: 15, fat: 1, unit: 'شريحة' },
    { id: 6, name: 'موز', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, unit: 'حبة' },
    { id: 7, name: 'تفاح', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, unit: 'حبة' },
    { id: 8, name: 'لبن زبادي', calories: 100, protein: 10, carbs: 5, fat: 4, unit: 'كوب' },
  ];

  const addFood = (food) => {
    const existing = selectedFoods.find((f) => f.id === food.id);

    if (existing) {
      setSelectedFoods(
        selectedFoods.map((f) =>
          f.id === food.id
            ? { ...f, quantity: f.quantity + 1 }
            : f
        )
      );
    } else {
      setSelectedFoods([
        ...selectedFoods,
        { ...food, quantity: 1 },
      ]);
    }
  };

  const removeFood = (foodId) => {
    const existing = selectedFoods.find((f) => f.id === foodId);

    if (existing && existing.quantity > 1) {
      setSelectedFoods(
        selectedFoods.map((f) =>
          f.id === foodId
            ? { ...f, quantity: f.quantity - 1 }
            : f
        )
      );
    } else {
      setSelectedFoods(
        selectedFoods.filter((f) => f.id !== foodId)
      );
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

  const handleLogMeal = () => {
    setIsLogged(true);

    setTimeout(() => {
      onClose();
      setIsLogged(false);
      setMealType('');
      setSelectedFoods([]);
    }, 2000);
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0A0E27] border-4 border-[#CCFF00] shadow-[16px_16px_0px_0px_rgba(204,255,0,0.5)] z-50"
          >
            {/* Header */}
            <div className="bg-[#CCFF00] p-6 border-b-4 border-black flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Utensils
                  className="w-8 h-8 text-black"
                  strokeWidth={2.5}
                />
                <h2 className="text-2xl font-black text-black mono">
                  LOG MEAL
                </h2>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 bg-black hover:bg-white transition-colors flex items-center justify-center"
              >
                <X
                  className="w-6 h-6 text-[#CCFF00]"
                  strokeWidth={2.5}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {!isLogged ? (
                <>
                  {/* Meal Types */}
                  <div>
                    <label className="block mono text-sm text-gray-400 mb-3">
                      نوع الوجبة
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {mealTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setMealType(type.id)}
                          className={`p-4 border-4 transition-all ${
                            mealType === type.id
                              ? 'bg-[#CCFF00] border-black'
                              : 'bg-[#151935] border-gray-700 hover:border-[#CCFF00]'
                          }`}
                        >
                          <div className="text-3xl mb-2">
                            {type.icon}
                          </div>

                          <div
                            className={`mono text-sm font-bold ${
                              mealType === type.id
                                ? 'text-black'
                                : 'text-white'
                            }`}
                          >
                            {type.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Food Selection */}
                  {mealType && (
                    <div>
                      <label className="block mono text-sm text-gray-400 mb-3">
                        اختر الأطعمة
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {commonFoods.map((food) => (
                          <div
                            key={food.id}
                            className="bg-[#151935] border-4 border-gray-700 hover:border-[#CCFF00] p-4 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-bold text-white">
                                {food.name}
                              </div>

                              <button
                                onClick={() => addFood(food)}
                                className="w-8 h-8 bg-[#CCFF00] hover:bg-[#FF6B35] border-2 border-black transition-colors flex items-center justify-center"
                              >
                                <Plus
                                  className="w-4 h-4 text-black"
                                  strokeWidth={3}
                                />
                              </button>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-400 mono">
                              <span>{food.calories} kcal</span>
                              <span>•</span>
                              <span>P:{food.protein}g</span>
                              <span>•</span>
                              <span>{food.unit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Selected Foods */}
                  {selectedFoods.length > 0 && (
                    <div>
                      <label className="block mono text-sm text-gray-400 mb-3">
                        الأطعمة المحددة
                      </label>

                      <div className="space-y-2">
                        {selectedFoods.map((food) => (
                          <div
                            key={food.id}
                            className="bg-[#151935] border-l-4 border-[#CCFF00] p-4 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-white">
                                {food.name}
                              </div>

                              <div className="text-sm text-gray-400 mono">
                                {food.calories * food.quantity} kcal •{' '}
                                {food.unit} × {food.quantity}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFood(food.id)}
                                className="w-8 h-8 bg-[#FF6B35] hover:bg-red-600 border-2 border-black transition-colors flex items-center justify-center"
                              >
                                <Minus
                                  className="w-4 h-4 text-black"
                                  strokeWidth={3}
                                />
                              </button>

                              <span className="mono font-bold text-white w-8 text-center">
                                {food.quantity}
                              </span>

                              <button
                                onClick={() => addFood(food)}
                                className="w-8 h-8 bg-[#CCFF00] hover:bg-[#4ECDC4] border-2 border-black transition-colors flex items-center justify-center"
                              >
                                <Plus
                                  className="w-4 h-4 text-black"
                                  strokeWidth={3}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {selectedFoods.length > 0 && (
                    <div className="bg-[#151935] border-4 border-[#FF6B35] p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="mono text-xs text-gray-400">
                            إجمالي السعرات
                          </div>

                          <div className="text-4xl font-black text-[#FF6B35] mono">
                            {totalCalories}
                          </div>

                          <div className="mono text-xs text-gray-400">
                            kcal
                          </div>
                        </div>

                        <div>
                          <div className="mono text-xs text-gray-400">
                            البروتين
                          </div>

                          <div className="text-4xl font-black text-[#CCFF00] mono">
                            {totalProtein.toFixed(1)}
                          </div>

                          <div className="mono text-xs text-gray-400">
                            g
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleLogMeal}
                        disabled={!mealType}
                        className="w-full bg-[#FF6B35] hover:bg-[#CCFF00] disabled:bg-gray-700 border-4 border-black p-4 transition-colors disabled:cursor-not-allowed"
                      >
                        <span className="mono font-bold text-black">
                          تسجيل الوجبة
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.2,
                      type: 'spring',
                      stiffness: 200,
                    }}
                  >
                    <CheckCircle
                      className="w-24 h-24 text-[#CCFF00] mb-6"
                      strokeWidth={2}
                    />
                  </motion.div>

                  <h3 className="text-3xl font-black text-white mb-2">
                    تم التسجيل بنجاح!
                  </h3>

                  <p className="text-gray-400 mono">
                    تمت إضافة {totalCalories} سعرة حرارية
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}