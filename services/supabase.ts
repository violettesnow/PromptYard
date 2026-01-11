
import { createClient } from '@supabase/supabase-js';

// These environment variables are expected to be available in the environment
const supabaseUrl = (window as any).process?.env?.SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = (window as any).process?.env?.SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) console.error('Error signing in:', error.message);
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error signing out:', error.message);
};
