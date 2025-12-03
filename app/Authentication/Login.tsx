import SvgEye from "@/assets/Icons/Eye";
import Button from "@/components/Button";
import CustomTextInput from "@/components/TextInput";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";

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
    <View style={{ flex: 1, alignItems: "center", paddingTop: 48 }}>
      <Image
        source={require("@/assets/images/icon.png")}
        width={128}
        height={128}
        style={{ width: 200, height: 200 }}
      />
      <Text style={{ fontFamily: "Arimo-Bold", fontSize: 24 }}>
        Welcome Back
      </Text>
      <Text style={{ fontFamily: "Arimo-Regular", fontSize: 14 }}>
        Login to access your account
      </Text>
      <View style={{ flex: 1, width: "100%", padding: 24, gap: 16 }}>
        <CustomTextInput
          title="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          // Optional: Add keyboardType="email-address" if your component supports it
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
                fontSize: 14,
                color: "#F4C430",
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          text="Login"
          wrap={false}
          onPress={handleLogin}
          // Optional: Disable button if fields are empty
          // state={!email || !password ? "disabled" : "default"}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          flex: 1,
          gap: 4,
          paddingBottom: 16,
        }}
      >
        <Text
          style={{
            fontFamily: "Arimo-Regular",
            fontSize: 14,
          }}
        >
          Don't Have an Account?
        </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text
            style={{
              color: "#F4C430",
              fontFamily: "Arimo-Medium",
            }}
          >
            Register here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
