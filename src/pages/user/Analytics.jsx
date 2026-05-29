import React, { useEffect, useState } from 'react';
import { Activity, Droplets, Flame, RefreshCw, Scale, Utensils } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { mealsAPI, statsAPI, unwrapSettledResult } from '../../services/api';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [emptyStates, setEmptyStates] = useState({ stats: false, summary: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const [dailyStats, mealSummary] = await Promise.allSettled([
      statsAPI.getDaily(),
      mealsAPI.getDailySummary(),
    ]);

    const statsResult = unwrapSettledResult(dailyStats, { emptyValue: null });
    const summaryResult = unwrapSettledResult(mealSummary, { emptyValue: null });
    const fatalError = [statsResult.error, summaryResult.error].find(Boolean);

    setStats(statsResult.value);
    setSummary(summaryResult.value);
    setEmptyStates({
      stats: statsResult.isEmpty,
      summary: summaryResult.isEmpty,
    });
    setError(fatalError || null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <PageLoader label="Loading analytics..." />;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  if (!stats && !summary) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Analytics</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Today&apos;s backend summary</h1>
        </div>
        <EmptyState
          title="Not enough data available to generate analytics."
          message="Record daily metrics to unlock insights."
          action={<Button onClick={load}>Refresh analytics</Button>}
        />
      </div>
    );
  }

  const mealProgress = summary?.totalMeals
    ? Math.round((summary.completedMeals / summary.totalMeals) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Analytics</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Today&apos;s backend summary</h1>
          <p className="mt-2 text-sm text-slate-300">
            Daily analytics stay graceful for new users and sparse accounts instead of failing on empty backend data.
          </p>
        </div>
        <Button variant="outline" onClick={load}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {emptyStates.stats && (
        <EmptyState
          title="No health metrics recorded yet."
          message="Record daily metrics to unlock deeper analytics."
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Flame} label="Consumed calories" value={summary?.consumedCalories ?? stats?.caloriesConsumed ?? 0} unit="kcal" />
        <Metric icon={Utensils} label="Remaining calories" value={summary?.remainingCalories ?? 0} unit="kcal" />
        <Metric icon={Scale} label="Weight" value={stats?.currentWeight ?? 0} unit="kg" />
        <Metric icon={Activity} label="Steps" value={stats?.steps ?? 0} unit="steps" />
        <Metric icon={Droplets} label="Water intake" value={stats?.waterIntake ?? 0} unit="L" />
        <Metric icon={Activity} label="BMI" value={stats?.bmi ?? 0} unit="" />
        <Metric icon={Activity} label="Waist" value={stats?.waist ?? 0} unit="cm" />
        <Metric icon={Activity} label="Chest" value={stats?.chest ?? 0} unit="cm" />
      </div>

      <Card className="border border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Meal completion</h2>
            <p className="mt-1 text-sm text-slate-400">
              {summary?.completedMeals || 0} of {summary?.totalMeals || 0} planned meals
            </p>
          </div>
          <span className="text-2xl font-bold text-emerald-400">{mealProgress}%</span>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${mealProgress}%` }} />
        </div>
        {emptyStates.summary && (
          <p className="mt-4 text-sm text-slate-400">
            No meal summary is available yet. Generate a plan and complete meals to populate this section.
          </p>
        )}
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value, unit }) {
  return (
    <Card className="border border-slate-700 bg-slate-900">
      <Icon className="h-6 w-6 text-emerald-400" />
      <p className="mt-4 text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">
        {Number(value || 0).toLocaleString()} {unit}
      </p>
    </Card>
  );
}
