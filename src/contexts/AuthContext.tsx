import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
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
        
        // Check if user is admin
        if (session?.user) {
          console.log('🔍 Checking admin status for user:', session.user.id, session.user.email);
          try {
            const { data: isUserAdmin, error: adminError } = await supabase.rpc('is_admin', { user_id: session.user.id });
            console.log('🔍 Admin RPC result:', { isUserAdmin, adminError, userId: session.user.id });
            if (mounted) {
              setIsAdmin(!!isUserAdmin);
              console.log('✅ Set isAdmin to:', !!isUserAdmin);
            }
          } catch (error) {
            console.error('❌ Error checking admin status:', error);
            if (mounted) {
              setIsAdmin(false);
              console.log('❌ Set isAdmin to false due to error');
            }
          }
        } else {
          console.log('🚫 No user session, setting isAdmin to false');
          if (mounted) {
            setIsAdmin(false);
          }
        }
        
        if (mounted) {
          console.log('🔄 Setting loading to false in auth listener');
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('🔍 Initial session check for user:', session.user.id, session.user.email);
        try {
          const { data: isUserAdmin, error: adminError } = await supabase.rpc('is_admin', { user_id: session.user.id });
          console.log('🔍 Initial admin RPC result:', { isUserAdmin, adminError, userId: session.user.id });
          if (mounted) {
            setIsAdmin(!!isUserAdmin);
            console.log('✅ Initial set isAdmin to:', !!isUserAdmin);
          }
        } catch (error) {
          console.error('❌ Initial error checking admin status:', error);
          if (mounted) {
            setIsAdmin(false);
            console.log('❌ Initial set isAdmin to false due to error');
          }
        }
      } else {
        if (mounted) {
          setIsAdmin(false);
        }
      }
      
      if (mounted) {
        console.log('🔄 Setting loading to false in initial session check');
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Remove the separate checkAdminStatus function since we're doing it inline now

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    // Clear local state
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setLoading(false);
  }, []);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    isAdmin,
    signOut,
  }), [user, session, loading, isAdmin, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};