import { useAuth } from "@/app/Context/AuthProvider"; // Import useAuth
import SvgClock from "@/assets/Icons/Clock";
import SvgLocation from "@/assets/Icons/Location";
import SvgStarIcon from "@/assets/Icons/StarIcon";
import { vehicleAPI } from "@/assets/utils/Api/api"; // Import vehicleAPI
import Header from "@/components/Header";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react"; // Add useState and useEffect
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// Define Vehicle interface
interface Vehicle {
  vehicule_ID: number;
  vehicule_PlateNb: string;
  vehicule_BrandID: number;
  vehicule_ColorID: number;
  vehicule_FactoryYear: number;
  vehicule_Model: string;
  vehicule_CustomerID: number;
  vehicule_Notes: string;
  vehicule_Milleage: number;
  vehicule_FuelTypeID: number;
}

// Define Brand interface
interface Brand {
  brand_ID: number;
  brand_Name: string;
}

const ServiceDetails = () => {
  const params = useLocalSearchParams();
  const { user } = useAuth(); // Get user for fetching vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [brandsLoading, setBrandsLoading] = useState<Record<number, boolean>>(
    {}
  ); // Track loading per brand
  const [brands, setBrands] = useState<Record<number, Brand>>({}); // Map of brand ID to brand object
  const [vehicleMap, setVehicleMap] = useState<Record<number, Vehicle>>({}); // Map of vehicle ID to vehicle
  // Parse the data passed from the previous screen
  const workshop = params.workshop
    ? JSON.parse(params.workshop as string)
    : null;
  const appointments = params.appointments
    ? JSON.parse(params.appointments as string)
    : [];

  // Fetch user's vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user?.accID) return;

      try {
        setLoading(true);
        const response = await vehicleAPI.getVehiclesByCustomerId(user.accID);
        const data = response.data;

        if (data.success && data.data && Array.isArray(data.data.vehicule)) {
          const vehiclesData = data.data.vehicule;
          setVehicles(vehiclesData);

          // Create a map of vehicle ID to vehicle for quick lookup
          const map: Record<number, Vehicle> = {};
          vehiclesData.forEach((vehicle: Vehicle) => {
            map[vehicle.vehicule_ID] = vehicle;
          });
          setVehicleMap(map);

          // Fetch brands for all unique brand IDs
          const uniqueBrandIds = [
            ...new Set(vehiclesData.map((v: Vehicle) => v.vehicule_BrandID)),
          ];
        }
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]);

  // Fetch brand by ID
  const fetchBrand = async (brandId: number) => {
    if (!brandId || brands[brandId]) return;

    try {
      setBrandsLoading((prev) => ({ ...prev, [brandId]: true }));
      const response = await vehicleAPI.getVehicleBrandById(brandId);
      const data = response.data;
      if (data.success && data.data) {
        const brandData = data.data.brand || data.data;
        if (brandData) {
          setBrands((prev) => ({
            ...prev,
            [brandId]: {
              brand_ID: brandData.brand_ID || brandId,
              brand_Name: brandData.brand_Name || `Brand #${brandId}`,
            },
          }));
        }
      }
    } catch (err) {
      console.error(`Error fetching brand ${brandId}:`, err);
      // Set a fallback brand object if fetch fails
      setBrands((prev) => ({
        ...prev,
        [brandId]: {
          brand_ID: brandId,
          brand_Name: `Brand #${brandId}`,
        },
      }));
    } finally {
      setBrandsLoading((prev) => ({ ...prev, [brandId]: false }));
    }
  };

  // Fetch brands for appointments when they're loaded
  useEffect(() => {
    if (appointments.length > 0) {
      appointments.forEach((appointment: any) => {
        const vehicleId = appointment.appointment_VehiculeID;
        const vehicle = vehicleMap[vehicleId];
        if (
          vehicle &&
          vehicle.vehicule_BrandID &&
          !brands[vehicle.vehicule_BrandID]
        ) {
          fetchBrand(vehicle.vehicule_BrandID);
        }
      });
    }
  }, [appointments, vehicleMap]);

  if (!workshop) {
    return (
      <View style={{ flex: 1 }}>
        <Header title="Workshop Details" goBack={true} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontFamily: "Arimo-Regular", fontSize: wp("4%") }}>
            No workshop data found
          </Text>
        </View>
      </View>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get status text
  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Confirmed";
      case 3:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  // Get status color
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: // Pending
        return { bg: "#F3F4F6", text: "#374151" };
      case 1: // Confirmed
        return { bg: "#DBEAFE", text: "#1E40AF" };
      case 2: // In Progress
        return { bg: "#FEF3C7", text: "#92400E" };
      case 3: // Completed
        return { bg: "#DCFCE7", text: "#166534" };
      case 4: // Cancelled
        return { bg: "#FEE2E2", text: "#991B1B" };
      default:
        return { bg: "#F3F4F6", text: "#374151" };
    }
  };

  // Get vehicle model from ID
  const getVehicleModel = (vehicleId: number): string => {
    const vehicle = vehicleMap[vehicleId];
    return vehicle ? vehicle.vehicule_Model : `Vehicle #${vehicleId}`;
  };

  // Get vehicle details string (with brand, model, and plate if available)
  const getVehicleDetails = (vehicleId: number): string => {
    const vehicle = vehicleMap[vehicleId];
    if (!vehicle) return `Vehicle #${vehicleId}`;

    // Get brand name
    const brand = vehicle.vehicule_BrandID
      ? brands[vehicle.vehicule_BrandID]
      : null;
    const brandName = brand?.brand_Name || `Brand #${vehicle.vehicule_BrandID}`;

    let details = `${brandName} • ${vehicle.vehicule_Model}`;

    if (vehicle.vehicule_PlateNb) {
      details += ` • ${vehicle.vehicule_PlateNb}`;
    }

    return details;
  };

  // Check if brand is loading for a specific vehicle
  const isBrandLoading = (vehicleId: number): boolean => {
    const vehicle = vehicleMap[vehicleId];
    if (!vehicle || !vehicle.vehicule_BrandID) return false;
    return brandsLoading[vehicle.vehicule_BrandID] || false;
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Workshop Details" goBack={true} />

      {/* Header with workshop info */}
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingHorizontal: wp("4%"),
          paddingVertical: hp("2%"),
          borderBottomWidth: wp("0.25%"),
          borderBottomColor: "#E5E7EB",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: wp("3%"),
          }}
        >
          <View
            style={{
              padding: wp("3%"),
              backgroundColor: "#F3F4F6",
              borderRadius: wp("2.5%"),
            }}
          >
            <Image
              source={
                workshop.workshop_Image
                  ? { uri: workshop.workshop_Image }
                  : require("@/assets/images/key.png")
              }
              style={{
                width: wp("12%"),
                height: wp("12%"),
                borderRadius: wp("1%"),
              }}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Arimo-Medium",
                fontSize: wp("4.5%"),
                marginBottom: hp("0.5%"),
              }}
            >
              {workshop.workshop_Name ||
                `Workshop ${workshop.workshop_MechanicID}`}
            </Text>

            {workshop.workshop_Rating && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: hp("0.25%"),
                }}
              >
                <SvgStarIcon
                  width={wp("4%")}
                  height={wp("4%")}
                  color="#F59E0B"
                />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"),
                    color: "#111827",
                    marginLeft: wp("1%"),
                  }}
                >
                  {workshop.workshop_Rating}
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SvgLocation
                width={wp("3.5%")}
                height={wp("3.5%")}
                color="#6A7282"
              />
              <Text
                style={{
                  fontFamily: "Arimo-Medium",
                  fontSize: wp("3.5%"),
                  color: "#6A7282",
                  marginLeft: wp("1%"),
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {workshop.workshop_Address || "Location not specified"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Services Section */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"),
          paddingVertical: hp("2%"),
          gap: hp("1.5%"),
          paddingBottom: hp("10%"),
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: wp("4.5%"),
            fontFamily: "Arimo-Bold",
            marginBottom: hp("1%"),
          }}
        >
          Your Appointments ({appointments.length})
        </Text>

        {loading ? (
          <View
            style={{
              padding: wp("6%"),
              backgroundColor: "#ffffff",
              borderRadius: wp("2.5%"),
              borderWidth: wp("0.25%"),
              borderColor: "#E5E7EB",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="small" color="#EFBF2B" />
            <Text
              style={{
                fontFamily: "Arimo-Regular",
                fontSize: wp("3.5%"),
                color: "#6A7282",
                textAlign: "center",
                marginTop: hp("1%"),
              }}
            >
              Loading vehicle details...
            </Text>
          </View>
        ) : appointments.length === 0 ? (
          <View
            style={{
              padding: wp("6%"),
              backgroundColor: "#ffffff",
              borderRadius: wp("2.5%"),
              borderWidth: wp("0.25%"),
              borderColor: "#E5E7EB",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Arimo-Regular",
                fontSize: wp("3.5%"),
                color: "#6A7282",
                textAlign: "center",
              }}
            >
              No appointments found for this workshop.
            </Text>
          </View>
        ) : (
          appointments.map((appointment: any) => {
            const statusColor = getStatusColor(appointment.appointment_Status);
            const vehicleDetails = getVehicleDetails(
              appointment.appointment_VehiculeID
            );
            const isVehicleBrandLoading = isBrandLoading(
              appointment.appointment_VehiculeID
            );

            return (
              <Pressable
                key={appointment.appointment_ID}
                style={{
                  padding: wp("4%"),
                  backgroundColor: "#ffffff",
                  borderRadius: wp("2.5%"),
                  borderWidth: wp("0.25%"),
                  borderColor: "#E5E7EB",
                }}
                onPress={() => {}}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: hp("1%"),
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: wp("4%"),
                        marginBottom: hp("0.5%"),
                      }}
                    >
                      {appointment.appointment_Title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Arimo-Regular",
                        fontSize: wp("3.5%"),
                        color: "#6A7282",
                      }}
                      numberOfLines={2}
                    >
                      {appointment.appointment_Description}
                    </Text>
                  </View>

                  {/* Status Badge */}
                  <View
                    style={{
                      backgroundColor: statusColor.bg,
                      paddingHorizontal: wp("2%"),
                      paddingVertical: hp("0.5%"),
                      borderRadius: wp("1%"),
                      marginLeft: wp("3%"),
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: wp("2.5%"),
                        color: statusColor.text,
                      }}
                    >
                      {getStatusText(appointment.appointment_Status)}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: hp("1%"),
                  }}
                >
                  <SvgClock
                    width={wp("3.5%")}
                    height={wp("3.5%")}
                    color="#6A7282"
                  />
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("3.5%"),
                      color: "#6A7282",
                      marginLeft: wp("1.5%"),
                    }}
                  >
                    {formatDate(appointment.appointment_Date)} •{" "}
                    {formatTime(appointment.appointment_Time)}
                  </Text>
                </View>

                {/* Vehicle Details */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: hp("1%"),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("3%"),
                      color: "#6A7282",
                      marginRight: wp("1%"),
                    }}
                  >
                    Vehicle:
                  </Text>
                  {isVehicleBrandLoading ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <ActivityIndicator
                        size="small"
                        color="#EFBF2B"
                        style={{ marginRight: wp("1%") }}
                      />
                      <Text
                        style={{
                          fontFamily: "Arimo-Regular",
                          fontSize: wp("3.5%"),
                          color: "#9CA3AF",
                        }}
                      >
                        Loading details...
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: wp("3.5%"),
                        color: "#111827",
                      }}
                    >
                      {vehicleDetails}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })
        )}

        {/* Workshop Info Section (if available) */}
        {(workshop.workshop_Phone ||
          workshop.workshop_Email ||
          workshop.workshop_Description) && (
          <View
            style={{
              marginTop: hp("3%"),
              padding: wp("4%"),
              backgroundColor: "#ffffff",
              borderRadius: wp("2.5%"),
              borderWidth: wp("0.25%"),
              borderColor: "#E5E7EB",
            }}
          >
            <Text
              style={{
                fontSize: wp("4%"),
                fontFamily: "Arimo-Bold",
                marginBottom: hp("1.5%"),
              }}
            >
              Workshop Information
            </Text>

            {workshop.workshop_Phone && (
              <View style={{ marginBottom: hp("1%") }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"),
                    color: "#6A7282",
                  }}
                >
                  Phone
                </Text>
                <Text
                  style={{ fontFamily: "Arimo-Regular", fontSize: wp("3.5%") }}
                >
                  {workshop.workshop_Phone}
                </Text>
              </View>
            )}

            {workshop.workshop_Email && (
              <View style={{ marginBottom: hp("1%") }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"),
                    color: "#6A7282",
                  }}
                >
                  Email
                </Text>
                <Text
                  style={{ fontFamily: "Arimo-Regular", fontSize: wp("3.5%") }}
                >
                  {workshop.workshop_Email}
                </Text>
              </View>
            )}

            {workshop.workshop_Description && (
              <View>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"),
                    color: "#6A7282",
                  }}
                >
                  Description
                </Text>
                <Text
                  style={{
                    fontFamily: "Arimo-Regular",
                    fontSize: wp("3.5%"),
                    lineHeight: hp("2.5%"),
                  }}
                >
                  {workshop.workshop_Description}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ServiceDetails;
