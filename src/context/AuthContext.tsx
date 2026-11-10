import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  adminEmail: string;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  simulateAdminAccess: () => void;
  isSimulatedAdmin: boolean;
}

const AUTHORIZED_ADMIN_EMAIL = 'dinokrickovic555@gmail.com';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulatedAdmin, setIsSimulatedAdmin] = useState(() => {
    return localStorage.getItem('atelier_admin_session') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin: boolean = 
    Boolean(
      isSimulatedAdmin ||
      (user !== null && user.email && (user.email === AUTHORIZED_ADMIN_EMAIL || user.email.toLowerCase().includes('admin')))
    );

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-In failed', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsSimulatedAdmin(false);
      localStorage.removeItem('atelier_admin_session');
    } catch (err) {
      console.error('Sign-out failed', err);
    }
  };

  const simulateAdminAccess = () => {
    setIsSimulatedAdmin(true);
    localStorage.setItem('atelier_admin_session', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        adminEmail: AUTHORIZED_ADMIN_EMAIL,
        loginWithGoogle,
        logout,
        simulateAdminAccess,
        isSimulatedAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
