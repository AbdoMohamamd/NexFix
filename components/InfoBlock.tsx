import { InfoBlockProps } from "@/assets/utils/Components/Types";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const InfoBlock = ({ Icon }: InfoBlockProps) => {
  const backgroundColor = "#E9B924";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Icon
        color={"#ffffff"}
        width={wp("7%")} // Responsive icon width (was 28)
        height={wp("7%")} // Responsive icon height (was 28)
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: wp("2%"), // Responsive padding (was 8)
    borderRadius: wp("2%"), // Responsive border radius (was 8)
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InfoBlock;
