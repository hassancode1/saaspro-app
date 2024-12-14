import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";

interface Props {
  title: string;
  value: string;
  handleChangeText: (x: string) => void;
  placeholder?: string;
  otherStyles: string;
  keyboardType?: any;
}
const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  keyboardType,
  placeholder,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-neutral-900 font-psemibold">{title}</Text>
      <View
        className="border-2 border-gray-400
      w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row"
      >
        <TextInput
          className="flex-1 text-black font-psemibold text-large "
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          placeholderTextColor="#7b7b8b"
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {!showPassword ? <Eye color="black" /> : <EyeOff color="black" />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
