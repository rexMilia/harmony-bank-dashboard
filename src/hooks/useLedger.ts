import { useState, useEffect, useCallback } from 'react';
import { transactionService, LedgerEntry } from '@/services/transactions';

export const useLedger = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLedger = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await transactionService.getLedger();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  return { entries, isLoading, error, refetch: fetchLedger };
};
