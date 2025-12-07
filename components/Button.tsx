import { ButtonProps } from "@/assets/utils/Types";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

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

  // Responsive SIZE_CONFIG - scales proportionally
  const SIZE_CONFIG = {
    small: {
      // Converted from pixels to percentages
      paddingVertical: hp("0.5%"), // was 4
      paddingHorizontal: wp("4%"), // was 16
      fontSize: wp("3.5%"), // was 14 (scales with width for consistency)
      iconSize: wp("5%"), // was 20
      borderRadius: wp("1.5%"), // was 6
      height: wp("7.5%"), // was 30 (responsive width-based height)
      width: wp("7.5%"), // was 30
      gap: wp("1%"), // was 4
      borderWidth: wp("0.25%"), // was 1
    },
    medium: {
      paddingVertical: hp("1%"), // was 8
      paddingHorizontal: wp("5%"), // was 20
      fontSize: wp("4.5%"), // was 18
      iconSize: wp("6%"), // was 24
      borderRadius: wp("2%"), // was 8
      height: wp("10%"), // was 40
      width: wp("10%"), // was 40
      gap: wp("2%"), // was 8
      borderWidth: wp("0.38%"), // was 1.5
    },
    large: {
      paddingVertical: hp("1.5%"), // was 12
      paddingHorizontal: wp("6%"), // was 24
      fontSize: wp("3.5%"), // was 14 (you had 14 for large)
      iconSize: wp("4%"), // was 16
      borderRadius: wp("2.5%"), // was 10
      height: wp("13%"), // was 52
      width: wp("13%"), // was 52
      gap: wp("2%"), // was 8
      borderWidth: wp("0.5%"), // was 2
    },
  } as const;

  const {
    paddingVertical,
    paddingHorizontal,
    fontSize,
    iconSize,
    borderRadius,
    height: defaultHeight,
    width: defaultWidth,
    gap,
    borderWidth,
  } = SIZE_CONFIG[size];

  // Use custom dimensions if provided, otherwise use default responsive ones
  const height = dimensions?.[0] || defaultHeight;
  const width = dimensions?.[1] || defaultWidth;

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
              height:
                type === "secondary"
                  ? typeof height === "number"
                    ? height - wp("1%") // Responsive adjustment
                    : height
                  : height,
              width:
                Icon && !text
                  ? type === "secondary"
                    ? typeof width === "number"
                      ? width - wp("1%") // Responsive adjustment
                      : width
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
