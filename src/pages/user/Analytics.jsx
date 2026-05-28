import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Loader2,
  RefreshCw,
  Droplets,
  Flame,
} from 'lucide-react';

import { statsAPI, mealsAPI } from '../../API';

export default function Analytics() {
  const [statsHistory, setStatsHistory] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [stats, summary] = await Promise.all([
        statsAPI.getDaily(),
        mealsAPI.getDailySummary(),
      ]);

      setStatsHistory(stats || []);
      setDailySummary(summary || null);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const latest = statsHistory[statsHistory.length - 1];
  const previous = statsHistory[statsHistory.length - 2];

  const getChange = (key) => {
    if (!latest || !previous) return null;
    if (latest[key] == null || previous[key] == null) return null;

    return latest[key] - previous[key];
  };

  const StatCard = ({ label, value, unit, change, color, icon: Icon }) => (
    <div className="border-2 bg-[#0A0E27] p-4" style={{ borderColor: color }}>
      <div className="flex justify-between mb-3">
        <div>
          <div className="text-xs text-gray-400">{label}</div>
          <div className="text-3xl font-bold" style={{ color }}>
            {value ?? '—'} <span className="text-sm">{unit}</span>
          </div>
        </div>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>

      {change !== null && (
        <div className="text-xs flex gap-1">
          {change >= 0 ? (
            <TrendingUp className="w-3 h-3 text-green-400" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-400" />
          )}

          <span className={change >= 0 ? 'text-green-400' : 'text-red-400'}>
            {change > 0 ? '+' : ''}
            {change.toFixed(1)} {unit}
          </span>

          <span className="text-gray-500">vs prev</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">ANALYTICS</h1>

        <button onClick={fetchData} className="p-2 border border-gray-700">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center p-12 text-gray-400">
          <Loader2 className="animate-spin mr-2" />
          Loading...
        </div>
      ) : (
        <>
          {/* Daily Summary */}
          {dailySummary && (
            <div className="border border-orange-500 p-4">
              <h2 className="text-sm text-gray-400 mb-3">
                TODAY'S NUTRITION
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xl text-orange-400">
                    {dailySummary.totalCalories || 0}
                  </div>
                  <div className="text-xs">Calories</div>
                </div>

                <div>
                  <div className="text-xl text-green-400">
                    {dailySummary.totalProtein || 0}g
                  </div>
                  <div className="text-xs">Protein</div>
                </div>

                <div>
                  <div className="text-xl text-blue-400">
                    {dailySummary.totalCarbs || 0}g
                  </div>
                  <div className="text-xs">Carbs</div>
                </div>

                <div>
                  <div className="text-xl text-white">
                    {dailySummary.totalFat || 0}g
                  </div>
                  <div className="text-xs">Fat</div>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          {statsHistory.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="WEIGHT"
                value={latest?.weight}
                unit="kg"
                change={getChange('weight')}
                color="#FF6B35"
                icon={Activity}
              />

              <StatCard
                label="CALORIES"
                value={latest?.calories}
                unit="kcal"
                change={getChange('calories')}
                color="#CCFF00"
                icon={Flame}
              />

              <StatCard
                label="WATER"
                value={latest?.water}
                unit="ml"
                change={getChange('water')}
                color="#4ECDC4"
                icon={Droplets}
              />

              <StatCard
                label="STEPS"
                value={latest?.steps}
                unit="steps"
                change={getChange('steps')}
                color="#fff"
                icon={Activity}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No stats yet
            </div>
          )}
        </>
      )}
    </div>
  );
}