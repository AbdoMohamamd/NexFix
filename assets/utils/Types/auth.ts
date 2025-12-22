export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  accID: number;
  accUserName: string;
  Role: number;
  accountEmail: string;
  accountPhoneNumber: string;
  roleName: string;
  accPhotoPath: string;
  workshop_ID: number;
  workshop_Name: string;
  workshop_Address: string;
  workshop_ContactPhone: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    // Include all user data fields
    accID: number;
    accUserName: string;
    Role: number;
    accountEmail: string;
    accPhoneNumber: string;
    roleName: string;
    accPhotoPath: string;
    workshop_ID: number;
    workshop_Name: string;
    workshop_Address: string;
    workshop_ContactPhone: string;
  };
}
