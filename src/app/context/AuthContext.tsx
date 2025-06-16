// /easytrade-ui/src/app/context/AuthContext.tsx
'use client'; // CRUCIAL for any file using React hooks like useState, useEffect, useContext

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Correct hooks for App Router

interface UserSession { // More specific type for the user object
  userId: string | number;
  username: string;
  // Add other user properties you might store/need from login, e.g., email, roles
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  login: (userData: UserSession, token?: string) => void; // userData now UserSession
  logout: () => void;
  isLoading: boolean; // To track initial auth state loading
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true until localStorage is checked
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("AuthProvider: useEffect to load from localStorage triggered.");
    try {
      const storedUserString = localStorage.getItem('easytrade_user');
      const storedToken = localStorage.getItem('easytrade_token');

      if (storedUserString && storedToken) {
        const storedUser: UserSession = JSON.parse(storedUserString);
        console.log("AuthProvider: Found user in localStorage:", storedUser);
        setUser(storedUser);
        setToken(storedToken);
      } else {
        console.log("AuthProvider: No user/token in localStorage.");
      }
    } catch (error) {
      console.error("AuthProvider: Error parsing user from localStorage", error);
      // Clear potentially corrupted data
      localStorage.removeItem('easytrade_user');
      localStorage.removeItem('easytrade_token');
    }
    setIsLoading(false); // Finished initial load attempt
  }, []); // Empty dependency array: run only once on mount

  const login = (userData: UserSession, authToken?: string) => {
    console.log("AuthProvider: login called with", userData, authToken);
    setUser(userData);
    const tokenToStore = authToken || 'mock_session_token_placeholder'; // Use provided token or a mock
    setToken(tokenToStore);
    localStorage.setItem('easytrade_user', JSON.stringify(userData));
    localStorage.setItem('easytrade_token', tokenToStore);
    
    // Intelligent redirect: if trying to access a protected page, go there. Else, dashboard.
    const callbackUrl = sessionStorage.getItem('easytrade_callbackUrl') || '/dashboard';
    sessionStorage.removeItem('easytrade_callbackUrl'); // Clean up
    router.push(callbackUrl);
    router.refresh(); // Force a refresh to ensure layout re-evaluates auth state
  };

  const logout = () => {
    console.log("AuthProvider: logout called.");
    setUser(null);
    setToken(null);
    localStorage.removeItem('easytrade_user');
    localStorage.removeItem('easytrade_token');
    if (pathname !== '/login' && pathname !== '/register') {
        router.push('/login'); // Redirect to login on logout
    }
    router.refresh(); // Force a refresh
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => { // Explicit return type
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This error means useAuth() was called outside of <AuthProvider>
    console.error("useAuth error: Context is undefined. Component not wrapped in AuthProvider?");
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
