import { User } from "firebase/auth";
import { ServiceApi, UserApi } from "./api";
import { lightTheme } from "../Colors";

export interface AuthContextProps {
  user: User | null;
  userData: UserApi | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}
export interface SelectionState {
  selectedIds: string[];
  isActive: boolean;
  selectableIds?: string[];
}

export interface SelectionContextType {
  getSelection: (listId: string) => SelectionState;
  toggleItem: (listId: string, itemId: string) => void;
  clearSelection: (listId: string) => void;
  startSelection: (listId: string) => void;
  selectAll: (listId: string, allIds: string[]) => void;
  setSelectableIds: (listId: string, ids: string[]) => void;
}
export interface ServicesProviderProps {
  services: ServiceApi[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
export type ThemeType = "light" | "dark" | "system";
type AppColors = typeof lightTheme;

// 2. Define the context type
export interface ThemeContextType {
  themeType: ThemeType;
  theme: AppColors;
  toggleTheme: (type?: ThemeType) => void;
  isDark: boolean;
}
