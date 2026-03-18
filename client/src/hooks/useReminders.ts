import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

export interface Reminder {
  id: string;
  user_id: string;
  deal_id: string | null;
  trigger_time: string;
  message: string;
  is_sent: boolean;
  status: 'pending' | 'sent' | 'cancelled';
  deals?: { title: string; contacts: { name: string } };
}

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useStore()

  const fetchReminders = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*, deals(title, contacts(name))')
        .eq('user_id', user.id)
        .order('trigger_time', { ascending: true })

      if (error) throw error
      
      const mapped = (data || []).map((r: any) => ({
        ...r,
        status: r.is_sent ? 'sent' : 'pending'
      }));
      
      setReminders(mapped)
    } catch (err) {
      console.error('Fetch reminders error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchReminders()
  }, [fetchReminders])

  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase.from('reminders').delete().eq('id', id)
      if (error) throw error
      setReminders(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error('Delete reminder error:', err)
    }
  }

  return { reminders, loading, refresh: fetchReminders, deleteReminder }
}
