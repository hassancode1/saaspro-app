import axios from "axios";
import { API_URL } from "@/context/AuthContext";
import Toast from "react-native-toast-message";

export const getNotes = async (visit_date: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/visits?visit_date=${visit_date}`
    );
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: error.response?.data || "Failed to fetch notes",
    });
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/me`);
    return response.data;
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: error.response?.data || "Failed to fetch notes",
    });
    throw error;
  }
};
