import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export interface User {
  id: string;
  phone: string;
  business_name: string;
  currency: string;
  has_seeded: boolean;
  whatsapp_connected: boolean;
  whatsapp_phone_id?: string;
  follow_up_hours: number;
  notification_preferences: { summary: boolean; ghosting: boolean; payments: boolean };
  created_at: string;
}

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
  last_contact_time: string;
  created_at: string;
  updated_at: string;
  contacts?: { name: string; phone: string; trust_score: number };
}

interface SabiState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  deals: Deal[];
  channel: any | null;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  subscribeToDeals: (userId: string) => void;
  authenticateWithPhone: (phone: string, otp: string, token: string) => Promise<void>;
  fetchDeals: () => Promise<void>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  markPaid: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  seedDemoData: (userId: string) => Promise<void>;
}

export const useStore = create<SabiState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,
      initialized: false,
      deals: [],
      channel: null,

      setUser: (user) => set({ user }),

      initialize: async () => {
        const { token } = get()
        if (!token) {
          set({ initialized: true, loading: false })
          return
        }
        set({ loading: true })
        try {
          const { data: { user: authUser }, error } = await supabase.auth.getUser(token)
          if (error || !authUser) {
            set({ user: null, token: null, initialized: true, loading: false })
            return
          }
          const { data: profile } = await supabase.from('users').select('*').eq('id', authUser.id).single()
          if (profile) {
            set({ user: profile })
            if (!profile.has_seeded) await get().seedDemoData(authUser.id)
            await get().fetchDeals()
            get().subscribeToDeals(authUser.id)
          }
        } catch {
          set({ user: null, token: null })
        } finally {
          set({ initialized: true, loading: false })
        }
      },

      subscribeToDeals: (userId: string) => {
        if (get().channel) return
        const channel = supabase
          .channel(`deals-${userId}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'deals', filter: `user_id=eq.${userId}` }, (payload: any) => {
            const curr = [...get().deals]
            if (payload.eventType === 'INSERT') {
              supabase.from('deals').select('*, contacts(*)').eq('id', payload.new.id).single()
                .then(({ data }) => { if (data) set({ deals: [data as Deal, ...get().deals] }) })
            } else if (payload.eventType === 'UPDATE') {
              const idx = curr.findIndex(d => d.id === payload.new.id)
              if (idx !== -1) { curr[idx] = { ...curr[idx], ...payload.new }; set({ deals: curr }) }
            } else if (payload.eventType === 'DELETE') {
              set({ deals: curr.filter(d => d.id !== payload.old.id) })
            }
          }).subscribe()
        set({ channel })
      },

      authenticateWithPhone: async (_phone, _otp, token) => {
        set({ loading: true })
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser(token)
          if (!authUser) throw new Error('Invalid token')
          const { data: profile } = await supabase.from('users').select('*').eq('id', authUser.id).single()
          set({ user: profile, token })
          if (profile && !profile.has_seeded) await get().seedDemoData(authUser.id)
          await get().fetchDeals()
          get().subscribeToDeals(authUser.id)
        } finally {
          set({ loading: false })
        }
      },

      fetchDeals: async () => {
        const { user } = get()
        if (!user) return
        const { data } = await supabase
          .from('deals').select('*, contacts(*)')
          .eq('user_id', user.id).neq('status', 'paid')
          .order('last_contact_time', { ascending: false })
        set({ deals: (data || []) as Deal[] })
      },

      updateDeal: async (id, updates) => {
        const { error } = await supabase.from('deals')
          .update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
        if (!error) {
          set({ deals: get().deals.map(d => d.id === id ? { ...d, ...updates } : d) })
        }
      },

      markPaid: async (id) => {
        await get().updateDeal(id, { status: 'paid' })
        setTimeout(() => {
          set({ deals: get().deals.filter(d => d.id !== id) })
        }, 1500)
      },

      updateUser: async (updates) => {
        const { user } = get()
        if (!user) return
        const { data, error } = await supabase.from('users').update(updates).eq('id', user.id).select().single()
        if (!error && data) set({ user: data })
      },

      seedDemoData: async (userId: string) => {
        try {
          const { data: contact } = await supabase.from('contacts')
            .insert([{ user_id: userId, name: 'Chidinma O.', phone: '+2348000000001', last_seen: new Date() }])
            .select().single()
          if (!contact) return
          const ago = (d: number) => new Date(Date.now() - d * 86400000).toISOString()
          await supabase.from('deals').insert([
            { user_id: userId, contact_id: contact.id, title: 'Ankara Fabric (6 yards)', amount: 15000, status: 'pending', summary: 'Wants delivery before weekend', last_contact_time: ago(3) },
            { user_id: userId, contact_id: contact.id, title: 'Gucci Belt', amount: 24500, status: 'inquiry', summary: 'Asking about authenticity', last_contact_time: ago(1) },
            { user_id: userId, contact_id: contact.id, title: 'Nike AF1 (Size 42)', amount: 45000, status: 'waiting_payment', summary: 'Said will pay today', last_contact_time: ago(5) },
          ])
          await supabase.from('users').update({ has_seeded: true }).eq('id', userId)
        } catch (err) { console.error('Seed error:', err) }
      },

      signOut: async () => {
        const { channel } = get()
        if (channel) supabase.removeChannel(channel)
        await supabase.auth.signOut()
        set({ user: null, token: null, deals: [], channel: null })
      }
    }),
    {
      name: 'sabi-crm-store',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
