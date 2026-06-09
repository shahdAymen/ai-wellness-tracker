import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, HeartPulse, Moon, RefreshCw, Route, Timer } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { googleFitAPI, isFatalApiError, isIntegrationError } from '../../services/api';

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

export default function DeviceSync() {
  const [summary, setSummary] = useState(null);
  const [integrationMissing, setIntegrationMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    setIntegrationMissing(false);

    try {
      const data = await googleFitAPI.getTodaySummary();
      setSummary(data);
    } catch (err) {
      setSummary(null);

      if (isIntegrationError(err) || (!isFatalApiError(err) && err.status !== 401 && err.status !== 403)) {
        setIntegrationMissing(true);
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);



  if (loading) return <PageLoader label="Loading Google Fit summary..." />;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-hairline dark:border-hairline-strong pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Google Fit</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Connected activity summary</h1>
          <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
            Google Fit data is optional. When it is not connected, this page stays friendly and actionable.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="secondary" onClick={load}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
          {!integrationMissing && summary && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Connected with Google
            </span>
          )}
        </div>
      </div>

      {integrationMissing || !summary ? (
        <EmptyState
          title="No Google Fit account connected."
          message="Google Fit synchronization requires logging in using your Google account. Please log out and sign in with Google to automatically synchronize your metrics (steps, calories, heart rate, active minutes, and sleep)."
        />
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Metric icon={Activity} label="Steps" value={summary.steps} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Metric icon={Flame} label="Calories burned" value={summary.caloriesBurned} suffix="kcal" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Metric icon={Route} label="Distance" value={summary.distanceKm} suffix="km" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Metric icon={Timer} label="Activity minutes" value={summary.activityMinutes} suffix="min" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Metric icon={HeartPulse} label="Average heart rate" value={summary.averageHeartRate} suffix="bpm" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Metric icon={Moon} label="Sleep" value={summary.sleepHours} suffix="h" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value, suffix = '' }) {
  return (
    <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">
            <AnimatedNumber value={value} /> <span className="text-xs font-normal text-ink-mute dark:text-ink-mute-2">{suffix}</span>
          </p>
        </div>
        <div className="rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}
