import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import BottomNavbar from "@/components/BottomNavbar";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="inverted" />
      <BottomNavbar/>
    </View>
  );
}
