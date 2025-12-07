import SvgInvoice from "@/assets/Icons/Invoice";
import SvgPhoto from "@/assets/Icons/Photo";
import SvgStar from "@/assets/Icons/Star";
import Button from "@/components/Button";
import Header from "@/components/Header";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const ServicesHistory = () => {
  // Sample service history data
  const servicesHistory = [
    {
      id: 1,
      serviceType: "Oil Change & Filter",
      date: "Nov 15, 2023",
      completedWork: "Completed",
      price: "$89.99",
      workshop: "AutoCare Center",
    },
    {
      id: 2,
      serviceType: "Brake Pad ",
      date: "Oct 28, 2023",
      completedWork: "Completed",
      price: "$245.50",
      workshop: "Quick Fix Garage",
    },
    {
      id: 3,
      serviceType: "Tire Rotation",
      date: "Sep 10, 2023",
      completedWork: "Completed",
      price: "$45.00",
      workshop: "Tire Masters",
    },
    {
      id: 4,
      serviceType: "AC Service",
      date: "Aug 22, 2023",
      completedWork: "Completed",
      price: "$120.00",
      workshop: "Cool Air Auto",
    },
    {
      id: 5,
      serviceType: "Engine Diagnostics",
      date: "Jul 15, 2023",
      completedWork: "Completed",
      price: "$75.00",
      workshop: "Precision Mechanics",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Header title="Services History" goBack={true} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"), // 16px
          paddingVertical: hp("2%"), // 16px
          gap: hp("1.5%"), // 12px
        }}
        showsVerticalScrollIndicator={false}
      >
        {servicesHistory.map((service) => (
          <View
            key={service.id}
            style={{
              backgroundColor: "#ffffff",
              borderWidth: wp("0.25%"), // 1px
              borderColor: "#E5E7EB",
              borderRadius: wp("2.5%"), // 10px
              overflow: "hidden",
              padding: wp("3%"), // 12px
            }}
          >
            {/* Service Card Content */}
            <Pressable
              style={{
                flexDirection: "row",
                gap: wp("3%"), // 12px
                justifyContent: "space-between",
              }}
              onPress={() => {
                // Navigate to service details
              }}
            >
              {/* Left side with image */}
              <View
                style={{
                  padding: wp("3%"), // 12px
                  backgroundColor: "#F3F4F6",
                  borderRadius: wp("2.5%"), // 10px
                  width: wp("15%"), // 60px
                  height: wp("15%"), // 60px
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@/assets/images/key.png")}
                  style={{
                    width: wp("9%"), // 36px
                    height: wp("9%"), // 36px
                  }}
                />
              </View>

              {/* Middle section with service info */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Bold",
                    fontSize: wp("4%"), // 16px
                    marginBottom: hp("0.5%"), // 4px
                  }}
                >
                  {service.serviceType}
                </Text>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"), // 14px
                    color: "#6A7282",
                    marginBottom: hp("0.5%"), // 4px
                  }}
                >
                  {service.workshop}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: wp("2%"), // 8px
                    marginBottom: hp("0.5%"), // 4px
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("3%"), // 12px
                      color: "#6A7282",
                    }}
                  >
                    {service.date}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#D1FAE5",
                      paddingHorizontal: wp("2%"), // 8px
                      paddingVertical: hp("0.25%"), // 2px
                      borderRadius: wp("1%"), // 4px
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: wp("2.5%"), // 10px
                        color: "#065F46",
                      }}
                    >
                      {service.completedWork}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right side with price - Changed to yellow */}
              <View
                style={{
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Arimo-Bold",
                    fontSize: wp("4.5%"), // 18px
                    color: "#F1C02C",
                  }}
                >
                  {service.price}
                </Text>
              </View>
            </Pressable>

            {/* Yellow Separator Line */}
            <View
              style={{
                height: wp("0.25%"), // 1px
                backgroundColor: "#F1C02C",
                marginVertical: hp("1.5%"), // 12px
              }}
            />

            {/* Invoice and Photos Section - Horizontal */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: wp("5%"), // 20px
                marginBottom: hp("1.5%"), // 12px
              }}
            >
              {/* Invoice */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: wp("1.5%"),
                }} // 6px
                onPress={() => {
                  // View invoice action
                }}
              >
                <SvgInvoice width={wp("5%")} height={wp("5%")} /> {/* 20px */}
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"), // 12px
                    color: "#6A7282",
                  }}
                >
                  Invoice
                </Text>
              </TouchableOpacity>

              {/* Photos */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: wp("1.5%"),
                }} // 6px
                onPress={() => {
                  // View photos action
                }}
              >
                <SvgPhoto width={wp("5%")} height={wp("5%")} /> {/* 20px */}
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"), // 12px
                    color: "#6A7282",
                  }}
                >
                  Photos
                </Text>
              </TouchableOpacity>
            </View>

            {/* Buttons Section - Stacked vertically under Invoice/Photos */}
            <View style={{ gap: hp("1%") }}>
              {/* 8px */}
              {/* Rate Button */}
              <Button
                onPress={() => {}}
                text="Book again"
                type="primary"
                size="small"
                wrap={false}
              />
              <Button
                onPress={() => {
                  router.navigate("/Pages/RateService");
                }}
                text="Rate"
                type="secondary"
                size="small"
                wrap={false}
                Icon={SvgStar}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ServicesHistory;
