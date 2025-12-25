import SvgAngleRight from "@/assets/Icons/AngleRight";
import SvgCalendar from "@/assets/Icons/Calendar";
import SvgCar from "@/assets/Icons/Car";
import SvgTachometerFastAlt from "@/assets/Icons/TachometerFastAlt";
import { remindersAPI, vehicleAPI } from "@/assets/utils/Api/api";
import Header from "@/components/Header";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useAuth } from "../Context/AuthProvider";

// Define types
interface Vehicle {
  vehicule_ID: number;
  vehicule_Model: string;
  vehicule_PlateNb?: string;
  vehicule_Milleage: number;
  vehicule_FactoryYear: number;
  vehicule_BrandID: number;
  vehicule_ColorID: number;
  vehicule_FuelTypeID: number;
  brand_Name?: string;
}

interface ServiceReminder {
  account_MechanicID: number;
  serviceReminder_Title: string;
  serviceReminder_Description: string;
  serviceReminder_VehiculeID: number;
  serviceReminder_Type: number;
  serviceReminder_DueDate: string;
  serviceReminder_DueMileage: number;
  serviceReminder_SendAt: string;
  [key: string]: any;
}

interface VehicleWithReminders extends Vehicle {
  reminders: ServiceReminder[];
}

const Reminder = () => {
  const { user } = useAuth();
  const [vehiclesWithReminders, setVehiclesWithReminders] = useState<
    VehicleWithReminders[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.accID) {
      fetchData();
    }
  }, [user?.accID]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.accID) {
        throw new Error("User not logged in");
      }

      // Fetch vehicles for the customer
      const vehiclesResponse = await vehicleAPI.getVehiclesByCustomerId(
        user.accID
      );

      if (!vehiclesResponse.data.success) {
        throw new Error(
          vehiclesResponse.data.message || "Failed to fetch vehicles"
        );
      }

      const vehicles: Vehicle[] = vehiclesResponse.data.data.vehicule || [];

      if (vehicles.length === 0) {
        setVehiclesWithReminders([]);
        return;
      }

      // Fetch all reminders
      const remindersResponse = await remindersAPI.getAll();

      if (!remindersResponse.data.success) {
        throw new Error(
          remindersResponse.data.message || "Failed to fetch reminders"
        );
      }

      const allReminders: ServiceReminder[] =
        remindersResponse.data.data.reminders || [];

      // Group reminders by vehicle ID
      const vehicleRemindersMap = allReminders.reduce((acc, reminder) => {
        const vehicleId = reminder.serviceReminder_VehiculeID;
        if (!acc[vehicleId]) {
          acc[vehicleId] = [];
        }
        acc[vehicleId].push(reminder);
        return acc;
      }, {} as Record<number, ServiceReminder[]>);

      // Combine vehicles with their reminders
      const vehiclesWithRemindersData = vehicles.map((vehicle) => ({
        ...vehicle,
        reminders: vehicleRemindersMap[vehicle.vehicule_ID] || [],
      }));

      // Filter to only show vehicles that have reminders
      const vehiclesWithActiveReminders = vehiclesWithRemindersData.filter(
        (vehicle) => vehicle.reminders.length > 0
      );

      setVehiclesWithReminders(vehiclesWithActiveReminders);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load reminders");
      setVehiclesWithReminders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format mileage with commas
  const formatMileage = (mileage: number) => {
    return mileage.toLocaleString() + " miles";
  };

  // Get reminder type text
  const getReminderTypeText = (type: number) => {
    switch (type) {
      case 1:
        return "Oil Change";
      case 2:
        return "Tire Rotation";
      case 3:
        return "Brake Service";
      case 4:
        return "Engine Check";
      default:
        return "Maintenance";
    }
  };

  // Get reminder type color - ALL CHANGED TO YELLOW
  const getReminderTypeColor = () => {
    return "#F4C430"; // Changed all to yellow
  };

  // Navigate to vehicle details
  const navigateToVehicleDetails = (vehicleId: number) => {
    router.push({
      pathname: "/Pages/VehicleDetails",
      params: { vehicleId: vehicleId.toString() },
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <Header title="Service Reminders" goBack={true} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#F4C430" />
          <Text
            style={{
              marginTop: hp("2%"),
              fontSize: wp("4%"),
              fontFamily: "Arimo-Regular",
              color: "#6B7280",
            }}
          >
            Loading reminders...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Header title="Service Reminders" goBack={true} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#F4C430"]}
            tintColor="#F4C430"
          />
        }
      >
        {error ? (
          <View style={{ padding: wp("5%"), alignItems: "center" }}>
            <Text
              style={{
                fontSize: wp("4%"),
                fontFamily: "Arimo-Regular",
                color: "#6B7280",
                textAlign: "center",
              }}
            >
              {error}
            </Text>
            <TouchableOpacity
              onPress={fetchData}
              style={{
                marginTop: hp("2%"),
                paddingHorizontal: wp("6%"),
                paddingVertical: hp("1.5%"),
                backgroundColor: "#F4C430",
                borderRadius: wp("2%"),
              }}
            >
              <Text
                style={{
                  fontSize: wp("3.5%"),
                  fontFamily: "Arimo-Medium",
                  color: "#ffffff",
                }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : vehiclesWithReminders.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: wp("5%"),
              minHeight: hp("60%"),
            }}
          >
            {/* CHANGED: Bigger car icon */}
            <SvgCar width={wp("25%")} height={wp("25%")} color="#E5E7EB" />
            <Text
              style={{
                fontSize: wp("4.5%"),
                fontFamily: "Arimo-Medium",
                color: "#111827",
                marginTop: hp("2%"),
                textAlign: "center",
              }}
            >
              No Service Reminders
            </Text>
            <Text
              style={{
                fontSize: wp("3.5%"),
                fontFamily: "Arimo-Regular",
                color: "#6B7280",
                marginTop: hp("1%"),
                textAlign: "center",
                lineHeight: hp("2.5%"),
              }}
            >
              You don't have any upcoming service reminders for your vehicles.
            </Text>
          </View>
        ) : (
          <View style={{ padding: wp("4%"), paddingBottom: hp("4%") }}>
            <Text
              style={{
                fontSize: wp("3.5%"),
                fontFamily: "Arimo-Regular",
                color: "#6B7280",
                marginBottom: hp("2%"),
              }}
            >
              Showing reminders for {vehiclesWithReminders.length} vehicle
              {vehiclesWithReminders.length !== 1 ? "s" : ""}
            </Text>

            {vehiclesWithReminders.map((vehicle) => (
              <View
                key={vehicle.vehicule_ID}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: wp("3%"),
                  borderWidth: wp("0.25%"),
                  borderColor: "#E5E7EB",
                  marginBottom: hp("2%"),
                  overflow: "hidden",
                  shadowColor: "#000000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 1.5,
                  elevation: 2,
                }}
              >
                {/* Vehicle Header */}
                <TouchableOpacity
                  onPress={() => navigateToVehicleDetails(vehicle.vehicule_ID)}
                  style={{
                    backgroundColor: "#FFFDF6",
                    padding: wp("4%"),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomWidth: wp("0.25%"),
                    borderBottomColor: "#FDE68A",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: wp("14%"), // CHANGED: Bigger container
                        height: wp("14%"), // CHANGED: Bigger container
                        borderRadius: wp("7%"), // CHANGED: Bigger radius
                        backgroundColor: "#FEF3C7",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: wp("3%"),
                      }}
                    >
                      {/* CHANGED: Bigger car icon */}
                      <SvgCar
                        width={wp("8%")} // CHANGED: Bigger
                        height={wp("8%")} // CHANGED: Bigger
                        color="#F4C430"
                      />
                    </View>
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
                        {vehicle.vehicule_Model}
                      </Text>
                      <Text
                        style={{
                          fontSize: wp("3.5%"),
                          fontFamily: "Arimo-Regular",
                          color: "#6B7280",
                          marginTop: hp("0.25%"),
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {vehicle.brand_Name || "Vehicle"} •{" "}
                        {vehicle.vehicule_FactoryYear}
                        {vehicle.vehicule_PlateNb &&
                          ` • ${vehicle.vehicule_PlateNb}`}
                      </Text>
                      <Text
                        style={{
                          fontSize: wp("3%"),
                          fontFamily: "Arimo-Medium",
                          color: "#F4C430",
                          marginTop: hp("0.5%"),
                        }}
                      >
                        Current: {formatMileage(vehicle.vehicule_Milleage)}
                      </Text>
                    </View>
                  </View>
                  <SvgAngleRight
                    width={wp("5%")}
                    height={wp("5%")}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>

                {/* Reminders List */}
                <View style={{ padding: wp("4%") }}>
                  <Text
                    style={{
                      fontSize: wp("3.5%"),
                      fontFamily: "Arimo-Medium",
                      color: "#6B7280",
                      marginBottom: hp("1.5%"),
                    }}
                  >
                    {vehicle.reminders.length} Service Reminder
                    {vehicle.reminders.length !== 1 ? "s" : ""}
                  </Text>

                  {vehicle.reminders.map((reminder, index) => (
                    <View
                      key={`${vehicle.vehicule_ID}-${index}`}
                      style={{
                        backgroundColor: "#F9FAFB",
                        borderRadius: wp("2%"),
                        padding: wp("4%"),
                        marginBottom: hp("1.5%"),
                        borderLeftWidth: wp("0.75%"),
                        // CHANGED: All to yellow
                        borderLeftColor: "#F4C430",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: hp("1%"),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: wp("4%"),
                            fontFamily: "Arimo-Bold",
                            color: "#111827",
                            flex: 1,
                          }}
                        >
                          {reminder.serviceReminder_Title}
                        </Text>
                        <View
                          style={{
                            // CHANGED: All to yellow
                            backgroundColor: "#F4C430",
                            paddingHorizontal: wp("2.5%"),
                            paddingVertical: hp("0.5%"),
                            borderRadius: wp("1%"),
                          }}
                        >
                          <Text
                            style={{
                              fontSize: wp("2.5%"),
                              fontFamily: "Arimo-Bold",
                              color: "#ffffff",
                            }}
                          >
                            {getReminderTypeText(reminder.serviceReminder_Type)}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={{
                          fontSize: wp("3.5%"),
                          fontFamily: "Arimo-Regular",
                          color: "#6B7280",
                          lineHeight: hp("2.5%"),
                          marginBottom: hp("1.5%"),
                        }}
                      >
                        {reminder.serviceReminder_Description}
                      </Text>

                      <View style={{ flexDirection: "row", gap: wp("4%") }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          {/* CHANGED: Bigger calendar icon */}
                          <SvgCalendar
                            width={wp("6%")} // CHANGED: Bigger
                            height={wp("6%")} // CHANGED: Bigger
                            color="#000000ff"
                          />
                          <View style={{ marginLeft: wp("2%") }}>
                            <Text
                              style={{
                                fontSize: wp("2.5%"),
                                fontFamily: "Arimo-Medium",
                                color: "#6B7280",
                              }}
                            >
                              Due Date
                            </Text>
                            <Text
                              style={{
                                fontSize: wp("3.5%"),
                                fontFamily: "Arimo-Medium",
                                color: "#111827",
                              }}
                            >
                              {formatDate(reminder.serviceReminder_DueDate)}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          {/* CHANGED: Bigger tachometer icon */}
                          <SvgTachometerFastAlt
                            width={wp("6%")} // CHANGED: Bigger
                            height={wp("6%")} // CHANGED: Bigger
                            color="#6B7280"
                          />
                          <View style={{ marginLeft: wp("2%") }}>
                            <Text
                              style={{
                                fontSize: wp("2.5%"),
                                fontFamily: "Arimo-Medium",
                                color: "#6B7280",
                              }}
                            >
                              Due Mileage
                            </Text>
                            <Text
                              style={{
                                fontSize: wp("3.5%"),
                                fontFamily: "Arimo-Medium",
                                color: "#111827",
                              }}
                            >
                              {formatMileage(
                                reminder.serviceReminder_DueMileage
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <Text
                        style={{
                          fontSize: wp("2.5%"),
                          fontFamily: "Arimo-Regular",
                          color: "#9CA3AF",
                          marginTop: hp("1%"),
                        }}
                      >
                        Reminder sent on:{" "}
                        {formatDate(reminder.serviceReminder_SendAt)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Reminder;
