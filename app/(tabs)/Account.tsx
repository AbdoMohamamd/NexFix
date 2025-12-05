import SvgAngleRight from "@/assets/Icons/AngleRight";
import SvgBell from "@/assets/Icons/Bell";
import SvgCar from "@/assets/Icons/Car";
import SvgClockBackward from "@/assets/Icons/ClockBackward";
import SvgLogout from "@/assets/Icons/Logout";
import SvgPlus from "@/assets/Icons/Plus";
import SvgQuestionMark from "@/assets/Icons/QuestionMark";
import SvgShield from "@/assets/Icons/Shield";
import InfoBlock from "@/components/InfoBlock copy";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Account = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // User data (in real app, this would come from auth context/state)
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };

  const vehicle = {
    model: "Toyota Camry",
    mileage: "45,280 miles",
    year: "2021",
  };

  const appVersion = "1.0.0";

  // Get initials for profile icon
  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(
      0
    )}`.toUpperCase();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{ fontSize: 24, fontFamily: "Arimo-Bold", color: "#111827" }}
          >
            Account
          </Text>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            onPress={() => {
              router.navigate("/Authentication/Welcome");
            }}
          >
            <SvgLogout />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Arimo-Regular",
                color: "#E7000B",
              }}
            >
              Logout
            </Text>
          </Pressable>
        </View>

        {/* Profile Section */}
        <View
          style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Profile Icon with Initials */}
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#F1C02C",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Arimo-Bold",
                  color: "#ffffff",
                }}
              >
                {getInitials()}
              </Text>
            </View>

            {/* User Details */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Arimo-Bold",
                  color: "#111827",
                }}
              >
                {user.firstName} {user.lastName}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Arimo-Regular",
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                {user.email}
              </Text>
            </View>

            {/* Edit Button */}
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Arimo-Medium",
                  color: "#F1C02C",
                }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Vehicles Section */}
        <View
          style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Arimo-Bold",
                color: "#111827",
              }}
            >
              My Vehicles
            </Text>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <SvgPlus width={16} height={16} color="#F1C02C" />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Arimo-Medium",
                  color: "#F1C02C",
                  marginLeft: 4,
                }}
              >
                Add new
              </Text>
            </TouchableOpacity>
          </View>

          {/* Vehicle Card */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFDF6",
              borderWidth: 1,
              borderColor: "#FDE68A",
              borderRadius: 12,
              padding: 16,
              gap: 8,
            }}
          >
            <InfoBlock Icon={SvgCar} />

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Arimo-Bold",
                  color: "#111827",
                }}
              >
                {vehicle.model}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Arimo-Regular",
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                {vehicle.mileage}
              </Text>
            </View>

            <SvgAngleRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* My Services Section */}
        <View
          style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Arimo-Bold",
                color: "#111827",
              }}
            >
              My Services
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.navigate("/Pages/ServicesHistory");
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Arimo-Medium",
                  color: "#F1C02C",
                }}
              >
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {/* Services History Card */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFDF6",
              borderWidth: 1,
              borderColor: "#FDE68A",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#F1C02C",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <SvgClockBackward width={24} height={24} color="#ffffff" />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Arimo-Bold",
                  color: "#111827",
                }}
              >
                Services History
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Arimo-Regular",
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                View your past service records
              </Text>
            </View>

            <SvgAngleRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View
          style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Arimo-Bold",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Settings
          </Text>

          {/* Notifications */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#F3F4F6",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ marginRight: 12 }}>
                <SvgBell width={24} height={24} color="#6B7280" />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Arimo-Regular",
                  color: "#111827",
                }}
              >
                Notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#D1D5DB", true: "#F1C02C" }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Help and Support Section */}
          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Arimo-Bold",
                color: "#111827",
                marginBottom: 16,
              }}
            >
              Help & Support
            </Text>

            {/* Help Center */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#F3F4F6",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ marginRight: 12 }}>
                  <SvgQuestionMark width={24} height={24} color="#6B7280" />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Arimo-Regular",
                    color: "#111827",
                  }}
                >
                  Help Center
                </Text>
              </View>
              <SvgAngleRight width={20} height={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ marginRight: 12 }}>
                  <SvgShield width={24} height={24} color="#6B7280" />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Arimo-Regular",
                    color: "#111827",
                  }}
                >
                  Privacy Policy
                </Text>
              </View>
              <SvgAngleRight width={20} height={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Arimo-Regular",
              color: "#9CA3AF",
            }}
          >
            Version {appVersion}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;
