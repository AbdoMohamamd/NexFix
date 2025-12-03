import { useRoute } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React, { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import SvgCalendar from "@/assets/Icons/Calendar";
import SvgHomeAlt from "@/assets/Icons/HomeAlt";
import SvgPhone from "@/assets/Icons/Phone";
import SvgUser from "@/assets/Icons/User";
import { BottomNavbarIconProps } from "@/assets/utils/Components/Types";

const TAB_CONFIG = [
  { name: "index", title: "Home", Icon: SvgHomeAlt, label: "Home" },
  { name: "Book", title: "Book", Icon: SvgCalendar, label: "Book" },
  { name: "Offers", title: "Offers", Icon: SvgPhone, label: "Offers" },
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
      {/* First two tabs (left side) */}
      {TAB_CONFIG.slice(0, 2).map((tab) => (
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

      {/* Last two tabs (right side) */}
      {TAB_CONFIG.slice(2).map((tab) => (
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
  <Icon color={color} width={28} height={28} />
));

const TabButton = memo(({ children, onPress, styles }: any) => {
  const route = useRoute();
  const currentTab = TAB_CONFIG.find((tab) => tab.name === route.name);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.centered}>{children}</View>
    </Pressable>
  );
});

// Dynamic styles function
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
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    height: 72,
  },
  label: {
    fontSize: 12,
    fontFamily: "Sfpro-regular",
    position: "absolute",
    top: "65%",
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
});

export default BottomNavbar;
