import SvgPhone from "@/assets/Icons/Phone";
import Button from "@/components/Button";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Text, View } from "react-native";

const Welcome = () => {
  return (
    <View
      style={{ paddingHorizontal: 24, justifyContent: "flex-end", flex: 1 }}
    >
      <StatusBar style="inverted" />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={require("@/assets/images/icon.png")}
          width={128}
          height={128}
          style={{ width: 200, height: 200 }}
        />
        <Text style={{ fontFamily: "Arimo-Bold", fontSize: 24 }}>
          Welcome to NEXFIX
        </Text>
        <Text style={{ fontFamily: "Arimo-Regular", fontSize: 14 }}>
          Your trusted car service partner
        </Text>
      </View>
      <View style={{ gap: 12, paddingBottom: 24 }}>
        <Button
          onPress={() => {
            router.navigate("/Authentication/Register");
          }}
          text="Register"
          wrap={false}
          type="primary"
        />
        <Button
          onPress={() => {
            router.navigate("/Authentication/Login");
          }}
          text="Login"
          wrap={false}
          type="secondary"
        />
        <Button
          onPress={() => {
            console.log("make phone call to number")
          }}
          text="Call Us"
          wrap={false}
          type="ternary"
          Icon={SvgPhone}
        />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Arimo-regular",
              fontSize: 12,
              color: "#6A7282",
            }}
          >
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
};
export default Welcome;
