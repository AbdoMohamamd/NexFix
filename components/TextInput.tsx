import { TextInputProps } from "@/assets/utils/Components/Types";
import React, { useRef, useState } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CustomTextInput = ({
  title,
  value,
  onChangeText,
  IconComponent1,
  IconComponent2,
  onRightIconPress,
  supportText,
  secureTextEntry,
  onPress,
  style, // NEW: Accept style prop
}: TextInputProps & { style?: any }) => {
  // Add style to props
  const colors = {
    default: {
      borderColor: "#E5E7EB",
      iconColor: "#6A7282",
      titleColor: "#364153",
      backgroundColor: "#fdfaeaff",
      textColor: "#8B7E2E",
    },
    active: {
      borderColor: "#F4C430",
      iconColor: "#101828",
      titleColor: "#364153",
      backgroundColor: "#fdfaeaff",
      textColor: "#8B7E2E",
    },
  };

  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<RNTextInput>(null);
  const currentColors = isFocused ? colors.active : colors.default;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleContainerPress = () => {
    inputRef.current?.focus();
    if (onPress) onPress();
  };

  return (
    <View style={[styles.container, style]}>
      {/* Apply the style here */}
      {title && (
        <Text style={[styles.title, { color: currentColors.titleColor }]}>
          {title}
        </Text>
      )}
      <TouchableOpacity
        onPress={handleContainerPress}
        style={[
          styles.inputWrapper,
          {
            borderColor: currentColors.borderColor,
            backgroundColor: currentColors.backgroundColor,
          },
        ]}
        activeOpacity={0.8}
      >
        <View style={styles.inputContent}>
          {IconComponent1 && (
            <IconComponent1
              color={currentColors.iconColor}
              width={24}
              height={24}
            />
          )}
          <RNTextInput
            ref={inputRef}
            style={[styles.input, { color: currentColors.textColor }]}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            onFocus={handleFocus}
            onBlur={handleBlur}
            cursorColor={currentColors.textColor}
          />
        </View>

        {IconComponent2 && (
          <TouchableOpacity onPress={onRightIconPress}>
            <IconComponent2
              color={currentColors.iconColor}
              width={24}
              height={24}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {supportText && <Text style={styles.supportText}>{supportText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%", // Default to full width
  },
  title: {
    fontSize: 14,
    fontFamily: "Arimo-Medium",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 48,
  },
  inputContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    fontSize: 16,
    fontFamily: "Arimo-Regular",
    flex: 1,
    padding: 0,
    margin: 0,
    height: "100%",
  },
  supportText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Arimo-Regular",
    color: "#6A7282",
  },
});

export default CustomTextInput;
