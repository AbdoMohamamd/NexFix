import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { DropDownProps } from "@/assets/utils/Types";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import SvgAngleDown from "@/assets/Icons/AngleDown";

const DropDown = ({
  title,
  placeholder,
  value,
  onValueChange,
  IconComponent1,
  supportText,
  state,
  options = [],
  card = false,
  style,
}: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
    error: {
      borderColor: "#DC2626",
      iconColor: "#DC2626",
      titleColor: "#DC2626",
      backgroundColor: "#fdfaeaff",
      textColor: "#DC2626",
    },
    success: {
      borderColor: "#059669",
      iconColor: "#059669",
      titleColor: "#059669",
      backgroundColor: "#fdfaeaff",
      textColor: "#059669",
    },
    disabled: {
      borderColor: "#D1D5DB",
      iconColor: "#9CA3AF",
      titleColor: "#9CA3AF",
      backgroundColor: "#F3F4F6",
      textColor: "#9CA3AF",
    },
  };

  const getColorByState = (
    state?: "default" | "error" | "success" | "active" | "disabled"
  ) => {
    switch (state) {
      case "error":
        return colors.error;
      case "success":
        return colors.success;
      case "active":
        return colors.active;
      case "disabled":
        return colors.disabled;
      default:
        return colors.default;
    }
  };

  const effectiveState =
    state === "disabled"
      ? "disabled"
      : state === "error" || state === "success"
      ? state
      : isFocused
      ? "active"
      : "default";

  const currentColors = getColorByState(effectiveState);
  const isDisabled = state === "disabled";

  const handlePress = () => {
    if (!isDisabled) {
      setIsOpen(true);
      setIsFocused(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleSelect = (option: any) => {
    onValueChange(option);
    handleClose();
  };

  const getDisplayValue = () => {
    if (value) {
      return value.name;
    } else {
      return placeholder;
    }
  };

  const renderOption = ({ item }: { item: any }) => {
    return (
      <View style={{ borderRadius: wp("2%"), overflow: "hidden" }}>
        <Pressable
          style={{
            backgroundColor: "#fdfaeaff",
            paddingVertical: hp("2%"),
            paddingHorizontal: wp("4%"),
            borderRadius: wp("2%"),
            marginVertical: hp("0.5%"),
          }}
          android_ripple={{ color: "#F4C43020" }}
          onPress={() => handleSelect(item)}
        >
          <Text
            style={{
              fontSize: wp("4%"),
              fontFamily: "Arimo-Regular",
              color: currentColors.textColor,
            }}
          >
            {item.name}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {title && (
        <Text style={[styles.title, { color: currentColors.titleColor }]}>
          {title}
        </Text>
      )}

      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.inputWrapper,
          {
            borderColor: currentColors.borderColor,
            backgroundColor: currentColors.backgroundColor,
            opacity: isDisabled ? 0.6 : 1,
          },
        ]}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <View style={styles.inputContent}>
          {IconComponent1 && (
            <IconComponent1
              color={currentColors.iconColor}
              width={wp("6%")}
              height={wp("6%")}
            />
          )}
          <Text
            style={[
              styles.input,
              {
                color: value
                  ? currentColors.textColor
                  : currentColors.iconColor,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {getDisplayValue()}
          </Text>
        </View>

        <SvgAngleDown
          color={currentColors.iconColor}
          width={wp("6%")}
          height={wp("6%")}
        />
      </TouchableOpacity>

      {/* Modal for dropdown options */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <View style={styles.dropdownContainer}>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.dropdownList}
              contentContainerStyle={styles.dropdownContent}
            />
          </View>
        </Pressable>
      </Modal>

      {supportText && (
        <Text style={[styles.supportText, { color: currentColors.iconColor }]}>
          {supportText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: wp("3.5%"),
    fontFamily: "Arimo-Medium",
    marginBottom: hp("0.8%"),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: wp("2%"),
    borderWidth: wp("0.38%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    minHeight: hp("6%"),
  },
  inputContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  input: {
    fontSize: wp("4%"),
    fontFamily: "Arimo-Regular",
    flex: 1,
  },
  supportText: {
    fontSize: wp("3%"),
    marginTop: hp("0.5%"),
    fontFamily: "Arimo-Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: wp("4%"),
  },
  dropdownContainer: {
    width: "100%",
    maxHeight: hp("50%"),
    backgroundColor: "#fdfaeaff",
    borderRadius: wp("2%"),
    borderWidth: wp("0.38%"),
    borderColor: "#F4C430",
    overflow: "hidden",
  },
  dropdownList: {
    width: "100%",
  },
  dropdownContent: {
    padding: wp("3%"),
  },
});

export default DropDown;
