import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Flame,
} from 'lucide-react';

export function TrackWorkoutModal({ isOpen, onClose }) {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const workouts = [
    {
      id: 1,
      name: 'HIIT Cardio Blast',
      duration: 30,
      calories: 400,
      level: 'متوسط',
      color: '#FF6B35',
      exercises: [
        'Jumping Jacks',
        'Burpees',
        'High Knees',
        'Mountain Climbers',
      ],
    },

    {
      id: 2,
      name: 'تمارين القوة',
      duration: 45,
      calories: 350,
      level: 'متقدم',
      color: '#CCFF00',
      exercises: [
        'Push-ups',
        'Squats',
        'Lunges',
        'Planks',
      ],
    },

    {
      id: 3,
      name: 'يوجا واسترخاء',
      duration: 20,
      calories: 150,
      level: 'مبتدئ',
      color: '#4ECDC4',
      exercises: [
        'Child Pose',
        'Downward Dog',
        'Warrior Pose',
        'Tree Pose',
      ],
    },

    {
      id: 4,
      name: 'تمارين البطن',
      duration: 15,
      calories: 200,
      level: 'مبتدئ',
      color: '#FF6B35',
      exercises: [
        'Crunches',
        'Bicycle Crunches',
        'Leg Raises',
        'Russian Twists',
      ],
    },
  ];

  useEffect(() => {
    let interval = null;

    if (isActive && selectedWorkout) {
      interval = setInterval(() => {
        setSeconds((s) => {
          if (s >= selectedWorkout.duration * 60) {
            setIsActive(false);
            setIsCompleted(true);
            return s;
          }

          return s + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, selectedWorkout]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${mins
      .toString()
      .padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const progress = selectedWorkout
    ? (seconds / (selectedWorkout.duration * 60)) * 100
    : 0;

  const handleReset = () => {
    setSeconds(0);
    setIsActive(false);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    setTimeout(() => {
      onClose();
      setSelectedWorkout(null);
      setSeconds(0);
      setIsActive(false);
      setIsCompleted(false);
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
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 50,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 50,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0A0E27] border-4 border-[#4ECDC4] shadow-[16px_16px_0px_0px_rgba(78,205,196,0.5)] z-50"
          >
            {/* Header */}
            <div className="bg-[#4ECDC4] p-6 border-b-4 border-black flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Dumbbell
                  className="w-8 h-8 text-black"
                  strokeWidth={2.5}
                />

                <h2 className="text-2xl font-black text-black mono">
                  TRACK WORKOUT
                </h2>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 bg-black hover:bg-white transition-colors flex items-center justify-center"
              >
                <X
                  className="w-6 h-6 text-[#4ECDC4]"
                  strokeWidth={2.5}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {!selectedWorkout ? (
                <>
                  {/* Workout Selection */}
                  <div>
                    <label className="block mono text-sm text-gray-400 mb-3">
                      اختر تمرين
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {workouts.map((workout) => (
                        <motion.button
                          key={workout.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setSelectedWorkout(workout)
                          }
                          className="bg-[#151935] border-4 border-gray-700 hover:border-[#4ECDC4] p-6 text-left transition-all"
                          style={{
                            borderLeftColor: workout.color,
                            borderLeftWidth: '8px',
                          }}
                        >
                          <div className="font-black text-white text-lg mb-3">
                            {workout.name}
                          </div>

                          <div className="space-y-2 text-sm text-gray-400 mono">
                            <div className="flex items-center justify-between">
                              <span>المدة</span>

                              <span className="text-white font-bold">
                                {workout.duration} دقيقة
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span>
                                السعرات المحروقة
                              </span>

                              <span className="text-[#FF6B35] font-bold">
                                {workout.calories} kcal
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span>المستوى</span>

                              <span
                                className="px-2 py-1 text-xs font-bold border-2 border-current"
                                style={{
                                  color: workout.color,
                                }}
                              >
                                {workout.level}
                              </span>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </>
              ) : !isCompleted ? (
                <>
                  {/* Active Workout */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Workout Info */}
                    <div className="bg-[#151935] border-4 border-[#4ECDC4] p-6">
                      <h3 className="text-3xl font-black text-white mb-4">
                        {selectedWorkout.name}
                      </h3>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="mono text-xs text-gray-400">
                            المدة
                          </div>

                          <div className="text-xl font-bold text-white mono">
                            {selectedWorkout.duration}م
                          </div>
                        </div>

                        <div>
                          <div className="mono text-xs text-gray-400">
                            السعرات
                          </div>

                          <div className="text-xl font-bold text-[#FF6B35] mono">
                            {selectedWorkout.calories}
                          </div>
                        </div>

                        <div>
                          <div className="mono text-xs text-gray-400">
                            المستوى
                          </div>

                          <div className="text-xl font-bold text-[#4ECDC4] mono">
                            {selectedWorkout.level}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timer */}
                    <div className="bg-[#151935] border-4 border-white p-8">
                      <div className="text-center mb-6">
                        <motion.div
                          animate={{
                            scale: isActive
                              ? [1, 1.05, 1]
                              : 1,
                          }}
                          transition={{
                            duration: 1,
                            repeat: isActive
                              ? Infinity
                              : 0,
                          }}
                          className="text-8xl font-black mono text-white mb-2"
                        >
                          {formatTime(seconds)}
                        </motion.div>

                        <div className="mono text-sm text-gray-400">
                          من {selectedWorkout.duration}:00
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-6 bg-[#0A0E27] border-4 border-gray-700 mb-6 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${progress}%`,
                          }}
                          className="absolute inset-y-0 left-0 bg-[#4ECDC4]"
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex gap-4">
                        <button
                          onClick={() =>
                            setIsActive(!isActive)
                          }
                          className="flex-1 bg-[#CCFF00] hover:bg-[#FF6B35] border-4 border-black p-4 transition-colors flex items-center justify-center gap-3"
                        >
                          {isActive ? (
                            <>
                              <Pause
                                className="w-6 h-6 text-black"
                                strokeWidth={2.5}
                              />

                              <span className="mono font-bold text-black">
                                إيقاف مؤقت
                              </span>
                            </>
                          ) : (
                            <>
                              <Play
                                className="w-6 h-6 text-black"
                                strokeWidth={2.5}
                              />

                              <span className="mono font-bold text-black">
                                بدء
                              </span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={handleReset}
                          className="bg-[#151935] hover:bg-[#FF6B35] border-4 border-gray-700 hover:border-black p-4 transition-all"
                        >
                          <RotateCcw
                            className="w-6 h-6 text-white"
                            strokeWidth={2.5}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Exercises */}
                    <div className="bg-[#151935] border-4 border-[#FF6B35] p-6">
                      <h4 className="mono text-sm text-gray-400 mb-3">
                        التمارين المتضمنة
                      </h4>

                      <div className="grid grid-cols-2 gap-2">
                        {selectedWorkout.exercises.map(
                          (exercise, index) => (
                            <div
                              key={index}
                              className="bg-[#0A0E27] border-2 border-gray-700 p-3 text-sm text-white"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 border-2 border-[#FF6B35] flex items-center justify-center mono text-xs text-[#FF6B35]">
                                  {index + 1}
                                </div>

                                <span>{exercise}</span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          setSelectedWorkout(null);
                          handleReset();
                        }}
                        className="bg-[#151935] border-4 border-gray-700 hover:border-white text-white p-4 transition-colors"
                      >
                        <span className="mono font-bold">
                          إلغاء
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          setIsCompleted(true)
                        }
                        className="bg-[#4ECDC4] border-4 border-black hover:bg-[#CCFF00] text-black p-4 transition-colors"
                      >
                        <span className="mono font-bold">
                          إنهاء التمرين
                        </span>
                      </button>
                    </div>
                  </motion.div>
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
                    أحسنت!
                  </h3>

                  <p className="text-gray-400 mono mb-2">
                    أنهيت التمرين بنجاح
                  </p>

                  <div className="flex items-center gap-2 text-[#FF6B35] mono text-xl font-bold">
                    <Flame
                      className="w-6 h-6"
                      strokeWidth={2.5}
                    />

                    <span>
                      حرقت {selectedWorkout.calories}{' '}
                      سعرة حرارية
                    </span>
                  </div>

                  <button
                    onClick={handleComplete}
                    className="mt-8 bg-[#CCFF00] hover:bg-[#4ECDC4] border-4 border-black text-black px-8 py-4 transition-colors"
                  >
                    <span className="mono font-bold">
                      إغلاق
                    </span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}