import {
  authAPI,
  clearAuthData,
  getUserData,
  initializeAuth,
  storeAuthData,
} from "@/assets/utils/Api/api";
import { UserData } from "@/assets/utils/Types";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      // Initialize axios with existing token
      await initializeAuth();

      // Get stored user data
      const storedUser = await getUserData();

      if (storedUser) {
        setUser(storedUser);
        // Get token separately
        const storedToken = await require("expo-secure-store").getItemAsync(
          "auth_token"
        );
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error checking existing auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await authAPI.login(email, password);

      if (response.data.success) {
        const { token, ...userData } = response.data.data;

        // Store auth data
        await storeAuthData(token, userData);

        // Update state
        setUser(userData as UserData);
        setToken(token);

        // Navigate to main app
        router.replace("/(tabs)");
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error.response?.data?.message || error.message || "Login failed";
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear stored data
      await clearAuthData();

      // Clear state
      setUser(null);
      setToken(null);

      // Navigate to login
      router.replace("/Authentication/Login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
