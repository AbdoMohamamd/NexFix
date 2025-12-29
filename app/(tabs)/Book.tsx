import { useAuth } from "@/app/Context/AuthProvider";
import SvgLocation from "@/assets/Icons/Location";
import SvgStarIcon from "@/assets/Icons/StarIcon";
import {
  appointmentsAPI,
  vehicleAPI,
  workshopsAPI,
} from "@/assets/utils/Api/api";
import { DropDownOption } from "@/assets/utils/Types";
import Button from "@/components/Button";
import DropDown from "@/components/DropDown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

// Define Workshop interface
interface Workshop {
  workshop_ID: number;
  workshop_MechanicID: number;
  workshop_Name: string;
  workshop_Location: string;
  workshop_Phone?: string;
  workshop_Email?: string;
  workshop_Description?: string;
  workshop_Rating?: number;
  workshop_ReviewCount?: number;
  workshop_Address?: number;
  workshop_Image?: string;
  workshop_IsAvailable?: boolean;
}

const Book = () => {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState("All Services");
  const [searchText, setSearchText] = useState("");
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [vehicles, setVehicles] = useState<DropDownOption[]>([]); // Store user's vehicles
  const [loading, setLoading] = useState(true);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Booking modal state
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking form state
  const [appointmentTitle, setAppointmentTitle] = useState("");
  const [appointmentDescription, setAppointmentDescription] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<DropDownOption>();

  // Date and Time state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const services = [
    "All Services",
    "Oil Change",
    "Tires",
    "Brakes",
    "Engine",
    "AC Repair",
    "Battery",
    "Transmission",
  ];

  // Set minimum date to today
  const minDate = new Date();

  // Set maximum date to 3 months from now
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  // Set time constraints (9 AM to 6 PM)
  const minTime = new Date();
  minTime.setHours(9, 0, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(18, 0, 0, 0);

  // Fetch all workshops
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await workshopsAPI.getAll();
      const data = response.data;

      if (data.success) {
        const workshopsData =
          data.data?.workshops || data.workshops || data.data || [];
        setWorkshops(Array.isArray(workshopsData) ? workshopsData : []);
      } else {
        setError(data.message || "Failed to fetch workshops");
      }
    } catch (err) {
      console.error("Error fetching workshops:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch user's vehicles
  const fetchUserVehicles = async () => {
    if (!user?.accID) return;

    try {
      setVehiclesLoading(true);
      const response = await vehicleAPI.getVehiclesByCustomerIdForDropDown(
        user.accID
      );
      const data = response;
      if (data.length > 0) {
        setVehicles(data);
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setVehicles([]);
    } finally {
      setVehiclesLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkshops();
    fetchUserVehicles();
  };

  useEffect(() => {
    fetchWorkshops();
    fetchUserVehicles();
  }, []);

  // Handle workshop selection for booking
  const handleBookNow = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setAppointmentTitle(""); // Reset form
    setAppointmentDescription("");
    setSelectedVehicleId(selectedVehicleId);

    // Set default date and time (tomorrow at 10 AM)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    setSelectedDate(tomorrow);
    setSelectedTime(tomorrow);

    setShowBookingModal(true);
  };

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Keep the time from the previously selected time
      const newDate = new Date(selectedDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setSelectedDate(newDate);
      setSelectedTime(newDate);
    }
  };

  // Handle time change
  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // Keep the date from the previously selected date
      const newTime = new Date(selectedDate);
      newTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setSelectedTime(newTime);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Check if selected time is within business hours
  const isWithinBusinessHours = (time: Date) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    const minHours = minTime.getHours();
    const minMinutes = minTime.getMinutes();
    const minTotalMinutes = minHours * 60 + minMinutes;

    const maxHours = maxTime.getHours();
    const maxMinutes = maxTime.getMinutes();
    const maxTotalMinutes = maxHours * 60 + maxMinutes;

    return totalMinutes >= minTotalMinutes && totalMinutes <= maxTotalMinutes;
  };

  // Handle booking submission
  const handleSubmitBooking = async () => {
    if (!selectedWorkshop || !user) {
      Alert.alert(
        "Error",
        "Please select a workshop and ensure you're logged in"
      );
      return;
    }

    if (!appointmentTitle.trim()) {
      Alert.alert("Error", "Please enter a service title");
      return;
    }

    if (!appointmentDescription.trim()) {
      Alert.alert("Error", "Please enter service description");
      return;
    }

    if (!selectedVehicleId) {
      Alert.alert("Error", "Please select a vehicle");
      return;
    }

    // Check if selected date is valid
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);

    if (selectedDateOnly < today) {
      Alert.alert("Error", "Please select a future date");
      return;
    }

    // Check if time is within business hours
    if (!isWithinBusinessHours(selectedTime)) {
      Alert.alert("Error", "Please select a time between 9:00 AM and 6:00 PM");
      return;
    }

    try {
      setBookingLoading(true);

      // Format date and time for API
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const formattedTime = selectedTime.toTimeString().split(" ")[0];
      const appointmentDateTime = `${formattedDate} ${formattedTime}`;

      const appointmentData = {
        account_CustomerID: user.accID,
        account_MechanicID: selectedWorkshop.workshop_MechanicID,
        appointment_VehiculeID: Number(selectedVehicleId.id),
        appointment_Title: appointmentTitle,
        appointment_Description: appointmentDescription,
        appointment_Date: formattedDate,
        appointment_Time: appointmentDateTime,
        appointment_Status: 1, // Default to pending
      };

      const response = await appointmentsAPI.createAppointment(appointmentData);

      const data = response.data;
      if (data.success) {
        Alert.alert("Success", "Appointment booked successfully!", [
          {
            text: "OK",
            onPress: () => {
              setShowBookingModal(false);
              router.navigate("/"); // Navigate to dashboard
            },
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to book appointment");
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Filter workshops based on search and service
  const filteredWorkshops = workshops.filter((workshop) => {
    const matchesSearch =
      searchText === "" ||
      workshop.workshop_Name.toLowerCase().includes(searchText.toLowerCase()) ||
      workshop.workshop_Location
        .toLowerCase()
        .includes(searchText.toLowerCase());

    const matchesService =
      selectedService === "All Services" ||
      workshop.workshop_Description
        ?.toLowerCase()
        .includes(selectedService.toLowerCase()) ||
      workshop.workshop_Name
        .toLowerCase()
        .includes(selectedService.toLowerCase());

    return matchesSearch && matchesService;
  });

  // Format rating
  const formatRating = (rating?: number, count?: number) => {
    if (!rating) return "No ratings";
    return `${rating.toFixed(1)} (${count || 0})`;
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#EFBF2B" />
          <Text style={{ marginTop: 10, fontFamily: "Arimo-Regular" }}>
            Loading workshops...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* White Header Section */}
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingHorizontal: wp("4%"),
          paddingTop: hp("1.5%"),
          paddingBottom: hp("2%"),
          borderBottomWidth: wp("0.25%"),
          borderBottomColor: "#E5E7EB",
        }}
      >
        {/* Workshops Count */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Arimo-Medium",
              fontSize: wp("4%"),
            }}
          >
            {filteredWorkshops.length} Workshop
            {filteredWorkshops.length !== 1 ? "s" : ""} Available
          </Text>

          {error ? (
            <Text
              style={{
                color: "#EF4444",
                fontFamily: "Arimo-Regular",
                fontSize: wp("3%"),
              }}
            >
              {error}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Workshops List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"),
          paddingVertical: hp("2%"),
          gap: hp("1.5%"),
          paddingBottom: hp("10%"),
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#EFBF2B"]}
            tintColor="#EFBF2B"
          />
        }
      >
        {filteredWorkshops.length === 0 ? (
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
                fontSize: wp("4%"),
                color: "#6A7282",
                textAlign: "center",
              }}
            >
              No workshops found. {searchText ? "Try a different search." : ""}
            </Text>
          </View>
        ) : (
          filteredWorkshops.map((workshop) => (
            <View
              key={workshop.workshop_ID}
              style={{
                padding: wp("4%"),
                backgroundColor: "#ffffff",
                borderRadius: wp("2.5%"),
                borderWidth: wp("0.25%"),
                borderColor: "#E5E7EB",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: wp("3%"),
                  marginBottom: hp("1.5%"),
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
                      width: wp("13%"),
                      height: wp("13%"),
                      borderRadius: wp("1%"),
                    }}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: hp("0.5%"),
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Arimo-Medium",
                          fontSize: wp("4%"),
                        }}
                      >
                        {workshop.workshop_Name}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: hp("0.25%"),
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
                          {formatRating(
                            workshop.workshop_Rating,
                            workshop.workshop_ReviewCount
                          )}
                        </Text>
                      </View>
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      {/* Availability indicator only */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: hp("0.25%"),
                        }}
                      >
                        <View
                          style={{
                            width: wp("1.5%"),
                            height: wp("1.5%"),
                            borderRadius: wp("0.75%"),
                            backgroundColor:
                              workshop.workshop_IsAvailable !== false
                                ? "#10B981"
                                : "#EF4444",
                            marginRight: wp("1%"),
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: "Arimo-Medium",
                            fontSize: wp("3.5%"),
                            color:
                              workshop.workshop_IsAvailable !== false
                                ? "#10B981"
                                : "#EF4444",
                          }}
                        >
                          {workshop.workshop_IsAvailable !== false
                            ? "Available"
                            : "Not available"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: hp("0.5%"),
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
                        color: "#111827",
                        marginLeft: wp("2%"),
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {workshop.workshop_Address}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Workshop Description (if available) */}
              {workshop.workshop_Description && (
                <Text
                  style={{
                    fontFamily: "Arimo-Regular",
                    fontSize: wp("3.5%"),
                    color: "#6A7282",
                    marginBottom: hp("1.5%"),
                    lineHeight: hp("2.5%"),
                  }}
                  numberOfLines={2}
                >
                  {workshop.workshop_Description}
                </Text>
              )}

              {/* Separator Line */}
              <View
                style={{
                  height: wp("0.25%"),
                  backgroundColor: "#E5E7EB",
                  marginVertical: hp("1.5%"),
                }}
              />

              {/* Action Button */}
              <Button
                onPress={() => handleBookNow(workshop)}
                text="Book Now"
                wrap={false}
                disabled={workshop.workshop_IsAvailable === false}
              />
            </View>
          ))
        )}
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: wp("5%"),
              borderTopRightRadius: wp("5%"),
              padding: wp("4%"),
              maxHeight: hp("85%"),
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: hp("2%"),
                }}
              >
                <Text
                  style={{ fontFamily: "Arimo-Bold", fontSize: wp("4.5%") }}
                >
                  Book Appointment
                </Text>
                <Pressable onPress={() => setShowBookingModal(false)}>
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("4%"),
                      color: "#EF4444",
                    }}
                  >
                    Cancel
                  </Text>
                </Pressable>
              </View>

              {/* Workshop Info */}
              {selectedWorkshop && (
                <View
                  style={{
                    backgroundColor: "#F8FAFC",
                    padding: wp("3%"),
                    borderRadius: wp("2%"),
                    marginBottom: hp("2%"),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arimo-Bold",
                      fontSize: wp("4%"),
                      marginBottom: hp("0.5%"),
                    }}
                  >
                    {selectedWorkshop.workshop_Name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Arimo-Regular",
                      fontSize: wp("3.5%"),
                      color: "#6A7282",
                    }}
                  >
                    {selectedWorkshop.workshop_Location}
                  </Text>
                </View>
              )}

              {/* Booking Form */}
              <Text
                style={{
                  fontFamily: "Arimo-Medium",
                  fontSize: wp("4%"),
                  marginBottom: hp("1%"),
                }}
              >
                Service Details
              </Text>

              {/* Service Title */}
              <View style={{ marginBottom: hp("2%") }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"),
                    marginBottom: hp("0.5%"),
                    color: "#374151",
                  }}
                >
                  Service Title*
                </Text>
                <TextInput
                  style={{
                    borderWidth: wp("0.25%"),
                    borderColor: "#E5E7EB",
                    borderRadius: wp("1%"),
                    padding: wp("3%"),
                    fontFamily: "Arimo-Regular",
                    fontSize: wp("4%"),
                    backgroundColor: "#FFFFFF",
                  }}
                  placeholder="e.g., Oil Change Service"
                  value={appointmentTitle}
                  onChangeText={setAppointmentTitle}
                />
              </View>

              {/* Service Description */}
              <View style={{ marginBottom: hp("2%") }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"),
                    marginBottom: hp("0.5%"),
                    color: "#374151",
                  }}
                >
                  Service Description*
                </Text>
                <TextInput
                  style={{
                    borderWidth: wp("0.25%"),
                    borderColor: "#E5E7EB",
                    borderRadius: wp("1%"),
                    padding: wp("3%"),
                    fontFamily: "Arimo-Regular",
                    fontSize: wp("4%"),
                    backgroundColor: "#FFFFFF",
                    minHeight: hp("10%"),
                    textAlignVertical: "top",
                  }}
                  placeholder="Describe what service you need..."
                  value={appointmentDescription}
                  onChangeText={setAppointmentDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Date Picker */}
              <View style={{ marginBottom: hp("2%") }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"),
                    marginBottom: hp("0.5%"),
                    color: "#374151",
                  }}
                >
                  Appointment Date*
                </Text>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    borderWidth: wp("0.25%"),
                    borderColor: "#E5E7EB",
                    borderRadius: wp("1%"),
                    padding: wp("3%"),
                    backgroundColor: "#FFFFFF",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arimo-Regular",
                      fontSize: wp("4%"),
                      color: selectedDate ? "#111827" : "#9CA3AF",
                    }}
                  >
                    {selectedDate ? formatDate(selectedDate) : "Select date"}
                  </Text>
                  <Text style={{ fontSize: wp("4%"), color: "#6A7282" }}>
                    📅
                  </Text>
                </Pressable>
              </View>

              {/* Time Picker */}
              <View style={{ marginBottom: hp("2%") }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"),
                    marginBottom: hp("0.5%"),
                    color: "#374151",
                  }}
                >
                  Appointment Time* (9:00 AM - 6:00 PM)
                </Text>
                <Pressable
                  onPress={() => setShowTimePicker(true)}
                  style={{
                    borderWidth: wp("0.25%"),
                    borderColor: "#E5E7EB",
                    borderRadius: wp("1%"),
                    padding: wp("3%"),
                    backgroundColor: "#FFFFFF",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arimo-Regular",
                      fontSize: wp("4%"),
                      color: selectedTime ? "#111827" : "#9CA3AF",
                    }}
                  >
                    {selectedTime ? formatTime(selectedTime) : "Select time"}
                  </Text>
                  <Text style={{ fontSize: wp("4%"), color: "#6A7282" }}>
                    ⏰
                  </Text>
                </Pressable>
                <Text
                  style={{
                    fontFamily: "Arimo-Regular",
                    fontSize: wp("3%"),
                    color: "#6A7282",
                    marginTop: hp("0.5%"),
                    fontStyle: "italic",
                  }}
                >
                  Business hours: 9:00 AM - 6:00 PM
                </Text>
              </View>

              {/* Vehicle Dropdown */}
              <View style={{ marginBottom: hp("3%") }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"),
                    marginBottom: hp("0.5%"),
                    color: "#374151",
                  }}
                >
                  Select Vehicle*
                </Text>

                {vehiclesLoading ? (
                  <View style={{ padding: wp("3%"), alignItems: "center" }}>
                    <ActivityIndicator size="small" color="#EFBF2B" />
                    <Text
                      style={{
                        fontFamily: "Arimo-Regular",
                        fontSize: wp("3%"),
                        color: "#6A7282",
                        marginTop: hp("1%"),
                      }}
                    >
                      Loading vehicles...
                    </Text>
                  </View>
                ) : vehicles.length === 0 ? (
                  <View
                    style={{
                      padding: wp("3%"),
                      alignItems: "center",
                      backgroundColor: "#FEF2F2",
                      borderRadius: wp("1%"),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: wp("3.5%"),
                        color: "#DC2626",
                        textAlign: "center",
                      }}
                    >
                      No vehicles found. Please add a vehicle first.
                    </Text>
                    <Pressable
                      onPress={() => {
                        setShowBookingModal(false);
                        router.navigate("/(tabs)/Account"); // Navigate to profile to add vehicles
                      }}
                      style={{
                        marginTop: hp("1%"),
                        paddingHorizontal: wp("4%"),
                        paddingVertical: hp("0.5%"),
                        backgroundColor: "#EFBF2B",
                        borderRadius: wp("1%"),
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Arimo-Medium",
                          fontSize: wp("3.5%"),
                          color: "#000000",
                        }}
                      >
                        Add Vehicle
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <DropDown
                    title="Vehicle"
                    value={selectedVehicleId}
                    onValueChange={(selectedOption) =>
                      setSelectedVehicleId(selectedOption)
                    }
                    placeholder="e.g., Toyota"
                    options={vehicles}
                    style={{ flex: 1 }}
                  />
                )}
              </View>

              {/* Submit Button */}
              <Button
                onPress={handleSubmitBooking}
                text={bookingLoading ? "Booking..." : "Confirm Booking"}
                wrap={false}
                disabled={bookingLoading || vehicles.length === 0}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
          minuteInterval={15} // 15-minute intervals
        />
      )}
    </SafeAreaView>
  );
};

export default Book;
