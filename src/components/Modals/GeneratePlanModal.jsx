import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { aiAPI } from '../../API';
import Button from '../../components/UI/Button';

export function GeneratePlanModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    goal: 'lose',
    activity: 'sedentary',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const res = await aiAPI.generateWeeklyPlan(formData);
      console.log('AI RESPONSE:', res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // ===== UI STYLES (MATCH DASHBOARD THEME) =====
  const inputClass =
    "w-full bg-[#0B1220] border border-[#243B55] rounded-2xl px-5 py-4 text-white outline-none focus:border-emerald-400 transition placeholder:text-gray-500";

  const labelClass = "text-gray-300 text-sm mb-2 block";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050A14]/80 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* MODAL */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-3xl rounded-3xl bg-[#0B1220] border border-[#243B55] shadow-2xl overflow-hidden"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-[#243B55]">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Customize Your AI
                  </h2>
                  <p className="text-gray-400 mt-1">
                    We need this data to calculate your metabolic rate.
                  </p>
                </div>

                <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <X size={26} />
                </button>
              </div>

              {/* BODY */}
              <div className="p-8 space-y-6">

                {/* AGE + GENDER */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Age</label>
                    <input
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className={inputClass}
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>

                {/* HEIGHT + WEIGHT */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Height (cm)</label>
                    <input
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => handleChange('height', e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => handleChange('weight', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* GOAL */}
                <div>
                  <label className="text-gray-300 text-sm mb-3 block">
                    Primary Goal
                  </label>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: 'lose', label: 'Lose Weight' },
                      { key: 'gain', label: 'Build Muscle' },
                      { key: 'maintain', label: 'Maintain' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleChange('goal', item.key)}
                        className={`
                          py-4 rounded-2xl font-semibold transition-all duration-300
                          border text-sm md:text-base
                          ${
                            formData.goal === item.key
                              ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/30 scale-[1.03]'
                              : 'bg-[#0B1220] text-emerald-400 border-[#243B55] hover:border-emerald-400 hover:scale-[1.01]'
                          }
                        `}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ACTIVITY */}
                <div>
                  <label className={labelClass}>Activity Level</label>

                  <select
                    value={formData.activity}
                    onChange={(e) => handleChange('activity', e.target.value)}
                    className={inputClass}
                  >
                    <option value="sedentary">Sedentary (Office Job)</option>
                    <option value="light">Light Exercise</option>
                    <option value="moderate">Moderate Exercise</option>
                    <option value="active">Very Active</option>
                  </select>
                </div>

                {/* BUTTON */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  size="lg"
                  className="w-full mt-2"
                >
                  {isGenerating ? 'Generating...' : 'Analyze & Generate Dashboard'}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}