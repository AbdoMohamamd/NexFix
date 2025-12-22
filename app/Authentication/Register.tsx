import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import SvgCar from "@/assets/Icons/Car";
import SvgEye from "@/assets/Icons/Eye";
import SvgEyeSlash from "@/assets/Icons/EyeSlash";
import SvgPlus from "@/assets/Icons/Plus";
import SvgTrash from "@/assets/Icons/Trash";
import { vehicleAPI } from "@/assets/utils/Api/api";
import { DropDownOption } from "@/assets/utils/Types";
import Button from "@/components/Button";
import DropDown from "@/components/DropDown";
import Header from "@/components/Header";
import InfoBlock from "@/components/InfoBlock";
import CustomTextInput from "@/components/TextInput";
import { router } from "expo-router";
import { useAuth } from "../Context/AuthProvider";

const Register = () => {
  const { register, isLoading } = useAuth();
  // Personal Information States
  const [accUserName, setAccUserName] = useState("");
  const [accountPhoneNumber, setAccountPhoneNumber] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accPassword, setAccountPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Vehicle States
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      brand: undefined,
      model: "",
      year: "",
      mileage: "",
      color: undefined,
      fuelType: undefined,
      plateNumber: "",
    },
  ]);
  const [brandOptions, setBrandOptions] = useState<DropDownOption[]>([
    { id: "", name: "" },
  ]);
  const [colorOptions, setColorOptions] = useState<DropDownOption[]>([
    { id: "", name: "" },
  ]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState<DropDownOption[]>([
    { id: "", name: "" },
  ]);
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add a new vehicle
  const addVehicle = () => {
    const newVehicle = {
      id: vehicles.length + 1,
      brand: undefined,
      model: "",
      year: "",
      mileage: "",
      color: undefined,
      fuelType: undefined,
      plateNumber: "",
    };
    setVehicles([...vehicles, newVehicle]);
  };

  // Remove a vehicle
  const removeVehicle = (id: number) => {
    if (vehicles.length > 1) {
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    }
  };

  // Update vehicle field
  const updateVehicle = (
    id: number,
    field: string,
    value: DropDownOption | String
  ) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
      )
    );
  };

  // Validate form
  const validateForm = () => {
    // Check required fields
    if (!accUserName.trim()) {
      Alert.alert("Error", "Please enter a username");
      return false;
    }

    if (!accountEmail.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(accountEmail)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (!accountPhoneNumber.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }

    if (!accPassword.trim()) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }

    if (accPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    if (accPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  // Handle form submission
  const validateVehicleFields = (vehicle: any) => {
    if (!vehicle.brand?.id) return "Please select a brand";
    if (!vehicle.model.trim()) return "Please enter a model";
    if (!vehicle.year.trim() || !/^\d{4}$/.test(vehicle.year))
      return "Please enter a valid year (e.g., 2020)";
    if (!vehicle.mileage.trim() || !/^\d+$/.test(vehicle.mileage))
      return "Please enter valid mileage";
    if (!vehicle.color?.id) return "Please select a color";
    if (!vehicle.fuelType?.id) return "Please select a fuel type";
    return null;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Prepare vehicle data
      const vehicleData = vehicles.map((vehicle) => ({
        brandId: vehicle.brand?.id,
        model: vehicle.model,
        year: vehicle.year,
        mileage: vehicle.mileage,
        colorId: vehicle.color?.id,
        fuelTypeId: vehicle.fuelType?.id,
        plateNumber: vehicle.plateNumber || "",
      }));
      // Validate vehicle data
      for (const vehicle of vehicleData) {
        if (!vehicle.brandId) {
          Alert.alert("Error", "Please select a brand for all vehicles");
          return;
        }
        if (!vehicle.model?.trim()) {
          Alert.alert("Error", "Please enter model for all vehicles");
          return;
        }
        if (!vehicle.year || !/^\d{4}$/.test(vehicle.year)) {
          Alert.alert(
            "Error",
            "Please enter a valid year (e.g., 2020) for all vehicles"
          );
          return;
        }
        if (!vehicle.mileage || !/^\d+$/.test(vehicle.mileage)) {
          Alert.alert("Error", "Please enter valid mileage for all vehicles");
          return;
        }
        if (!vehicle.colorId) {
          Alert.alert("Error", "Please select a color for all vehicles");
          return;
        }
        if (!vehicle.fuelTypeId) {
          Alert.alert("Error", "Please select a fuel type for all vehicles");
          return;
        }
      }

      // Call register with vehicle data
      await register({
        accUserName,
        accountEmail,
        accountPhoneNumber,
        accPassword,
        Role: 3,
        vehicles: vehicleData,
      });
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.message || "Something went wrong. Please try again."
      );
    }
  };
  useEffect(() => {
    getVehicleData();
  }, []);
  const getVehicleData = async () => {
    const vehicleBrand = await vehicleAPI.getVehicleBrands();
    setBrandOptions(vehicleBrand);
    const vehicleColor = await vehicleAPI.getVehicleColors();
    setColorOptions(vehicleColor);
    const vehicleFuelType = await vehicleAPI.getVehicleFuelTypes();
    setFuelTypeOptions(vehicleFuelType);
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        <Header title="Create Account" goBack={true} />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Personal Information Card */}
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
              Personal Information
            </Text>

            <CustomTextInput
              title="Username"
              value={accUserName}
              onChangeText={setAccUserName}
              placeholder="Enter your username"
            />

            <CustomTextInput
              title="Phone Number"
              value={accountPhoneNumber}
              onChangeText={setAccountPhoneNumber}
              placeholder="Enter your phone number"
            />

            <CustomTextInput
              title="Email"
              value={accountEmail}
              onChangeText={setAccountEmail}
              placeholder="Enter your email"
            />

            <CustomTextInput
              title="Password"
              value={accPassword}
              onChangeText={setAccountPassword}
              placeholder="Enter your password (min. 6 characters)"
              secureTextEntry={!showPassword}
              IconComponent2={showPassword ? SvgEyeSlash : SvgEye}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <CustomTextInput
              title="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              IconComponent2={showConfirmPassword ? SvgEyeSlash : SvgEye}
              onRightIconPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          </View>

          {/* Vehicles Card */}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "Arimo-Bold", fontSize: 16 }}>
                My Vehicles ({vehicles.length})
              </Text>
              <Pressable
                onPress={addVehicle}
                style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
              >
                <SvgPlus width={16} height={16} color={"#F4C430"} />
                <Text style={{ color: "#F4C430", fontFamily: "Arimo-Medium" }}>
                  Add Vehicle
                </Text>
              </Pressable>
            </View>

            {vehicles.map((vehicle, index) => (
              <View
                key={vehicle.id}
                style={{
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: vehicles.length > 1 ? 12 : 0,
                }}
              >
                {/* Vehicle Header */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <InfoBlock Icon={SvgCar} />
                    <Text style={{ fontFamily: "Arimo-Medium" }}>
                      Vehicle {index + 1}
                    </Text>
                  </View>

                  {/* Show delete button only if more than one vehicle */}
                  {vehicles.length > 1 && (
                    <Pressable onPress={() => removeVehicle(vehicle.id)}>
                      <SvgTrash width={16} height={16} color="#EF4444" />
                    </Pressable>
                  )}
                </View>

                {/* Vehicle Form */}
                <View
                  style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
                >
                  <DropDown
                    title="Brand"
                    value={vehicle.brand}
                    onValueChange={(selectedOption) =>
                      updateVehicle(vehicle.id, "brand", selectedOption)
                    }
                    placeholder="e.g., Toyota"
                    options={brandOptions} // You need to provide an array of brand options
                    style={{ flex: 1 }}
                  />
                  <CustomTextInput
                    title="Model"
                    value={vehicle.model} // Fixed
                    onChangeText={(value) =>
                      updateVehicle(vehicle.id, "model", value)
                    }
                    style={{ flex: 1 }}
                    placeholder="e.g., Camry"
                  />
                </View>

                <View
                  style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
                >
                  <CustomTextInput
                    title="Year"
                    value={vehicle.year}
                    onChangeText={(value) =>
                      updateVehicle(vehicle.id, "year", value)
                    }
                    style={{ flex: 1 }}
                    placeholder="e.g., 2020"
                  />
                  <CustomTextInput
                    title="Mileage"
                    value={vehicle.mileage}
                    onChangeText={(value) =>
                      updateVehicle(vehicle.id, "mileage", value)
                    }
                    style={{ flex: 1 }}
                    placeholder="e.g., 50000"
                  />
                </View>
                <View
                  style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
                >
                  <DropDown
                    title="Color"
                    value={vehicle.color}
                    onValueChange={(selectedOption) =>
                      updateVehicle(vehicle.id, "color", selectedOption)
                    }
                    placeholder="e.g., Red"
                    options={colorOptions} // You need to provide an array of brand options
                    style={{ flex: 1 }}
                  />

                  <DropDown
                    title="Fuel Type"
                    value={vehicle.fuelType}
                    onValueChange={(selectedOption) =>
                      updateVehicle(vehicle.id, "fuelType", selectedOption)
                    }
                    placeholder="e.g., Diezel"
                    options={fuelTypeOptions} // You need to provide an array of brand options
                    style={{ flex: 1 }}
                  />
                </View>
                <View
                  style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
                >
                  <CustomTextInput
                    title="Plate Number"
                    value={vehicle.plateNumber} // Fixed
                    onChangeText={
                      (value) => updateVehicle(vehicle.id, "plateNumber", value) // Fixed
                    }
                    style={{ flex: 1 }}
                    placeholder="(Optional)"
                  />
                </View>
              </View>
            ))}

            {/* Empty State */}
            {vehicles.length === 0 && (
              <View style={{ alignItems: "center", padding: 20 }}>
                <SvgCar width={48} height={48} color="#E5E7EB" />
                <Text
                  style={{
                    color: "#6A7282",
                    marginTop: 8,
                    fontFamily: "Arimo-Regular",
                  }}
                >
                  No vehicles added yet
                </Text>
                <Pressable onPress={addVehicle} style={{ marginTop: 12 }}>
                  <Text
                    style={{ color: "#F4C430", fontFamily: "Arimo-Medium" }}
                  >
                    Add your first vehicle
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <Button
            text={isLoading ? "Creating Account..." : "Create Account"}
            wrap={false}
            onPress={handleSubmit}
            disabled={isLoading}
          />

          {/* Login link */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontFamily: "Arimo-Regular",
                fontSize: 14,
                color: "#6A7282",
              }}
            >
              Already Have an Account?
            </Text>
            <Pressable onPress={() => router.navigate("/Authentication/Login")}>
              <Text
                style={{
                  color: "#F4C430",
                  fontFamily: "Arimo-Medium",
                  fontSize: 14,
                  marginLeft: 4,
                }}
              >
                Login here
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;
