import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

export interface Contact {
  id: string;
  user_id: string;
  whatsapp_id: string;
  name: string;
  phone: string;
  trust_score: number;
  last_seen: string;
  created_at: string;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useStore();

  const fetchContacts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('last_seen', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  return { contacts, loading, error, refresh: fetchContacts };
};
