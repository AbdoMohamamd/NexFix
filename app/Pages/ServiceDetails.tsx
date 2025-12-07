import SvgClock from "@/assets/Icons/Clock";
import SvgLocation from "@/assets/Icons/Location";
import SvgStarIcon from "@/assets/Icons/StarIcon";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

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
      price: "$75",}
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header with workshop info */}
      <View
        style={{
          backgroundColor: "#ffffff",
          paddingHorizontal: wp('4%'), // 16px
          paddingVertical: hp('2%'), // 16px
          borderBottomWidth: wp('0.25%'), // 1px
          borderBottomColor: "#E5E7EB",
        }}
      >
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center", 
          gap: wp('3%') // 12px
        }}>
          <View
            style={{
              padding: wp('3%'), // 12px
              backgroundColor: "#F3F4F6",
              borderRadius: wp('2.5%'), // 10px
            }}
          >
            <Image
              source={require("@/assets/images/key.png")}
              style={{ 
                width: wp('12%'), // 48px
                height: wp('12%') // 48px
              }}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "Arimo-Medium",
                fontSize: wp('4.5%'), // 18px
                marginBottom: hp('0.5%'), // 4px
              }}
            >
              {workshop.name}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: hp('0.25%'), // 2px
              }}
            >
              <SvgStarIcon 
                width={wp('4%')} // 16px
                height={wp('4%')} // 16px
                color="#F59E0B" 
              />
              <Text
                style={{
                  fontFamily: "Arimo-Medium",
                  fontSize: wp('3.5%'), // 14px
                  color: "#111827",
                  marginLeft: wp('1%'), // 4px
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
                <SvgLocation 
                  width={wp('3.5%')} // 14px
                  height={wp('3.5%')} // 14px
                  color="#6A7282" 
                />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp('3.5%'), // 14px
                    color: "#6A7282",
                    marginLeft: wp('1%'), // 4px
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
          paddingHorizontal: wp('4%'), // 16px
          paddingVertical: hp('2%'), // 16px
          gap: hp('1.5%'), // 12px
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: wp('4.5%'), // 18px
            fontFamily: "Arimo-Bold",
            marginBottom: hp('1%'), // 8px
          }}
        >
          Your Services
        </Text>

        {services.map((service) => (
          <Pressable
            key={service.id}
            style={{
              padding: wp('4%'), // 16px
              backgroundColor: "#ffffff",
              borderRadius: wp('2.5%'), // 10px
              borderWidth: wp('0.25%'), // 1px
              borderColor: "#E5E7EB",
            }}
            onPress={() => console.log(`Pressed service ${service.id}`)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: hp('1%'), // 8px
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp('4%'), // 16px
                    marginBottom: hp('0.5%'), // 4px
                  }}
                >
                  {service.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "Arimo-Regular",
                    fontSize: wp('3.5%'), // 14px
                    color: "#6A7282",
                  }}
                >
                  {service.description}
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: "Arimo-Bold",
                  fontSize: wp('4.5%'), // 18px
                  color: "#EFBF2B",
                  marginLeft: wp('3%'), // 12px
                }}
              >
                {service.price}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: hp('1%'), // 8px
              }}
            >
              <SvgClock 
                width={wp('3.5%')} // 14px
                height={wp('3.5%')} // 14px
                color="#6A7282" 
              />
              <Text
                style={{
                  fontFamily: "Arimo-Medium",
                  fontSize: wp('3.5%'), // 14px
                  color: "#6A7282",
                  marginLeft: wp('1.5%'), // 6px
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