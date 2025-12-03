import { InfoBlockProps } from "@/assets/utils/Components/Types";
import React from "react";
import { StyleSheet, View } from "react-native";

const InfoBlock = ({ Icon }: InfoBlockProps) => {
  const backgroundColor = "#E9B924";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Icon color={"#ffffff"} width={28} height={28} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InfoBlock;
