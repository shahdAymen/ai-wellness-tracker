import { useCallback, useEffect, useState } from 'react';
import { getPlanDays, mealsAPI, unwrapSettledResult } from '../services/api';

export function usePlannerData() {
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [monthlyPlan, setMonthlyPlan] = useState(null);
  const [emptyStates, setEmptyStates] = useState({
    weekly: false,
    monthly: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [weekly, monthly] = await Promise.allSettled([
      mealsAPI.getWeekly(),
      mealsAPI.getMonthly(),
    ]);

    const weeklyResult = unwrapSettledResult(weekly, { emptyValue: null });
    const monthlyResult = unwrapSettledResult(monthly, { emptyValue: null });
    const fatalError = [weeklyResult.error, monthlyResult.error].find(Boolean);

    setWeeklyPlan(weeklyResult.value);
    setMonthlyPlan(monthlyResult.value);
    setEmptyStates({
      weekly: weeklyResult.isEmpty,
      monthly: monthlyResult.isEmpty,
    });
    setError(fatalError || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    weeklyPlan,
    monthlyPlan,
    weeklyDays: getPlanDays(weeklyPlan),
    monthlyDays: getPlanDays(monthlyPlan),
    emptyStates,
    loading,
    error,
    reload: load,
  };
}
