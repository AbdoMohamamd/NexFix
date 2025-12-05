import SvgInvoice from "@/assets/Icons/Invoice";
import SvgPhoto from "@/assets/Icons/Photo";
import SvgStar from "@/assets/Icons/Star";
import Button from "@/components/Button";
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
      {/* Header */}

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {servicesHistory.map((service) => (
          <View
            key={service.id}
            style={{
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 10,
              overflow: "hidden",
              padding: 12,
            }}
          >
            {/* Service Card Content */}
            <Pressable
              style={{
                flexDirection: "row",
                gap: 12,
                justifyContent: "space-between",
              }}
              onPress={() => {
                // Navigate to service details
              }}
            >
              {/* Left side with image */}
              <View
                style={{
                  padding: 12,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 10,
                  width: 60,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@/assets/images/key.png")}
                  style={{ width: 36, height: 36 }}
                />
              </View>

              {/* Middle section with service info */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Bold",
                    fontSize: 16,
                    marginBottom: 4,
                  }}
                >
                  {service.serviceType}
                </Text>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: 14,
                    color: "#6A7282",
                    marginBottom: 4,
                  }}
                >
                  {service.workshop}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: 12,
                      color: "#6A7282",
                    }}
                  >
                    {service.date}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#D1FAE5",
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: 10,
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
                    fontSize: 18,
                    color: "#F1C02C", // Changed to yellow
                  }}
                >
                  {service.price}
                </Text>
              </View>
            </Pressable>

            {/* Yellow Separator Line */}
            <View
              style={{
                height: 1,
                backgroundColor: "#F1C02C",
                marginVertical: 12,
              }}
            />

            {/* Invoice and Photos Section - Horizontal */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                marginBottom: 12,
              }}
            >
              {/* Invoice */}
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                onPress={() => {
                  // View invoice action
                }}
              >
                <SvgInvoice />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: 12,
                    color: "#6A7282",
                  }}
                >
                  Invoice
                </Text>
              </TouchableOpacity>

              {/* Photos */}
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                onPress={() => {
                  // View photos action
                }}
              >
                <SvgPhoto />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: 12,
                    color: "#6A7282",
                  }}
                >
                  Photos
                </Text>
              </TouchableOpacity>
            </View>

            {/* Buttons Section - Stacked vertically under Invoice/Photos */}
            <View style={{ gap: 8 }}>
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
              {/* Book Again Button */}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ServicesHistory;
