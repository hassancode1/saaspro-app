import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/form-field";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { isLoginin, onLogin } = useAuth();

  const handleLogin = () => {
    if (!form.email || !form.password) {
      Toast.show({
        type: "error",
        text1: "Please fill in all the details",
      });
      return;
    }
    onLogin!(form.email, form.password);
  };
  return (
    <SafeAreaView className=" h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <View className="flex justify-center items-center">
            <Image
              source={require("@/assets/images/saasprologo.png")}
              resizeMode="contain"
              className="w-[300px] h-[60px] "
            />
          </View>
          <Text className="text-2xl text-center  text-neutral-800 text-semibold mt-10 font-semibold">
            Sign In to Saaspro Health
          </Text>

          <FormField
            value={form.email}
            title="Email"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter Email"
          />
          <FormField
            value={form.password}
            title="Password"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            placeholder="Enter Password"
          />
          <CustomButton
            title="Sign In"
            handlePress={handleLogin}
            containerStyles="mt-7 "
            isLoading={isLoginin as boolean}
            textStyles="text-white font-bold text-2xl"
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-purple-700 underline font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/"
              className="text-lg font-psemibold underline text-purple-700"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
