import React, { useRef, useEffect } from "react";
import { Text, TouchableOpacity, Animated, View } from "react-native";
import { Loader2 } from "lucide-react-native";

interface Props {
  title: string;
  handlePress: () => void;
  containerStyles: string;
  textStyles?: string;
  isLoading: boolean;
}

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: Props) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      const spin = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spin.start();

      return () => spin.stop();
    }
  }, [isLoading, spinAnim]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center flex-row ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      {isLoading ? (
        <View className="flex-row items-center">
          <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
            <Loader2 color="white" size={24} />
          </Animated.View>
        </View>
      ) : (
        <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
