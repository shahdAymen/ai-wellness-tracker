import { useCallback, useEffect, useState } from 'react';
import { getPlanMeals, mealsAPI, statsAPI, unwrapSettledResult, waterAPI } from '../services/api';

export function useTrackerData() {
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
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const [stats, waterHistory, waterToday, todayPlan] = await Promise.allSettled([
      statsAPI.getDaily(),
      waterAPI.getHistory(),
      waterAPI.getToday(),
      mealsAPI.getToday(),
    ]);

    const statsResult = unwrapSettledResult(stats, { emptyValue: null });
    const waterHistoryResult = unwrapSettledResult(waterHistory, { emptyValue: [] });
    const waterTodayResult = unwrapSettledResult(waterToday, { emptyValue: null });
    const todayPlanResult = unwrapSettledResult(todayPlan, { emptyValue: null });

    const fatalError = [
      statsResult.error,
      waterHistoryResult.error,
      waterTodayResult.error,
      todayPlanResult.error,
    ].find(Boolean);

    setState({
      stats: statsResult.value,
      waterHistory: Array.isArray(waterHistoryResult.value) ? waterHistoryResult.value : [],
      waterToday: waterTodayResult.value,
      todayPlan: todayPlanResult.value,
      todayMeals: todayPlanResult.value ? getPlanMeals(todayPlanResult.value) : [],
      emptyStates: {
        stats: statsResult.isEmpty,
        waterHistory: waterHistoryResult.isEmpty || (Array.isArray(waterHistoryResult.value) && waterHistoryResult.value.length === 0),
        waterToday: waterTodayResult.isEmpty,
        meals: todayPlanResult.isEmpty,
      },
      loading: false,
      error: fatalError || null,
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
