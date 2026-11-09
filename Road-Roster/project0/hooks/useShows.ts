import { useCallback, useEffect, useState } from 'react';
import { fetchShows } from '@/lib/shows';
import type { Show } from '@/lib/types';

const LOAD_ERROR_MESSAGE = "We couldn't load your shows. Check your connection and try again.";

export function useShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setShows(await fetchShows());
    } catch {
      setError(LOAD_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { shows, loading, error, reload };
}
