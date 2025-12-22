import {
  authAPI,
  clearAuthData,
  getUserData,
  initializeAuth,
  storeAuthData,
  vehicleAPI,
} from "@/assets/utils/Api/api";
import { UserData } from "@/assets/utils/Types";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    accUserName: string;
    accountEmail: string;
    accountPhoneNumber: string;
    accPassword: string;
    Role?: number;
    vehicles?: any[];
  }) => Promise<void>;
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

  const register = async (userData: {
    accUserName: string;
    accountEmail: string;
    accountPhoneNumber: string;
    accPassword: string;
    Role?: number;
    vehicles?: any[]; // Add vehicles parameter
  }) => {
    try {
      setIsLoading(true);

      // Set default role to 3 (Customer) if not provided
      const dataToSend = {
        accUserName: userData.accUserName,
        accountEmail: userData.accountEmail,
        accountPhoneNumber: userData.accountPhoneNumber,
        accPassword: userData.accPassword,
        Role: userData.Role || 3,
      };

      const response = await authAPI.register(dataToSend);

      if (response.data.success) {
        const { token, ...userDataFromResponse } = response.data.data;

        // Store auth data
        await storeAuthData(token, userDataFromResponse);

        // Update state
        const user = userDataFromResponse as UserData;
        setUser(user);
        setToken(token);

        // If vehicles are provided, add them after successful registration
        if (userData.vehicles && userData.vehicles.length > 0 && user.accID) {
          await addUserVehicles(user.accID, userData.vehicles);
        }

        // Navigate to main app
        router.replace("/(tabs)");
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw (
        error.response?.data?.message || error.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to add user vehicles
  const addUserVehicles = async (customerId: number, vehicles: any[]) => {
    try {
      const vehiclePromises = vehicles.map((vehicle) =>
        vehicleAPI.addVehicle({
          vehicule_CustomerID: customerId,
          vehicule_PlateNb: vehicle.plateNumber || "",
          vehicule_BrandID: vehicle.brandId || vehicle.brand?.id,
          vehicule_ColorID: vehicle.colorId || vehicle.color?.id,
          vehicule_FactoryYear: parseInt(vehicle.year) || 0,
          vehicule_Model: vehicle.model || "",
          vehicule_Notes: "", // You can add notes field to your form if needed
          vehicule_Milleage: parseInt(vehicle.mileage) || 0,
          vehicule_FuelTypeID: vehicle.fuelTypeId || vehicle.fuelType?.id,
        })
      );

      await Promise.all(vehiclePromises);
    } catch (error) {
      console.error("Error adding vehicles:", error);
      // Don't throw here to allow registration to succeed even if vehicles fail
      // You can show a warning instead
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
      router.replace("/Authentication/Welcome");
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
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
