import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface User {
  id: string;
  phone: string;
  business_name: string;
  currency: string;
  has_seeded: boolean;
  created_at: string;
}

interface SabiState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  deals: any[];
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  seedDemoData: (userId: string) => Promise<void>;
  fetchDeals: () => Promise<void>;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, businessName: string) => Promise<void>;
}

export const useStore = create<SabiState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  deals: [],

  setUser: (user) => set({ user }),

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userProfile) {
          set({ user: userProfile });
          
          // Seed check: 
          if (!userProfile.has_seeded) {
            await get().seedDemoData(session.user.id);
            // Re-fetch profile to get updated has_seeded
            const { data: updatedProfile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            set({ user: updatedProfile });
          }
          
          // Fetch initial deals
          await get().fetchDeals();

          // Set up realtime sub
          supabase
            .channel(`deals-user-${session.user.id}`)
            .on('postgres_changes', { 
               event: '*', 
               schema: 'public', 
               table: 'deals', 
               filter: `user_id=eq.${session.user.id}` 
            }, () => {
              get().fetchDeals();
            })
            .subscribe();
        }

        set({ initialized: true, loading: false });
      } else {
        set({ user: null, initialized: true, loading: false, deals: [] });
      }
    } catch (error) {
      console.error('Initialization error:', error);
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
    
    set({ deals: deals || [] });
  },

  seedDemoData: async (userId: string) => {
    try {
      // 1. Create a demo contact
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

      // 2. Insert 6 demo deals
      await supabase.from('deals').insert([
        { user_id: userId, contact_id: contact.id, title: 'Ankara Fabric (6 yards)', amount: 15000, status: 'pending', summary: 'Hot lead from WhatsApp' },
        { user_id: userId, contact_id: contact.id, title: 'Gucci Belt (Black)', amount: 24500, status: 'paid', summary: 'Successfully closed' },
        { user_id: userId, contact_id: contact.id, title: 'Nike AF1 White', amount: 45000, status: 'inquiry', summary: 'Checking stock 10/10' },
        { user_id: userId, contact_id: contact.id, title: 'G-Shock Watch', amount: 12000, status: 'ghosted', summary: 'Stoppped replying after price' },
        { user_id: userId, contact_id: contact.id, title: 'Designer Perfume', amount: 35000, status: 'waiting_payment', summary: 'Awaiting transfer' },
        { user_id: userId, contact_id: contact.id, title: 'Sample Sneakers 44', amount: 18000, status: 'pending', summary: 'Size 44 check' }
      ]);

      // 3. Mark as seeded
      await supabase.from('users').update({ has_seeded: true }).eq('id', userId);
    } catch (err) {
      console.error('Seed error:', err);
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    if (data.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      set({ user: profile });
    }
  },

  signUp: async (email, password, businessName) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { business_name: businessName } }
    });
    if (error) throw error;

    if (data.user) {
      const { data: profile } = await supabase
        .from('users')
        .insert([{ 
          id: data.user.id, 
          phone: email.split('@')[0], 
          business_name: businessName 
        }])
        .select()
        .single();
      set({ user: profile });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  }
}));
