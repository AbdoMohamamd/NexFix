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
  serviceReview_Comment: string;
}

const RateService = () => {
  const { user } = useAuth();
  const { serviceId, serviceTitle } = useLocalSearchParams();
  const numericServiceId = Number(serviceId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
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

  const [autoCommentApplied, setAutoCommentApplied] = useState(false);

  // Auto-comment suggestions based on star rating
  const getAutoComment = (stars: number): string => {
    switch (stars) {
      case 1:
        return "Very poor service. Needs major improvement.";
      case 2:
        return "Below average. Could be much better.";
      case 3:
        return "Average service. Met basic expectations.";
      case 4:
        return "Good service. Satisfied with the experience.";
      case 5:
        return "Excellent service! Highly recommended.";
      default:
        return "";
    }
  };

  // When rating changes, auto-fill comment if it's empty or if it's the same as a previous auto-comment
  useEffect(() => {
    if (rating > 0 && !existingReview) {
      const autoComment = getAutoComment(rating);

      // Only auto-fill if comment is empty or already contains an auto-comment
      if (!comment.trim() || autoCommentApplied) {
        setComment(autoComment);
        setAutoCommentApplied(true);
      }
    }
  }, [rating, existingReview]);

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
            setAutoCommentApplied(false); // Don't auto-apply for existing reviews
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

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleCommentChange = (text: string) => {
    setComment(text);
    // If user starts typing manually, don't auto-apply anymore
    if (autoCommentApplied && text !== getAutoComment(rating)) {
      setAutoCommentApplied(false);
    }
  };

  const handleClearComment = () => {
    setComment("");
    setAutoCommentApplied(false);
  };

  const handleSubmitReview = async () => {
    if (!user?.accID) {
      Alert.alert("Error", "Please login to submit a review");
      return;
    }

    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }

    if (!numericServiceId) {
      Alert.alert("Error", "Invalid service ID");
      return;
    }

    try {
      setSubmitting(true);

      if (existingReview) {
        // UPDATE existing review
        const updateData = {
          serviceReview_ID: existingReview.serviceReview_ID,
          serviceReview_Rating: rating,
          serviceReview_Comment: comment.trim(),
          serviceReview_Date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
        };

        console.log("Updating review:", updateData);
        const response = await rateServiceAPI.updateServiceReview(updateData);
        console.log("Update response:", response.data);

        if (response.data.success) {
          Alert.alert("Success", "Review updated successfully!", [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
        } else {
          Alert.alert(
            "Error",
            response.data.message || "Failed to update review"
          );
        }
      } else {
        // CREATE new review
        const createData = {
          serviceReview_Rating: rating,
          serviceReviewServiceID: numericServiceId,
          reviewAccount: user.accID,
          serviceReview_Comment: comment.trim(), // Can be empty string
        };

        console.log("Creating new review:", createData);
        const response = await rateServiceAPI.addServiceReview(createData);
        console.log("Create response:", response.data);

        if (response.data.success) {
          Alert.alert("Success", "Thank you for your review!", [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
        } else {
          Alert.alert(
            "Error",
            response.data.message || "Failed to submit review"
          );
        }
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
      const StarIcon = star <= (hoverRating || rating) ? SvgStar : SvgStar;
      const starColor = star <= (hoverRating || rating) ? "#F1C02C" : "#E5E7EB";

      return (
        <TouchableOpacity
          key={star}
          onPress={() => handleRatingChange(star)}
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

  const isSubmitDisabled = rating === 0 || submitting;

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
                    flexDirection: "row",
                    alignItems: "center",
                    gap: wp("2%"),
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#D1FAE5",
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
                  <Text
                    style={{
                      fontFamily: "Arimo-Regular",
                      fontSize: wp("2.5%"),
                      color: "#6A7282",
                    }}
                  >
                    • Last updated: {existingReview.serviceReview_Date}
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
              <View style={{ alignItems: "flex-end" }}>
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
                {!existingReview && rating > 0 && rating < 3 && (
                  <Text
                    style={{
                      fontFamily: "Arimo-Regular",
                      fontSize: wp("2.5%"),
                      color: "#DC2626",
                      marginTop: hp("0.25%"),
                    }}
                  >
                    Poor experience
                  </Text>
                )}
              </View>
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

        {/* Comment Card - Optional */}
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
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: hp("1%"),
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                (optional)
              </Text>
            </View>

            {comment.trim() && (
              <TouchableOpacity
                onPress={handleClearComment}
                disabled={submitting}
              >
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"),
                    color: "#EF4444",
                  }}
                >
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Auto-comment suggestion */}
          {autoCommentApplied && rating > 0 && (
            <View
              style={{
                backgroundColor: "#F0FDF4",
                borderWidth: wp("0.25%"),
                borderColor: "#86EFAC",
                borderRadius: wp("2%"),
                padding: wp("3%"),
                marginBottom: hp("1%"),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: hp("0.5%"),
                }}
              >
                <Text style={{ fontSize: wp("4%"), marginRight: wp("2%") }}>
                  💡
                </Text>
                <Text
                  style={{
                    fontFamily: "Arimo-Medium",
                    fontSize: wp("3%"),
                    color: "#065F46",
                  }}
                >
                  Suggested comment based on your {rating}-star rating
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Arimo-Regular",
                  fontSize: wp("3%"),
                  color: "#166534",
                }}
              >
                Feel free to edit or delete this suggestion
              </Text>
            </View>
          )}

          <TextInput
            style={{
              height: hp("12.5%"),
              borderWidth: wp("0.25%"),
              borderColor: "#E5E7EB",
              borderRadius: wp("2%"),
              padding: wp("3%"),
              fontFamily: "Arimo-Regular",
              fontSize: wp("3.5%"),
              color: "#111827",
              textAlignVertical: "top",
            }}
            placeholder="Tell us about your experience... (optional)"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={handleCommentChange}
            editable={!submitting}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: hp("1%"),
            }}
          >
            {rating > 0 && !comment.trim() && (
              <Text
                style={{
                  fontFamily: "Arimo-Regular",
                  fontSize: wp("3%"),
                  color: "#6A7282",
                  fontStyle: "italic",
                }}
              >
                No comment added. You can submit with just the rating.
              </Text>
            )}

            <Text
              style={{
                fontFamily: "Arimo-Regular",
                fontSize: wp("3%"),
                color: comment.length > 500 ? "#EF4444" : "#9CA3AF",
              }}
            >
              {comment.length}/500 characters
            </Text>
          </View>
        </View>

        {/* Validation Summary */}
        {isSubmitDisabled && rating === 0 && (
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
              <Text
                style={{
                  fontFamily: "Arimo-Regular",
                  fontSize: wp("3%"),
                  color: "#DC2626",
                }}
              >
                • Select a star rating (required)
              </Text>
              <Text
                style={{
                  fontFamily: "Arimo-Regular",
                  fontSize: wp("3%"),
                  color: "#6A7282",
                  marginTop: hp("0.25%"),
                }}
              >
                • Comment is optional
              </Text>
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
