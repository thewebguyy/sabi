import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { Profile, Deal, DealStatus } from '../types'

export type { Deal, Profile, DealStatus }
export const DEFAULT_FOLLOW_UP_DELAY_HOURS = 48;

interface SabiState {
  user: Profile | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  deals: Deal[];
  channel: ReturnType<typeof supabase.channel> | null;
  
  // Auth Actions
  setUser: (user: Profile | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;

  // Deal Actions
  fetchDeals: () => Promise<void>;
  subscribeToDeals: (userId: string) => void;
  createDeal: (dealData: Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Deal | null>;
  updateDeal: (id: string, updates: Partial<Deal>) => Promise<void>;
  markWon: (id: string) => Promise<void>;
  markLost: (id: string) => Promise<void>;
  recordVendorContact: (id: string) => Promise<void>;
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
          let { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle()
          if (!profile) {
            // Auto-create profile if missing
            const { data: newProfile } = await supabase
              .from('profiles')
              .insert([{ id: authUser.id, currency: 'NGN' }])
              .select()
              .single()
            profile = newProfile
          }
          if (profile) {
            set({ user: profile })
            await get().fetchDeals()
            get().subscribeToDeals(authUser.id)
          }
        } catch (err) {
          console.error('[Store Initialize Error]', err)
          set({ user: null, token: null })
        } finally {
          set({ initialized: true, loading: false })
        }
      },

      subscribeToDeals: (userId: string) => {
        if (get().channel) return
        const channel = supabase
          .channel(`deals-${userId}`)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'deals', filter: `user_id=eq.${userId}` },
            (payload: any) => {
              const currentDeals = [...get().deals]
              if (payload.eventType === 'INSERT') {
                set({ deals: [payload.new as Deal, ...currentDeals] })
              } else if (payload.eventType === 'UPDATE') {
                const idx = currentDeals.findIndex(d => d.id === payload.new.id)
                if (idx !== -1) {
                  currentDeals[idx] = { ...currentDeals[idx], ...payload.new }
                  set({ deals: currentDeals })
                }
              } else if (payload.eventType === 'DELETE') {
                set({ deals: currentDeals.filter(d => d.id !== payload.old.id) })
              }
            }
          )
          .subscribe()
        set({ channel })
      },

      fetchDeals: async () => {
        const { user } = get()
        if (!user) return
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('user_id', user.id)
          .order('follow_up_due_at', { ascending: true })
        
        if (error) {
          console.error('[Fetch Deals Error]', error.message)
          return
        }
        set({ deals: (data || []) as Deal[] })
      },

      createDeal: async (dealData) => {
        const { user } = get()
        if (!user) return null
        const now = new Date().toISOString()
        const { data, error } = await supabase
          .from('deals')
          .insert([{
            ...dealData,
            user_id: user.id,
            captured_at: now,
            created_at: now,
            updated_at: now
          }])
          .select()
          .single()

        if (error) {
          console.error('[Create Deal Error]', error.message)
          throw error
        }

        // Log activity
        await supabase.from('activities').insert([{
          user_id: user.id,
          deal_id: data.id,
          activity_type: 'captured'
        }])

        const updatedDeals = [data as Deal, ...get().deals]
        set({ deals: updatedDeals })
        return data as Deal
      },

      updateDeal: async (id, updates) => {
        const now = new Date().toISOString()
        const { error } = await supabase
          .from('deals')
          .update({ ...updates, updated_at: now })
          .eq('id', id)
        
        if (error) {
          console.error('[Update Deal Error]', error.message)
          throw error
        }

        set({
          deals: get().deals.map(d => d.id === id ? { ...d, ...updates, updated_at: now } : d)
        })
      },

      markWon: async (id) => {
        const { user } = get()
        const now = new Date().toISOString()
        await get().updateDeal(id, { status: 'won', won_at: now })
        
        if (user) {
          await supabase.from('activities').insert([{
            user_id: user.id,
            deal_id: id,
            activity_type: 'won'
          }])
        }
      },

      markLost: async (id) => {
        const { user } = get()
        const now = new Date().toISOString()
        await get().updateDeal(id, { status: 'lost', lost_at: now })

        if (user) {
          await supabase.from('activities').insert([{
            user_id: user.id,
            deal_id: id,
            activity_type: 'lost'
          }])
        }
      },

      recordVendorContact: async (id) => {
        const { user } = get()
        const now = new Date().toISOString()
        // Reset follow_up_due_at by default delay hours
        const nextDue = new Date(Date.now() + DEFAULT_FOLLOW_UP_DELAY_HOURS * 3600 * 1000).toISOString()

        await get().updateDeal(id, {
          last_vendor_contact_at: now,
          follow_up_due_at: nextDue
        })

        if (user) {
          await supabase.from('activities').insert([{
            user_id: user.id,
            deal_id: id,
            activity_type: 'followup_sent'
          }])
        }
      },

      updateProfile: async (updates) => {
        const { user } = get()
        if (!user) return
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single()
        
        if (!error && data) {
          set({ user: data as Profile })
        }
      },

      signOut: async () => {
        const { channel } = get()
        if (channel) supabase.removeChannel(channel)
        await supabase.auth.signOut()
        set({ user: null, token: null, deals: [], channel: null })
      }
    }),
    {
      name: 'sabi-store',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
