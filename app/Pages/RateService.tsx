import SvgStar from "@/assets/Icons/Star";
import Button from "@/components/Button";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        {/* Service Card */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 10,
            padding: 12,
          }}
        >
          <View style={{ flexDirection: "row", gap: 12 }}>
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
              </View>
            </View>

            {/* Right side with price */}
          </View>
        </View>

        {/* Rating Card */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <Text
            style={{ fontFamily: "Arimo-Bold", fontSize: 16, marginBottom: 12 }}
          >
            How was your experience?
          </Text>

          {/* Star Rating */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              marginBottom: 8,
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
                  width={40}
                  height={40}
                  fill={star <= (hoverRating || rating) ? "#F1C02C" : "#ffffff"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={{
              textAlign: "center",
              fontFamily: "Arimo-Medium",
              fontSize: 12,
              color: "#6A7282",
              marginTop: 4,
            }}
          >
            Tap to rate this service
          </Text>
        </View>

        {/* Feedback Card */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{ fontFamily: "Arimo-Bold", fontSize: 16, marginRight: 4 }}
            >
              Share your feedback
            </Text>
            <Text
              style={{
                fontFamily: "Arimo-Regular",
                fontSize: 12,
                color: "#6A7282",
              }}
            >
              (optional)
            </Text>
          </View>

          <TextInput
            style={{
              height: 100,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 8,
              padding: 12,
              fontFamily: "Arimo-Regular",
              fontSize: 14,
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
        <View style={{ marginTop: 8 }}>
          <Button
            onPress={() => {
              // Handle submit review
              console.log("Rating:", rating);
              console.log("Feedback:", feedback);
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
