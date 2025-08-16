import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user is admin - do this synchronously, not with setTimeout
        if (session?.user) {
          try {
            console.log('Checking admin status for user:', session.user.id);
            const { data: isUserAdmin, error } = await supabase.rpc('is_admin', { user_id: session.user.id });
            console.log('Admin check result:', { isUserAdmin, error });
            if (mounted) {
              setIsAdmin(!!isUserAdmin);
              console.log('Set isAdmin to:', !!isUserAdmin);
            }
          } catch (error) {
            console.error('Error checking admin status:', error);
            if (mounted) {
              setIsAdmin(false);
            }
          }
        } else {
          setIsAdmin(false);
          console.log('No session user, set isAdmin to false');
        }
        
        if (mounted) {
          setLoading(false);
          console.log('Auth loading set to false after auth state change');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          console.log('Checking admin status for existing session user:', session.user.id);
          const { data: isUserAdmin, error } = await supabase.rpc('is_admin', { user_id: session.user.id });
          console.log('Admin check result for existing session:', { isUserAdmin, error });
          if (mounted) {
            setIsAdmin(!!isUserAdmin);
            console.log('Set isAdmin to (existing session):', !!isUserAdmin);
          }
        } catch (error) {
          console.error('Error checking admin status for existing session:', error);
          if (mounted) {
            setIsAdmin(false);
          }
        }
      }
      
      if (mounted) {
        setLoading(false);
        console.log('Auth loading set to false');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Remove the separate checkAdminStatus function since we're doing it inline now

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};