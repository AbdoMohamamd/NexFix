import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SvgAngleLeft from "@/assets/Icons/AngleLeft";
import { HeaderProps } from "@/assets/utils/Components/Types";
import Button from "./Button";

const Header = ({
  title,
  goBack = true,
  Icon,
  onPress,
  safeArea = true,
}: HeaderProps) => {
  const router = useRouter();

  const Container = safeArea ? SafeAreaView : View;
  return (
    <Container edges={["top"]}>
      <View style={styles.container}>
        {/* Left: Back button */}
        {goBack ? (
          <Button
            size="small"
            type="ternary"
            Icon={SvgAngleLeft}
            onPress={router.back}
            dimensions={[56, 56]}
          />
        ) : (
          <View style={styles.iconSpacer} />
        )}

        {/* Center Title */}
        <Text style={styles.text} numberOfLines={1}>
          {title}
        </Text>

        {/* Right: Optional icon */}
        {Icon ? (
          <Button
            size="small"
            type="ternary"
            Icon={Icon}
            onPress={() => {
              if (onPress) {
                onPress();
              }
            }}
            dimensions={[56, 56]}
          />
        ) : (
          <View style={styles.iconSpacer} />
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    shadowColor: "#000000", // Your color
    shadowOffset: {
      width: 0, // X value
      height: 1, // Y value
    },
    shadowOpacity: 10 / 100, // Convert % to decimal (e.g., 10% → 0.1)
    shadowRadius: 3 / 2, // Rough conversion
    backgroundColor: "#ffffff",
  },
  iconSpacer: {
    width: 30,
  },
  text: {
    color: "#000000",
    fontSize: 18,
    fontFamily: "Sfpro-bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
});

export default Header;
