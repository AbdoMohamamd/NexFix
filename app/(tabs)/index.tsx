import SvgAngleRight from "@/assets/Icons/AngleRight";
import SvgBell from "@/assets/Icons/Bell";
import SvgClock from "@/assets/Icons/Clock";
import SvgClockBackward from "@/assets/Icons/ClockBackward";
import SvgLocation from "@/assets/Icons/Location";
import SvgTag from "@/assets/Icons/Tag"; // Add this import for offer icon
import {
  appointmentsAPI,
  getUniqueMechanicIdsFromAppointments,
  offersAPI, // Import offersAPI
  workshopsAPI,
} from "@/assets/utils/Api/api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../Context/AuthProvider";

// Define types (add ServiceOffer interface)
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

// Add ServiceOffer interface
interface ServiceOffer {
  serviceOffer_ID: number;
  serviceOffer_Title: string;
  serviceOfferDiscountType: string;
  serviceOffer_DiscountValue: number;
  serviceOffer_Description: string;
  serviceOffer_StartDate: string;
  serviceOffer_EndDate: string;
  serviceOfferIsActive: number;
  serviceOffer_CreatedAt: string;
  serviceOffer_MechanicID: number;
}

export default function TabOneScreen() {
  const { user, token } = useAuth();
  const [workshops, setWorkshops] = useState<WorkshopWithAppointments[]>([]);
  const [latestOffer, setLatestOffer] = useState<ServiceOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [offerLoading, setOfferLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch latest offer
  const fetchLatestOffer = async () => {
    try {
      setOfferLoading(true);
      const response = await offersAPI.getAll();

      if (response.data.success && response.data.data.serviceOffers) {
        const currentDate = new Date();
        const activeOffers = response.data.data.serviceOffers.filter(
          (offer: any) => {
            const endDate = new Date(offer.serviceOffer_EndDate);
            return endDate >= currentDate; // Only include offers that haven't expired
          }
        );

        // Get the latest offer (based on start date or creation date)
        if (activeOffers.length > 0) {
          const sortedOffers = activeOffers.sort(
            (a: ServiceOffer, b: ServiceOffer) =>
              new Date(b.serviceOffer_StartDate).getTime() -
              new Date(a.serviceOffer_StartDate).getTime()
          );
          setLatestOffer(sortedOffers[0]);
        } else {
          setLatestOffer(null);
        }
      } else {
        setLatestOffer(null);
      }
    } catch (err) {
      console.error("Error fetching offers:", err);
      setLatestOffer(null);
    } finally {
      setOfferLoading(false);
    }
  };

  // Function to fetch workshops based on appointments
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?.accID) {
        setError("User not logged in");
        return;
      }

      // Fetch appointments
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

      // Get unique mechanic IDs from appointments
      const mechanicIds = getUniqueMechanicIdsFromAppointments(appointments);
      if (mechanicIds.length === 0) {
        setWorkshops([]);
        return;
      }

      // Fetch workshops for each mechanic ID
      const workshopPromises = mechanicIds.map(async (mechanicId, index) => {
        try {
          const workshopResponse = await workshopsAPI.getByMechanicId(
            mechanicId
          );
          const workshopData = workshopResponse.data;
          if (workshopData.success && workshopData.data) {
            const workshopInfo =
              workshopData.data.workshops?.[index] || workshopData.data;
            const mechanicAppointments = appointments.filter(
              (appointment) => appointment.account_MechanicID === mechanicId
            );

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
    fetchLatestOffer();
  };

  useEffect(() => {
    fetchWorkshops();
    fetchLatestOffer();
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

  // Function to navigate to reminders page
  const navigateToReminders = () => {
    router.navigate("/Pages/Reminder");
  };

  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else if (hour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Format discount text
  const getDiscountText = (offer: ServiceOffer) => {
    return offer.serviceOfferDiscountType === "Percentage"
      ? `${offer.serviceOffer_DiscountValue}% OFF`
      : `$${offer.serviceOffer_DiscountValue} OFF`;
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#EFBF2B" />
        <Text style={{ marginTop: 10, fontFamily: "Arimo-Regular" }}>
          Loading...
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
          onPress={onRefresh}
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
      {/* Header Section */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: wp("4%"),
          paddingVertical: hp("1.5%"),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: wp("1%"),
            alignItems: "center",
            flex: 1,
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

        {/* Notification Icon Button */}
        <Pressable
          onPress={() => {
            router.navigate("/Pages/ServicesHistory");
          }}
          style={{
            padding: wp("2%"),
            marginLeft: wp("2%"),
          }}
        >
          <SvgClockBackward
            width={wp("6%")}
            height={wp("6%")}
            color="#111827"
          />
        </Pressable>
        <Pressable
          onPress={navigateToReminders}
          style={{
            padding: wp("2%"),
            marginLeft: wp("2%"),
          }}
        >
          <SvgBell width={wp("6%")} height={wp("6%")} color="#111827" />
        </Pressable>
      </View>

      {/* Welcome Section */}
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
          {getTimeBasedGreeting()}, {user?.accUserName}
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

      {/* Latest Offer Section */}
      {!offerLoading && latestOffer ? (
        <Pressable
          style={{
            marginHorizontal: wp("4%"),
            marginTop: hp("2%"),
            backgroundColor: "#FFF9E6",
            borderWidth: wp("0.25%"),
            borderColor: "#F4C430",
            borderRadius: wp("2.5%"),
            overflow: "hidden",
          }}
          onPress={() => {
            router.navigate("/(tabs)/Offers");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: wp("3%"),
            }}
          >
            <View
              style={{
                backgroundColor: "#F4C430",
                padding: wp("2.5%"),
                borderRadius: wp("1.5%"),
                marginRight: wp("3%"),
              }}
            >
              <SvgTag width={wp("5%")} height={wp("5%")} color="#FFFFFF" />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Arimo-Bold",
                  fontSize: wp("3.5%"),
                  color: "#92400E",
                }}
                numberOfLines={1}
              >
                {latestOffer.serviceOffer_Title}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: hp("0.5%"),
                }}
              >
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"),
                    color: "#111827",
                    marginRight: wp("2%"),
                  }}
                >
                  {getDiscountText(latestOffer)}
                </Text>

                <Text
                  style={{
                    fontFamily: "Arimo-Regular",
                    fontSize: wp("2.5%"),
                    color: "#6A7282",
                  }}
                >
                  • Valid until: {formatDate(latestOffer.serviceOffer_EndDate)}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      ) : !offerLoading && !latestOffer ? (
        <View
          style={{
            marginHorizontal: wp("4%"),
            marginTop: hp("2%"),
            backgroundColor: "#F3F4F6",
            borderRadius: wp("2.5%"),
            padding: wp("3%"),
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Arimo-Regular",
              fontSize: wp("3.5%"),
              color: "#6A7282",
            }}
          >
            No offers available
          </Text>
        </View>
      ) : (
        <View
          style={{
            marginHorizontal: wp("4%"),
            marginTop: hp("2%"),
            padding: wp("3%"),
            backgroundColor: "#F3F4F6",
            borderRadius: wp("2.5%"),
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="small" color="#EFBF2B" />
          <Text
            style={{
              fontFamily: "Arimo-Regular",
              fontSize: wp("3%"),
              color: "#6A7282",
              marginTop: hp("0.5%"),
            }}
          >
            Checking for offers...
          </Text>
        </View>
      )}
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Text
          style={{
            fontSize: wp("4.5%"),
            fontFamily: "Arimo-Bold",
            marginBottom: hp("1%"),
          }}
        >
          Your Workshops
          <Text style={{ fontFamily: "Arimo-Regular", fontSize: wp("3.5%") }}>
            ({workshops.length})
          </Text>
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"),
          gap: wp("2%"),
          paddingBottom: hp("2%"),
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
