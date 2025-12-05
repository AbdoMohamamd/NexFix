import SvgLocation from "@/assets/Icons/Location";
import SvgSearch from "@/assets/Icons/Search";
import SvgStarIcon from "@/assets/Icons/StarIcon";
import Button from "@/components/Button";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Book = () => {
  const [selectedService, setSelectedService] = useState("All Services");
  const [searchText, setSearchText] = useState("");

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

  const mechanics = [
    {
      id: 1,
      name: "Quick Fix Auto",
      rating: "4.8 (120)",
      distance: "2.5 km",
      price: "$54",
      isAvailable: true,
    },
    {
      id: 2,
      name: "Precision Auto Care",
      rating: "4.9 (95)",
      distance: "3.2 km",
      price: "$68",
      isAvailable: true,
    },
    {
      id: 3,
      name: "City Mechanics",
      rating: "4.7 (210)",
      distance: "5.1 km",
      price: "$45",
      isAvailable: false,
    },
    {
      id: 4,
      name: "Express Repair Hub",
      rating: "4.6 (87)",
      distance: "1.8 km",
      price: "$72",
      isAvailable: true,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* White Header Section */}
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        {/* Search Input with Icon */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#ffffff",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 100,
            paddingHorizontal: 16,
            height: 48,
            marginBottom: 16,
          }}
        >
          <SvgSearch width={20} height={20} color="#9CA3AF" />
          <TextInput
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 12,
              fontSize: 16,
              fontFamily: "Arimo-Regular",
            }}
            placeholder="Search services or mechanics"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Services Filter Buttons - Scrollable Horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          <View style={{ flexDirection: "row", gap: 8 }}>
            {services.map((service) => (
              <Pressable
                key={service}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor:
                    selectedService === service ? "#EFBF2B" : "#ffffff",
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor:
                    selectedService === service ? "#EFBF2B" : "#E5E7EB",
                }}
                onPress={() => setSelectedService(service)}
              >
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: 14,
                    color: selectedService === service ? "#000000" : "#374151",
                  }}
                >
                  {service}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Mechanics Count */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: "Arimo-Medium", fontSize: 16 }}>
            {mechanics.length} Mechanics Available
          </Text>
        </View>
      </View>

      {/* Mechanics List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mechanic Cards */}
        {mechanics.map((mechanic) => (
          <View
            key={mechanic.id}
            style={{
              padding: 16,
              backgroundColor: "#ffffff",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
              <View
                style={{
                  padding: 12,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 10,
                }}
              >
                <Image
                  source={require("@/assets/images/key.png")}
                  style={{ width: 36, height: 36 }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 4,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: 16,
                      }}
                    >
                      {mechanic.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
                      <SvgStarIcon width={16} height={16} color="#F59E0B" />
                      <Text
                        style={{
                          fontFamily: "Arimo-Medium",
                          fontSize: 14,
                          color: "#111827",
                          marginLeft: 4,
                        }}
                      >
                        {mechanic.rating}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontFamily: "Arimo-Bold",
                        fontSize: 18,
                        color: "#EFBF2B",
                      }}
                    >
                      {mechanic.price}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: mechanic.isAvailable
                            ? "#10B981"
                            : "#EF4444",
                          marginRight: 4,
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: "Arimo-Medium",
                          fontSize: 14,
                          color: mechanic.isAvailable ? "#10B981" : "#EF4444",
                        }}
                      >
                        {mechanic.isAvailable ? "Available" : "Not available"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <SvgLocation width={14} height={14} color="#6A7282" />

                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: 14,
                      color: "#111827",
                      marginLeft: 8,
                    }}
                  >
                    {mechanic.distance}
                  </Text>
                </View>
              </View>
            </View>

            {/* Separator Line */}
            <View
              style={{
                height: 1,
                backgroundColor: "#E5E7EB",
                marginVertical: 12,
              }}
            />

            {/* Action Button */}
            <Button
              onPress={() => console.log("Book Now pressed")}
              text="Book Now"
              wrap={false}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Book;
