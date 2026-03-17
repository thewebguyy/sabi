import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

export interface Deal {
  id: string;
  user_id: string;
  contact_id: string;
  title: string;
  amount: number;
  currency: string;
  status: 'inquiry' | 'pending' | 'waiting_payment' | 'paid' | 'ghosted';
  summary: string;
  customer_constraint: string;
  ai_suggested_reply: string;
  created_at: string;
  updated_at: string;
  contacts?: {
    name: string;
    phone: string;
    trust_score: number;
  };
}

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useStore();

  const fetchDeals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*, contacts(name, phone, trust_score)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [user]);

  return { deals, loading, error, refresh: fetchDeals };
};
