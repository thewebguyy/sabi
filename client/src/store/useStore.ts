import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface User {
  id: string;
  phone: string;
  business_name: string;
  currency: string;
  whatsapp_connected: boolean;
  plan: string;
}

interface SabiState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
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
      } else {
        set({ user: null, initialized: true, loading: false });
      }
    } catch (error) {
      console.error('Initialization error:', error);
      set({ initialized: true, loading: false });
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    set({ user: profile });
  },

  signUp: async (email, password, businessName) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { business_name: businessName }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('Signup failed');

    // Create profile in our 'users' table
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: data.user.id,
        phone: data.user.email?.split('@')[0], // Extract phone from fake email
        business_name: businessName,
        plan: 'free'
      }]);

    if (profileError) throw profileError;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    set({ user: profile });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  }
}))
