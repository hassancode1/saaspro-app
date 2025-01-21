import React from "react";
import { View } from "react-native";

const SkeletonLoader = () => {
  return (
    <View className="w-full p-4 space-y-4">
      <View className="flex flex-row justify-between items-center mb-6">
        <View className="h-8 w-32 rounded-md bg-gray-200 animate-pulse" />
        <View className="h-8 w-24 rounded-md bg-gray-200 animate-pulse" />
      </View>

      <View className="h-12 w-full rounded-lg bg-gray-200 animate-pulse mb-6" />

      {[1, 2, 3].map((item) => (
        <View
          key={item}
          className="w-full rounded-lg bg-white p-4 shadow-sm space-y-3 mb-4"
        >
          <View className="flex flex-row justify-between items-center gap-4">
            <View className="h-6 w-28 rounded-md bg-gray-200 animate-pulse" />
            <View className="h-6 w-24 rounded-md bg-gray-200 animate-pulse" />
          </View>

          <View className="h-6 w-20 rounded-md bg-gray-200 animate-pulse" />

          <View className="space-y-10">
            <View className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <View className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
          </View>
        </View>
      ))}
    </View>
  );
};

export default SkeletonLoader;
