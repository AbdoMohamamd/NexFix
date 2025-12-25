import { offersAPI } from "@/assets/utils/Api/api";
import Button from "@/components/Button";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

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

const Offers = () => {
  const [offers, setOffers] = useState<ServiceOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await offersAPI.getAll();

      if (response.data.success && response.data.data.serviceOffers) {
        // Filter out expired offers and only show active ones
        const currentDate = new Date();
        const activeOffers = response.data.data.serviceOffers.filter(
          (offer: any) => {
            const endDate = new Date(offer.serviceOffer_EndDate);
            return endDate >= currentDate; // Only include offers that haven't expired
          }
        );
        setOffers(activeOffers);
        setError(null);
      } else {
        setError("No offers available");
        setOffers([]);
      }
    } catch (err: any) {
      console.error("Error fetching offers:", err);
      setError("Failed to load offers. Please try again.");
      setOffers([]);
      Alert.alert("Error", "Failed to load offers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchOffers();
  };

  // Format date to shorter format (e.g., "Dec 31")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Format date for the valid period display
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // If same month, show "Dec 15-31"
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${start.toLocaleDateString("en-US", {
        month: "short",
      })} ${start.getDate()}-${end.getDate()}`;
    }

    // Different months: "Dec 15 - Jan 10"
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Share offer via device's sharing options
  const handleShareOffer = async (offer: ServiceOffer) => {
    try {
      const discountText =
        offer.serviceOfferDiscountType === "Percentage"
          ? `${offer.serviceOffer_DiscountValue}%`
          : `$${offer.serviceOffer_DiscountValue}`;

      const message =
        `🔥 ${offer.serviceOffer_Title} 🔥\n\n` +
        `💥 ${discountText} ${
          offer.serviceOfferDiscountType === "Percentage" ? "OFF" : "DISCOUNT"
        }\n\n` +
        `📝 ${offer.serviceOffer_Description}\n\n` +
        `📅 Valid until: ${new Date(
          offer.serviceOffer_EndDate
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}\n\n` +
        `👉 Grab this exclusive offer now!`;

      const result = await Share.share({
        message: message,
        title: offer.serviceOffer_Title,
      });

      if (result.action === Share.sharedAction) {
        console.log("Offer shared successfully");
      }
    } catch (error: any) {
      Alert.alert("Error", "Unable to share offer: " + error.message);
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#F4C430" />
        <Text
          style={{
            marginTop: hp("2%"),
            fontSize: wp("4%"),
            fontFamily: "Arimo-Regular",
            color: "#6A7282",
          }}
        >
          Loading offers...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingHorizontal: wp("4%"),
          paddingVertical: hp("2%"),
          borderBottomWidth: wp("0.25%"),
          borderBottomColor: "#E5E7EB",
        }}
      >
        <Text style={{ fontSize: wp("5%"), fontFamily: "Arimo-Bold" }}>
          Offers & Rewards
        </Text>
        <Text
          style={{
            fontSize: wp("3.5%"),
            fontFamily: "Arimo-Regular",
            color: "#6A7282",
            marginTop: hp("0.5%"),
          }}
        >
          {offers.length} active promotion{offers.length !== 1 ? "s" : ""}{" "}
          available
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"),
          paddingVertical: hp("2%"),
          gap: hp("2%"),
          backgroundColor: "#FFF9E6",
          paddingBottom: hp("4%"),
          flexGrow: 1, // Ensures proper scrolling with refresh
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#F4C430"]}
            tintColor="#F4C430"
            title="Pull to refresh"
            titleColor="#6A7282"
          />
        }
      >
        {error ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: hp("10%"),
            }}
          >
            <Text
              style={{
                fontSize: wp("4.5%"),
                fontFamily: "Arimo-Regular",
                color: "#6A7282",
                textAlign: "center",
                paddingHorizontal: wp("5%"),
                marginBottom: hp("2%"),
              }}
            >
              {error}
            </Text>
            <Button text="Try Again" onPress={fetchOffers} />
          </View>
        ) : offers.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              paddingVertical: hp("10%"),
              backgroundColor: "#ffffff",
              borderRadius: wp("3%"),
              padding: wp("5%"),
              borderWidth: wp("0.25%"),
              borderColor: "#E5E7EB",
              marginTop: hp("2%"),
            }}
          >
            <Text
              style={{
                fontSize: wp("4.5%"),
                fontFamily: "Arimo-Medium",
                color: "#111827",
                textAlign: "center",
                marginBottom: hp("1%"),
              }}
            >
              No Active Offers
            </Text>
            <Text
              style={{
                fontSize: wp("3.5%"),
                fontFamily: "Arimo-Regular",
                color: "#6A7282",
                textAlign: "center",
                marginBottom: hp("2%"),
              }}
            >
              Pull down to refresh or check back soon!
            </Text>
            <Button
              text="Refresh"
              onPress={onRefresh}
              type="secondary"
              size="medium"
            />
          </View>
        ) : (
          offers.map((offer) => {
            const discountText =
              offer.serviceOfferDiscountType === "Percentage"
                ? `${offer.serviceOffer_DiscountValue}% OFF`
                : `$${offer.serviceOffer_DiscountValue} OFF`;

            return (
              <View
                key={offer.serviceOffer_ID}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: wp("3%"),
                  borderWidth: wp("0.25%"),
                  borderColor: "#F4C430",
                  overflow: "hidden",
                }}
              >
                {/* Offer Header with Discount Badge */}
                <View
                  style={{
                    backgroundColor: "#FEF3C7",
                    paddingHorizontal: wp("4%"),
                    paddingVertical: hp("1.5%"),
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arimo-Bold",
                      fontSize: wp("4%"),
                      color: "#92400E",
                      flex: 1,
                      marginRight: wp("2%"),
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {offer.serviceOffer_Title}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#F4C430",
                      paddingHorizontal: wp("3%"),
                      paddingVertical: hp("0.75%"),
                      borderRadius: wp("1.5%"),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Arimo-Bold",
                        fontSize: wp("3.5%"),
                        color: "#ffffff",
                      }}
                    >
                      {discountText}
                    </Text>
                  </View>
                </View>

                <View style={{ padding: wp("4%") }}>
                  {/* Description */}
                  <Text
                    style={{
                      fontFamily: "Arimo-Regular",
                      fontSize: wp("3.5%"),
                      color: "#6A7282",
                      lineHeight: hp("2.5%"),
                      marginBottom: hp("2%"),
                    }}
                  >
                    {offer.serviceOffer_Description}
                  </Text>

                  {/* Light Separator Line */}
                  <View
                    style={{
                      height: wp("0.25%"),
                      backgroundColor: "#EEDB9D",
                      marginBottom: hp("2%"),
                    }}
                  />

                  {/* Footer with Dates and Share Button */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1, marginRight: wp("2%") }}>
                      <Text
                        style={{
                          fontFamily: "Arimo-Medium",
                          fontSize: wp("3%"),
                          color: "#6A7282",
                          marginBottom: hp("0.25%"),
                        }}
                      >
                        Valid Until
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Arimo-Medium",
                          fontSize: wp("3.5%"),
                          color: "#111827",
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {formatDateRange(
                          offer.serviceOffer_StartDate,
                          offer.serviceOffer_EndDate
                        )}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Arimo-Regular",
                          fontSize: wp("2.5%"),
                          color: "#9CA3AF",
                          marginTop: hp("0.5%"),
                        }}
                      >
                        Offer #{offer.serviceOffer_ID}
                      </Text>
                    </View>

                    <Button
                      text="Share"
                      type="secondary"
                      size={"medium"}
                      onPress={() => handleShareOffer(offer)}
                    />
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Offers;
