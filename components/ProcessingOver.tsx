import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Check } from "lucide-react-native";
import { RecordingState } from "@/hooks/useRecording";

interface ProcessingOverlayProps {
  recordingState: RecordingState;
  uploading: boolean;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  recordingState,
  uploading,
}) => {
  if (
    recordingState !== "transcribing" &&
    recordingState !== "summarizing" &&
    recordingState !== "completed"
  ) {
    return null;
  }

  return (
    <View className="bg-gray-100 rounded-md p-2 mt-4 items-center justify-center">
      <Check size={40} color="#22C55E" className="mb-4" />

      <Text className="text-lg font-semibold mb-2">
        Check status in All Notes
      </Text>

      <Text className="text-center text-gray-600 mb-4 px-4">
        May take a while for transcription and summarization generation to
        finish
      </Text>

      {uploading && (
        <View className="w-full px-8 mt-4">
          <View className="w-full bg-blue-600 rounded-md py-3 px-4 flex-row items-center justify-center">
            <Text className="text-white font-medium mr-2">Uploading...</Text>
            <ActivityIndicator size="small" color="white" />
          </View>
        </View>
      )}
    </View>
  );
};

export default ProcessingOverlay;
