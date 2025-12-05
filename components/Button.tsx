import { ButtonProps } from "@/assets/utils/Components/Types";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Button = ({
  text,
  Icon,
  size = "large",
  type = "primary",
  state = "default",
  wrap = true,
  dimensions,
  onPress,
  disabled = false,
}: ButtonProps) => {
  const colors = {
    primary: {
      default: {
        bg: "#F4C430",
        text: "#101828",
        border: "transparent",
      },
      pressed: {
        bg: "#e0b42dff",
        text: "#101828",
        border: "transparent",
      },
      disabled: {
        bg: "#F3F4F6",
        text: "#9CA3AF",
        border: "transparent",
      },
    },
    secondary: {
      default: {
        bg: "#ffffff",
        text: "#F4C430",
        border: "#F4C430",
      },
      pressed: {
        bg: "#f1f1f1ff",
        text: "#E0B01C",
        border: "#E0B01C",
      },
      disabled: {
        bg: "#F3F4F6",
        text: "#9CA3AF",
        border: "#D1D5DB",
      },
    },
    ternary: {
      default: {
        bg: "#ffffff",
        text: "#364153",
        border: "#c2c3c5ff",
      },
      pressed: {
        bg: "#f1f1f1ff",
        text: "#364153",
        border: "#c2c3c5ff",
      },
      disabled: {
        bg: "#F3F4F6",
        text: "#9CA3AF",
        border: "#D1D5DB",
      },
    },
  };

  const {
    bg,
    text: textColor,
    border,
  } = disabled ? colors[type].disabled : colors[type][state];
  const pressedStyle = disabled ? colors[type].disabled : colors[type].pressed;

  const SIZE_CONFIG = {
    small: {
      padding: [4, 16],
      fontSize: 14,
      iconSize: 20,
      borderRadius: 6,
      dimensions: dimensions ? dimensions : [30, 30],
      gap: 4,
      borderWidth: 1,
    },
    medium: {
      padding: [8, 20],
      fontSize: 18,
      iconSize: 24,
      borderRadius: 8,
      dimensions: [40, 40],
      gap: 8,
      borderWidth: 1.5,
    },
    large: {
      padding: [12, 24],
      fontSize: 14,
      iconSize: 16,
      borderRadius: 10,
      dimensions: [52, 52],
      gap: 8,
      borderWidth: 2,
    },
  } as const;

  const {
    padding: [paddingVertical, paddingHorizontal],
    fontSize,
    iconSize,
    borderRadius,
    dimensions: [height, width],
    gap,
    borderWidth,
  } = SIZE_CONFIG[size];

  return (
    <View
      style={{
        overflow: "hidden",
        borderRadius: borderRadius,
        borderWidth: type === "primary" ? 0 : borderWidth,
        borderColor: border,
        alignSelf: wrap ? "center" : "auto",
      }}
    >
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        style={({ pressed }) => {
          // Determine which state colors to use
          const currentState = disabled
            ? colors[type].disabled
            : pressed
            ? colors[type].pressed
            : colors[type].default;

          return [
            styles.baseButton,
            {
              backgroundColor: currentState.bg,
              paddingHorizontal,
              paddingVertical,
              gap,
              height: type === "secondary" ? height - 4 : height,
              width:
                Icon && !text
                  ? type === "secondary"
                    ? width - 4
                    : width
                  : "auto",
              borderRadius: borderRadius,
              borderColor: currentState.border,
            },
          ];
        }}
      >
        {({ pressed }) => (
          <>
            {Icon && (
              <Icon
                color={
                  disabled
                    ? colors[type].disabled.text
                    : pressed
                    ? pressedStyle.text
                    : textColor
                }
                width={iconSize}
                height={iconSize}
              />
            )}
            {text && (
              <Text
                style={[
                  styles.text,
                  {
                    color: disabled
                      ? colors[type].disabled.text
                      : pressed
                      ? pressedStyle.text
                      : textColor,
                    fontSize,
                    opacity: disabled ? 0.7 : 1,
                  },
                ]}
              >
                {text}
              </Text>
            )}
          </>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontFamily: "Arimo-Medium",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

export default Button;
