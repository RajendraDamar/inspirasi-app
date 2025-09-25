import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase/config';

export type User = any; // keep broad for now; narrow later when integrating auth models

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
  const register = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
