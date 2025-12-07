import { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import SvgEye from "@/assets/Icons/Eye";
import Button from "@/components/Button";
import Header from "@/components/Header";
import CustomTextInput from "@/components/TextInput";
import { router } from "expo-router";
import { useAuth } from "../Context/AuthProvider";

const Login = () => {
  const { login, isLoading,user } = useAuth();

  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Handle login submission
  const handleLogin = async () => {
    // Basic validation
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      setIsLoggingIn(true);
      await login(email, password);
      // Navigation is handled in the AuthContext after successful login
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    console.log("Forgot password for:", email);
    // Navigate to forgot password screen
    // router.navigate('/Authentication/ForgotPassword');
  };

  // Handle register navigation
  const handleRegister = () => {
    router.navigate("/Authentication/Register");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Header goBack={true} safeArea={true} title="Login" />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Logo and Welcome Section */}
            <View style={{ alignItems: "center", paddingTop: hp("2%") }}>
              <Image
                source={require("@/assets/images/icon.png")}
                style={{
                  width: wp("40%"),
                  height: wp("40%"),
                  marginTop: hp("2%"),
                }}
              />
              <Text
                style={{
                  fontFamily: "Arimo-Bold",
                  fontSize: wp("6%"),
                  marginTop: hp("1%"),
                  textAlign: "center",
                }}
              >
                Welcome Back
              </Text>
              <Text
                style={{
                  fontFamily: "Arimo-Regular",
                  fontSize: wp("3.5%"),
                  color: "#6A7282",
                  marginTop: hp("0.5%"),
                  textAlign: "center",
                  paddingHorizontal: wp("10%"),
                }}
              >
                Login to access your account
              </Text>
            </View>

            {/* Form Inputs */}
            <View
              style={{
                width: "100%",
                padding: wp("6%"),
                gap: hp("2%"),
                marginTop: hp("4%"),
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
                      fontSize: wp("3.5%"),
                      color: "#F4C430",
                    }}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                text={isLoggingIn ? "Logging in..." : "Login"}
                wrap={false}
                onPress={handleLogin}
                disabled={isLoggingIn}
              />
            </View>

            {/* Register link - stays at bottom */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: wp("6%"),
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontFamily: "Arimo-Regular",
                  fontSize: wp("3.5%"),
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
                    fontSize: wp("3.5%"),
                    marginLeft: wp("1%"),
                  }}
                >
                  Register here
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
