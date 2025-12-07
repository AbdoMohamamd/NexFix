import SvgAngleRight from "@/assets/Icons/AngleRight";
import SvgClock from "@/assets/Icons/Clock";
import SvgLocation from "@/assets/Icons/Location";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabOneScreen() {
  const workshops = [
    {
      id: 1,
      name: "Quick Fix Auto",
      location: "Al Quoz, Dubai",
      lastVisit: "Sep 15, 2025",
    },
    {
      id: 2,
      name: "Precision Auto Care",
      location: "Business Bay, Dubai",
      lastVisit: "Oct 5, 2025",
    },
    {
      id: 3,
      name: "City Mechanics",
      location: "Deira, Dubai",
      lastVisit: "Sep 28, 2025",
    },
    {
      id: 4,
      name: "Express Repair Hub",
      location: "Jumeirah, Dubai",
      lastVisit: "Oct 12, 2025",
    },
    {
      id: 5,
      name: "Master Garage",
      location: "Al Barsha, Dubai",
      lastVisit: "Sep 20, 2025",
    },
    {
      id: 6,
      name: "Auto Solutions",
      location: "Motor City, Dubai",
      lastVisit: "Oct 8, 2025",
    },
    {
      id: 7,
      name: "Pro Fix Workshop",
      location: "Silicon Oasis, Dubai",
      lastVisit: "Sep 25, 2025",
    },
    {
      id: 8,
      name: "Reliable Auto Care",
      location: "Bur Dubai, Dubai",
      lastVisit: "Oct 1, 2025",
    },
  ];

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          gap: wp("1%"), // 4px
          alignItems: "center",
          paddingHorizontal: wp("4%"), // 16px
          paddingVertical: hp("1.5%"), // 12px
        }}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          style={{
            width: wp("17.5%"), // 70px
            height: wp("17.5%"), // 70px
          }}
        />
        <Text
          style={{
            fontSize: wp("4.5%"), // 18px
            fontFamily: "Arimo-Bold",
          }}
        >
          Dashboard
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#EFBF2B",
          padding: wp("4%"), // 16px
        }}
      >
        <Text
          style={{
            fontSize: wp("4%"), // 16px
            fontFamily: "Arimo-Bold",
          }}
        >
          Welcome Back, Ayman!
        </Text>
        <Text
          style={{
            fontSize: wp("3.5%"), // 14px
            fontFamily: "Arimo-Regular",
            marginTop: hp("0.5%"), // 2px
          }}
        >
          Here are your previous workshops
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"), // 16px
          gap: wp("2%"), // 8px
          paddingBottom: hp("22%"), // 150px
          paddingTop: hp("2%"), // 16px
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: wp("4.5%"), // 18px
            fontFamily: "Arimo-Bold",
            marginBottom: hp("1%"), // 8px
          }}
        >
          Your Workshop
        </Text>

        {workshops.map((workshop) => (
          <Pressable
            key={workshop.id}
            style={{
              padding: wp("4%"), // 16px
              backgroundColor: "#ffffff",
              flexDirection: "row",
              gap: wp("2%"), // 8px
              borderWidth: wp("0.25%"), // 1px
              borderColor: "#E5E7EB",
              borderRadius: wp("2.5%"), // 10px
              justifyContent: "space-between",
            }}
            onPress={() => {
              router.navigate("/Pages/ServiceDetails");
            }}
          >
            <View style={{ flexDirection: "row", gap: wp("2%") }}>
              <View
                style={{
                  padding: wp("3%"), // 12px
                  backgroundColor: "#F3F4F6",
                  borderRadius: wp("2.5%"), // 10px
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
              <View >
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("4%"), // 16px
                  }}
                >
                  {workshop.name}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: hp("0.5%"), // 2px
                  }}
                >
                  <SvgLocation
                    width={wp("3.5%")} // 14px
                    height={wp("3.5%")} // 14px
                  />
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("3.5%"), // 14px
                      color: "#6A7282",
                      marginLeft: wp("1%"), // 4px
                    }}
                  >
                    {workshop.location}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: hp("0.5%"), // 2px
                  }}
                >
                  <SvgClock
                    width={wp("3%")} // 12px
                    height={wp("3%")} // 12px
                  />
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("3%"), // 12px
                      color: "#6A7282",
                      marginLeft: wp("1%"), // 4px
                    }}
                  >
                    Last visit: {workshop.lastVisit}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <SvgAngleRight
                height={wp("6%")} // 24px
                width={wp("6%")} // 24px
                color="#99A1AF"
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
