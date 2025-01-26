import { StyleSheet, Text, View } from "react-native";
import { Tabs, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/hooks/services";
import { useAuth } from "@/context/AuthContext";
import {  LucideIcon } from "lucide-react-native";
import TabBar from "@/components/TabBar";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
type TabIconProps = {
  Icon: LucideIcon;
  color: string;
  name: string;
  focused: boolean;
};

// const TabIcon = ({ Icon, color, name, focused }: TabIconProps) => {
//   return (
//     <View className="flex items-center justify-center gap-2 mt-5 w-16">
//       <Icon color={color} />
//       <Text
//         className={`${focused ? "font-bold" : "font-pregular"} text-md`}
//         style={{ color: color }}
//       >
//         {name}
//       </Text>
//     </View>
//   );
// };
interface User {
  email: string;
  username: string;
}
const TabsLayout = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { authState } = useAuth();
  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUser();
      setCurrentUser(data);
    } finally {
      setLoading(false);
    }
  };
  if (!authState?.authenticated) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header currentUser={currentUser}/>
      {/* <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#0454F0",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "none",
            borderTopWidth: 1,
            // borderTopColor: "#232533",
            paddingTop: 10,
            height: 90,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                Icon={Home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: "Notes",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                Icon={Notebook}
                color={color}
                name="Notes"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs> */}

      <Tabs
        tabBar={(props) => (
          <TabBar
            state={props.state}
            descriptors={props.descriptors}
            navigation={props.navigation}
          />
        )}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            title: "Notes",
            headerShown: false,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;

