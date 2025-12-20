import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Base URL for your API
const API_BASE_URL = "http://siblani-001-site6.atempurl.com/api/nexfix_api/";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

// Store token and user data
export const storeAuthData = async (token: string, userData: any) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));

    // Set default authorization header for future requests
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } catch (error) {
    console.error("Error storing auth data:", error);
  }
};

// Get stored token
export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Get stored user data
export const getUserData = async (): Promise<any | null> => {
  try {
    const userData = await SecureStore.getItemAsync(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Clear auth data (logout)
export const clearAuthData = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    delete api.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

// Update stored user data
export const updateUserData = async (newUserData: any) => {
  try {
    const currentUserData = await getUserData();
    const updatedUserData = { ...currentUserData, ...newUserData };
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUserData));
    return updatedUserData;
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

// Initialize auth token if exists
export const initializeAuth = async () => {
  const token = await getToken();
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return token;
};

// API calls
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("login.php", { email, password }),

  register: (userData: {
    accUserName: string;
    accountEmail: string;
    accountPhoneNumber: string;
    accPassword: string;
    Role: number;
  }) => api.post("account_new.php", userData),

  // Update account information
  updateAccount: (accountData: {
    accID: number;
    accPassword?: string;
    accountEmail: string;
    accountPhoneNumber: string;
  }) => api.post("account_update.php", accountData),

  // Get account details

  // Add other API endpoints as needed
  // logout: () => api.post('logout.php'),
};

export default api;
