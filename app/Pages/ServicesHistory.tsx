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
          paddingHorizontal: wp("4%"),
          paddingVertical: hp("2%"),
          gap: hp("1.5%"),
        }}
        showsVerticalScrollIndicator={false}
      >
        {servicesHistory.map((service) => (
          <View
            key={service.id}
            style={{
              backgroundColor: "#ffffff",
              borderWidth: wp("0.25%"),
              borderColor: "#E5E7EB",
              borderRadius: wp("2.5%"),
              overflow: "hidden",
              padding: wp("3%"),
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                gap: wp("3%"),
                justifyContent: "space-between",
              }}
              onPress={() => {}}
            >
              <View
                style={{
                  padding: wp("3%"),
                  backgroundColor: "#F3F4F6",
                  borderRadius: wp("2.5%"),
                  width: wp("15%"),
                  height: wp("15%"),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("@/assets/images/key.png")}
                  style={{
                    width: wp("9%"),
                    height: wp("9%"),
                  }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Arimo-Bold",
                    fontSize: wp("4%"),
                    marginBottom: hp("0.5%"),
                  }}
                >
                  {service.serviceType}
                </Text>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3.5%"),
                    color: "#6A7282",
                    marginBottom: hp("0.5%"),
                  }}
                >
                  {service.workshop}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: wp("2%"),
                    marginBottom: hp("0.5%"),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("3%"),
                      color: "#6A7282",
                    }}
                  >
                    {service.date}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#D1FAE5",
                      paddingHorizontal: wp("2%"),
                      paddingVertical: hp("0.25%"),
                      borderRadius: wp("1%"),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Arimo-Medium",
                        fontSize: wp("2.5%"),
                        color: "#065F46",
                      }}
                    >
                      {service.completedWork}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Arimo-Bold",
                    fontSize: wp("4.5%"),
                    color: "#F1C02C",
                  }}
                >
                  {service.price}
                </Text>
              </View>
            </Pressable>

            <View
              style={{
                height: wp("0.25%"),
                backgroundColor: "#F1C02C",
                marginVertical: hp("1.5%"),
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: wp("5%"),
                marginBottom: hp("1.5%"),
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: wp("1.5%"),
                }}
                onPress={() => {}}
              >
                <SvgInvoice width={wp("5%")} height={wp("5%")} />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"),
                    color: "#6A7282",
                  }}
                >
                  Invoice
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: wp("1.5%"),
                }}
                onPress={() => {}}
              >
                <SvgPhoto width={wp("5%")} height={wp("5%")} />
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"),
                    color: "#6A7282",
                  }}
                >
                  Photos
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: hp("1%") }}>
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
