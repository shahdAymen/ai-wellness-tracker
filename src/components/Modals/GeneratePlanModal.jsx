import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Target, Calendar } from 'lucide-react';

export function GeneratePlanModal({ isOpen, onClose }) {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('7');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      setPlan({
        title: 'خطة تغذية وتمارين شخصية',
        duration: `${duration} أيام`,
        dailyCalories: 2200,

        meals: [
          {
            name: 'الفطور',
            calories: 500,
            time: '08:00',
          },
          {
            name: 'الغداء',
            calories: 700,
            time: '13:00',
          },
          {
            name: 'العشاء',
            calories: 600,
            time: '19:00',
          },
          {
            name: 'سناك',
            calories: 400,
            time: '16:00',
          },
        ],

        workouts: [
          {
            name: 'HIIT Cardio',
            duration: '30 دقيقة',
            days: ['الإثنين', 'الأربعاء', 'الجمعة'],
          },
          {
            name: 'تمارين القوة',
            duration: '45 دقيقة',
            days: ['الثلاثاء', 'الخميس'],
          },
          {
            name: 'يوجا واسترخاء',
            duration: '20 دقيقة',
            days: ['السبت', 'الأحد'],
          },
        ],
      });

      setIsGenerating(false);
    }, 2000);
  };

  const handleReset = () => {
    setPlan(null);
    setGoal('');
    setDuration('7');
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0A0E27] border-4 border-[#FF6B35] shadow-[16px_16px_0px_0px_rgba(255,107,53,0.5)] z-50"
          >
            {/* Header */}
            <div className="bg-[#FF6B35] p-6 border-b-4 border-black flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Zap
                  className="w-8 h-8 text-black"
                  strokeWidth={2.5}
                />

                <h2 className="text-2xl font-black text-black mono">
                  GENERATE AI PLAN
                </h2>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 bg-black hover:bg-white transition-colors flex items-center justify-center"
              >
                <X
                  className="w-6 h-6 text-[#FF6B35]"
                  strokeWidth={2.5}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {!plan ? (
                <>
                  {/* Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block mono text-sm text-gray-400 mb-2">
                        ما هو هدفك الرئيسي؟
                      </label>

                      <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full bg-[#151935] border-4 border-gray-700 focus:border-[#FF6B35] text-white p-4 mono outline-none transition-colors"
                        dir="rtl"
                      >
                        <option value="">
                          اختر هدفك
                        </option>

                        <option value="lose">
                          خسارة الوزن
                        </option>

                        <option value="gain">
                          زيادة الكتلة العضلية
                        </option>

                        <option value="maintain">
                          الحفاظ على الوزن
                        </option>

                        <option value="health">
                          تحسين الصحة العامة
                        </option>
                      </select>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block mono text-sm text-gray-400 mb-2">
                        مدة الخطة
                      </label>

                      <div className="grid grid-cols-3 gap-3">
                        {['7', '14', '30'].map((days) => (
                          <button
                            key={days}
                            onClick={() => setDuration(days)}
                            className={`p-4 border-4 transition-all ${
                              duration === days
                                ? 'bg-[#FF6B35] border-black text-black'
                                : 'bg-[#151935] border-gray-700 text-white hover:border-[#FF6B35]'
                            }`}
                          >
                            <div className="text-3xl font-black mono">
                              {days}
                            </div>

                            <div className="text-xs mono">
                              يوم
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-[#151935] border-4 border-[#CCFF00] p-4">
                      <div className="flex items-start gap-3">
                        <Target
                          className="w-5 h-5 text-[#CCFF00] mt-1"
                          strokeWidth={2.5}
                        />

                        <div className="text-sm text-gray-300">
                          سيتم إنشاء خطة مخصصة لك تشمل
                          جدول الوجبات والتمارين بناءً
                          على بياناتك الشخصية وأهدافك.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={!goal || isGenerating}
                    className="w-full bg-[#FF6B35] hover:bg-[#CCFF00] disabled:bg-gray-700 border-4 border-black p-4 transition-colors disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        >
                          <Zap
                            className="w-6 h-6 text-black"
                            strokeWidth={2.5}
                          />
                        </motion.div>

                        <span className="mono font-bold text-black">
                          جاري الإنشاء...
                        </span>
                      </div>
                    ) : (
                      <span className="mono font-bold text-black">
                        إنشاء الخطة
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Generated Plan */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Plan Header */}
                    <div className="bg-[#151935] border-4 border-[#CCFF00] p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar
                          className="w-6 h-6 text-[#CCFF00]"
                          strokeWidth={2.5}
                        />

                        <h3 className="text-2xl font-black text-white">
                          {plan.title}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="mono text-xs text-gray-400">
                            المدة
                          </div>

                          <div className="text-xl font-bold text-white mono">
                            {plan.duration}
                          </div>
                        </div>

                        <div>
                          <div className="mono text-xs text-gray-400">
                            السعرات اليومية
                          </div>

                          <div className="text-xl font-bold text-[#CCFF00] mono">
                            {plan.dailyCalories} kcal
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meals */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-6 bg-[#FF6B35]" />
                        جدول الوجبات اليومي
                      </h4>

                      <div className="space-y-2">
                        {plan.meals.map((meal, index) => (
                          <div
                            key={index}
                            className="bg-[#151935] border-l-4 border-[#FF6B35] p-4 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-white">
                                {meal.name}
                              </div>

                              <div className="text-sm text-gray-400 mono">
                                {meal.time}
                              </div>
                            </div>

                            <div className="text-[#FF6B35] mono font-bold">
                              {meal.calories} kcal
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Workouts */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <div className="w-1 h-6 bg-[#CCFF00]" />
                        جدول التمارين الأسبوعي
                      </h4>

                      <div className="space-y-2">
                        {plan.workouts.map((workout, index) => (
                          <div
                            key={index}
                            className="bg-[#151935] border-l-4 border-[#CCFF00] p-4"
                          >
                            <div className="font-bold text-white mb-2">
                              {workout.name}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-400 mono">
                              <span>{workout.duration}</span>

                              <span>•</span>

                              <span>
                                {workout.days.join(' • ')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleReset}
                        className="bg-[#151935] border-4 border-gray-700 hover:border-white text-white p-4 transition-colors"
                      >
                        <span className="mono font-bold">
                          إنشاء خطة جديدة
                        </span>
                      </button>

                      <button
                        onClick={onClose}
                        className="bg-[#CCFF00] border-4 border-black hover:bg-[#FF6B35] text-black p-4 transition-colors"
                      >
                        <span className="mono font-bold">
                          تطبيق الخطة
                        </span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
