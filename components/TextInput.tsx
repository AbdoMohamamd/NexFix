import { TextInputProps } from "@/assets/utils/Components/Types";
import React, { useRef, useState } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
  style,
}: TextInputProps & { style?: any }) => {
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
              width={wp('6%')}   // Responsive icon (was 24)
              height={wp('6%')}  // Responsive icon (was 24)
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
              width={wp('6%')}   // Responsive icon (was 24)
              height={wp('6%')}  // Responsive icon (was 24)
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
    width: "100%",
  },
  title: {
    fontSize: wp('3.5%'),   // Responsive font (was 14)
    fontFamily: "Arimo-Medium",
    marginBottom: hp('0.8%'), // Responsive margin (was 6)
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: wp('2%'),    // Responsive border radius (was 8)
    borderWidth: wp('0.38%'),  // Responsive border width (was 1.5)
    paddingHorizontal: wp('3%'), // Responsive padding (was 12)
    paddingVertical: hp('1%'),   // Responsive padding (was 8)
    minHeight: hp('6%'),        // Responsive min height (was 48)
  },
  inputContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: wp('2%'),             // Responsive gap (was 8)
  },
  input: {
    fontSize: wp('4%'),        // Responsive font (was 16)
    fontFamily: "Arimo-Regular",
    flex: 1,
    padding: 0,
    margin: 0,
    height: "100%",
    minHeight: hp('4%'),       // Ensure touch target on tablets
  },
  supportText: {
    fontSize: wp('3%'),        // Responsive font (was 12)
    marginTop: hp('0.5%'),     // Responsive margin (was 4)
    fontFamily: "Arimo-Regular",
    color: "#6A7282",
  },
});

export default CustomTextInput;