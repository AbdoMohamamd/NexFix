import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

import SvgGoback from "@/assets/Icons/Goback";
import { HeaderProps } from "@/assets/utils/Components/Types";

const Header = ({
  title,
  goBack = true,
  Icon,
  onPress,
  safeArea = true,
}: HeaderProps) => {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* Left: Back button */}
      {goBack ? (
        <Pressable
          onPress={() => {
            router.back();
          }}
          style={styles.iconContainer}
        >
          <SvgGoback width={wp("6%")} height={wp("6%")} />
        </Pressable>
      ) : Icon ? (
        <Pressable onPress={onPress} style={styles.iconContainer}>
          <Icon width={wp("6%")} height={wp("6%")} />
        </Pressable>
      ) : (
        <View style={styles.iconSpacer} />
      )}

      {/* Center Title */}
      <Text style={styles.text} numberOfLines={1}>
        {title}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),

    // For BOTTOM shadow only on iOS
    shadowColor: "#000000",
    shadowOffset: {
      width: 0, // No horizontal shadow
      height: hp("0.15%"), // Shadow ONLY at the bottom (positive value)
    },
    shadowOpacity: 0.1,
    shadowRadius: wp("0.75%"),

    // For BOTTOM shadow only on Android
    elevation: 4,
  },
  iconContainer: {
    width: wp("8%"), // Responsive width for touch area
    height: wp("8%"), // Responsive height for touch area
    justifyContent: "center",
    alignItems: "center",
  },
  iconSpacer: {
    width: wp("12%"), // Match iconContainer width for consistent spacing
    height: wp("12%"), // Match iconContainer height
  },
  text: {
    color: "#000000",
    fontSize: wp("5%"),
    fontFamily: "Arimo-Medium",
    flex: 1,
    marginHorizontal: wp("2%"),
  },
});

export default Header;
