import SvgCalendar from "@/assets/Icons/Calendar";
import SvgCar from "@/assets/Icons/Car";
import SvgFire from "@/assets/Icons/Fire";
import SvgPalette from "@/assets/Icons/Palette";
import SvgTachometerFastAlt from "@/assets/Icons/TachometerFastAlt";
import SvgTagAlt from "@/assets/Icons/TagAlt";
import SvgTrash from "@/assets/Icons/Trash";
import { vehicleAPI } from "@/assets/utils/Api/api";
import Header from "@/components/Header";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useAuth } from "../Context/AuthProvider";

interface VehicleDetails {
  vehicule_ID: number;
  vehicule_Model: string;
  vehicule_Milleage: number;
  vehicule_FactoryYear: number;
  vehicule_PlateNb?: string;
  vehicule_Notes?: string;
  vehicule_BrandID: number;
  vehicule_ColorID: number;
  vehicule_FuelTypeID: number;
}

const VehicleDetails = () => {
  const { vehicleId } = useLocalSearchParams();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [brandName, setBrandName] = useState<string>("");
  const [colorName, setColorName] = useState<string>("");
  const [fuelTypeName, setFuelTypeName] = useState<string>("");
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetails();
    }
  }, [vehicleId]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      // Option 2: Fallback to customer list if single fetch doesn't work
      const response = await vehicleAPI.getVehiclesByCustomerId(user!.accID);

      if (response.data.success && response.data.data.vehicule) {
        const foundVehicle = response.data.data.vehicule.find(
          (v: any) => v.vehicule_ID.toString() === vehicleId.toString()
        );

        if (foundVehicle) {
          setVehicle(foundVehicle);
          await fetchAdditionalDetails(foundVehicle);
        } else {
          Alert.alert("Error", "Vehicle not found");
          router.back();
        }
      }
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      Alert.alert("Error", "Failed to load vehicle details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalDetails = async (vehicleData: VehicleDetails) => {
    try {
      setDetailsLoading(true);

      // Fetch all details in parallel
      const [brandResponse, colorResponse, fuelTypeResponse] =
        await Promise.allSettled([
          vehicleAPI.getVehicleBrandById(vehicleData.vehicule_BrandID),
          vehicleAPI.getVehicleColorById(vehicleData.vehicule_ColorID),
          vehicleAPI.getVehicleFuelTypeById(vehicleData.vehicule_FuelTypeID),
        ]);

      // Handle brand response
      if (brandResponse.status === "fulfilled") {
        const brandData = brandResponse.value.data;
        setBrandName(brandData.data.brand_Name);
      }

      // Handle color response
      if (colorResponse.status === "fulfilled") {
        const colorData = colorResponse.value.data;
        setColorName(colorData.data.color_Name);
      }

      // Handle fuel type response
      if (fuelTypeResponse.status === "fulfilled") {
        const fuelTypeData = fuelTypeResponse.value.data;
        setFuelTypeName(fuelTypeData.data.fuelType_Name);
      }
    } catch (error) {
      console.error("Error fetching additional details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Vehicle",
      "Are you sure you want to delete this vehicle? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      // Check if deleteVehicle API function exists
      if (vehicleAPI.deleteVehicle) {
        await vehicleAPI.deleteVehicle(vehicle!.vehicule_ID);
      } else {
        // If not, you might need to implement it
        throw new Error("Delete API not implemented");
      }

      Alert.alert("Success", "Vehicle deleted successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Delete error:", error);
      Alert.alert("Error", error.message || "Failed to delete vehicle");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: "/Pages/EditVehicle",
      params: {
        vehicleId,
      },
    });
  };

  const formatMileage = (mileage: number) => {
    return mileage.toLocaleString() + " miles";
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Vehicle Details" goBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F1C02C" />
          <Text style={styles.loadingText}>Loading vehicle details...</Text>
        </View>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.container}>
        <Header title="Vehicle Details" goBack={true} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Vehicle not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Vehicle Details" goBack={true} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Vehicle Image/Icon Header */}
        <View style={styles.imageSection}>
          <View style={styles.vehicleIconContainer}>
            <SvgCar width={wp("20%")} height={wp("20%")} color="#000000ff" />
          </View>
          <Text style={styles.vehicleModel}>{vehicle.vehicule_Model}</Text>
          <Text style={styles.vehicleBrand}>{brandName}</Text>
        </View>

        {/* Vehicle Information Cards */}
        <View style={styles.infoSection}>
          {/* Basic Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Vehicle Information</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <SvgCalendar
                  width={wp("8%")}
                  height={wp("8%")}
                  color="#000000ff"
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Year</Text>
                <Text style={styles.infoValue}>
                  {vehicle.vehicule_FactoryYear}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <SvgTachometerFastAlt
                  width={wp("8%")}
                  height={wp("8%")}
                  color="#6B7280"
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Mileage</Text>
                <Text style={styles.infoValue}>
                  {formatMileage(vehicle.vehicule_Milleage)}
                </Text>
              </View>
            </View>

            {detailsLoading ? (
              <View style={styles.infoRow}>
                <View style={styles.infoContent}>
                  <ActivityIndicator size="small" color="#F1C02C" />
                  <Text style={[styles.infoLabel, { marginTop: hp("0.5%") }]}>
                    Loading details...
                  </Text>
                </View>
              </View>
            ) : (
              <>
                {colorName && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <SvgPalette
                        width={wp("8%")}
                        height={wp("8%")}
                        color="#6B7280"
                      />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Color</Text>
                      <Text style={styles.infoValue}>{colorName}</Text>
                    </View>
                  </View>
                )}

                {fuelTypeName && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <SvgFire
                        width={wp("8%")}
                        height={wp("8%")}
                        color="#6B7280"
                      />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Fuel Type</Text>
                      <Text style={styles.infoValue}>{fuelTypeName}</Text>
                    </View>
                  </View>
                )}

                {vehicle.vehicule_PlateNb && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <SvgTagAlt
                        width={wp("8%")}
                        height={wp("8%")}
                        color="#6B7280"
                      />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Plate Number</Text>
                      <Text style={styles.infoValue}>
                        {vehicle.vehicule_PlateNb}
                      </Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Notes Card (if available) */}
          {vehicle.vehicule_Notes && (
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Notes</Text>
              <View style={styles.notesContainer}>
                <Text style={styles.notesText}>{vehicle.vehicule_Notes}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
          disabled={deleting || detailsLoading}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
          disabled={deleting || detailsLoading}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <SvgTrash width={wp("5%")} height={wp("5%")} color="#ffffff" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
  },
  loadingText: {
    marginTop: hp("2%"),
    fontSize: wp("4%"),
    fontFamily: "Arimo-Regular",
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
  },
  errorText: {
    fontSize: wp("4.5%"),
    fontFamily: "Arimo-Regular",
    color: "#6B7280",
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: hp("4%"),
    backgroundColor: "#FFFDF6",
    borderBottomWidth: wp("0.25%"),
    borderBottomColor: "#FDE68A",
  },
  vehicleIconContainer: {
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: wp("15%"),
    backgroundColor: "#E9B924",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  vehicleModel: {
    fontSize: wp("6%"),
    fontFamily: "Arimo-Bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: hp("0.5%"),
  },
  vehicleBrand: {
    fontSize: wp("4%"),
    fontFamily: "Arimo-Regular",
    color: "#6B7280",
    textAlign: "center",
  },
  infoSection: {
    padding: wp("5%"),
    gap: hp("2%"),
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: wp("3%"),
    padding: wp("5%"),
    borderWidth: wp("0.25%"),
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: wp("4.5%"),
    fontFamily: "Arimo-Bold",
    color: "#111827",
    marginBottom: hp("2.5%"),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1%"),
    marginBottom: hp("2%"),
  },
  infoIconContainer: {
    width: wp("10%"),
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: wp("3.5%"),
    fontFamily: "Arimo-Regular",
    color: "#6B7280",
  },
  infoValue: {
    fontSize: wp("4%"),
    fontFamily: "Arimo-Medium",
    color: "#111827",
  },
  notesContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: wp("2%"),
    padding: wp("4%"),
  },
  notesText: {
    fontSize: wp("4%"),
    fontFamily: "Arimo-Regular",
    color: "#4B5563",
    lineHeight: hp("2.5%"),
  },
  serviceHistoryButton: {
    backgroundColor: "#FFFDF6",
    borderWidth: wp("0.25%"),
    borderColor: "#FDE68A",
    borderRadius: wp("2%"),
    padding: wp("4%"),
    alignItems: "center",
  },
  serviceHistoryText: {
    fontSize: wp("4%"),
    fontFamily: "Arimo-Medium",
    color: "#F1C02C",
    marginBottom: hp("0.5%"),
  },
  serviceHistorySubText: {
    fontSize: wp("3.5%"),
    fontFamily: "Arimo-Regular",
    color: "#6B7280",
  },
  actionButtons: {
    flexDirection: "row",
    padding: wp("5%"),
    paddingTop: wp("2%"),
    borderTopWidth: wp("0.25%"),
    borderTopColor: "#E5E7EB",
    backgroundColor: "#ffffff",
    gap: wp("3%"),
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp("2%"),
    paddingVertical: hp("2%"),
    gap: wp("2%"),
  },
  editButton: {
    backgroundColor: "#F1C02C",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  editButtonText: {
    fontSize: wp("4%"),
    fontFamily: "Arimo-Medium",
    color: "#ffffff",
  },
  deleteButtonText: {
    fontSize: wp("4%"),
    fontFamily: "Arimo-Medium",
    color: "#ffffff",
  },
});

export default VehicleDetails;
