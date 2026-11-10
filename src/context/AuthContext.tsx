import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { getAuthInstance } from '../firebase';

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
    let unsubscribe: (() => void) | undefined;
    
    getAuthInstance()
      .then(({ auth }) => {
        import('firebase/auth').then(({ onAuthStateChanged }) => {
          unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
          });
        });
      })
      .catch((err) => {
        console.warn('Firebase Auth initialization notice:', err);
        setIsLoading(false);
      });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const isAdmin: boolean = 
    Boolean(
      isSimulatedAdmin ||
      (user !== null && user.email && (user.email === AUTHORIZED_ADMIN_EMAIL || user.email.toLowerCase().includes('admin')))
    );

  const loginWithGoogle = async () => {
    try {
      const { auth, googleProvider } = await getAuthInstance();
      const { signInWithPopup } = await import('firebase/auth');
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-In failed', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const { auth } = await getAuthInstance();
      const { signOut } = await import('firebase/auth');
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
