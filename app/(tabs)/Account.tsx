import SvgAngleRight from "@/assets/Icons/AngleRight";
import SvgCar from "@/assets/Icons/Car";
import SvgClockBackward from "@/assets/Icons/ClockBackward";
import SvgLogout from "@/assets/Icons/Logout";
import SvgPlus from "@/assets/Icons/Plus";
import { vehicleAPI } from "@/assets/utils/Api/api"; // Import the API
import InfoBlock from "@/components/InfoBlock";
import Constants from "expo-constants";
import { Link, router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
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

// Define vehicle interface
interface Vehicle {
  vehicule_ID: number;
  vehicule_Model: string;
  vehicule_Milleage: number;
  vehicule_FactoryYear: number;
  vehicule_PlateNb?: string;
  brand_Name?: string;
  color_Name?: string;
  fuelType_Name?: string;
}

const Account = () => {
  const appVersion = Constants.expoConfig?.version || "1.0.0";
  const { logout, user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  // Format mileage for display
  const formatMileage = (mileage: number) => {
    return mileage.toLocaleString() + " miles";
  };

  // Fetch vehicles
  const fetchVehicles = async () => {
    if (!user?.accID) return;
    try {
      setIsLoading(true);
      const response = await vehicleAPI.getVehiclesByCustomerId(user.accID);
      if (response.data.success) {
        setVehicles(response.data.data.vehicule || []);
      } else {
        setVehicles([]);
      }
    } catch (error: any) {
      console.error("Error fetching vehicles:", error);
      Alert.alert("Error", "Failed to load vehicles. Please try again.");
      setVehicles([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setShouldRefresh(false); // Reset refresh flag
    }
  };

  // Load vehicles on component mount and when user changes
  useEffect(() => {
    if (user?.accID) {
      fetchVehicles();
    }
  }, [user?.accID]);

  // Use focus effect to refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Refresh vehicles when screen comes into focus
      if (user?.accID) {
        fetchVehicles();
      }

      // Cleanup function
      return () => {
        // Optional: You can add cleanup logic here if needed
      };
    }, [user?.accID])
  );

  // Handle pull to refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  // Navigate to vehicle details or edit
  const navigateToVehicle = (vehicleId: number) => {
    router.push({
      pathname: "/Pages/VehicleDetails",
      params: { vehicleId },
    });
  };

  // Navigate to add vehicle
  const navigateToAddVehicle = () => {
    // Navigate to AddVehicle screen
    router.push("/Pages/AddVehicle");
  };

  // Get initials for profile icon
  const getInitials = () => {
    const firstName = user?.accUserName?.split(" ")[0] || "User";
    const lastName = user?.accUserName?.split(" ")[1] || "";
    return `${firstName.charAt(0)}${
      lastName ? lastName.charAt(0) : ""
    }`.toUpperCase();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#F1C02C"]}
            tintColor="#F1C02C"
          />
        }
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: wp("5%"),
            paddingVertical: hp("2%"),
            borderBottomWidth: wp("0.25%"),
            borderBottomColor: "#E5E7EB",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: wp("6%"),
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
              gap: wp("1%"),
            }}
            onPress={() => {
              logout();
            }}
          >
            <SvgLogout width={wp("4.5%")} height={wp("4.5%")} />
            <Text
              style={{
                fontSize: wp("3.5%"),
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
            padding: wp("5%"),
            borderBottomWidth: wp("0.25%"),
            borderBottomColor: "#F3F4F6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Profile Icon with Initials */}
            <View
              style={{
                width: wp("15%"),
                height: wp("15%"),
                borderRadius: wp("7.5%"),
                backgroundColor: "#F1C02C",
                justifyContent: "center",
                alignItems: "center",
                marginRight: wp("4%"),
              }}
            >
              <Text
                style={{
                  fontSize: wp("6%"),
                  fontFamily: "Arimo-Bold",
                  color: "#ffffff",
                }}
              >
                {getInitials()}
              </Text>
            </View>

            {/* User Details */}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontSize: wp("5%"),
                  fontFamily: "Arimo-Bold",
                  color: "#111827",
                }}
              >
                {user?.accUserName || "User"}
              </Text>
              <Text
                style={{
                  fontSize: wp("3.5%"),
                  fontFamily: "Arimo-Regular",
                  color: "#6B7280",
                  marginTop: hp("0.25%"),
                  backgroundColor: "#fff",
                }}
              >
                {user?.accountEmail || ""}
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
                  fontSize: wp("3.5%"),
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
            padding: wp("5%"),
            borderBottomWidth: wp("0.25%"),
            borderBottomColor: "#F3F4F6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: hp("2%"),
            }}
          >
            <Text
              style={{
                fontSize: wp("4.5%"),
                fontFamily: "Arimo-Bold",
                color: "#111827",
              }}
            >
              My Vehicles ({vehicles.length})
            </Text>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={navigateToAddVehicle}
            >
              <SvgPlus width={wp("4%")} height={wp("4%")} color="#F1C02C" />
              <Text
                style={{
                  fontSize: wp("3.5%"),
                  fontFamily: "Arimo-Medium",
                  color: "#F1C02C",
                  marginLeft: wp("1%"),
                }}
              >
                Add new
              </Text>
            </TouchableOpacity>
          </View>

          {/* Loading State */}
          {isLoading ? (
            <View style={{ alignItems: "center", padding: hp("4%") }}>
              <ActivityIndicator size="large" color="#F1C02C" />
              <Text style={{ marginTop: hp("2%"), color: "#6B7280" }}>
                Loading vehicles...
              </Text>
            </View>
          ) : vehicles.length === 0 ? (
            // Empty State
            <View style={{ alignItems: "center", padding: hp("2%") }}>
              <Text
                style={{
                  color: "#6B7280",
                  fontFamily: "Arimo-Regular",
                  fontSize: wp("4%"),
                  textAlign: "center",
                }}
              >
                No vehicles added yet
              </Text>
              <TouchableOpacity
                onPress={navigateToAddVehicle}
                style={{ marginTop: hp("2%") }}
              >
                <Text
                  style={{
                    color: "#F1C02C",
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"),
                  }}
                >
                  Add your first vehicle
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Vehicles List
            <View style={{ gap: hp("1.5%") }}>
              {vehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.vehicule_ID}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFFDF6",
                    borderWidth: wp("0.25%"),
                    borderColor: "#FDE68A",
                    borderRadius: wp("3%"),
                    padding: wp("4%"),
                    gap: wp("2%"),
                  }}
                  onPress={() => navigateToVehicle(vehicle.vehicule_ID)}
                >
                  <InfoBlock Icon={SvgCar} />

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: wp("4%"),
                        fontFamily: "Arimo-Bold",
                        color: "#111827",
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {vehicle.vehicule_Model || "Unnamed Vehicle"}
                    </Text>

                    <View
                      style={{ flexDirection: "row", marginTop: hp("0.5%") }}
                    >
                      <Text
                        style={{
                          fontSize: wp("3.5%"),
                          fontFamily: "Arimo-Regular",
                          color: "#6B7280",
                          marginRight: wp("2%"),
                        }}
                      >
                        {formatMileage(vehicle.vehicule_Milleage)}
                      </Text>
                      <Text
                        style={{
                          fontSize: wp("3.5%"),
                          fontFamily: "Arimo-Regular",
                          color: "#6B7280",
                        }}
                      >
                        • {vehicle.vehicule_FactoryYear}
                      </Text>
                    </View>

                    {/* Optional: Display brand and plate number */}
                    {(vehicle.brand_Name || vehicle.vehicule_PlateNb) && (
                      <Text
                        style={{
                          fontSize: wp("3.5%"),
                          fontFamily: "Arimo-Regular",
                          color: "#9CA3AF",
                          marginTop: hp("0.25%"),
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {vehicle.brand_Name ? `${vehicle.brand_Name}` : ""}
                        {vehicle.brand_Name && vehicle.vehicule_PlateNb
                          ? " • "
                          : ""}
                        {vehicle.vehicule_PlateNb || ""}
                      </Text>
                    )}
                  </View>

                  <SvgAngleRight
                    width={wp("5%")}
                    height={wp("5%")}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* My Services Section */}
        <View
          style={{
            padding: wp("5%"),
            borderBottomWidth: wp("0.25%"),
            borderBottomColor: "#F3F4F6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: hp("2%"),
            }}
          >
            <Text
              style={{
                fontSize: wp("4.5%"),
                fontFamily: "Arimo-Bold",
                color: "#111827",
              }}
            >
              My Services
            </Text>
          </View>

          {/* Services History Card */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFDF6",
              borderWidth: wp("0.25%"),
              borderColor: "#FDE68A",
              borderRadius: wp("3%"),
              padding: wp("4%"),
            }}
            onPress={() => {
              router.navigate("/Pages/ServicesHistory");
            }}
          >
            <View
              style={{
                width: wp("12%"),
                height: wp("12%"),
                borderRadius: wp("6%"),
                backgroundColor: "#F1C02C",
                justifyContent: "center",
                alignItems: "center",
                marginRight: wp("4%"),
              }}
            >
              <SvgClockBackward
                width={wp("6%")}
                height={wp("6%")}
                color="#ffffff"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: wp("4%"),
                  fontFamily: "Arimo-Bold",
                  color: "#111827",
                }}
              >
                Services History
              </Text>
              <Text
                style={{
                  fontSize: wp("3.5%"),
                  fontFamily: "Arimo-Regular",
                  color: "#6B7280",
                  marginTop: hp("0.25%"),
                }}
              >
                View your past service records
              </Text>
            </View>

            <SvgAngleRight width={wp("5%")} height={wp("5%")} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View
          style={{ padding: wp("5%"), alignItems: "center", gap: hp("0.5%") }}
        >
          <Text
            style={{
              fontSize: wp("3%"),
              fontFamily: "Arimo-Regular",
              color: "#9CA3AF",
            }}
          >
            Version {appVersion}
          </Text>
          <Link
            href="https://its4solution.com"
            style={{
              fontSize: wp("3%"),
              fontFamily: "Arimo-Regular",
              color: "#F1C02C",
            }}
          >
            Developed by its4solution.com
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;
