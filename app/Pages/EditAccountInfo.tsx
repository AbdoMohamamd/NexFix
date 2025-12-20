import SvgEye from "@/assets/Icons/Eye";
import SvgEyeSlash from "@/assets/Icons/EyeSlash";
import { authAPI, updateUserData } from "@/assets/utils/Api/api";
import Button from "@/components/Button";
import Header from "@/components/Header";
import CustomTextInput from "@/components/TextInput";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAuth } from "../Context/AuthProvider";

const EditAccountInfo = () => {
  const { user, token } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setEmail(user.accountEmail || "");
      setPhoneNumber(user.accPhoneNumber || user.accPhoneNumber || "");
    }
    setIsLoadingData(false);
  }, [user]);

  // Validate form
  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }

    // If password is provided, validate it
    if (password.trim()) {
      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters long");
        return false;
      }

      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return false;
      }
    }

    return true;
  };

  // Handle update account
  const handleUpdateAccount = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare the data for API
      const updateData: any = {
        accID: user?.accID,
        accountEmail: email,
        accountPhoneNumber: phoneNumber,
      };

      // Only include password if it was changed
      if (password.trim()) {
        updateData.accPassword = password;
      }

      console.log("Updating account with:", updateData);

      const response = await authAPI.updateAccount(updateData);
      console.log("Update response:", response.data);

      if (response.data.success) {
        // Update local user data
        const updatedUserData = {
          ...user,
          accountEmail: email,
          accPhoneNumber: phoneNumber,
          accountPhoneNumber: phoneNumber,
        };

        // Update in SecureStore
        await updateUserData(updatedUserData);

        Alert.alert(
          "Success",
          response.data.message || "Account updated successfully!",
          [{ text: "OK" }]
        );
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error: any) {
      console.error("Update error:", error);

      let errorMessage = "Update failed";

      if (error.response) {
        console.error("Error response data:", error.response.data);
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Check your connection.";
      } else {
        errorMessage = error.message;
      }

      Alert.alert("Update Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Header goBack={true} title="Edit Account" />

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              gap: 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Current Account Info */}
            <View
              style={{
                padding: 16,
                backgroundColor: "#F8FAFC",
                borderRadius: 12,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Arimo-Bold",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                Current Account
              </Text>
              <Text
                style={{
                  fontFamily: "Arimo-Regular",
                  fontSize: 12,
                  color: "#6B7280",
                }}
              >
                Username: {user?.accUserName}
              </Text>
              <Text
                style={{
                  fontFamily: "Arimo-Regular",
                  fontSize: 12,
                  color: "#6B7280",
                }}
              >
                Role: {user?.roleName || "Customer"}
              </Text>
            </View>

            {/* Edit Form Card */}
            <View
              style={{
                padding: 16,
                gap: 12,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 1.5,
                elevation: 2,
                backgroundColor: "#ffffff",
                borderRadius: 24,
              }}
            >
              <Text style={{ fontFamily: "Arimo-Bold", fontSize: 16 }}>
                Edit Information
              </Text>

              {/* Email Input */}
              <CustomTextInput
                title="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your new email"
              />

              {/* Phone Number Input */}
              <CustomTextInput
                title="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your new phone number"
              />

              {/* Password Input (Optional) */}
              <CustomTextInput
                title="New Password (Optional)"
                value={password}
                onChangeText={setPassword}
                placeholder="Leave empty to keep current password"
                secureTextEntry={!showPassword}
                IconComponent2={showPassword ? SvgEyeSlash : SvgEye}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              {/* Confirm Password Input (Only if password is entered) */}
              {password.trim() ? (
                <CustomTextInput
                  title="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your new password"
                  secureTextEntry={!showConfirmPassword}
                  IconComponent2={showConfirmPassword ? SvgEyeSlash : SvgEye}
                  onRightIconPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
              ) : null}

              <Button
                text={isLoading ? "Updating..." : "Update Account"}
                wrap={false}
                onPress={handleUpdateAccount}
                disabled={isLoading}
              />

              <Text
                style={{
                  fontFamily: "Arimo-Regular",
                  fontSize: 12,
                  color: "#6B7280",
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Note: Leave password fields empty if you don't want to change
                your password
              </Text>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditAccountInfo;
