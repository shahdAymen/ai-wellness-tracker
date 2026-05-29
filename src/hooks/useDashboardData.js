import { useCallback, useEffect, useState } from 'react';
import {
  dashboardAPI,
  getPlanMeals,
  googleFitAPI,
  mealsAPI,
  statsAPI,
  unwrapSettledResult,
  waterAPI,
} from '../services/api';

export function useDashboardData() {
  const [state, setState] = useState({
    dashboard: null,
    todayPlan: null,
    todayMeals: [],
    dailyStats: null,
    waterToday: null,
    googleFit: null,
    emptyStates: {
      dashboard: false,
      meals: false,
      stats: false,
      water: false,
      googleFit: false,
      googleFitIntegrationMissing: false,
    },
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const [dashboard, todayPlan, dailyStats, waterToday, googleFit] = await Promise.allSettled([
      dashboardAPI.getUserDashboard(),
      mealsAPI.getToday(),
      statsAPI.getDaily(),
      waterAPI.getToday(),
      googleFitAPI.getTodaySummary(),
    ]);

    const dashboardResult = unwrapSettledResult(dashboard);
    const todayPlanResult = unwrapSettledResult(todayPlan, { emptyValue: null });
    const dailyStatsResult = unwrapSettledResult(dailyStats, { emptyValue: null });
    const waterTodayResult = unwrapSettledResult(waterToday, { emptyValue: null });
    const googleFitResult = unwrapSettledResult(googleFit, {
      emptyValue: null,
      allowIntegration: true,
    });

    const fatalError = [
      dashboardResult.error,
      todayPlanResult.error,
      dailyStatsResult.error,
      waterTodayResult.error,
      googleFitResult.error,
    ].find(Boolean);

    setState({
      dashboard: dashboardResult.value,
      todayPlan: todayPlanResult.value,
      todayMeals: todayPlanResult.value ? getPlanMeals(todayPlanResult.value) : [],
      dailyStats: dailyStatsResult.value,
      waterToday: waterTodayResult.value,
      googleFit: googleFitResult.value,
      emptyStates: {
        dashboard: dashboardResult.isEmpty,
        meals: todayPlanResult.isEmpty,
        stats: dailyStatsResult.isEmpty,
        water: waterTodayResult.isEmpty,
        googleFit: googleFitResult.isEmpty,
        googleFitIntegrationMissing: googleFitResult.isIntegrationMissing,
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
