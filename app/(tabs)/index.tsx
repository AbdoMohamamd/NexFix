import SvgAngleRight from "@/assets/Icons/AngleRight";
import SvgClock from "@/assets/Icons/Clock";
import SvgLocation from "@/assets/Icons/Location";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
          gap: 4,
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          width={70}
          height={70}
          style={{ width: 70, height: 70 }}
        />
        <Text>Dashboard</Text>
      </View>
      <View style={{ backgroundColor: "#EFBF2B", padding: 16 }}>
        <Text style={{ fontSize: 16, fontFamily: "Arimo-Bold" }}>
          Welcome Back, Ayman!
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Arimo-Regular" }}>
          Here are your previous workshops
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
          paddingBottom: 150,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 18, fontFamily: "Arimo-Bold" }}>
          Your Workshop
        </Text>

        {workshops.map((workshop) => (
          <Pressable
            key={workshop.id}
            style={{
              padding: 16,
              backgroundColor: "#ffffff",
              flexDirection: "row",
              gap: 8,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 10,
              justifyContent: "space-between",
            }}
            onPress={() => {
              router.navigate("/Pages/ServiceDetails");
            }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View
                style={{
                  padding: 12,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 10,
                }}
              >
                <Image
                  source={require("@/assets/images/key.png")}
                  width={36}
                  height={36}
                  style={{ width: 36, height: 36 }}
                />
              </View>
              <View>
                <Text style={{ fontFamily: "Arimo-Medium", fontSize: 16 }}>
                  {workshop.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <SvgLocation width={14} height={14} />
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: 14,
                      color: "#6A7282",
                    }}
                  >
                    {workshop.location}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <SvgClock width={12} height={12} />
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: 12,
                      color: "#6A7282",
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
              <SvgAngleRight height={24} width={24} color={"#99A1AF"} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
