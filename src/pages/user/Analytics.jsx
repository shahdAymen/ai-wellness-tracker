import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Droplets, Flame, RefreshCw, Scale, Utensils } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { mealsAPI, statsAPI, unwrapSettledResult } from '../../services/api';
import AnimatedNumber from '../../components/UI/AnimatedNumber';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

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
      <div className="space-y-8 max-w-7xl mx-auto font-sans">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-hairline dark:border-hairline-strong pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Analytics</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Today's backend summary</h1>
          </div>
          <Button variant="secondary" onClick={load}>
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
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
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-hairline dark:border-hairline-strong pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Analytics</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Today's backend summary</h1>
          <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
            Daily analytics stay graceful for new users and sparse accounts instead of failing on empty backend data.
          </p>
        </div>
        <Button variant="secondary" onClick={load}>
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {emptyStates.stats && (
        <EmptyState
          title="No health metrics recorded yet."
          message="Record daily metrics to unlock deeper analytics."
        />
      )}

      <motion.div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Metric icon={Flame} label="Consumed calories" value={summary?.consumedCalories ?? stats?.caloriesConsumed ?? 0} unit="kcal" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Metric icon={Utensils} label="Remaining calories" value={summary?.remainingCalories ?? 0} unit="kcal" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Metric icon={Scale} label="Weight" value={stats?.currentWeight ?? 0} unit="kg" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Metric icon={Activity} label="Steps" value={stats?.steps ?? 0} unit="steps" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Metric icon={Droplets} label="Water intake" value={stats?.waterIntake ?? 0} unit="L" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Metric icon={Activity} label="BMI" value={stats?.bmi ?? 0} unit="" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Metric icon={Activity} label="Waist" value={stats?.waist ?? 0} unit="cm" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Metric icon={Activity} label="Chest" value={stats?.chest ?? 0} unit="cm" />
        </motion.div>
      </motion.div>

      <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
        <div className="flex items-center justify-between pb-4 border-b border-hairline dark:border-hairline-strong mb-5">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark">Meal completion</h2>
            <p className="text-xs text-ink-mute dark:text-ink-mute-2 mt-0.5">
              <AnimatedNumber value={summary?.completedMeals || 0} /> of <AnimatedNumber value={summary?.totalMeals || 0} /> planned meals
            </p>
          </div>
          <span className="text-base font-bold text-primary"><AnimatedNumber value={`${mealProgress}%`} /></span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-hairline dark:bg-hairline-strong">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${mealProgress}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="h-full rounded-full bg-primary"
          />
        </div>
        {emptyStates.summary && (
          <p className="mt-4 text-xs text-ink-mute dark:text-ink-mute-2">
            No meal summary is available yet. Generate a plan and complete meals to populate this section.
          </p>
        )}
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value, unit }) {
  return (
    <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">
            <AnimatedNumber value={value} /> <span className="text-xs font-normal text-ink-mute dark:text-ink-mute-2">{unit}</span>
          </p>
        </div>
        <div className="rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}
