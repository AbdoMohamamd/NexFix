import SvgClock from "@/assets/Icons/Clock";
import SvgLocation from "@/assets/Icons/Location";
import SvgStarIcon from "@/assets/Icons/StarIcon";
import Header from "@/components/Header";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const ServiceDetails = () => {
  const params = useLocalSearchParams();

  // Parse the data passed from the previous screen
  const workshop = params.workshop
    ? JSON.parse(params.workshop as string)
    : null;
  const appointments = params.appointments
    ? JSON.parse(params.appointments as string)
    : [];

  if (!workshop) {
    return (
      <View style={{ flex: 1 }}>
        <Header title="Book Service" goBack={true} />
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
      case 0:
        return "Pending";
      case 1:
        return "Confirmed";
      case 2:
        return "In Progress";
      case 3:
        return "Completed";
      case 4:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="Book Service" goBack={true} />
      {/* Header with workshop info */}
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingHorizontal: wp("4%"), // 16px
          paddingVertical: hp("2%"), // 16px
          borderBottomWidth: wp("0.25%"), // 1px
          borderBottomColor: "#E5E7EB",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: wp("3%"), // 12px
          }}
        >
          <View
            style={{
              padding: wp("3%"), // 12px
              backgroundColor: "#F3F4F6",
              borderRadius: wp("2.5%"), // 10px
            }}
          >
            <Image
              source={
                workshop.workshop_Image
                  ? { uri: workshop.workshop_Image }
                  : require("@/assets/images/key.png")
              }
              style={{
                width: wp("12%"), // 48px
                height: wp("12%"), // 48px
                borderRadius: wp("1%"),
              }}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Arimo-Medium",
                fontSize: wp("4.5%"), // 18px
                marginBottom: hp("0.5%"), // 4px
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
                  marginBottom: hp("0.25%"), // 2px
                }}
              >
                <SvgStarIcon
                  width={wp("4%")} // 16px
                  height={wp("4%")} // 16px
                  color="#F59E0B"
                />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"), // 14px
                    color: "#111827",
                    marginLeft: wp("1%"), // 4px
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
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <SvgLocation
                  width={wp("3.5%")} // 14px
                  height={wp("3.5%")} // 14px
                  color="#6A7282"
                />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"), // 14px
                    color: "#6A7282",
                    marginLeft: wp("1%"), // 4px
                  }}
                >
                  {workshop.workshop_Location || "Location not specified"}
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: "Arimo-Medium",
                  fontSize: wp("3%"), // 12px
                  color: "#6A7282",
                }}
              >
                ID: {workshop.workshop_MechanicID}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Services Section */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"), // 16px
          paddingVertical: hp("2%"), // 16px
          gap: hp("1.5%"), // 12px
          paddingBottom: hp("10%"),
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: wp("4.5%"), // 18px
            fontFamily: "Arimo-Bold",
            marginBottom: hp("1%"), // 8px
          }}
        >
          Your Appointments ({appointments.length})
        </Text>

        {appointments.length === 0 ? (
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
          appointments.map((appointment: any) => (
            <Pressable
              key={appointment.appointment_ID}
              style={{
                padding: wp("4%"), // 16px
                backgroundColor: "#ffffff",
                borderRadius: wp("2.5%"), // 10px
                borderWidth: wp("0.25%"), // 1px
                borderColor: "#E5E7EB",
              }}
              onPress={() => {}}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: hp("1%"), // 8px
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("4%"), // 16px
                      marginBottom: hp("0.5%"), // 4px
                    }}
                  >
                    {appointment.appointment_Title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Arimo-Regular",
                      fontSize: wp("3.5%"), // 14px
                      color: "#6A7282",
                    }}
                  >
                    {appointment.appointment_Description}
                  </Text>
                </View>

                {/* Status Badge */}
                <View
                  style={{
                    backgroundColor:
                      appointment.appointment_Status === 3
                        ? "#DCFCE7"
                        : appointment.appointment_Status === 4
                        ? "#FEE2E2"
                        : appointment.appointment_Status === 2
                        ? "#FEF3C7"
                        : appointment.appointment_Status === 1
                        ? "#DBEAFE"
                        : "#F3F4F6",
                    paddingHorizontal: wp("2%"),
                    paddingVertical: hp("0.5%"),
                    borderRadius: wp("1%"),
                    marginLeft: wp("3%"), // 12px
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("2.5%"), // 10px
                      color:
                        appointment.appointment_Status === 3
                          ? "#166534"
                          : appointment.appointment_Status === 4
                          ? "#991B1B"
                          : appointment.appointment_Status === 2
                          ? "#92400E"
                          : appointment.appointment_Status === 1
                          ? "#1E40AF"
                          : "#374151",
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
                  marginTop: hp("1%"), // 8px
                }}
              >
                <SvgClock
                  width={wp("3.5%")} // 14px
                  height={wp("3.5%")} // 14px
                  color="#6A7282"
                />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"), // 14px
                    color: "#6A7282",
                    marginLeft: wp("1.5%"), // 6px
                  }}
                >
                  {formatDate(appointment.appointment_Date)} •{" "}
                  {formatTime(appointment.appointment_Time)}
                </Text>
              </View>

              {/* Vehicle ID */}
              <Text
                style={{
                  fontFamily: "Arimo-Medium",
                  fontSize: wp("3%"), // 12px
                  color: "#6A7282",
                  marginTop: hp("1%"),
                }}
              >
                Vehicle ID: {appointment.appointment_VehiculeID}
              </Text>
            </Pressable>
          ))
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
