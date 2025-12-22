import SvgPhone from "@/assets/Icons/Phone";
import Button from "@/components/Button";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Text, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Welcome = () => {
  return (
    <View
      style={{
        paddingHorizontal: wp("6%"), // 24px
        justifyContent: "flex-end",
        flex: 1,
      }}
    >
      <StatusBar style="inverted" />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          style={{
            width: wp("50%"), // 200px
            height: wp("50%"), // 200px
          }}
        />
        <Text
          style={{
            fontFamily: "Arimo-Bold",
            fontSize: wp("6%"), // 24px
            marginTop: hp("2%"), // 16px
          }}
        >
          Welcome to NEXFIX
        </Text>
        <Text
          style={{
            fontFamily: "Arimo-Regular",
            fontSize: wp("3.5%"), // 14px
            color: "#6A7282",
            marginTop: hp("0.5%"), // 4px
          }}
        >
          Your trusted car service partner
        </Text>
      </View>
      <View
        style={{
          gap: hp("1.5%"), // 12px
          paddingBottom: hp("3%"), // 24px
        }}
      >
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
          }}
          text="Call Us"
          wrap={false}
          type="ternary"
          Icon={SvgPhone}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: wp("4%"), // 16px
          }}
        >
          <Text
            style={{
              fontFamily: "Arimo-regular",
              fontSize: wp("3%"), // 12px
              color: "#6A7282",
              textAlign: "center",
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
