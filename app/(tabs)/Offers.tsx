import Button from "@/components/Button";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Offers = () => {
  const offers = [
    {
      id: 1,
      title: "20% Off Oil Change",
      description:
        "Get 20% discount on full synthetic oil change service at any participating workshop.",
      expires: "Dec 31, 2025",
    },
    {
      id: 2,
      title: "Free Tire Change",
      description:
        "Refer a friend to any workshop and get a free tire change service for your vehicle.",
      expires: "Nov 15, 2025",
    },
    {
      id: 3,
      title: "Brake Service Discount",
      description:
        "50% off on brake pad replacement and rotor inspection. Limited time offer.",
      expires: "Oct 30, 2025",
    },
    {
      id: 4,
      title: "Free AC Check",
      description:
        "Complimentary AC system check and diagnostics with any service purchase.",
      expires: "Jan 15, 2026",
    },
    {
      id: 5,
      title: "Engine Tune-up Special",
      description:
        "Get 30% off complete engine diagnostics and tune-up package.",
      expires: "Nov 30, 2025",
    },
    {
      id: 6,
      title: "Referral Bonus",
      description:
        "Earn $10 credit for every friend you refer who books a service.",
      expires: "Ongoing",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Arimo-Bold",
          }}
        >
          Offers & Rewards
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Arimo-Regular",
            color: "#6A7282",
            marginTop: 4,
          }}
        >
          Promotions and rewards for our valued customers
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          gap: 16,
          backgroundColor: "#FFF9E6",
        }}
        showsVerticalScrollIndicator={false}
      >
        {offers.map((offer) => (
          <View
            key={offer.id}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#F4C430",
              overflow: "hidden",
              padding:12
            }}
          >
            <View style={{ padding: 16, paddingTop: 0 }}>
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Bold",
                    fontSize: 18,
                    marginBottom: 8,
                  }}
                >
                  {offer.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "Arimo-Regular",
                    fontSize: 14,
                    color: "#6A7282",
                    lineHeight: 20,
                  }}
                >
                  {offer.description}
                </Text>
              </View>

              {/* Light Yellow Line */}
              <View
                style={{
                  height: 1,
                  backgroundColor: "#eedb9dff",
                  marginVertical: 12,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: 12,
                      color: "#6A7282",
                      marginBottom: 2,
                    }}
                  >
                    Expires
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: 14,
                      color: "#111827",
                    }}
                  >
                    {offer.expires}
                  </Text>
                </View>

                <Button text="Redeem" type="secondary" size={"medium"} onPress={()=>{}}/>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Offers;
