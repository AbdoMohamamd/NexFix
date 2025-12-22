import { Dispatch,  ReactNode, SetStateAction } from "react";
import { ViewStyle } from "react-native";

export interface IconProps {
  color?: string;
  width: number;
  height: number;
}
export type IconComponentType = React.ComponentType<IconProps>;

export interface BottomNavbarIconProps {
  Icon: IconComponentType;
  color: string;
}

export type ButtonTypes = "primary" | "secondary" | "ternary";
export type ButtonStates = "default" | "pressed";
export type ButtonSizes = "large" | "medium" | "small";
export interface ButtonProps {
  text?: string;
  type?: ButtonTypes;
  state?: ButtonStates;
  Icon?: IconComponentType;
  dimensions?: number[];
  wrap?: boolean;
  onPress: () => void;
  size?: ButtonSizes;
  disabled?: boolean;
}



export interface InfoBlockProps {
  Icon: IconComponentType;
}

export type ToastStates = "info" | "error" | "warning" | "success";
export interface ToastProps {
  message: string;
  visible: boolean;
  state: ToastStates;
  onHide?: () => void;
  position?: number;
}
export interface DropDownOption {
  id: string;
  name: string;
  description?: string;
  price?: number;
}
export type DropDownState =
  | "info"
  | "error"
  | "success"
  | "disabled"
  | "active";
export interface DropDownProps {
  title: string;
  placeholder: string;
  value?: DropDownOption;
  onValueChange: (value: DropDownOption) => void;
  IconComponent1?: IconComponentType;
  supportText?: string;
  state?: DropDownState;
  options: DropDownOption[];
  card?: boolean;
  style?:ViewStyle
}

export interface HeaderProps {
  title: string;
  goBack: boolean;
  Icon?: IconComponentType;
  onPress?: () => void;
  safeArea?: boolean;
}
export interface LineChartPoint {
  x: number | string;
  y: number;
  date: string;
}
export interface LineChartProps {
  data: LineChartPoint[] | null;
  setData: Dispatch<SetStateAction<LineChartPoint[] | null>>;
  tickValuesX: (number | string)[];
  tickValuesY: number[];
  setShowCalendar: Dispatch<SetStateAction<boolean>>;
  percentChange: number;
  diff: number;
  title: string;
  source: string;
  isLoading: boolean;
}
export interface ListTitleProps {
  title: string;
  rightText: string;
  isClickable: boolean;
  onPress?: () => void;
  isLoading: boolean;
  withBorder: boolean;
}
export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}


export type PopupState =
  | "default"
  | "error"
  | "success"
  | "warning"
  | "info"
  | "white";
export interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
  IconComponent?: IconComponentType;
  state?: "error" | "success" | "warning" | "info" | "white";
  showCloseButton?: boolean;
  animationDuration?: number;
  withButtons?: boolean;
}


export type TextInputStates =
  | "info"
  | "error"
  | "success"
  | "active"
  | "disabled";

export interface TextInputProps {
  title?: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  IconComponent1?: IconComponentType;
  IconComponent2?: IconComponentType;
  onRightIconPress?: () => void;
  supportText?: string;
  secureTextEntry?: boolean;
  state?: TextInputStates;
  onPress?: () => void;
}







