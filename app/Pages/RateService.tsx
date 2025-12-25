import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// Icons
import SvgStar from "@/assets/Icons/Star";

// Components
import Button from "@/components/Button";
import Header from "@/components/Header";

// API & Auth
import { rateServiceAPI } from "@/assets/utils/Api/api";
import { useAuth } from "../Context/AuthProvider";

// Types
interface ServiceReview {
  serviceReview_ID: number;
  serviceReview_Date: string;
  serviceReview_Rating: number;
  serviceReviewServiceID: number;
  reviewAccount: number;
  serviceReview_Comment: string; // Now required based on API
}

const RateService = () => {
  const { user } = useAuth();
  const { serviceId, serviceTitle } = useLocalSearchParams();
  const numericServiceId = Number(serviceId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(""); // Changed from feedback to comment
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState<ServiceReview | null>(
    null
  );
  const [serviceDetails, setServiceDetails] = useState({
    id: numericServiceId,
    serviceType: (serviceTitle as string) || "Service",
    date: "Unknown Date",
    price: "$0.00",
    workshop: "Workshop",
  });

  // Fetch existing review when component loads
  useEffect(() => {
    const fetchExistingReview = async () => {
      if (!user?.accID || !numericServiceId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch existing reviews for this service
        const response = await rateServiceAPI.getServiceReviewByServiceID(
          numericServiceId
        );

        if (response.data.success && response.data.data?.reviews) {
          const reviews = response.data.data.reviews;

          // Find the user's review for this service
          const userReview = reviews.find(
            (review: ServiceReview) =>
              review.reviewAccount === user.accID &&
              review.serviceReviewServiceID === numericServiceId
          );

          if (userReview) {
            setExistingReview(userReview);
            setRating(userReview.serviceReview_Rating);
            setComment(userReview.serviceReview_Comment || "");

            // You might want to fetch service details here if needed
            // For now, we'll use the passed params
          }
        }
      } catch (error) {
        console.error("Error fetching review:", error);
        Alert.alert("Error", "Failed to load review data");
      } finally {
        setLoading(false);
      }
    };

    fetchExistingReview();
  }, [user?.accID, numericServiceId]);

  const handleSubmitReview = async () => {
    if (!user?.accID) {
      Alert.alert("Error", "Please login to submit a review");
      return;
    }

    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }

    if (!comment.trim()) {
      Alert.alert("Error", "Please add a comment for your review");
      return;
    }

    if (comment.trim().length < 10) {
      Alert.alert("Error", "Comment must be at least 10 characters long");
      return;
    }

    if (!numericServiceId) {
      Alert.alert("Error", "Invalid service ID");
      return;
    }

    try {
      setSubmitting(true);

      const reviewData = {
        serviceReview_Rating: rating,
        serviceReviewServiceID: numericServiceId,
        reviewAccount: user.accID,
        serviceReview_Comment: comment.trim(), // Required field
      };

      console.log("Submitting review:", reviewData);

      const response = await rateServiceAPI.addServiceReview(reviewData);
      console.log("Review response:", response.data);

      if (response.data.success) {
        Alert.alert(
          "Success",
          existingReview
            ? "Review updated successfully!"
            : "Thank you for your review!",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to submit review"
        );
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => {
      const StarIcon =
        star <= (hoverRating || rating) ? SvgStar : SvgStar;
      const starColor = star <= (hoverRating || rating) ? "#F1C02C" : "#E5E7EB";

      return (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          onPressIn={() => setHoverRating(star)}
          onPressOut={() => setHoverRating(0)}
          disabled={submitting}
          style={{ padding: wp("1%") }}
        >
          <StarIcon width={wp("10%")} height={wp("10%")} fill={starColor} />
        </TouchableOpacity>
      );
    });
  };

  const isSubmitDisabled =
    rating === 0 || !comment.trim() || comment.trim().length < 10 || submitting;

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <Header title="Rate Service" goBack={true} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#F1C02C" />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Header title="Rate Service" goBack={true} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp("4%"),
          paddingVertical: hp("2%"),
          gap: hp("2%"),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Card */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderWidth: wp("0.25%"),
            borderColor: "#E5E7EB",
            borderRadius: wp("2.5%"),
            padding: wp("3%"),
          }}
        >
          <View style={{ flexDirection: "row", gap: wp("3%") }}>
            {/* Left side with image */}
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

            {/* Middle section with service info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Arimo-Bold",
                  fontSize: wp("4%"),
                  marginBottom: hp("0.5%"),
                }}
              >
                {serviceDetails.serviceType}
              </Text>

              {existingReview && (
                <View
                  style={{
                    backgroundColor: "#D1FAE5",
                    alignSelf: "flex-start",
                    paddingHorizontal: wp("2%"),
                    paddingVertical: hp("0.5%"),
                    borderRadius: wp("1%"),
                    marginBottom: hp("0.5%"),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Arimo-Medium",
                      fontSize: wp("2.5%"),
                      color: "#065F46",
                    }}
                  >
                    You've already reviewed this service
                  </Text>
                </View>
              )}

              <Text
                style={{
                  fontFamily: "Arimo-Medium",
                  fontSize: wp("3.5%"),
                  color: "#6A7282",
                  marginBottom: hp("0.5%"),
                }}
              >
                {serviceDetails.workshop}
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
                  {serviceDetails.date}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rating Card */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderWidth: wp("0.25%"),
            borderColor: "#E5E7EB",
            borderRadius: wp("2.5%"),
            padding: wp("4%"),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: hp("1.5%"),
            }}
          >
            <Text
              style={{
                fontFamily: "Arimo-Bold",
                fontSize: wp("4%"),
              }}
            >
              {existingReview
                ? "Update your rating"
                : "How was your experience?"}
            </Text>

            {rating > 0 && (
              <Text
                style={{
                  fontFamily: "Arimo-Bold",
                  fontSize: wp("3.5%"),
                  color: "#F1C02C",
                  backgroundColor: "#FEF3C7",
                  paddingHorizontal: wp("2%"),
                  paddingVertical: hp("0.5%"),
                  borderRadius: wp("1%"),
                }}
              >
                {rating} {rating === 1 ? "star" : "stars"}
              </Text>
            )}
          </View>

          {/* Star Rating */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: wp("2%"),
              marginBottom: hp("1%"),
            }}
          >
            {renderStars()}
          </View>

          <Text
            style={{
              textAlign: "center",
              fontFamily: "Arimo-Medium",
              fontSize: wp("3%"),
              color: "#6A7282",
              marginTop: hp("0.5%"),
            }}
          >
            {existingReview
              ? "Tap to update your rating"
              : "Tap to rate this service"}
          </Text>
        </View>

        {/* Comment Card - Now required */}
        <View
          style={{
            backgroundColor: "#ffffff",
            borderWidth: wp("0.25%"),
            borderColor:
              comment.trim().length < 10 && comment.length > 0
                ? "#EF4444"
                : "#E5E7EB",
            borderRadius: wp("2.5%"),
            padding: wp("4%"),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: hp("1%"),
            }}
          >
            <Text
              style={{
                fontFamily: "Arimo-Bold",
                fontSize: wp("4%"),
                marginRight: wp("1%"),
              }}
            >
              Share your feedback
            </Text>
            <Text
              style={{
                fontFamily: "Arimo-Regular",
                fontSize: wp("3%"),
                color: "#6A7282",
              }}
            >
              (required)
            </Text>
          </View>

          <TextInput
            style={{
              height: hp("12.5%"),
              borderWidth: wp("0.25%"),
              borderColor:
                comment.trim().length < 10 && comment.length > 0
                  ? "#EF4444"
                  : "#E5E7EB",
              borderRadius: wp("2%"),
              padding: wp("3%"),
              fontFamily: "Arimo-Regular",
              fontSize: wp("3.5%"),
              color: "#111827",
              textAlignVertical: "top",
            }}
            placeholder="Tell us about your experience... (Minimum 10 characters)"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            editable={!submitting}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: hp("1%"),
            }}
          >
            {comment.trim().length < 10 && comment.length > 0 && (
              <Text
                style={{
                  fontFamily: "Arimo-Regular",
                  fontSize: wp("3%"),
                  color: "#EF4444",
                }}
              >
                Comment must be at least 10 characters
              </Text>
            )}

            <Text
              style={{
                fontFamily: "Arimo-Regular",
                fontSize: wp("3%"),
                color: comment.trim().length < 10 ? "#EF4444" : "#9CA3AF",
              }}
            >
              {comment.length}/500 characters
            </Text>
          </View>
        </View>

        {/* Validation Summary */}
        {isSubmitDisabled && (
          <View
            style={{
              backgroundColor: "#FEF2F2",
              borderWidth: wp("0.25%"),
              borderColor: "#FCA5A5",
              borderRadius: wp("2%"),
              padding: wp("3%"),
            }}
          >
            <Text
              style={{
                fontFamily: "Arimo-Medium",
                fontSize: wp("3.5%"),
                color: "#DC2626",
              }}
            >
              To submit your review:
            </Text>
            <View style={{ marginTop: hp("0.5%") }}>
              {rating === 0 && (
                <Text
                  style={{
                    fontFamily: "Arimo-Regular",
                    fontSize: wp("3%"),
                    color: "#DC2626",
                  }}
                >
                  • Select a star rating
                </Text>
              )}
              {!comment.trim() && (
                <Text
                  style={{
                    fontFamily: "Arimo-Regular",
                    fontSize: wp("3%"),
                    color: "#DC2626",
                  }}
                >
                  • Add a comment
                </Text>
              )}
              {comment.trim().length < 10 && comment.length > 0 && (
                <Text
                  style={{
                    fontFamily: "Arimo-Regular",
                    fontSize: wp("3%"),
                    color: "#DC2626",
                  }}
                >
                  • Comment must be at least 10 characters (currently{" "}
                  {comment.trim().length})
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Submit Button */}
        <View style={{ marginTop: hp("1%") }}>
          {submitting ? (
            <View style={{ alignItems: "center" }}>
              <ActivityIndicator size="large" color="#F1C02C" />
            </View>
          ) : (
            <Button
              onPress={handleSubmitReview}
              text={existingReview ? "Update Review" : "Submit Review"}
              type="primary"
              size="large"
              disabled={isSubmitDisabled}
              wrap={false}
            />
          )}
        </View>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ alignItems: "center", marginTop: hp("1%") }}
          disabled={submitting}
        >
          <Text
            style={{
              fontFamily: "Arimo-Medium",
              fontSize: wp("3.5%"),
              color: "#6A7282",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RateService;
