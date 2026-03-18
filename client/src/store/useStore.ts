import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface User {
  id: string;
  phone: string;
  business_name: string;
  created_at: string;
}

interface SabiState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  seedDemoData: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, businessName: string) => Promise<void>;
}

export const useStore = create<SabiState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

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
        
        set({ user: userProfile, initialized: true, loading: false });

        // Seed check: If no deals, add demo ones
        const { count } = await supabase.from('deals').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id);
        if (count === 0) {
          await get().seedDemoData(session.user.id);
        }
      } else {
        set({ user: null, initialized: true, loading: false });
      }
    } catch (error) {
      console.error('Initialization error:', error);
      set({ initialized: true, loading: false });
    }
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
