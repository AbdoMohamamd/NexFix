import SvgAngleRight from "@/assets/Icons/AngleRight";
import SvgBell from "@/assets/Icons/Bell";
import SvgCar from "@/assets/Icons/Car";
import SvgClockBackward from "@/assets/Icons/ClockBackward";
import SvgLogout from "@/assets/Icons/Logout";
import SvgPlus from "@/assets/Icons/Plus";
import SvgQuestionMark from "@/assets/Icons/QuestionMark";
import SvgShield from "@/assets/Icons/Shield";
import InfoBlock from "@/components/InfoBlock";
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
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../Context/AuthProvider";

const Account = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { logout } = useAuth();
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
            paddingHorizontal: wp("5%"), // Responsive (was 20)
            paddingVertical: hp("2%"), // Responsive (was 16)
            borderBottomWidth: wp("0.25%"), // Responsive (was 1)
            borderBottomColor: "#E5E7EB",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: wp("6%"), // Responsive (was 24)
              fontFamily: "Arimo-Bold",
              color: "#111827",
            }}
          >
            Account
          </Text>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: wp("1%"), // Responsive (was 4)
            }}
            onPress={() => {
              logout();
            }}
          >
            <SvgLogout width={wp("4.5%")} height={wp("4.5%")} />
            {/* Responsive icon */}
            <Text
              style={{
                fontSize: wp("3.5%"), // Responsive (was 14)
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
            padding: wp("5%"), // Responsive (was 20)
            borderBottomWidth: wp("0.25%"), // Responsive (was 1)
            borderBottomColor: "#F3F4F6",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Profile Icon with Initials */}
            <View
              style={{
                width: wp("15%"), // Responsive (was 60)
                height: wp("15%"), // Responsive (was 60)
                borderRadius: wp("7.5%"), // Half of width for perfect circle
                backgroundColor: "#F1C02C",
                justifyContent: "center",
                alignItems: "center",
                marginRight: wp("4%"), // Responsive (was 16)
              }}
            >
              <Text
                style={{
                  fontSize: wp("6%"), // Responsive (was 24)
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
                  fontSize: wp("5%"), // Responsive (was 20)
                  fontFamily: "Arimo-Bold",
                  color: "#111827",
                }}
              >
                {user.firstName} {user.lastName}
              </Text>
              <Text
                style={{
                  fontSize: wp("3.5%"), // Responsive (was 14)
                  fontFamily: "Arimo-Regular",
                  color: "#6B7280",
                  marginTop: hp("0.25%"), // Responsive (was 2)
                }}
              >
                {user.email}
              </Text>
            </View>

            {/* Edit Button */}
            <TouchableOpacity
              onPress={() => {
                router.navigate("/Pages/EditAccountInfo");
              }}
            >
              <Text
                style={{
                  fontSize: wp("3.5%"), // Responsive (was 14)
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
            padding: wp("5%"), // Responsive (was 20)
            borderBottomWidth: wp("0.25%"), // Responsive (was 1)
            borderBottomColor: "#F3F4F6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: hp("2%"), // Responsive (was 16)
            }}
          >
            <Text
              style={{
                fontSize: wp("4.5%"), // Responsive (was 18)
                fontFamily: "Arimo-Bold",
                color: "#111827",
              }}
            >
              My Vehicles
            </Text>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <SvgPlus
                width={wp("4%")} // Responsive (was 16)
                height={wp("4%")} // Responsive (was 16)
                color="#F1C02C"
              />
              <Text
                style={{
                  fontSize: wp("3.5%"), // Responsive (was 14)
                  fontFamily: "Arimo-Medium",
                  color: "#F1C02C",
                  marginLeft: wp("1%"), // Responsive (was 4)
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
              borderWidth: wp("0.25%"), // Responsive (was 1)
              borderColor: "#FDE68A",
              borderRadius: wp("3%"), // Responsive (was 12)
              padding: wp("4%"), // Responsive (was 16)
              gap: wp("2%"), // Responsive (was 8)
            }}
          >
            <InfoBlock Icon={SvgCar} />

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: wp("4%"), // Responsive (was 16)
                  fontFamily: "Arimo-Bold",
                  color: "#111827",
                }}
              >
                {vehicle.model}
              </Text>
              <Text
                style={{
                  fontSize: wp("3.5%"), // Responsive (was 14)
                  fontFamily: "Arimo-Regular",
                  color: "#6B7280",
                  marginTop: hp("0.25%"), // Responsive (was 2)
                }}
              >
                {vehicle.mileage}
              </Text>
            </View>

            <SvgAngleRight
              width={wp("5%")} // Responsive (was 20)
              height={wp("5%")} // Responsive (was 20)
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* My Services Section */}
        <View
          style={{
            padding: wp("5%"), // Responsive (was 20)
            borderBottomWidth: wp("0.25%"), // Responsive (was 1)
            borderBottomColor: "#F3F4F6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: hp("2%"), // Responsive (was 16)
            }}
          >
            <Text
              style={{
                fontSize: wp("4.5%"), // Responsive (was 18)
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
                  fontSize: wp("3.5%"), // Responsive (was 14)
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
              borderWidth: wp("0.25%"), // Responsive (was 1)
              borderColor: "#FDE68A",
              borderRadius: wp("3%"), // Responsive (was 12)
              padding: wp("4%"), // Responsive (was 16)
            }}
          >
            <View
              style={{
                width: wp("12%"), // Responsive (was 48)
                height: wp("12%"), // Responsive (was 48)
                borderRadius: wp("6%"), // Half of width for perfect circle
                backgroundColor: "#F1C02C",
                justifyContent: "center",
                alignItems: "center",
                marginRight: wp("4%"), // Responsive (was 16)
              }}
            >
              <SvgClockBackward
                width={wp("6%")} // Responsive (was 24)
                height={wp("6%")} // Responsive (was 24)
                color="#ffffff"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: wp("4%"), // Responsive (was 16)
                  fontFamily: "Arimo-Bold",
                  color: "#111827",
                }}
              >
                Services History
              </Text>
              <Text
                style={{
                  fontSize: wp("3.5%"), // Responsive (was 14)
                  fontFamily: "Arimo-Regular",
                  color: "#6B7280",
                  marginTop: hp("0.25%"), // Responsive (was 2)
                }}
              >
                View your past service records
              </Text>
            </View>

            <SvgAngleRight
              width={wp("5%")} // Responsive (was 20)
              height={wp("5%")} // Responsive (was 20)
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View
          style={{
            padding: wp("5%"), // Responsive (was 20)
            borderBottomWidth: wp("0.25%"), // Responsive (was 1)
            borderBottomColor: "#F3F4F6",
          }}
        >
          <Text
            style={{
              fontSize: wp("4.5%"), // Responsive (was 18)
              fontFamily: "Arimo-Bold",
              color: "#111827",
              marginBottom: hp("2%"), // Responsive (was 16)
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
              paddingVertical: hp("1.5%"), // Responsive (was 12)
              borderBottomWidth: wp("0.25%"), // Responsive (was 1)
              borderBottomColor: "#F3F4F6",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ marginRight: wp("3%") }}>
                {/* Responsive (was 12) */}
                <SvgBell
                  width={wp("6%")} // Responsive (was 24)
                  height={wp("6%")} // Responsive (was 24)
                  color="#6B7280"
                />
              </View>
              <Text
                style={{
                  fontSize: wp("4%"), // Responsive (was 16)
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
          <View style={{ marginTop: hp("2%") }}>
            {/* Responsive (was 16) */}
            <Text
              style={{
                fontSize: wp("4.5%"), // Responsive (was 18)
                fontFamily: "Arimo-Bold",
                color: "#111827",
                marginBottom: hp("2%"), // Responsive (was 16)
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
                paddingVertical: hp("1.5%"), // Responsive (was 12)
                borderBottomWidth: wp("0.25%"), // Responsive (was 1)
                borderBottomColor: "#F3F4F6",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ marginRight: wp("3%") }}>
                  {/* Responsive (was 12) */}
                  <SvgQuestionMark
                    width={wp("6%")} // Responsive (was 24)
                    height={wp("6%")} // Responsive (was 24)
                    color="#6B7280"
                  />
                </View>
                <Text
                  style={{
                    fontSize: wp("4%"), // Responsive (was 16)
                    fontFamily: "Arimo-Regular",
                    color: "#111827",
                  }}
                >
                  Help Center
                </Text>
              </View>
              <SvgAngleRight
                width={wp("5%")} // Responsive (was 20)
                height={wp("5%")} // Responsive (was 20)
                color="#9CA3AF"
              />
            </TouchableOpacity>
            {/* Privacy Policy */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: hp("1.5%"), // Responsive (was 12)
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ marginRight: wp("3%") }}>
                  {/* Responsive (was 12) */}
                  <SvgShield
                    width={wp("6%")} // Responsive (was 24)
                    height={wp("6%")} // Responsive (was 24)
                    color="#6B7280"
                  />
                </View>
                <Text
                  style={{
                    fontSize: wp("4%"), // Responsive (was 16)
                    fontFamily: "Arimo-Regular",
                    color: "#111827",
                  }}
                >
                  Privacy Policy
                </Text>
              </View>
              <SvgAngleRight
                width={wp("5%")} // Responsive (was 20)
                height={wp("5%")} // Responsive (was 20)
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View
          style={{
            padding: wp("5%"), // Responsive (was 20)
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: wp("3%"), // Responsive (was 12)
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
