import { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";

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

export type BadgeTypes = "primary" | "secondary" | "ternary";
export type BadgeStates = "info" | "error" | "warning" | "success";
export interface BadgeProps {
  text: string | number;
  type: BadgeTypes;
  state: BadgeStates;
  Icon?: IconComponentType;
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

export interface ListData {
  id: string;
  title: string;
  subtitle?: string;
  rightText?: string;
  badgeProps?: BadgeProps;
  infoBlockProps?: InfoBlockProps;
}

export interface ItemsWithoutClientListData extends ListData {
  clientName: string;
  name: string;
  description: string;
  status: boolean;
  quantity: number;
  price: number;
  receiptDate: Date;
  paymentDate: Date;
}

export type ListRightSetting =
  | "Hybrid"
  | "Icon"
  | "Text"
  | "Toggle"
  | "Badge"
  | "IconText";
export type ListLeftSetting = "Avatar" | "InfoBlock" | "Icon";

export interface ItemListProps {
  id: string;
  title: string;
  subtitle: string;
  badgeProps?: BadgeProps;
  infoBlockProps?: InfoBlockProps;
  leftSetting?: ListLeftSetting;
  rightSetting?: ListRightSetting;
  IconRight?: IconComponentType;
  IconLeft?: IconComponentType;
  isSelected?: boolean;
  selectable?: boolean;
  isLoading?: boolean;
  onLongPress?: () => void;
  onPress: () => void;
  rightText?: string;
  pressable?: boolean;
  isSelectionMode?: boolean;
}

export interface TagFilterData {
  name: string;
  id: string;
}
export interface TagFilterProps {
  tags: TagFilterData[];
  selectedTags: TagFilterData[];
  setSelectedTags: (selected: TagFilterData[]) => void;
  isLoading: boolean;
}

export type CalendarTriggerButtonStates =
  | "info"
  | "error"
  | "success"
  | "active"
  | "disabled";
export interface CalendarTriggerButtonProps {
  title?: string;
  placeholder?: string;
  value?: string;
  onPress: () => void;
  IconComponent1?: React.ComponentType<any>;
  state?: CalendarTriggerButtonStates;
  supportText?: string;
}

export interface CheckBoxProps {
  checked: boolean;
  onValueChange: (value: boolean) => void;
  text?: string;
  disabled?: boolean;
}
export interface CustomBottomSheetProps {
  title?: string;
  children: ReactElement;
  withButtons: boolean;
  onConfirm: () => void;
  onDismiss?: () => void;
}
export interface CalendarPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: (selectedDate: string) => void;
  onRangeConfirm?: (startDate: string, endDate: string) => void;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
  animationDuration?: number;
  withButtons?: boolean;
  initialDate?: Date;
  dateRange?: boolean;
}
export type ViewMode = "days" | "months" | "years";

export type DateRange = {
  start: string | null;
  end: string | null;
};

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
  IconComponent1: IconComponentType;
  supportText?: string;
  state?: DropDownState;
  options: DropDownOption[];
  card: boolean;
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

export interface MiniLineGraphProps {
  data: LineChartPoint[] | null;
  width: number;
  height: number;
  title: string;
  subLabel: string;
  isLoading: boolean;
  subValue: string | null;
  percentage: number;
  value: number | null;
}
export interface PieChartData {
  x: string;
  y: number;
  color: string;
}
export interface PieChartProps {
  items: PieChartData[];
  title: string;
  tip: string;
  isLoading: boolean;
  isTwoLegends: boolean;
}
export interface PillarChartData {
  month: number;
  price: number;
  revenue: number;
  x: number;
  y: number;
  year: number;
}
export interface PillarChartLegendItemsData {
  color: string;
  selectedColor: string;
  label: string;
}
export interface PillarChartPorps {
  title: string;
  subtitle: string;
  chartData: PillarChartData[][] | null;
  setShowCalendar: Dispatch<SetStateAction<boolean>>;
  months: string[] | null;
  barWidth: number;
  chartHeight?: number;
  chartWidth?: number;
  showLegend?: boolean;
  showHeader?: boolean;
  isLoading: boolean;
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
export interface RangeSliderProps {
  values: number[];
  min: number;
  max: number;
  onValuesChange: (value: number[]) => void;
  unit?: string;
}
export interface SelectionActionBarProps {
  listId: string;
  height?: number;
  actions: { id: string; Icon: IconComponentType; onPress: () => void }[];
  withSelectAll: boolean;
}
export interface ServiceCardProps {
  option: DropDownOption;
  isSelected?: boolean;
  onSelectionChange: (selectedId: string) => void;
  pressable?: boolean;
}
export interface ShimmmerPlaceholderProps {
  width: number | string;
  height: number | string;
  borderRadius: number;
  position?: string;
  left?: number | string;
  right?: number;
  top?: string | number;
  bottom?: string | number;
}

export type StateIndicatorStates =
  | "error"
  | "success"
  | "warning"
  | "info"
  | "white";
export interface StateIndicatorProps {
  IconComponent: IconComponentType;
  state?: StateIndicatorStates;
}

export interface TabData {
  name: string;
}
export interface TabSliderProps {
  initialTab: number;
  tabs: TabData[];
  onTabChange: (index: number) => void;
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

export interface TabPage {
  key: string;
  component: React.ComponentType<any>;
}

export interface TopTabsNavbarProps {
  pages?: TabPage[];
  initialRoute?: string;
  onTabChange?: (index: number) => void;
}

export interface Option {
  id: string;
  title: string;
  subtitle?: string;
  IconComponent: IconComponentType;
}

export interface OptionCardProps {
  options: Option[];
  initialSelectedId?: string;
  onSelectionChange: (selectedId: string) => void;
}
export interface Tab {
  name: string;
  tab: React.JSX.Element;
}
