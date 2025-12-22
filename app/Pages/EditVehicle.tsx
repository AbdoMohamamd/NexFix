import { vehicleAPI } from "@/assets/utils/Api/api";
import { DropDownOption } from "@/assets/utils/Types";
import Button from "@/components/Button";
import DropDown from "@/components/DropDown";
import Header from "@/components/Header";
import CustomTextInput from "@/components/TextInput";
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

interface VehicleData {
  vehicule_ID: number;
  vehicule_PlateNb: string;
  vehicule_Model: string;
  vehicule_Milleage: number | string;
  vehicule_Notes: string;
  vehicule_ColorID: number;
}

const EditVehicle = () => {
  const { vehicleId } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [vehicleData, setVehicleData] = useState<VehicleData>({
    vehicule_ID: 0,
    vehicule_PlateNb: "",
    vehicule_Model: "",
    vehicule_Milleage: "",
    vehicule_Notes: "",
    vehicule_ColorID: 0,
  });

  const [colorOptions, setColorOptions] = useState<DropDownOption[]>([
    { id: "", name: "" },
  ]);
  const [color, setColor] = useState<DropDownOption | undefined>(undefined);

  useEffect(() => {
    fetchVehicleData();
  }, [vehicleId]);

  const fetchVehicleData = async () => {
    try {
      setLoading(true);

      // First, fetch color options (same as Register page)
      const vehicleColor = await vehicleAPI.getVehicleColors();
      setColorOptions(vehicleColor);

      // Then fetch the vehicle details
      const vehiclesResponse = await vehicleAPI.getVehiclesByCustomerId(
        user!.accID
      );

      if (
        vehiclesResponse.data.success &&
        vehiclesResponse.data.data.vehicule
      ) {
        const foundVehicle = vehiclesResponse.data.data.vehicule.find(
          (v: any) => v.vehicule_ID.toString() === vehicleId.toString()
        );

        if (foundVehicle) {
          setVehicleData({
            vehicule_ID: foundVehicle.vehicule_ID,
            vehicule_PlateNb: foundVehicle.vehicule_PlateNb || "",
            vehicule_Model: foundVehicle.vehicule_Model || "",
            vehicule_Milleage: foundVehicle.vehicule_Milleage.toString() || "",
            vehicule_Notes: foundVehicle.vehicule_Notes || "",
            vehicule_ColorID: foundVehicle.vehicule_ColorID,
          });

          // Find and set the selected color from options
          const selectedColorOption = vehicleColor.find(
            (color: DropDownOption) =>
              color.id === foundVehicle.vehicule_ColorID
          );
          setColor(selectedColorOption);
        } else {
          Alert.alert("Error", "Vehicle not found");
          router.back();
        }
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      Alert.alert("Error", "Failed to load vehicle data");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleInputChange = (field: keyof VehicleData, value: string) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle color selection (same as Register page)
  const handleColorChange = (selectedOption: DropDownOption) => {
    setColor(selectedOption);
    setVehicleData((prev) => ({
      ...prev,
      vehicule_ColorID: selectedOption.id,
    }));
  };

  const validateForm = () => {
    if (!vehicleData.vehicule_Model.trim()) {
      Alert.alert("Error", "Please enter vehicle model");
      return false;
    }

    if (!vehicleData.vehicule_Milleage.toString().trim()) {
      Alert.alert("Error", "Please enter vehicle mileage");
      return false;
    }

    if (!/^\d+$/.test(vehicleData.vehicule_Milleage.toString())) {
      Alert.alert("Error", "Please enter a valid mileage (numbers only)");
      return false;
    }

    if (!color?.id) {
      Alert.alert("Error", "Please select a color");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const updateData = {
        vehicule_ID: vehicleData.vehicule_ID,
        vehicule_PlateNb: vehicleData.vehicule_PlateNb || "",
        vehicule_Model: vehicleData.vehicule_Model,
        vehicule_Milleage:
          parseInt(vehicleData.vehicule_Milleage.toString()) || 0,
        vehicule_Notes: vehicleData.vehicule_Notes || "",
        vehicule_ColorID: color!.id, // Using the color state
      };


      // Update vehicle API call
      const response = await vehicleAPI.updateVehicle(updateData);

      if (response.data.success) {
        Alert.alert("Success", "Vehicle updated successfully", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to update vehicle"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Edit Vehicle" goBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F1C02C" />
          <Text style={styles.loadingText}>Loading vehicle data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Edit Vehicle" goBack={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Edit Vehicle Information</Text>

          {/* Plate Number */}
          <View style={styles.inputRow}>
            <CustomTextInput
              title="Plate Number"
              value={vehicleData.vehicule_PlateNb}
              onChangeText={(value) =>
                handleInputChange("vehicule_PlateNb", value)
              }
              placeholder="e.g., XYZ789"
            />
          </View>

          {/* Model */}
          <View style={styles.inputRow}>
            <CustomTextInput
              title="Model *"
              value={vehicleData.vehicule_Model}
              onChangeText={(value) =>
                handleInputChange("vehicule_Model", value)
              }
              placeholder="e.g., Honda Accord"
            />
          </View>

          {/* Mileage */}
          <View style={styles.inputRow}>
            <CustomTextInput
              title="Mileage *"
              value={vehicleData.vehicule_Milleage.toString()}
              onChangeText={(value) =>
                handleInputChange("vehicule_Milleage", value)
              }
              placeholder="e.g., 60000"
            />
          </View>

          {/* Color - Same pattern as Register page */}
          <View style={styles.inputRow}>
            <DropDown
              title="Color *"
              value={color}
              onValueChange={handleColorChange}
              placeholder="Select color"
              options={colorOptions}
            />
          </View>

          {/* Notes */}
          <View style={styles.inputRow}>
            <CustomTextInput
              title="Notes"
              value={vehicleData.vehicule_Notes}
              onChangeText={(value) =>
                handleInputChange("vehicule_Notes", value)
              }
              placeholder="Add any notes about the vehicle"
              style={styles.notesInput}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            text={submitting ? "Updating..." : "Update Vehicle"}
            onPress={handleSubmit}
            disabled={submitting}
            wrap={false}
          />

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    gap: hp("2%"),
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: wp("4%"),
    padding: wp("5%"),
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: wp("5%"),
    fontFamily: "Arimo-Bold",
    color: "#111827",
    marginBottom: hp("2.5%"),
  },
  inputRow: {
    marginBottom: hp("2%"),
    width: "100%",
  },
  notesInput: {
    minHeight: hp("12%"),
    textAlignVertical: "top",
  },
  buttonContainer: {
    gap: hp("2%"),
    marginTop: hp("1%"),
    marginBottom: hp("4%"),
  },
  updateButton: {
    backgroundColor: "#F1C02C",
  },
  cancelButton: {
    paddingVertical: hp("2%"),
    borderRadius: wp("2%"),
    borderWidth: wp("0.25%"),
    borderColor: "#E5E7EB",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  cancelButtonText: {
    fontSize: wp("4%"),
    fontFamily: "Arimo-Medium",
    color: "#6B7280",
  },
});

export default EditVehicle;
