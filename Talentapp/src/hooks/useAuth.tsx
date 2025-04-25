import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ... (keep your existing types)

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser>(null);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      // if (event === 'SIGNED_IN') {
      //   toast.success(`Welcome back, ${session?.user.email}!`);
      // }
      // if (event === 'SIGNED_OUT') {
      //   toast.info('You have been logged out');
      // }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!error) {
      toast.success('Account created successfully! Please check your email for verification.');
    } else {
      toast.error(`Sign up failed: ${error.message}`);
    }
    return { user: data.user, error };
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      toast.success(`Welcome back, ${data.user?.email}!`);
    } else {
      toast.error(`Login failed: ${error.message}`);
    }
    return { user: data.user, error };
  };

  const signOut = async (): Promise<{ error: Error | null }> => {
    const { error } = await supabase.auth.signOut();
    // if (!error) {
    //   toast.info('You have been logged out');
    // } else {
    //   toast.error(`Logout failed: ${error.message}`);
    // }
    return { error };
  };

  return { user, signUp, signIn, signOut };
};