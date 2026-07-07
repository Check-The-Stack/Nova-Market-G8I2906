"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import api from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Validar si existe sesión previa persistida
    const storedToken = localStorage.getItem("novamarket_token");
    const storedUser = localStorage.getItem("novamarket_user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user session:", error);
        localStorage.removeItem("novamarket_token");
        localStorage.removeItem("novamarket_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("novamarket_token", newToken);
    localStorage.setItem("novamarket_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("novamarket_token");
    localStorage.removeItem("novamarket_user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: User) => {
    localStorage.setItem("novamarket_user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
