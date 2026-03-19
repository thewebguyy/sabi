import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface User {
  id: string;
  phone: string;
  business_name: string;
  currency: string;
  has_seeded: boolean;
  notification_preferences: {
    summary: boolean;
    ghosting: boolean;
    payments: boolean;
  };
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
  created_at: string;
  updated_at: string;
  contacts?: {
    name: string;
    phone: string;
    trust_score: number;
  };
}

interface SabiState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  deals: Deal[];
  channel: any | null;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  seedDemoData: (userId: string) => Promise<void>;
  fetchDeals: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserPreferences: (prefs: Partial<User['notification_preferences']>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, businessName: string) => Promise<void>;
}

export const useStore = create<SabiState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  deals: [],
  channel: null,

  setUser: (user) => set({ user }),

  initialize: async () => {
    // 1. Initial Session Check
    const { data: { session } } = await supabase.auth.getSession();
    
    // 2. Auth State Callback
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth change event:', event);
      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userProfile) {
          set({ user: userProfile });
          
          if (!userProfile.has_seeded) {
            await get().seedDemoData(session.user.id);
            const { data: updatedProfile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            set({ user: updatedProfile });
          }
          
          await get().fetchDeals();

          // Realtime logic
          if (!get().channel) {
            const channel = supabase
              .channel(`deals-user-${session.user.id}`)
              .on('postgres_changes', { 
                 event: '*', 
                 schema: 'public', 
                 table: 'deals', 
                 filter: `user_id=eq.${session.user.id}` 
              }, (payload: any) => {
                // Optimized In-place Updates
                const currentDeals = [...get().deals];
                
                if (payload.eventType === 'INSERT') {
                  // Fetch the new deal with contacts join (since postgres_changes payload usually only contains the table columns)
                  supabase
                    .from('deals')
                    .select('*, contacts(*)')
                    .eq('id', payload.new.id)
                    .single()
                    .then(({ data }) => {
                      if (data) set({ deals: [data as Deal, ...get().deals] });
                    });
                } else if (payload.eventType === 'UPDATE') {
                  const index = currentDeals.findIndex(d => d.id === payload.new.id);
                  if (index !== -1) {
                    // Update only fields, but keep contact data
                    currentDeals[index] = { ...currentDeals[index], ...payload.new };
                    set({ deals: currentDeals });
                  }
                } else if (payload.eventType === 'DELETE') {
                  set({ deals: currentDeals.filter(d => d.id !== payload.old.id) });
                }
              })
              .subscribe();
            set({ channel });
          }
        }
        set({ initialized: true, loading: false });
      } else {
        // Cleanup on logout event
        if (get().channel) {
          supabase.removeChannel(get().channel);
        }
        set({ user: null, initialized: true, loading: false, deals: [], channel: null });
      }
    });

    // Handle initial state if session already exists
    if (!session?.user) {
      set({ initialized: true, loading: false });
    }
  },

  fetchDeals: async () => {
    const { user } = get();
    if (!user) return;
    
    const { data: deals } = await supabase
      .from('deals')
      .select('*, contacts(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    set({ deals: (deals || []) as Deal[] });
  },

  updateUserPreferences: async (prefs) => {
    const { user } = get();
    if (!user) return;

    const newPrefs = { ...user.notification_preferences, ...prefs };
    const { data, error } = await supabase
      .from('users')
      .update({ notification_preferences: newPrefs })
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) set({ user: data });
  },

  seedDemoData: async (userId: string) => {
    try {
      const { data: contact } = await supabase
        .from('contacts')
        .insert([{
          user_id: userId,
          name: 'Chidinma O.',
          phone: '+2348000000001',
          last_seen: new Date()
        }])
        .select()
        .single();
      
      if (!contact) return;

      await supabase.from('deals').insert([
        { user_id: userId, contact_id: contact.id, title: 'Ankara Fabric', amount: 15000, status: 'pending', summary: 'Hot lead from WhatsApp' },
        { user_id: userId, contact_id: contact.id, title: 'Gucci Belt', amount: 24500, status: 'paid', summary: 'Successfully closed' },
        { user_id: userId, contact_id: contact.id, title: 'Nike AF1', amount: 45000, status: 'inquiry', summary: 'Checking stock' },
        { user_id: userId, contact_id: contact.id, title: 'G-Shock Watch', amount: 12000, status: 'ghosted', summary: 'Stopped replying' },
        { user_id: userId, contact_id: contact.id, title: 'Designer Perfume', amount: 35000, status: 'waiting_payment', summary: 'Awaiting transfer' },
        { user_id: userId, contact_id: contact.id, title: 'Sample Sneakers', amount: 18000, status: 'pending', summary: 'Size check' }
      ]);

      await supabase.from('users').update({ has_seeded: true }).eq('id', userId);
    } catch (err) {
      console.error('Seed error:', err);
    }
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  signUp: async (email, password, businessName) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { business_name: businessName } }
    });
    if (error) throw error;

    if (data.user) {
      await supabase
        .from('users')
        .insert([{ 
          id: data.user.id, 
          phone: email.split('@')[0], 
          business_name: businessName,
          notification_preferences: { summary: true, ghosting: true, payments: true }
        }]);
    }
  },

  signOut: async () => {
    const { channel } = get();
    if (channel) {
      await supabase.removeChannel(channel);
    }
    await supabase.auth.signOut();
    set({ user: null, deals: [], channel: null });
  }
}));
