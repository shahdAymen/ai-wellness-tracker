import { useCallback, useEffect, useRef, useState } from 'react';
import { getPlanDays, getPlanMeals, mealsAPI, statsAPI, unwrapSettledResult, waterAPI } from '../services/api';

export function useTrackerData() {
  const isInitialLoad = useRef(true);
  const [state, setState] = useState({
    stats: null,
    waterHistory: [],
    waterToday: null,
    todayPlan: null,
    todayMeals: [],
    emptyStates: {
      stats: false,
      waterHistory: false,
      waterToday: false,
      meals: false,
    },
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    if (isInitialLoad.current) {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    } else {
      setState((prev) => ({ ...prev, error: null }));
    }

    const [stats, waterHistory, weeklyPlan] = await Promise.allSettled([
      statsAPI.getDaily(),
      waterAPI.getHistory(),
      mealsAPI.getWeekly(),
    ]);

    const statsResult = unwrapSettledResult(stats, { emptyValue: null });
    const waterHistoryResult = unwrapSettledResult(waterHistory, { emptyValue: [] });
    const weeklyPlanResult = unwrapSettledResult(weeklyPlan, { emptyValue: null });

    const fatalError = [
      statsResult.error,
      waterHistoryResult.error,
      weeklyPlanResult.error,
    ].find(Boolean);

    // Get today's local date string
    const todayLocal = new Date();
    const yyyy = todayLocal.getFullYear();
    const mm = String(todayLocal.getMonth() + 1).padStart(2, '0');
    const dd = String(todayLocal.getDate()).padStart(2, '0');
    const todayDateString = `${yyyy}-${mm}-${dd}`;

    // Get shifted/synchronized days and find today's plan day
    const weeklyDays = getPlanDays(weeklyPlanResult.value);
    const todayPlanDay = weeklyDays.find((day) => day.date === todayDateString) || null;
    const todayMeals = todayPlanDay ? (todayPlanDay.meals || []) : [];

    // Filter waterHistory to only keep entries matching today's local date
    const rawWaterHistory = Array.isArray(waterHistoryResult.value) ? waterHistoryResult.value : [];
    const syncedWaterHistory = rawWaterHistory.filter((entry) => {
      if (!entry.date) return false;
      const datePart = entry.date.includes('T') ? entry.date.split('T')[0] : entry.date;
      return datePart === todayDateString;
    });

    // Compute today's water summary dynamically from local date-filtered history
    const waterTodayValue = {
      totalAmount: syncedWaterHistory.reduce((sum, entry) => sum + Number(entry.amount || 0), 0),
      logsCount: syncedWaterHistory.length,
      date: todayDateString,
    };

    setState({
      stats: statsResult.value,
      waterHistory: syncedWaterHistory,
      waterToday: waterTodayValue,
      todayPlan: todayPlanDay,
      todayMeals: todayMeals,
      emptyStates: {
        stats: statsResult.isEmpty,
        waterHistory: waterHistoryResult.isEmpty || syncedWaterHistory.length === 0,
        waterToday: waterHistoryResult.isEmpty || waterTodayValue.totalAmount === 0,
        meals: todayPlanDay === null || todayMeals.length === 0,
      },
      loading: false,
      error: fatalError || null,
    });
    isInitialLoad.current = false;
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
