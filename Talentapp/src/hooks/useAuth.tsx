import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

type AuthUser = {
  id: string;
  email?: string;
} | null;

type AuthResponse = {
  user: AuthUser;
  error: Error | null;
};

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser>(null);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { user: data.user, error };
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data.user, error };
  };

  const signOut = async (): Promise<{ error: Error | null }> => {
    const { error } = await supabase.auth.signOut();
    return { error };
    
  };

  return { user, signUp, signIn, signOut };
};