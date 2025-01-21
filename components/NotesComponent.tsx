import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { X, Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import moment from "moment";

type VisitNote = {
  visit_date: string;
  notes: string;
  createdAt: string;
  provider: string;
  note_status: "completed" | "pending" | "in-progress";
  transcription_job_name: string;
  transcript: string;
  patient_id: string;
  visits_note_id: string;
};

interface NoteDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  note: VisitNote | null;
}

const NoteDetailModal = ({
  isVisible,
  onClose,
  note,
}: NoteDetailModalProps) => {
  const formatDate = (date: string) => {
    return moment(date).format("MMM D, YYYY");
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("Copied", `${field} copied to clipboard`);
    } catch (error) {
      Alert.alert("Error", "Failed to copy text");
    }
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <TouchableOpacity
      onPress={() => copyToClipboard(text, field)}
      className="p-2 rounded-full bg-gray-100"
    >
      <Copy size={16} color="gray" />
    </TouchableOpacity>
  );

  if (!note) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-3/4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-semibold">Note Details</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1">
            <View className="space-y-4">
              <View>
                <Text className="text-lg font-semibold mt-1">
                  {note.patient_id}
                </Text>
              </View>

              <View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-500 text-sm">Visit Date</Text>
                  <Text className="text-lg mt-1">
                    {formatDate(note.visit_date)}
                  </Text>
                </View>
              </View>

              <View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-500 text-sm">Provider</Text>
                  <Text className="text-lg mt-1">{note.provider || "N/A"}</Text>
                </View>
              </View>

              <View>
                <Text className="text-gray-500 text-sm">Status</Text>
                <View
                  className={`
                    px-3 py-1 rounded-full self-start mt-1
                    ${
                      note.note_status === "completed"
                        ? "bg-green-100"
                        : note.note_status === "pending"
                        ? "bg-yellow-100"
                        : "bg-blue-100"
                    }
                  `}
                >
                  <Text
                    className={`
                      text-sm font-medium
                      ${
                        note.note_status === "completed"
                          ? "text-green-700"
                          : note.note_status === "pending"
                          ? "text-yellow-700"
                          : "text-blue-700"
                      }
                    `}
                  >
                    {note.note_status}
                  </Text>
                </View>
              </View>

              <View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-500 text-sm">Notes</Text>
                  <CopyButton text={note.notes || "N/A"} field="Transcript" />
                </View>
                <Text className="text-lg mt-1">{note.notes || "N/A"}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default NoteDetailModal;
