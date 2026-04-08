import { createContext, useContext, useState, ReactNode } from "react";
import { apiFetch, setStoredToken } from "../lib/api";

export interface User {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  role: "student" | "admin";
  sscGpa?: string;
  hscGpa?: string;
  subject?: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: "student" | "admin";
  sscGpa?: string;
  hscGpa?: string;
  subject?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; role?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: (idToken: string) => Promise<{ success: boolean; message: string; role?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "bd_admission_session";
const TOKEN_KEY = "bd_admission_token";

// Demo users are no longer used in the frontend. Use real accounts via MongoDB.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    try {
      const res = await apiFetch<{ token: string; user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(res.user);
      setToken(res.token);
      setStoredToken(res.token);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
      sessionStorage.setItem(TOKEN_KEY, res.token);
      return { success: true, message: "Login successful", role: res.user.role };
    } catch (e: any) {
      return { success: false, message: e?.message || "Login failed" };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await apiFetch<{ success: boolean; id: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return { success: true, message: "Account created successfully! Please login." };
    } catch (e: any) {
      return { success: false, message: e?.message || "Registration failed" };
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const res = await apiFetch<{ token: string; user: User }>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
      setUser(res.user);
      setToken(res.token);
      setStoredToken(res.token);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
      sessionStorage.setItem(TOKEN_KEY, res.token);
      return { success: true, message: "Login successful", role: res.user.role };
    } catch (e: any) {
      return { success: false, message: e?.message || "Google login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setStoredToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: !!user, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
