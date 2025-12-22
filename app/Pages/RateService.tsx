import SvgStar from "@/assets/Icons/Star";
import Button from "@/components/Button";
import Header from "@/components/Header";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const RateService = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  // Service data (could be passed via navigation params)
  const service = {
    id: 1,
    serviceType: "Oil Change & Filter",
    date: "Nov 15, 2023",
    price: "$89.99",
    workshop: "Oil change",
  };

  const isSubmitDisabled = rating === 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Header title="Rate Service" goBack={true} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"), // 16px
          paddingVertical: hp("2%"), // 16px
          gap: hp("2%"), // 16px
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Card */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderWidth: wp("0.25%"), // 1px
            borderColor: "#E5E7EB",
            borderRadius: wp("2.5%"), // 10px
            padding: wp("3%"), // 12px
          }}
        >
          <View style={{ flexDirection: "row", gap: wp("3%") }}>
            {/* 12px */}
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
              </View>
            </View>
          </View>
        </View>

        {/* Rating Card */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderWidth: wp("0.25%"), // 1px
            borderColor: "#E5E7EB",
            borderRadius: wp("2.5%"), // 10px
            padding: wp("4%"), // 16px
          }}
        >
          <Text
            style={{
              fontFamily: "Arimo-Bold",
              fontSize: wp("4%"), // 16px
              marginBottom: hp("1.5%"), // 12px
            }}
          >
            How was your experience?
          </Text>

          {/* Star Rating */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: wp("2%"), // 8px
              marginBottom: hp("1%"), // 8px
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                onPressIn={() => setHoverRating(star)}
                onPressOut={() => setHoverRating(0)}
              >
                <SvgStar
                  width={wp("10%")} // 40px
                  height={wp("10%")} // 40px
                  fill={star <= (hoverRating || rating) ? "#F1C02C" : "#ffffff"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={{
              textAlign: "center",
              fontFamily: "Arimo-Medium",
              fontSize: wp("3%"), // 12px
              color: "#6A7282",
              marginTop: hp("0.5%"), // 4px
            }}
          >
            Tap to rate this service
          </Text>
        </View>

        {/* Feedback Card */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderWidth: wp("0.25%"), // 1px
            borderColor: "#E5E7EB",
            borderRadius: wp("2.5%"), // 10px
            padding: wp("4%"), // 16px
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: hp("1%"), // 8px
            }}
          >
            <Text
              style={{
                fontFamily: "Arimo-Bold",
                fontSize: wp("4%"), // 16px
                marginRight: wp("1%"), // 4px
              }}
            >
              Share your feedback
            </Text>
            <Text
              style={{
                fontFamily: "Arimo-Regular",
                fontSize: wp("3%"), // 12px
                color: "#6A7282",
              }}
            >
              (optional)
            </Text>
          </View>

          <TextInput
            style={{
              height: hp("12.5%"), // 100px
              borderWidth: wp("0.25%"), // 1px
              borderColor: "#E5E7EB",
              borderRadius: wp("2%"), // 8px
              padding: wp("3%"), // 12px
              fontFamily: "Arimo-Regular",
              fontSize: wp("3.5%"), // 14px
              color: "#111827",
              textAlignVertical: "top",
            }}
            placeholder="Tell us about your experience..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>

        {/* Submit Button */}
        <View style={{ marginTop: hp("1%") }}>
          {/* 8px */}
          <Button
            onPress={() => {
              // Handle submit review
              // router.back() or show success message
            }}
            text="Submit Review"
            type="primary"
            size="large"
            disabled={isSubmitDisabled}
            wrap={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default RateService;
