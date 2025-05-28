import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  mbtiType?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserMbti: (mbtiType: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle cases where no profile exists

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, set profile to null
          setProfile(null);
          return;
        }
        throw error;
      }

      if (data) {
        setProfile({
          id: data.id,
          email: data.email,
          nickname: data.nickname,
          mbtiType: data.mbti_type
        });
      } else {
        // No profile found
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, nickname: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;
      if (!user) throw new Error('User registration failed');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email,
            nickname
          }
        ]);

      if (profileError) throw profileError;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const updateUserMbti = async (mbtiType: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ mbti_type: mbtiType })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, mbtiType } : null);
    } catch (error) {
      console.error('Error updating MBTI:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nickname: data.nickname,
          mbti_type: data.mbtiType,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    isLoading,
    login,
    register,
    logout,
    updateUserMbti,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};