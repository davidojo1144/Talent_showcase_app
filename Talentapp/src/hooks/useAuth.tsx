// hooks/useAuth.ts
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [loading, setLoading] = useState(true);

  // Enhanced auth state listener
  useEffect(() => {
    setLoading(true);
    // First check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Then set up listener for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      toast.success('Account created! Check your email for verification.');
      return { user: data.user, error: null };
    } catch (error) {
      toast.error(`Sign up failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { user: null, error: error as Error };
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast.success(`Welcome back, ${data.user?.email}!`);
      return { user: data.user, error: null };
    } catch (error) {
      toast.error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { user: null, error: error as Error };
    }
  };

  const signOut = async (): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.info('You have been logged out');
      return { error: null };
    } catch (error) {
      toast.error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { error: error as Error };
    }
  };

  return { user, loading, signUp, signIn, signOut };
};