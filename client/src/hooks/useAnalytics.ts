import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

export interface AnalyticsSummary {
  totalDeals: number;
  closedDeals: number;
  revenue: number;
  ghosted: number;
  sabiRecovered: number;
}

export const useAnalytics = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useStore();

  const fetchAnalytics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/analytics/summary`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setSummary(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  return { summary, loading, error, refresh: fetchAnalytics };
};
