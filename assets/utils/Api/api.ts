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

  // Add other API endpoints as needed
  // logout: () => api.post('logout.php'),
};
export const appointmentsAPI = {
  // Get appointments for a specific customer
  getByCustomerId: (account_CustomerID: number) =>
    api.get(
      `appointment/appointment_select.php?account_CustomerID=${account_CustomerID}`
    ),

  // Get appointments for a specific mechanic/workshop
  getByMechanicId: (account_MechanicID: number) =>
    api.get(
      `appointment/appointment_select.php?account_MechanicID=${account_MechanicID}`
    ),
  // Get appointments for a specific mechanic/workshop
  createAppointment: (appointmentData: {
    account_CustomerID: number;
    account_MechanicID: number;
    appointment_VehiculeID: number;
    appointment_Title: string;
    appointment_Description: string;
    appointment_Date: string;
    appointment_Time: string;
    appointment_Status?: number;
  }) => api.post("appointment/appointment_new.php", appointmentData),
};

export const workshopsAPI = {
  // Get workshop by mechanic ID
  getByMechanicId: (workshop_MechanicID: number) =>
    api.get("workshop/workshop_select.php", {
      params: { workshop_MechanicID },
    }),

  // Get all workshops (optional)
  getAll: () => api.get("workshop/workshop_select.php"),
  getById: (workshop_ID: number) =>
    api.get(`workshop/workshop_select.php?workshop_ID=${workshop_ID}`),
};

// Helper function to get unique mechanic IDs from appointments
export const getUniqueMechanicIdsFromAppointments = (
  appointments: any[]
): number[] => {
  if (!appointments || appointments.length === 0) return [];

  const mechanicIds = appointments
    .map((appointment) => appointment.account_MechanicID)
    .filter((id): id is number => id !== null && id !== undefined && id > 0);

  // Return unique IDs
  return [...new Set(mechanicIds)];
};
export const vehicleAPI = {
  // Get workshop by mechanic ID
  getVehicleBrands: async () => {
    const response = await api.get("vehicule/vehicule_brand_select.php", {});
    // Transform the data to match what DropDown expects
    const transformedData = response.data.data.brands.map((brand: any) => ({
      id: brand.brand_ID,
      name: brand.brand_Name, // or brand.brand_Name if you prefer just the brand name
    }));

    return transformedData;
  },
  getVehicleColors: async () => {
    const response = await api.get("vehicule/vehicule_color_select.php", {});
    // Transform the data to match what DropDown expects
    const transformedData = response.data.data.colors.map((color: any) => ({
      id: color.color_ID,
      name: color.color_Name, // or brand.brand_Name if you prefer just the brand name
    }));

    return transformedData;
  },
  getVehicleFuelTypes: async () => {
    const response = await api.get("vehicule/vehicule_fueltype_select.php", {});
    // Transform the data to match what DropDown expects
    const transformedData = response.data.data.fuelTypes.map(
      (fuelType: any) => ({
        id: fuelType.fuelType_ID,
        name: fuelType.fuelType_Name, // or brand.brand_Name if you prefer just the brand name
      })
    );

    return transformedData;
  },
  addVehicle: (vehicleData: {
    vehicule_CustomerID: number;
    vehicule_PlateNb?: string;
    vehicule_BrandID: number;
    vehicule_ColorID: number;
    vehicule_FactoryYear: number | string;
    vehicule_Model: string;
    vehicule_Notes?: string;
    vehicule_Milleage: number | string;
    vehicule_FuelTypeID: number;
  }) => api.post("vehicule/vehicule_new.php", vehicleData),

  // Get user's vehicles
  getVehiclesByCustomerId: (vehicule_CustomerID: number) =>
    api.get(
      `vehicule/vehicule_select.php?vehicule_CustomerID=${vehicule_CustomerID}`
    ),

  // Update vehicle
  updateVehicle: (vehicleData: {
    vehicule_ID: number;
    vehicule_PlateNb?: string;
    vehicule_BrandID: number;
    vehicule_ColorID: number;
    vehicule_FactoryYear: number;
    vehicule_Model: string;
    vehicule_Notes?: string;
    vehicule_Milleage: number;
    vehicule_FuelTypeID: number;
  }) => api.post("vehicule/vehicule_update.php", vehicleData),
};
export default api;
