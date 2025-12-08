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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
          paddingHorizontal: wp("4%"), // Responsive (was 16)
          paddingTop: hp("1.5%"), // Responsive (was 12)
          paddingBottom: hp("2%"), // Responsive (was 16)
          borderBottomWidth: wp("0.25%"), // Responsive (was 1)
          borderBottomColor: "#E5E7EB",
        }}
      >
        {/* Search Input with Icon */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#ffffff",
            borderWidth: wp("0.25%"), // Responsive (was 1)
            borderColor: "#E5E7EB",
            borderRadius: wp("25%"), // Half of height for pill shape
            paddingHorizontal: wp("4%"), // Responsive (was 16)
            height: hp("6%"), // Responsive (was 48)
            marginBottom: hp("2%"), // Responsive (was 16)
          }}
        >
          <SvgSearch
            width={wp("5%")} // Responsive (was 20)
            height={wp("5%")} // Responsive (was 20)
            color="#9CA3AF"
          />
          <TextInput
            style={{
              flex: 1,
              paddingVertical: hp("1.5%"), // Responsive (was 12)
              paddingHorizontal: wp("3%"), // Responsive (was 12)
              fontSize: wp("4%"), // Responsive (was 16)
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
          style={{ marginBottom: hp("2%") }} // Responsive (was 16)
        >
          <View style={{ flexDirection: "row", gap: wp("2%") }}>
            {/* Responsive (was 8) */}
            {services.map((service) => (
              <Pressable
                key={service}
                style={{
                  paddingHorizontal: wp("4%"), // Responsive (was 16)
                  paddingVertical: hp("1%"), // Responsive (was 8)
                  backgroundColor:
                    selectedService === service ? "#EFBF2B" : "#ffffff",
                  borderRadius: wp("25%"), // Pill shape
                  borderWidth: wp("0.25%"), // Responsive (was 1)
                  borderColor:
                    selectedService === service ? "#EFBF2B" : "#E5E7EB",
                }}
                onPress={() => setSelectedService(service)}
              >
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"), // Responsive (was 14)
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
          <Text
            style={{
              fontFamily: "Arimo-Medium",
              fontSize: wp("4%"), // Responsive (was 16)
            }}
          >
            {mechanics.length} Mechanics Available
          </Text>
        </View>
      </View>

      {/* Mechanics List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"), // Responsive (was 16)
          paddingVertical: hp("2%"), // Responsive (was 16)
          gap: hp("1.5%"), // Responsive (was 12)
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mechanic Cards */}
        {mechanics.map((mechanic) => (
          <View
            key={mechanic.id}
            style={{
              padding: wp("4%"), // Responsive (was 16)
              backgroundColor: "#ffffff",
              borderRadius: wp("2.5%"), // Responsive (was 10)
              borderWidth: wp("0.25%"), // Responsive (was 1)
              borderColor: "#E5E7EB",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: wp("3%"), // Responsive (was 12)
                marginBottom: hp("1.5%"), // Responsive (was 12)
              }}
            >
              <View
                style={{
                  padding: wp("3%"), // Responsive (was 12)
                  backgroundColor: "#F3F4F6",
                  borderRadius: wp("2.5%"), // Responsive (was 10)
                }}
              >
                <Image
                  source={require("@/assets/images/key.png")}
                  style={{
                    width: wp("13%"), // Responsive (was 36)
                    height: wp("13%"), // Responsive (was 36)
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: hp("0.5%"), // Responsive (was 4)
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: wp("4%"), // Responsive (was 16)
                      }}
                    >
                      {mechanic.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: hp("0.25%"), // Responsive (was 2)
                      }}
                    >
                      <SvgStarIcon
                        width={wp("4%")} // Responsive (was 16)
                        height={wp("4%")} // Responsive (was 16)
                        color="#F59E0B"
                      />
                      <Text
                        style={{
                          fontFamily: "Arimo-Medium",
                          fontSize: wp("3.5%"), // Responsive (was 14)
                          color: "#111827",
                          marginLeft: wp("1%"), // Responsive (was 4)
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
                        fontSize: wp("4.5%"), // Responsive (was 18)
                        color: "#EFBF2B",
                      }}
                    >
                      {mechanic.price}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: hp("0.25%"), // Responsive (was 2)
                      }}
                    >
                      <View
                        style={{
                          width: wp("1.5%"), // Responsive (was 6)
                          height: wp("1.5%"), // Responsive (was 6)
                          borderRadius: wp("0.75%"), // Half of width
                          backgroundColor: mechanic.isAvailable
                            ? "#10B981"
                            : "#EF4444",
                          marginRight: wp("1%"), // Responsive (was 4)
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: "Arimo-Medium",
                          fontSize: wp("3.5%"), // Responsive (was 14)
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
                    marginTop: hp("0.5%"), // Responsive (was 4)
                  }}
                >
                  <SvgLocation
                    width={wp("3.5%")} // Responsive (was 14)
                    height={wp("3.5%")} // Responsive (was 14)
                    color="#6A7282"
                  />

                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("3.5%"), // Responsive (was 14)
                      color: "#111827",
                      marginLeft: wp("2%"), // Responsive (was 8)
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
                height: wp("0.25%"), // Responsive (was 1)
                backgroundColor: "#E5E7EB",
                marginVertical: hp("1.5%"), // Responsive (was 12)
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
