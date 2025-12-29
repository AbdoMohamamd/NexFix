import { Tabs } from "expo-router";
import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import SvgCalendar from "@/assets/Icons/Calendar";
import SvgClockBackward from "@/assets/Icons/ClockBackward";
import SvgHomeAlt from "@/assets/Icons/HomeAlt";
import SvgTag from "@/assets/Icons/Tag";
import SvgUser from "@/assets/Icons/User";
import { BottomNavbarIconProps } from "@/assets/utils/Types";

const TAB_CONFIG = [
  { name: "index", title: "Home", Icon: SvgHomeAlt, label: "Home" },

  { name: "Book", title: "Book", Icon: SvgCalendar, label: "Book" },
  {
    name: "Services",
    title: "Services",
    Icon: SvgClockBackward,
    label: "Services",
  },
  { name: "Offers", title: "Offers", Icon: SvgTag, label: "Offers" },
  { name: "Account", title: "Account", Icon: SvgUser, label: "Account" },
];

const BottomNavbar = memo(() => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F4C430",
        tabBarInactiveTintColor: "#6A7282",
        tabBarStyle: styles.tabBar,
        tabBarButton: (props) => <TabButton {...props} styles={styles} />,
        tabBarHideOnKeyboard: true,
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            headerShown: false,
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <TabBarIcon Icon={tab.Icon} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
});

const TabBarIcon = memo(({ Icon, color }: BottomNavbarIconProps) => (
  <Icon
    color={color}
    width={wp("7%")} // Responsive icon width (was 28)
    height={wp("7%")} // Responsive icon height (was 28)
  />
));

const TabButton = memo(({ children, onPress, styles }: any) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.centered}>{children}</View>
    </Pressable>
  );
});

// Responsive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  centered: {
    alignItems: "center",
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: wp("0.3%"), // Responsive border (was 1)
    borderTopColor: "#E5E7EB",
    height: hp("9%"), // Responsive height (was 72)
    minHeight: hp("9%"), // Ensure minimum height on small screens
  },
  label: {
    fontSize: wp("3%"), // Responsive font size (was 12)
    fontFamily: "Sfpro-regular",
    position: "absolute",
    top: "65%", // Percentage remains the same
  },
  floatingButton: {
    width: wp("12%"), // Responsive width (was 48)
    height: wp("12%"), // Responsive height (was 48)
    borderWidth: wp("0.5%"), // Responsive border (was 2)
    justifyContent: "center",
    alignItems: "center",
    borderRadius: wp("25%"), // Half of width for perfect circle
  },
});

export default BottomNavbar;
