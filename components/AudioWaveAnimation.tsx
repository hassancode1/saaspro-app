import React from "react";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

const AudioWaveAnimation = () => {
  return (
    <View
      style={styles.container}
      className="opacity-1 border-gray-400 rounded-lg my-5  h-[100px]"
    >
      <LottieView
        source={require("@/assets/images/audiowave.json")}
        autoPlay
        loop
        style={styles.lottieAnimation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginTop: 50,
  },
  lottieAnimation: {
    width: 300,
    height: 200,
  },
});

export default AudioWaveAnimation;
