import React, { useEffect, useState } from 'react';
import {
  Flame,
  Zap,
  Droplets,
  Utensils,
  Dumbbell,
  Watch,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';

import { Card } from '../../components/UI/Card';
import { ProgressCircle } from '../../components/UI/ProgressCircles';
import Button from '../../components/UI/Button';
import { ChatBot } from '../../components/ChatBot/ChatBot';

export function UserDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = {
    calories: { current: 1450, target: 2200 },
    burned: { current: 450, target: 600 },
    hydration: { current: 1250, target: 3500 },
  };

  const upNext = [
    {
      id: 1,
      icon: Utensils,
      name: 'Salmon Quinoa Bowl',
      time: '12:00 PM',
      calories: '450 kcal',
      color: 'text-orange-500',
      borderColor: 'border-orange-500',
    },
    {
      id: 2,
      icon: Dumbbell,
      name: 'HIIT Cardio Blast',
      time: '17:30 PM',
      calories: '30 mins',
      color: 'text-red-500',
      borderColor: 'border-red-500',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate={mounted ? 'show' : 'hidden'}
      className="space-y-6 p-4"
    >
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {[ 
          {
            icon: Utensils,
            label: 'Calories',
            data: stats.calories,
            color: '#f97316',
          },
          {
            icon: Flame,
            label: 'Burned',
            data: stats.burned,
            color: '#ef4444',
          },
          {
            icon: Droplets,
            label: 'Hydration',
            data: stats.hydration,
            color: '#3b82f6',
          },
        ].map((itemData, i) => {
          const Icon = itemData.icon;

          return (
            <motion.div key={i} variants={item}>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <div>
                      <p className="text-xs uppercase">{itemData.label}</p>
                      <p className="text-2xl">
                        {itemData.data.current}{' '}
                        <span className="text-sm text-gray-500">
                          / {itemData.data.target}
                        </span>
                      </p>
                    </div>
                  </div>

                  <ProgressCircle
                    value={itemData.data.current}
                    max={itemData.data.target}
                    color={itemData.color}
                  />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Up Next */}
      <motion.div variants={item}>
        <Card>
          <h3 className="mb-4">Up Next</h3>

          <div className="space-y-4">
            {upNext.map((task) => {
              const Icon = task.icon;

              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${task.borderColor}`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className={`w-6 h-6 ${task.color}`} />
                    <div>
                      <p>{task.name}</p>
                      <p className="text-sm text-gray-500">
                        {task.calories} • {task.time}
                      </p>
                    </div>
                  </div>

                  <button>
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Device */}
      <motion.div variants={item}>
        <Card>
          <div className="flex justify-between mb-4">
            <div className="flex gap-2 items-center">
              <Watch className="w-5 h-5" />
              <span>Device Sync</span>
            </div>

            <span className="text-green-500 text-xs">LIVE</span>
          </div>

          <div className="grid grid-cols-3 text-center">
            <div>
              <p className="text-2xl">112</p>
              <p className="text-xs">BPM</p>
            </div>
            <div>
              <p className="text-2xl">8.4k</p>
              <p className="text-xs">Steps</p>
            </div>
            <div>
              <p className="text-2xl">7h</p>
              <p className="text-xs">Sleep</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button>
          <Zap className="w-5 h-5" />
          Generate AI Plan
        </Button>

        <Button>
          <Utensils className="w-5 h-5" />
          Log Meal
        </Button>

        <Button>
          <Dumbbell className="w-5 h-5" />
          Track Workout
        </Button>
      </div>

      {/* ChatBot */}
      <ChatBot />
    </motion.div>
  );
}

export default UserDashboard;