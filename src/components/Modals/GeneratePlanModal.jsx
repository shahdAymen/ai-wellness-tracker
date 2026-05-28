import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { aiAPI } from '../../API';

export function GeneratePlanModal({ isOpen, onClose }) {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('7');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGenerate = async () => {
    try {
      if (!goal) return;

      setIsGenerating(true);

      const res = await aiAPI.generateWeeklyPlan(
        goal,
        Number(duration)
      );

      console.log('AI RESPONSE:', res);

      const data = res?.data ?? res;

      setPlan({
        title: data?.title || 'AI Plan',
        duration: data?.duration || `${duration} days`,
        meals: data?.meals ?? [],
        workouts: data?.workouts ?? [],
      });

    } catch (err) {
      console.error('Generate error:', err);
    } finally {
      setIsGenerating(false);
    }
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
          <motion.div
            className="fixed inset-0 bg-black/80 z-50"
            onClick={onClose}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div className="w-full max-w-2xl bg-[#0A0E27] border-4 border-[#FF6B35]">

              {/* HEADER */}
              <div className="bg-[#FF6B35] p-6 flex justify-between items-center">
                <h2 className="font-black text-black">
                  GENERATE AI PLAN
                </h2>

                <button onClick={onClose}>
                  <X />
                </button>
              </div>

              <div className="p-6 space-y-4">

                {!plan ? (
                  <>
                    {/* GOAL */}
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full p-3 bg-[#151935] text-white"
                    >
                      <option value="">اختر الهدف</option>
                      <option value="lose">خسارة الوزن</option>
                      <option value="gain">زيادة العضلات</option>
                      <option value="maintain">الحفاظ على الوزن</option>
                    </select>

                    {/* DURATION */}
                    <div className="grid grid-cols-3 gap-3">
                      {['7', '14', '30'].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`p-4 border ${
                            duration === d
                              ? 'bg-orange-500 text-black'
                              : 'bg-[#151935] text-white'
                          }`}
                        >
                          {d} يوم
                        </button>
                      ))}
                    </div>

                    {/* GENERATE */}
                    <button
                      onClick={handleGenerate}
                      disabled={!goal || isGenerating}
                      className="w-full bg-orange-500 p-4 font-bold disabled:opacity-50"
                    >
                      {isGenerating ? 'جاري الإنشاء...' : 'إنشاء الخطة'}
                    </button>
                  </>
                ) : (
                  <>
                    {/* RESULT */}
                    <h3 className="text-white text-xl font-bold">
                      {plan.title}
                    </h3>

                    <p className="text-gray-300">
                      {plan.duration}
                    </p>

                    {/* MEALS */}
                    <div className="space-y-2 mt-4">
                      {(plan.meals || []).map((m, i) => (
                        <div
                          key={i}
                          className="bg-[#151935] p-2 text-white"
                        >
                          {m.name} - {m.calories} kcal
                        </div>
                      ))}
                    </div>

                    {/* ACTIONS */}
                    <button
                      onClick={handleReset}
                      className="mt-4 bg-gray-700 p-3 w-full text-white"
                    >
                      إنشاء جديد
                    </button>

                    <button
                      onClick={onClose}
                      className="mt-2 bg-green-400 p-3 w-full text-black"
                    >
                      تطبيق
                    </button>
                  </>
                )}

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}