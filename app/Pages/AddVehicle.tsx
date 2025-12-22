import { vehicleAPI } from "@/assets/utils/Api/api";
import Button from "@/components/Button";
import DropDown from "@/components/DropDown";
import Header from "@/components/Header";
import CustomTextInput from "@/components/TextInput";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../Context/AuthProvider";

const AddVehicle = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [brandOptions, setBrandOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState([]);

  const [vehicleData, setVehicleData] = useState({
    brand: undefined as any,
    model: "",
    year: "",
    mileage: "",
    color: undefined as any,
    fuelType: undefined as any,
    plateNumber: "",
  });

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      setIsLoading(true);
      const [brands, colors, fuelTypes] = await Promise.all([
        vehicleAPI.getVehicleBrands(),
        vehicleAPI.getVehicleColors(),
        vehicleAPI.getVehicleFuelTypes(),
      ]);

      setBrandOptions(brands);
      setColorOptions(colors);
      setFuelTypeOptions(fuelTypes);
    } catch (error) {
      Alert.alert("Error", "Failed to load vehicle data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!vehicleData.brand?.id) {
      Alert.alert("Error", "Please select a vehicle brand");
      return false;
    }
    if (!vehicleData.model.trim()) {
      Alert.alert("Error", "Please enter vehicle model");
      return false;
    }
    if (!vehicleData.year.trim()) {
      Alert.alert("Error", "Please enter vehicle year");
      return false;
    }
    if (!/^\d{4}$/.test(vehicleData.year)) {
      Alert.alert("Error", "Please enter a valid year (e.g., 2020)");
      return false;
    }
    if (!vehicleData.mileage.trim()) {
      Alert.alert("Error", "Please enter vehicle mileage");
      return false;
    }
    if (!/^\d+$/.test(vehicleData.mileage)) {
      Alert.alert("Error", "Please enter a valid mileage (numbers only)");
      return false;
    }
    if (!vehicleData.color?.id) {
      Alert.alert("Error", "Please select a vehicle color");
      return false;
    }
    if (!vehicleData.fuelType?.id) {
      Alert.alert("Error", "Please select a fuel type");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      await vehicleAPI.addVehicle({
        vehicule_CustomerID: user!.accID,
        vehicule_PlateNb: vehicleData.plateNumber || "",
        vehicule_BrandID: vehicleData.brand?.id,
        vehicule_ColorID: vehicleData.color?.id,
        vehicule_FactoryYear:
          parseInt(vehicleData.year) || new Date().getFullYear(),
        vehicule_Model: vehicleData.model,
        vehicule_Notes: "",
        vehicule_Milleage: parseInt(vehicleData.mileage) || 0,
        vehicule_FuelTypeID: vehicleData.fuelType?.id,
      });

      Alert.alert("Success", "Vehicle added successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Add vehicle error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add vehicle"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Add Vehicle" goBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F1C02C" />
          <Text style={styles.loadingText}>Loading vehicle data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Add Vehicle" goBack={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Vehicle Information</Text>

          {/* Brand */}
          <View style={styles.inputRow}>
            <DropDown
              title="Brand *"
              value={vehicleData.brand}
              onValueChange={(selectedOption) =>
                handleInputChange("brand", selectedOption)
              }
              placeholder="Select brand"
              options={brandOptions}
            />
          </View>

          {/* Model */}
          <View style={styles.inputRow}>
            <CustomTextInput
              title="Model *"
              value={vehicleData.model}
              onChangeText={(value) => handleInputChange("model", value)}
              placeholder="e.g., Camry"
            />
          </View>

          {/* Year */}
          <View style={styles.inputRow}>
            <CustomTextInput
              title="Year *"
              value={vehicleData.year}
              onChangeText={(value) => handleInputChange("year", value)}
              placeholder="e.g., 2020"
            />
          </View>

          {/* Mileage */}
          <View style={styles.inputRow}>
            <CustomTextInput
              title="Mileage *"
              value={vehicleData.mileage}
              onChangeText={(value) => handleInputChange("mileage", value)}
              placeholder="e.g., 50000"
            />
          </View>

          {/* Color */}
          <View style={styles.inputRow}>
            <DropDown
              title="Color *"
              value={vehicleData.color}
              onValueChange={(selectedOption) =>
                handleInputChange("color", selectedOption)
              }
              placeholder="Select color"
              options={colorOptions}
            />
          </View>

          {/* Fuel Type */}
          <View style={styles.inputRow}>
            <DropDown
              title="Fuel Type *"
              value={vehicleData.fuelType}
              onValueChange={(selectedOption) =>
                handleInputChange("fuelType", selectedOption)
              }
              placeholder="Select fuel type"
              options={fuelTypeOptions}
            />
          </View>

          {/* Plate Number (Optional) */}
          <View style={styles.inputRow}>
            <CustomTextInput
              title="Plate Number"
              value={vehicleData.plateNumber}
              onChangeText={(value) => handleInputChange("plateNumber", value)}
              placeholder="(Optional) e.g., ABC-123"
            />
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            text={isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
            onPress={handleSubmit}
            disabled={isSubmitting}
            wrap={false}
          />
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
  buttonContainer: {
    marginTop: hp("1%"),
    marginBottom: hp("4%"),
  },
});

export default AddVehicle;
