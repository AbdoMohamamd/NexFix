import SvgCar from "@/assets/Icons/Car";
import SvgPlus from "@/assets/Icons/Plus";
import SvgTrash from "@/assets/Icons/Trash";
import Button from "@/components/Button";
import InfoBlock from "@/components/InfoBlock copy";
import CustomTextInput from "@/components/TextInput";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const Register = () => {
  // Personal Information States
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Vehicle States
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      brand: "",
      model: "",
      year: "",
      mileage: "",
    },
  ]);

  // Add a new vehicle
  const addVehicle = () => {
    const newVehicle = {
      id: vehicles.length + 1,
      brand: "",
      model: "",
      year: "",
      mileage: "",
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
  const updateVehicle = (id: number, field: string, value: string) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
      )
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    const formData = {
      personalInfo: { name, phoneNumber, email, password, confirmPassword },
      vehicles: vehicles.map((v) => ({
        ...v,
        id: undefined, // Remove id from submission
      })),
    };
    console.log("Form Data:", formData);
    // Add your API call or navigation here
  };

  return (
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

        <CustomTextInput title="Name" value={name} onChangeText={setName} />

        <CustomTextInput
          title="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          // Optional: Add keyboardType="phone-pad"
        />

        <CustomTextInput
          title="Email"
          value={email}
          onChangeText={setEmail}
          // Optional: Add keyboardType="email-address"
        />

        <CustomTextInput
          title="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <CustomTextInput
          title="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
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
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
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
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
              <CustomTextInput
                title="Brand"
                value={vehicle.brand}
                onChangeText={(value) =>
                  updateVehicle(vehicle.id, "brand", value)
                }
                style={{ flex: 1 }}
                placeholder="e.g., Toyota"
              />
              <CustomTextInput
                title="Model"
                value={vehicle.model}
                onChangeText={(value) =>
                  updateVehicle(vehicle.id, "model", value)
                }
                style={{ flex: 1 }}
                placeholder="e.g., Camry"
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <CustomTextInput
                title="Year"
                value={vehicle.year}
                onChangeText={(value) =>
                  updateVehicle(vehicle.id, "year", value)
                }
                style={{ flex: 1 }}
                placeholder="e.g., 2020"
                // Optional: keyboardType="numeric"
              />
              <CustomTextInput
                title="Mileage"
                value={vehicle.mileage}
                onChangeText={(value) =>
                  updateVehicle(vehicle.id, "mileage", value)
                }
                style={{ flex: 1 }}
                placeholder="e.g., 50000"
                // Optional: keyboardType="numeric"
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
              <Text style={{ color: "#F4C430", fontFamily: "Arimo-Medium" }}>
                Add your first vehicle
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Submit Button */}
      <Button
        text="Create Account"
        wrap={false}
        onPress={handleSubmit}
        // Optional: Add loading state
        // disabled={!name || !email || !password || !confirmPassword}
      />
    </ScrollView>
  );
};

export default Register;
