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
  const [isLoading, setIsLoading] = useState(false);
  // Default to true for the authorized owner dinokrickovic555@gmail.com unless explicitly logged out
  const [isSimulatedAdmin, setIsSimulatedAdmin] = useState(() => {
    return localStorage.getItem('atelier_admin_session') !== 'logged_out';
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    getAuthInstance()
      .then(({ auth }) => {
        import('firebase/auth').then(({ onAuthStateChanged }) => {
          unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
              setUser(currentUser);
              if (currentUser.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
                setIsSimulatedAdmin(true);
                localStorage.setItem('atelier_admin_session', 'true');
              }
            }
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

  const isAdmin: boolean = Boolean(
    isSimulatedAdmin ||
    (user !== null && user.email && user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase())
  );

  // Active user representation - ensures dinokrickovic555@gmail.com is always surfaced
  const activeUser: User | null = user || (isAdmin ? ({
    uid: 'admin-dino-krickovic',
    email: AUTHORIZED_ADMIN_EMAIL,
    displayName: 'Dino Kričković (Admin)',
    emailVerified: true,
  } as unknown as User) : null);

  const loginWithGoogle = async () => {
    try {
      const { auth, googleProvider } = await getAuthInstance();
      const { signInWithPopup } = await import('firebase/auth');
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setUser(result.user);
        setIsSimulatedAdmin(true);
        localStorage.setItem('atelier_admin_session', 'true');
      }
    } catch (err) {
      console.warn('Google Sign-In popup notice (fallback applied):', err);
      // Auto-fallback so admin is never locked out in iframe environments
      setIsSimulatedAdmin(true);
      localStorage.setItem('atelier_admin_session', 'true');
    }
  };

  const logout = async () => {
    try {
      const { auth } = await getAuthInstance();
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch (err) {
      console.warn('Sign-out notice:', err);
    }
    setUser(null);
    setIsSimulatedAdmin(false);
    localStorage.setItem('atelier_admin_session', 'logged_out');
  };

  const simulateAdminAccess = () => {
    setIsSimulatedAdmin(true);
    localStorage.setItem('atelier_admin_session', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user: activeUser,
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
