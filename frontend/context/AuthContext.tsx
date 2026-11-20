"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, getCurrentUser, logoutUser } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Already starts as true on initial load

  async function refreshUser() {
    setLoading(true);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  // Fetch initial session asynchronously; only update state after await resolves
  useEffect(() => {
    let isMounted = true;

    async function loadInitialUser() {
      const currentUser = await getCurrentUser();
      if (isMounted) {
        setUser(currentUser);
        setLoading(false);
      }
    }

    loadInitialUser();

    // Cleanup prevents state updates if the component unmounts while fetching
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}