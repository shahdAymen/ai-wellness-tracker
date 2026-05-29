import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((items) => items.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message, type = 'info', duration = 4200 }) => {
      const id = crypto.randomUUID();
      setToasts((items) => [...items, { id, title, message, type }]);
      window.setTimeout(() => removeToast(id), duration);
      return id;
    },
    [removeToast]
  );

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          return (
            <div
              key={toast.id}
              className="rounded-lg border border-gray-200 bg-white p-4 text-gray-900 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              role="status"
            >
              <div className="flex gap-3">
                <Icon
                  className={`mt-0.5 h-5 w-5 ${
                    toast.type === 'success'
                      ? 'text-emerald-500'
                      : toast.type === 'error'
                        ? 'text-rose-500'
                        : 'text-blue-500'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
                  {toast.message && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {toast.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="rounded-md p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return context;
}
