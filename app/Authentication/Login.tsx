import SvgEye from "@/assets/Icons/Eye";
import Button from "@/components/Button";
import Header from "@/components/Header";
import CustomTextInput from "@/components/TextInput";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const Login = () => {
  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // Handle login submission
  const handleLogin = () => {
    console.log("Login attempt:", { email, password });
    // Add validation if needed
    router.navigate("/(tabs)");
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    console.log("Forgot password for:", email);
    // Navigate to forgot password screen or show modal
  };

  // Handle register navigation
  const handleRegister = () => {
    router.navigate("/Authentication/Register");
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Header goBack={true} safeArea={true} title="Login" />
      <View style={{ alignItems: "center" ,flex:1}}>
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
            fontSize: wp("6%"), // 24px,
            marginTop: hp("1%"), // 8px
          }}
        >
          Welcome Back
        </Text>
        <Text
          style={{
            fontFamily: "Arimo-Regular",
            fontSize: wp("3.5%"), // 14px
            color: "#6A7282",
            marginTop: hp("0.5%"), // 4px
          }}
        >
          Login to access your account
        </Text>
        <View
          style={{
            flex: 1,
            width: "100%",
            padding: wp("6%"), // 24px
            gap: hp("2%"), // 16px,
            marginTop: hp("2%"), // 16px
          }}
        >
          <CustomTextInput
            title="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
          />

          <CustomTextInput
            title="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            IconComponent2={SvgEye}
            onRightIconPress={() => setShowPassword(!showPassword)}
            placeholder="Enter your password"
          />

          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text
                style={{
                  fontFamily: "Arimo-Regular",
                  fontSize: wp("3.5%"), // 14px
                  color: "#F4C430",
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <Button text="Login" wrap={false} onPress={handleLogin} />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: hp("2%"), // 16px
            paddingHorizontal: wp("6%"), // 24px
            width: "100%",
          }}
        >
          <Text
            style={{
              fontFamily: "Arimo-Regular",
              fontSize: wp("3.5%"), // 14px
              color: "#6A7282",
            }}
          >
            Don't Have an Account?
          </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text
              style={{
                color: "#F4C430",
                fontFamily: "Arimo-Medium",
                fontSize: wp("3.5%"), // 14px
                marginLeft: wp("1%"), // 4px
              }}
            >
              Register here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
