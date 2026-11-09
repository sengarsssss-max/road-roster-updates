import { useCallback, useEffect, useState } from 'react';
import { fetchRosterMembers } from '@/lib/roster';
import type { RosterMember } from '@/lib/types';

const LOAD_ERROR_MESSAGE = "We couldn't load your roster. Check your connection and try again.";

export function useRoster() {
  const [members, setMembers] = useState<RosterMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMembers(await fetchRosterMembers());
    } catch {
      setError(LOAD_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { members, loading, error, reload };
}
