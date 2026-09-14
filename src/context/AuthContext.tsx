import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { initialUser } from '../mockData';
import { auth, db } from '../lib/firebase';
import { signInAnonymously, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isFirebaseConnected: boolean;
  login: (btId: string, role?: UserRole) => boolean;
  register: (profileData: Partial<UserProfile>) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateAvatar: (avatarUrl: string) => void;
  toggleRole: () => void;
  upgradeToPro: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('eduhub_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialUser;
      }
    }
    return initialUser;
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        setIsFirebaseConnected(true);

        try {
          // Fetch or sync user doc in Firestore
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUser((prev) => ({ ...prev, ...data, id: fbUser.uid }));
          } else {
            // Write initial profile to Firestore
            await setDoc(userDocRef, {
              ...user,
              id: fbUser.uid,
              createdAt: new Date().toISOString(),
            }, { merge: true });
          }
        } catch (e) {
          console.warn('Firestore user fetch note:', e);
        }
      } else {
        setFirebaseUser(null);
        // Attempt anonymous sign-in so all queries pass authenticated security rules
        signInAnonymously(auth).catch((err) => {
          console.warn('Anonymous auth note (fallback mode active):', err);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('eduhub_user', JSON.stringify(user));
  }, [user]);

  const login = (btId: string, role: UserRole = 'student') => {
    setUser((prev) => {
      const updated: UserProfile = {
        ...prev,
        btId: btId || prev.btId,
        role: role,
        academicTrack: role === 'student' ? 'CS 2024 Track' : 'Alumni Network (Class of 2022)',
      };

      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true }).catch(console.warn);
      }

      return updated;
    });
    setIsAuthenticated(true);
    return true;
  };

  const register = (profileData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      ...initialUser,
      id: firebaseUser ? firebaseUser.uid : `user-${Date.now()}`,
      name: profileData.name || 'Student Member',
      btId: profileData.btId || 'BT24CS001',
      branch: profileData.branch || 'Computer Science',
      semester: profileData.semester || '1st',
      yearOfStudy: profileData.yearOfStudy || '1st Year',
      rollNo: profileData.rollNo || '01',
      role: profileData.role || 'student',
      academicTrack: profileData.role === 'alumni' ? `Alumni (Class of ${profileData.passoutYear || '2023'})` : `${profileData.branch || 'CS'} ${profileData.yearOfStudy || '1st Year'}`,
      passoutYear: profileData.passoutYear,
    };

    setUser(newUser);
    setIsAuthenticated(true);

    if (firebaseUser) {
      setDoc(doc(db, 'users', firebaseUser.uid), newUser, { merge: true }).catch(console.warn);
    }

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    signOut(auth).catch(console.warn);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true }).catch(console.warn);
      }
      return updated;
    });
  };

  const updateAvatar = (avatarUrl: string) => {
    setUser((prev) => {
      const updated = { ...prev, avatar: avatarUrl };
      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), { avatar: avatarUrl, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.warn);
      }
      return updated;
    });
  };

  const toggleRole = () => {
    setUser((prev) => {
      const nextRole: UserRole = prev.role === 'student' ? 'alumni' : 'student';
      const updated: UserProfile = {
        ...prev,
        role: nextRole,
        academicTrack: nextRole === 'student' ? 'CS 2024 Track' : 'Alumni Network (Ex-Google, Class of 2020)',
      };
      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true }).catch(console.warn);
      }
      return updated;
    });
  };

  const upgradeToPro = () => {
    setUser((prev) => {
      const updated = { ...prev, isPro: true };
      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true }).catch(console.warn);
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated,
        isFirebaseConnected,
        login,
        register,
        logout,
        updateUser,
        updateAvatar,
        toggleRole,
        upgradeToPro,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
