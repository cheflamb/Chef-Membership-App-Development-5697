import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';

export const useRoleManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if current user can manage roles
  const canManageRoles = user?.role === 'admin' || user?.tier === 'guild';

  useEffect(() => {
    if (canManageRoles) {
      fetchUsers();
    }
  }, [canManageRoles]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles_chef_brigade')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles_chef_brigade')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));

      // Log the role change
      await logRoleChange(userId, newRole);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateUserTier = async (userId, newTier) => {
    try {
      const { error } = await supabase
        .from('profiles_chef_brigade')
        .update({ 
          tier: newTier,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, tier: newTier } : u
      ));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const suspendUser = async (userId, reason) => {
    try {
      const { error } = await supabase
        .from('profiles_chef_brigade')
        .update({ 
          status: 'suspended',
          suspension_reason: reason,
          suspended_at: new Date().toISOString(),
          suspended_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'suspended', suspension_reason: reason } : u
      ));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const unsuspendUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('profiles_chef_brigade')
        .update({ 
          status: 'active',
          suspension_reason: null,
          suspended_at: null,
          suspended_by: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { 
          ...u, 
          status: 'active', 
          suspension_reason: null,
          suspended_at: null,
          suspended_by: null
        } : u
      ));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteUser = async (userId) => {
    try {
      // Soft delete - mark as deleted instead of removing
      const { error } = await supabase
        .from('profiles_chef_brigade')
        .update({ 
          status: 'deleted',
          deleted_at: new Date().toISOString(),
          deleted_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Remove from local state
      setUsers(users.filter(u => u.id !== userId));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logRoleChange = async (userId, newRole) => {
    try {
      await supabase
        .from('role_change_log_chef_brigade')
        .insert([{
          user_id: userId,
          changed_by: user.id,
          old_role: users.find(u => u.id === userId)?.role,
          new_role: newRole,
          created_at: new Date().toISOString()
        }]);
    } catch (err) {
      console.error('Error logging role change:', err);
    }
  };

  const getUsersByRole = (role) => {
    return users.filter(u => u.role === role && u.status !== 'deleted');
  };

  const getUsersByTier = (tier) => {
    return users.filter(u => u.tier === tier && u.status !== 'deleted');
  };

  const getActiveUsers = () => {
    return users.filter(u => u.status === 'active');
  };

  const getSuspendedUsers = () => {
    return users.filter(u => u.status === 'suspended');
  };

  const searchUsers = (query) => {
    if (!query) return users;
    
    const lowercaseQuery = query.toLowerCase();
    return users.filter(u => 
      u.name?.toLowerCase().includes(lowercaseQuery) ||
      u.email?.toLowerCase().includes(lowercaseQuery) ||
      u.role?.toLowerCase().includes(lowercaseQuery) ||
      u.tier?.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    users,
    loading,
    error,
    canManageRoles,
    updateUserRole,
    updateUserTier,
    suspendUser,
    unsuspendUser,
    deleteUser,
    getUsersByRole,
    getUsersByTier,
    getActiveUsers,
    getSuspendedUsers,
    searchUsers,
    refreshUsers: fetchUsers
  };
};