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

import { workoutAPI } from "../../API";

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
    },
    {
      id: 2,
      name: 'تمارين القوة',
      duration: 45,
      calories: 350,
    },
    {
      id: 3,
      name: 'يوجا واسترخاء',
      duration: 20,
      calories: 150,
    },
    {
      id: 4,
      name: 'تمارين البطن',
      duration: 15,
      calories: 200,
    },
  ];

  // =========================
  // ✅ API CALL (FIXED)
  // =========================
  const sendWorkoutToAPI = async () => {
    if (!selectedWorkout) return;

    try {
      await workoutAPI.addWorkout({
        exerciseName: selectedWorkout.name,
        sets: 1,
        reps: 1,
        duration: selectedWorkout.duration,
        caloriesBurned: selectedWorkout.calories,
        date: new Date().toISOString(),
      });

    } catch (err) {
      console.log('API Error:', err);
    }
  };

  // TIMER
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
    }

    return () => clearInterval(interval);
  }, [isActive, selectedWorkout]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = selectedWorkout
    ? (seconds / (selectedWorkout.duration * 60)) * 100
    : 0;

  const handleReset = () => {
    setSeconds(0);
    setIsActive(false);
    setIsCompleted(false);
  };

  const handleFinish = async () => {
    await sendWorkoutToAPI();
    setIsCompleted(true);
  };

  const handleComplete = () => {
    setTimeout(() => {
      onClose();
      setSelectedWorkout(null);
      setSeconds(0);
      setIsActive(false);
      setIsCompleted(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="w-full max-w-2xl bg-[#0A0E27] border-4 border-[#4ECDC4]"
          >

            {/* HEADER */}
            <div className="bg-[#4ECDC4] p-4 flex justify-between">
              <h2 className="font-bold">TRACK WORKOUT</h2>
              <button onClick={onClose}><X /></button>
            </div>

            <div className="p-5">

              {/* LIST */}
              {!selectedWorkout ? (
                workouts.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWorkout(w)}
                    className="block w-full p-3 bg-gray-800 mb-2"
                  >
                    {w.name} - {w.duration} min
                  </button>
                ))
              ) : !isCompleted ? (
                <>
                  <div className="text-5xl text-white text-center">
                    {formatTime(seconds)}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setIsActive(!isActive)}>
                      {isActive ? <Pause /> : <Play />}
                    </button>

                    <button onClick={handleReset}>
                      <RotateCcw />
                    </button>
                  </div>

                  <button
                    onClick={handleFinish}
                    className="w-full mt-4 bg-green-400"
                  >
                    إنهاء التمرين
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <CheckCircle className="text-green-400 w-16 h-16 mx-auto" />
                  <p>تم حفظ التمرين بنجاح</p>

                  <button onClick={handleComplete}>
                    إغلاق
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}