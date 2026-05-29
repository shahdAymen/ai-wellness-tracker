import { useCallback, useEffect, useState } from 'react';

export function useAsyncResource(loader, { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(immediate));
  const [error, setError] = useState(null);

  const run = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loader(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    if (!immediate) return;
    run().catch(() => {});
  }, [immediate, run]);

  return { data, setData, loading, error, run, retry: run };
}
