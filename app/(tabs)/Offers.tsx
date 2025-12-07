import Button from "@/components/Button";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
          paddingHorizontal: wp("4%"), // 16px
          paddingVertical: hp("2%"), // 16px
          borderBottomWidth: wp("0.25%"), // 1px
          borderBottomColor: "#E5E7EB",
        }}
      >
        <Text
          style={{
            fontSize: wp("5%"), // 20px
            fontFamily: "Arimo-Bold",
          }}
        >
          Offers & Rewards
        </Text>
        <Text
          style={{
            fontSize: wp("3.5%"), // 14px
            fontFamily: "Arimo-Regular",
            color: "#6A7282",
            marginTop: hp("0.5%"), // 4px
          }}
        >
          Promotions and rewards for our valued customers
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"), // 16px
          paddingVertical: hp("2%"), // 16px
          gap: hp("2%"), // 16px
          backgroundColor: "#FFF9E6",
        }}
        showsVerticalScrollIndicator={false}
      >
        {offers.map((offer) => (
          <View
            key={offer.id}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: wp("3%"), // 12px
              borderWidth: wp("0.25%"), // 1px
              borderColor: "#F4C430",
              overflow: "hidden",
              padding: wp("3%"), // 12px
            }}
          >
            <View style={{ padding: wp("4%"), paddingTop: 0 }}>
              <View style={{ marginBottom: hp("1.5%") }}>
                {/* 12px */}
                <Text
                  style={{
                    fontFamily: "Arimo-Bold",
                    fontSize: wp("4.5%"), // 18px
                    marginBottom: hp("1%"), // 8px
                  }}
                >
                  {offer.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "Arimo-Regular",
                    fontSize: wp("3.5%"), // 14px
                    color: "#6A7282",
                    lineHeight: hp("2.5%"), // 20px
                  }}
                >
                  {offer.description}
                </Text>
              </View>

              {/* Light Yellow Line */}
              <View
                style={{
                  height: wp("0.25%"), // 1px
                  backgroundColor: "#eedb9dff",
                  marginVertical: hp("1.5%"), // 12px
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
                      fontSize: wp("3%"), // 12px
                      color: "#6A7282",
                      marginBottom: hp("0.25%"), // 2px
                    }}
                  >
                    Expires
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("3.5%"), // 14px
                      color: "#111827",
                    }}
                  >
                    {offer.expires}
                  </Text>
                </View>

                <Button
                  text="Redeem"
                  type="secondary"
                  size={"medium"}
                  onPress={() => {}}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Offers;
