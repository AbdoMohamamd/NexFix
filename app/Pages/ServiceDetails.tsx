import SvgClock from "@/assets/Icons/Clock";
import SvgLocation from "@/assets/Icons/Location";
import SvgStarIcon from "@/assets/Icons/StarIcon";
import React from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

const ServiceDetails = () => {
  const workshop = {
    id: 1,
    name: "Quick Fix Auto",
    location: "Al Quoz, Dubai",
    rating: "4.8 (120)",
    distance: "2.5 km",
  };

  const services = [
    {
      id: 1,
      title: "Oil Change",
      description: "Full synthetic oil change with filter replacement",
      date: "Oct 15, 2025 • 10:00 AM",
      price: "$54",
    },
    {
      id: 2,
      title: "Tire Change",
      description: "Replace all 4 tires with alignment check",
      date: "Oct 12, 2025 • 2:30 PM",
      price: "$120",
    },
    {
      id: 3,
      title: "Brake Service",
      description: "Brake pad replacement and rotor inspection",
      date: "Oct 8, 2025 • 9:00 AM",
      price: "$85",
    },
    {
      id: 4,
      title: "Engine Tune-up",
      description: "Complete engine diagnostics and tune-up",
      date: "Sep 28, 2025 • 11:00 AM",
      price: "$150",
    },
    {
      id: 5,
      title: "AC Repair",
      description: "AC system recharge and leak check",
      date: "Sep 20, 2025 • 3:00 PM",
      price: "$75",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header with workshop info */}
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              padding: 12,
              backgroundColor: "#F3F4F6",
              borderRadius: 10,
            }}
          >
            <Image
              source={require("@/assets/images/key.png")}
              style={{ width: 48, height: 48 }}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Arimo-Medium",
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              {workshop.name}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 2,
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
                {workshop.rating}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <SvgLocation width={14} height={14} color="#6A7282" />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: 14,
                    color: "#6A7282",
                    marginLeft: 4,
                  }}
                >
                  {workshop.location}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Services Section */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Arimo-Bold",
            marginBottom: 8,
          }}
        >
          Your Services
        </Text>

        {services.map((service) => (
          <Pressable
            key={service.id}
            style={{
              padding: 16,
              backgroundColor: "#ffffff",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
            onPress={() => console.log(`Pressed service ${service.id}`)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: 16,
                    marginBottom: 4,
                  }}
                >
                  {service.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "Arimo-Regular",
                    fontSize: 14,
                    color: "#6A7282",
                  }}
                >
                  {service.description}
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: "Arimo-Bold",
                  fontSize: 18,
                  color: "#EFBF2B",
                  marginLeft: 12,
                }}
              >
                {service.price}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <SvgClock width={14} height={14} color="#6A7282" />
              <Text
                style={{
                  fontFamily: "Arimo-Medium",
                  fontSize: 14,
                  color: "#6A7282",
                  marginLeft: 6,
                }}
              >
                {service.date}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceDetails;
