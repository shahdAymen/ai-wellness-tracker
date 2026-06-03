import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPlanDays, mealsAPI, unwrapSettledResult } from '../services/api';

export function usePlannerData() {
  const isInitialLoad = useRef(true);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [monthlyPlan, setMonthlyPlan] = useState(null);
  const [emptyStates, setEmptyStates] = useState({
    weekly: false,
    monthly: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (isInitialLoad.current) {
      setLoading(true);
    }
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
    isInitialLoad.current = false;
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const weeklyDays = useMemo(() => getPlanDays(weeklyPlan), [weeklyPlan]);
  const monthlyDays = useMemo(() => getPlanDays(monthlyPlan), [monthlyPlan]);

  return {
    weeklyPlan,
    monthlyPlan,
    weeklyDays,
    monthlyDays,
    emptyStates,
    loading,
    error,
    reload: load,
  };
}

