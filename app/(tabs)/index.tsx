import SvgAngleRight from "@/assets/Icons/AngleRight";
import SvgClock from "@/assets/Icons/Clock";
import SvgLocation from "@/assets/Icons/Location";
import {
  appointmentsAPI,
  workshopsAPI,
  getUniqueMechanicIdsFromAppointments,
} from "@/assets/utils/Api/api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../Context/AuthProvider";

// Define types
interface Appointment {
  account_CustomerID: number;
  account_MechanicID: number;
  appointment_Date: string;
  appointment_Description: string;
  appointment_ID: number;
  appointment_Status: number;
  appointment_Time: string;
  appointment_Title: string;
  appointment_VehiculeID: number;
}

interface Workshop {
  workshop_ID?: number;
  workshop_MechanicID: number;
  workshop_Name: string;
  workshop_Location: string;
  workshop_Phone?: string;
  workshop_Email?: string;
  workshop_Description?: string;
  workshop_Image?: string;
  [key: string]: any;
}

interface WorkshopWithAppointments extends Workshop {
  appointments: Appointment[];
  lastVisit?: string;
}

export default function TabOneScreen() {
  const { user, token } = useAuth();
  const [workshops, setWorkshops] = useState<WorkshopWithAppointments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch workshops based on appointments
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?.accID) {
        setError("User not logged in");
        return;
      }

      // 1. Fetch appointments for the customer
      const appointmentsResponse = await appointmentsAPI.getByCustomerId(
        user.accID
      );
      const appointmentsData = appointmentsResponse.data;

      if (!appointmentsData.success) {
        setError(appointmentsData.message || "Failed to fetch appointments");
        return;
      }

      const appointments: Appointment[] =
        appointmentsData.data?.appointments || [];

      if (appointments.length === 0) {
        setWorkshops([]);
        return;
      }

      // 2. Get unique mechanic IDs from appointments
      const mechanicIds = getUniqueMechanicIdsFromAppointments(appointments);
      if (mechanicIds.length === 0) {
        setWorkshops([]);
        return;
      }

      // 3. Fetch workshops for each mechanic ID
      const workshopPromises = mechanicIds.map(async (mechanicId,index) => {
        try {
          const workshopResponse = await workshopsAPI.getByMechanicId(
            mechanicId
          );
          const workshopData = workshopResponse.data;
          if (workshopData.success && workshopData.data) {
            // Get workshop info (assuming API returns array of workshops)
            const workshopInfo =
              workshopData.data.workshops?.[index] || workshopData.data;
            // Filter appointments for this specific mechanic
            const mechanicAppointments = appointments.filter(
              (appointment) => appointment.account_MechanicID === mechanicId
            );

            // Get the most recent appointment date for "last visit"
            const lastAppointment =
              mechanicAppointments.length > 0
                ? mechanicAppointments.sort(
                    (a, b) =>
                      new Date(b.appointment_Date).getTime() -
                      new Date(a.appointment_Date).getTime()
                  )[0]
                : null;

            return {
              ...workshopInfo,
              appointments: mechanicAppointments,
              lastVisit: lastAppointment
                ? new Date(lastAppointment.appointment_Date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )
                : "No visits yet",
            } as WorkshopWithAppointments;
          }
          return null;
        } catch (err) {
          console.error(
            `Error fetching workshop for mechanic ${mechanicId}:`,
            err
          );
          return null;
        }
      });
      // 4. Wait for all workshop requests to complete
      const workshopResults = await Promise.all(workshopPromises);
      const validWorkshops = workshopResults.filter(
        (workshop): workshop is WorkshopWithAppointments => workshop !== null
      );
      setWorkshops(validWorkshops);
    } catch (err) {
      console.error("Error fetching workshops:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkshops();
  };

  useEffect(() => {
    fetchWorkshops();
  }, [user]);

  // Function to navigate to workshop details
  const navigateToWorkshopDetails = (workshop: WorkshopWithAppointments) => {
    router.navigate({
      pathname: "/Pages/ServiceDetails",
      params: {
        workshop: JSON.stringify(workshop),
        appointments: JSON.stringify(workshop.appointments),
      },
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#EFBF2B" />
        <Text style={{ marginTop: 10, fontFamily: "Arimo-Regular" }}>
          Loading workshops...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            color: "red",
            fontFamily: "Arimo-Regular",
            textAlign: "center",
          }}
        >
          Error: {error}
        </Text>
        <Pressable
          onPress={fetchWorkshops}
          style={{
            marginTop: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: "#EFBF2B",
            borderRadius: 5,
          }}
        >
          <Text style={{ fontFamily: "Arimo-Bold" }}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          gap: wp("1%"),
          alignItems: "center",
          paddingHorizontal: wp("4%"),
          paddingVertical: hp("1.5%"),
        }}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          style={{
            width: wp("17.5%"),
            height: wp("17.5%"),
          }}
        />
        <Text
          style={{
            fontSize: wp("4.5%"),
            fontFamily: "Arimo-Bold",
          }}
        >
          Dashboard
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#EFBF2B",
          padding: wp("4%"),
        }}
      >
        <Text
          style={{
            fontSize: wp("4%"),
            fontFamily: "Arimo-Bold",
          }}
        >
          Welcome Back, {user?.accUserName}
        </Text>
        <Text
          style={{
            fontSize: wp("3.5%"),
            fontFamily: "Arimo-Regular",
            marginTop: hp("0.5%"),
          }}
        >
          Here are your previous workshops
        </Text>

        {/* Summary Stats */}
        <View
          style={{ flexDirection: "row", marginTop: hp("1%"), gap: wp("4%") }}
        >
          <View>
            <Text style={{ fontFamily: "Arimo-Bold", fontSize: wp("3.5%") }}>
              {workshops.length}
            </Text>
            <Text style={{ fontFamily: "Arimo-Regular", fontSize: wp("3%") }}>
              Workshops
            </Text>
          </View>
          <View>
            <Text style={{ fontFamily: "Arimo-Bold", fontSize: wp("3.5%") }}>
              {workshops.reduce(
                (total, workshop) => total + workshop.appointments.length,
                0
              )}
            </Text>
            <Text style={{ fontFamily: "Arimo-Regular", fontSize: wp("3%") }}>
              Total Appointments
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"),
          gap: wp("2%"),
          paddingBottom: hp("22%"),
          paddingTop: hp("2%"),
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
        <Text
          style={{
            fontSize: wp("4.5%"),
            fontFamily: "Arimo-Bold",
            marginBottom: hp("1%"),
          }}
        >
          Your Workshops
          <Text style={{ fontFamily: "Arimo-Regular", fontSize: wp("3.5%") }}>
            {" "}
            ({workshops.length})
          </Text>
        </Text>

        {workshops.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: hp("10%") }}>
            <Text
              style={{
                fontFamily: "Arimo-Regular",
                fontSize: wp("4%"),
                color: "#6A7282",
              }}
            >
              No workshops found
            </Text>
            <Text
              style={{
                fontFamily: "Arimo-Regular",
                fontSize: wp("3.5%"),
                color: "#6A7282",
                marginTop: hp("1%"),
              }}
            >
              Book an appointment to see workshops here
            </Text>
          </View>
        ) : (
          workshops.map((workshop) => (
            <Pressable
              key={workshop.workshop_ID || workshop.workshop_MechanicID}
              style={{
                padding: wp("4%"),
                backgroundColor: "#ffffff",
                flexDirection: "row",
                gap: wp("2%"),
                borderWidth: wp("0.25%"),
                borderColor: "#E5E7EB",
                borderRadius: wp("2.5%"),
                justifyContent: "space-between",
              }}
              onPress={() => navigateToWorkshopDetails(workshop)}
            >
              <View style={{ flexDirection: "row", gap: wp("2%"), flex: 1 }}>
                <View
                  style={{
                    padding: wp("3%"),
                    backgroundColor: "#F3F4F6",
                    borderRadius: wp("2.5%"),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={
                      workshop.workshop_Image
                        ? { uri: workshop.workshop_Image }
                        : require("@/assets/images/key.png")
                    }
                    style={{
                      width: wp("11%"),
                      height: wp("11%"),
                      borderRadius: wp("1%"),
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("4%"),
                    }}
                  >
                    {workshop.workshop_Name ||
                      `Workshop ${workshop.workshop_MechanicID}`}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: hp("0.5%"),
                    }}
                  >
                    <SvgLocation width={wp("3.5%")} height={wp("3.5%")} />
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

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: hp("0.5%"),
                    }}
                  >
                    <SvgClock width={wp("3%")} height={wp("3%")} />
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: wp("3%"),
                        color: "#6A7282",
                        marginLeft: wp("1%"),
                      }}
                    >
                      Last visit: {workshop.lastVisit || "No visits yet"}
                    </Text>
                  </View>

                  {/* Appointment count badge */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: hp("0.5%"),
                      backgroundColor: "#F0F9FF",
                      alignSelf: "flex-start",
                      paddingHorizontal: wp("2%"),
                      paddingVertical: hp("0.25%"),
                      borderRadius: wp("1%"),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: wp("2.5%"),
                        color: "#0369A1",
                      }}
                    >
                      {workshop.appointments.length} appointment
                      {workshop.appointments.length !== 1 ? "s" : ""}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <SvgAngleRight
                  height={wp("6%")}
                  width={wp("6%")}
                  color="#99A1AF"
                />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
