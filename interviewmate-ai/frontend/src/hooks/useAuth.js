// ============================================
// INTERVIEWMATE AI - USE AUTH HOOK
// ============================================

import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const auth = useAuthContext();
  
  return {
    ...auth,
    // Computed properties
    isAdmin: auth.user?.role === 'admin',
    isCounselor: auth.user?.role === 'counselor',
    isJobSeeker: auth.user?.role === 'user' || !auth.user?.role,
    userName: auth.user?.name || 'Guest',
    userEmail: auth.user?.email || '',
    userAvatar: auth.user?.avatar || null,
    userCollege: auth.user?.college || '',
    userBranch: auth.user?.branch || '',
    userYear: auth.user?.year || ''
  };
};