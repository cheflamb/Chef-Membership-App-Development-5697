import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchOrCreateUserProfile(session.user);
      } else {
        setLoading(false);
        setInitializing(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchOrCreateUserProfile(session.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchOrCreateUserProfile = async (authUser) => {
    try {
      setLoading(true);
      
      // Try to fetch existing profile
      let { data: profile, error } = await supabase
        .from('profiles_chef_brigade')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const newProfile = {
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || 'Chef',
          tier: 'free',
          avatar: `https://images.unsplash.com/photo-1583394293214-28a5b6ba4f1c?w=150&h=150&fit=crop&crop=face`,
          badges: ['joined-brigade'],
          private_rss_url: `https://feeds.captivate.fm/private/${authUser.id}`,
          created_at: new Date().toISOString()
        };

        const { data: createdProfile, error: insertError } = await supabase
          .from('profiles_chef_brigade')
          .insert([newProfile])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          setUser({
            id: authUser.id,
            email: authUser.email,
            ...newProfile
          });
        } else {
          setUser(createdProfile);
        }
      } else if (error) {
        console.error('Error fetching profile:', error);
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || 'Chef',
          tier: 'free',
          avatar: `https://images.unsplash.com/photo-1583394293214-28a5b6ba4f1c?w=150&h=150&fit=crop&crop=face`,
          badges: ['joined-brigade'],
          private_rss_url: `https://feeds.captivate.fm/private/${authUser.id}`
        });
      } else {
        setUser(profile);
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error in fetchOrCreateUserProfile:', error);
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || 'Chef',
        tier: 'free',
        avatar: `https://images.unsplash.com/photo-1583394293214-28a5b6ba4f1c?w=150&h=150&fit=crop&crop=face`,
        badges: ['joined-brigade']
      });
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  };

  const signUp = async (email, password, name, agreeTerms) => {
    if (!agreeTerms) {
      throw new Error('You must agree to the terms and conditions');
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            agreed_to_terms: true,
            agreed_at: new Date().toISOString()
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTier = async (newTier) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles_chef_brigade')
        .update({ 
          tier: newTier, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => ({ ...prev, tier: newTier }));
    } catch (error) {
      console.error('Error updating tier:', error);
      throw error;
    }
  };

  const addBadge = async (badgeId) => {
    if (!user || user.badges?.includes(badgeId)) return;

    try {
      const newBadges = [...(user.badges || []), badgeId];
      const { error } = await supabase
        .from('profiles_chef_brigade')
        .update({ 
          badges: newBadges, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => ({ ...prev, badges: newBadges }));
    } catch (error) {
      console.error('Error adding badge:', error);
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles_chef_brigade')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Tier-based access control helpers
  const hasAccess = (requiredTier) => {
    if (!user) return requiredTier === 'free';
    
    const tierHierarchy = ['free', 'brigade', 'fraternity', 'guild'];
    const userTierIndex = tierHierarchy.indexOf(user.tier);
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
    
    return userTierIndex >= requiredTierIndex;
  };

  const canAccessCourse = (course) => {
    return hasAccess(course.tier_required);
  };

  const canAccessFeature = (feature) => {
    const featureRequirements = {
      'journal': 'free',
      'courses_basic': 'free',
      'courses_advanced': 'brigade',
      'live_sessions': 'brigade',
      'group_coaching': 'brigade',
      'qa_sessions': 'fraternity',
      'deep_dives': 'fraternity',
      'private_calls': 'guild',
      'masterminds': 'guild',
      'text_support': 'guild'
    };
    
    return hasAccess(featureRequirements[feature] || 'guild');
  };

  const value = {
    user,
    loading: loading || initializing,
    initializing,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateTier,
    addBadge,
    updateProfile,
    hasAccess,
    canAccessCourse,
    canAccessFeature
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};