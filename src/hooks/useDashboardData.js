import { useCallback, useEffect, useRef, useState } from 'react';
import {
  dashboardAPI,
  getPlanDays,
  googleFitAPI,
  mealsAPI,
  statsAPI,
  unwrapSettledResult,
  waterAPI,
} from '../services/api';

export function useDashboardData() {
  const isInitialLoad = useRef(true);
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
    if (isInitialLoad.current) {
      setState((prev) => ({ ...prev, loading: true, error: null }));
    } else {
      setState((prev) => ({ ...prev, error: null }));
    }

    const [dashboard, weeklyPlan, dailyStats, waterHistory, googleFit] = await Promise.allSettled([
      dashboardAPI.getUserDashboard(),
      mealsAPI.getWeekly(),
      statsAPI.getDaily(),
      waterAPI.getHistory(),
      googleFitAPI.getTodaySummary(),
    ]);

    const dashboardResult = unwrapSettledResult(dashboard);
    const weeklyPlanResult = unwrapSettledResult(weeklyPlan, { emptyValue: null });
    const dailyStatsResult = unwrapSettledResult(dailyStats, { emptyValue: null });
    const waterHistoryResult = unwrapSettledResult(waterHistory, { emptyValue: [] });
    const googleFitResult = unwrapSettledResult(googleFit, {
      emptyValue: null,
      allowIntegration: true,
    });

    const fatalError = [
      dashboardResult.error,
      weeklyPlanResult.error,
      dailyStatsResult.error,
      waterHistoryResult.error,
      googleFitResult.error,
    ].find(Boolean);

    // Get shifted/synchronized days
    const weeklyDays = getPlanDays(weeklyPlanResult.value);

    // Find the day corresponding to today's local date (formatted as YYYY-MM-DD)
    const todayLocal = new Date();
    const yyyy = todayLocal.getFullYear();
    const mm = String(todayLocal.getMonth() + 1).padStart(2, '0');
    const dd = String(todayLocal.getDate()).padStart(2, '0');
    const todayDateString = `${yyyy}-${mm}-${dd}`;

    const todayPlanDay = weeklyDays.find((day) => day.date === todayDateString) || null;
    const todayMeals = todayPlanDay ? (todayPlanDay.meals || []) : [];

    // Filter waterHistory to only keep entries matching today's local date
    const rawWaterHistory = Array.isArray(waterHistoryResult.value) ? waterHistoryResult.value : [];
    const todayWaterLogs = rawWaterHistory.filter((entry) => {
      if (!entry.date) return false;
      const datePart = entry.date.includes('T') ? entry.date.split('T')[0] : entry.date;
      return datePart === todayDateString;
    });

    // Compute today's water summary dynamically from local date-filtered history
    const waterTodayValue = {
      totalAmount: todayWaterLogs.reduce((sum, entry) => sum + Number(entry.amount || 0), 0),
      logsCount: todayWaterLogs.length,
      date: todayDateString,
    };

    // Calculate consumed, total, remaining calories and completed meals dynamically to match the synchronized UI!
    const targetCalories = dashboardResult.value?.targetCalories || 0;
    const totalMeals = todayMeals.length;
    const completedMeals = todayMeals.filter((m) => m.isCompleted).length;
    const consumedCalories = todayMeals
      .filter((m) => m.isCompleted)
      .reduce((sum, m) => sum + Number(m.calories || 0), 0);
    const remainingCalories = Math.max(0, targetCalories - consumedCalories);

    const mergedDashboard = dashboardResult.value ? {
      ...dashboardResult.value,
      totalMeals,
      completedMeals,
      consumedCalories,
      remainingCalories,
    } : null;

    setState({
      dashboard: mergedDashboard,
      todayPlan: todayPlanDay,
      todayMeals: todayMeals,
      dailyStats: dailyStatsResult.value,
      waterToday: waterTodayValue,
      googleFit: googleFitResult.value,
      emptyStates: {
        dashboard: dashboardResult.isEmpty || todayMeals.length === 0,
        meals: todayPlanDay === null,
        stats: dailyStatsResult.isEmpty,
        water: waterHistoryResult.isEmpty || waterTodayValue.totalAmount === 0,
        googleFit: googleFitResult.isEmpty,
        googleFitIntegrationMissing: googleFitResult.isIntegrationMissing,
      },
      loading: false,
      error: fatalError || null,
    });
    isInitialLoad.current = false;
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handler = () => load();
    window.addEventListener('vitalityai:dashboard-refresh', handler);
    return () => window.removeEventListener('vitalityai:dashboard-refresh', handler);
  }, [load]);

  return { ...state, reload: load };
}
