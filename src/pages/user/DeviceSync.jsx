import React, { useEffect, useState } from 'react';
import { Activity, Flame, HeartPulse, Link, Moon, RefreshCw, Route, Timer } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { authAPI, googleFitAPI, isFatalApiError, isIntegrationError } from '../../services/api';

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

  const connectGoogle = () => {
    window.location.href = authAPI.getGoogleLoginUrl();
  };

  if (loading) return <PageLoader label="Loading Google Fit summary..." />;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Google Fit</p>
          <h1 className="mt-2 text-3xl font-bold text-app">Connected activity summary</h1>
          <p className="mt-2 text-sm text-app-muted">
            Google Fit data is optional. When it is not connected, this page stays friendly and actionable.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={load}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={connectGoogle}>
            <Link className="h-4 w-4" />
            Connect Google
          </Button>
        </div>
      </div>

      {integrationMissing || !summary ? (
        <EmptyState
          title="No Google Fit account connected."
          message="Connect Google Fit to sync steps, calories burned, distance, heart rate, activity minutes, and sleep."
          action={
            <Button onClick={connectGoogle}>
              <Link className="h-4 w-4" />
              Connect Google Fit
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Metric icon={Activity} label="Steps" value={summary.steps} />
          <Metric icon={Flame} label="Calories burned" value={summary.caloriesBurned} suffix="kcal" />
          <Metric icon={Route} label="Distance" value={summary.distanceKm} suffix="km" />
          <Metric icon={Timer} label="Activity minutes" value={summary.activityMinutes} suffix="min" />
          <Metric icon={HeartPulse} label="Average heart rate" value={summary.averageHeartRate} suffix="bpm" />
          <Metric icon={Moon} label="Sleep" value={summary.sleepHours} suffix="h" />
        </div>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value, suffix = '' }) {
  return (
    <Card className="border border-app">
      <Icon className="h-7 w-7 text-emerald-400" />
      <p className="mt-4 text-sm text-app-muted">{label}</p>
      <p className="mt-1 text-3xl font-bold text-app">
        {Number(value || 0).toLocaleString()} {suffix}
      </p>
    </Card>
  );
}
