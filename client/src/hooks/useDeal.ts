import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { Deal } from './useDeals';

export interface Message {
  id: string;
  body: string;
  direction: 'inbound' | 'outbound';
  timestamp: string;
}

export const useDeal = (id: string | undefined) => {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useStore();

  const fetchDeal = async () => {
    if (!user || !id) return;
    
    setLoading(true);
    try {
      // 1. Fetch deal details
      const { data: dealData, error: dealError } = await supabase
        .from('deals')
        .select('*, contacts(*)')
        .eq('id', id)
        .single();

      if (dealError) throw dealError;
      setDeal(dealData);

      // 2. Fetch chat messages
      const { data: msgData, error: msgError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('deal_id', id)
        .order('timestamp', { ascending: true });

      if (msgError) throw msgError;
      setMessages(msgData || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeal();

    // Subscribe to real-time chat messages
    if (!id) return;
    const channel = supabase
      .channel(`chat_${id}`)
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `deal_id=eq.${id}` }, 
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, id]);

  return { deal, messages, loading, error, refresh: fetchDeal };
};
