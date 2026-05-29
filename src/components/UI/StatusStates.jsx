import React from 'react';
import { AlertCircle, Inbox, Loader2, RefreshCw } from 'lucide-react';
import Button from './Button';

export function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-app-muted">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-black/10 dark:bg-white/10 ${className}`} />;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-rose-800 dark:text-rose-100">{title}</h3>
          {message && <p className="mt-1 text-sm text-rose-700 dark:text-rose-200">{message}</p>}
          {onRetry && (
            <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title = 'No data yet', message, action }) {
  return (
    <div className="rounded-lg border border-dashed border-app bg-app-card p-8 text-center">
      <Inbox className="mx-auto h-10 w-10 text-app-muted" />
      <h3 className="mt-3 text-base font-semibold text-app">{title}</h3>
      {message && <p className="mx-auto mt-2 max-w-md text-sm text-app-muted">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
