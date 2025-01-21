import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UsersRound } from "lucide-react-native";
import React from "react";

interface User {
  email: string;
  username: string;
}
interface Props {
  currentUser: User | null;
}
const Header = ({ currentUser }: Props) => {
  return (
    <SafeAreaView>
      <View className=" flex-row items-center justify-end gap-2 px-9 mt-6 ">
        <View className="w-12 h-12 rounded-full bg-[#0454F0] items-center p-4 justify-center">
          <UsersRound color="#fff" />
        </View>
        <Text>{currentUser?.username}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Header;
