import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  studentId?: string;
  graduation?: string;
  major?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('unt_rate_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // If there's an error parsing, clear the invalid data
        localStorage.removeItem('unt_rate_user');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('unt_rate_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unt_rate_user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility function to validate UNT email
export function validateUNTEmail(email: string): boolean {
  return email.toLowerCase().endsWith('@my.unt.edu');
}

// Utility function to get validation error message
export function getEmailValidationError(email: string): string | null {
  if (!email) {
    return 'Email is required';
  }
  if (!validateUNTEmail(email)) {
    return 'Only UNT student emails (@my.unt.edu) are allowed';
  }
  return null;
}