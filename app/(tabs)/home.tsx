import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { Mic, Pause, StopCircleIcon, Play } from "lucide-react-native";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/form-field";
import { Dropdown } from "react-native-element-dropdown";
import AudioProgressControl from "@/components/AudioControlProgress";
import { RecordingState } from "@/hooks/useRecording";
import ProcessingOverlay from "@/components/ProcessingOver";
import AudioWaveAnimation from "@/components/AudioWaveAnimation";
import useRecording from "@/hooks/useRecording";
import moment from "moment";

type Template = {
  label: string;
  value: string;
};

const Home = () => {
  const {
    recordedAudio,
    recordingState,
    pauseRecording,
    resumeRecording,
    startRecording,
    stopRecording,
    recordingDuration,
    uploadAudio,
    isUploading,
  } = useRecording();
  const [form, setForm] = useState({
    patientName: "",
    template: "",
    date: new Date(),
  });

  const [showPicker, setShowPicker] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const toggleDatePicker = () => {
    setShowPicker((currentState) => !currentState);
  };

  const onChangeDate = (event: { type: string }, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate;
      setForm({ ...form, date: currentDate });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  const handleConfirmIOS = () => {
    setForm({ ...form, date: form.date });
    toggleDatePicker();
  };

  const templates: Template[] = [
    { label: "Patient Assessment", value: "assessment" },
    { label: "Consultation Report", value: "consultation" },
    { label: "Treatment Plan", value: "treatment" },
    { label: "Follow-up Note", value: "followup" },
  ];
  const saveAndContinue = async () => {
    const { patientName, template, date } = form;
    if (!patientName.trim()) {
      Toast.show({
        type: "error",
        text1: `Name is Required`,
      });
      return;
    }
    if (!template) {
      Toast.show({
        type: "error",
        text1: `Please select a template`,
      });
      return;
    }
    const timestamp = new Date().toISOString();
    const filename = `recordings/${patientName}/${date.toISOString()}/${timestamp}.m4a`;
    const file = {
      name: filename,
      type: "audio/mp4",
      uri: recordedAudio?.file,
    };

    await uploadAudio({
      file: file,
      patientId: patientName,
      visitDate: moment(date).format("YYYY-MM-DD"),
    });
  };

  const renderRecordingButton = () => {
    switch (recordingState) {
      case RecordingState.Initial:
        return (
          <TouchableOpacity
            className="bg-black mt-8 rounded-xl min-h-[50px] justify-center items-center flex-row"
            onPress={startRecording}
          >
            <View>
              <Mic color="white" />
            </View>
            <Text className="text-white font-bold ml-4 text-[1.1rem]">
              Start Recording
            </Text>
          </TouchableOpacity>
        );
      case RecordingState.Recording:
        return (
          <View>
            <AudioWaveAnimation />
            <View className="flex-row justify-between mt-8">
              <TouchableOpacity
                className="bg-[#FFC801] rounded-xl min-h-[50px] flex-1 mr-2 justify-center items-center flex-row"
                onPress={pauseRecording}
              >
                <View>
                  <Pause color="white" />
                </View>
                <Text className="text-white font-bold ml-4 text-[1.1rem]">
                  Pause
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-700 rounded-xl min-h-[50px] flex-1 ml-2 justify-center items-center flex-row"
                onPress={stopRecording}
              >
                <View>
                  <StopCircleIcon color="white" />
                </View>
                <Text className="text-white font-bold ml-4 text-[1.1rem]">
                  Stop
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case RecordingState.Paused:
        return (
          <View className="flex-row justify-between mt-8">
            <TouchableOpacity
              className="bg-[#00D180] rounded-xl min-h-[50px] flex-1 mr-2 justify-center items-center flex-row"
              onPress={resumeRecording}
            >
              <View>
                <Play color="white" />
              </View>
              <Text className="text-white font-bold ml-4 text-[1.1rem]">
                Resume
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-700 rounded-xl min-h-[50px] flex-1 ml-2 justify-center items-center flex-row"
              onPress={stopRecording}
            >
              <View>
                <StopCircleIcon color="white" />
              </View>
              <Text className="text-white font-bold ml-4 text-[1.1rem]">
                Stop
              </Text>
            </TouchableOpacity>
          </View>
        );
      case RecordingState.Review:
        return (
          <View className="mt-7">
            {recordedAudio && (
              <AudioProgressControl audioRecording={recordedAudio} />
            )}
            <View className="flex-row justify-between mt-8">
              <TouchableOpacity
                className="bg-black rounded-xl min-h-[50px] flex-1 ml-2 justify-center items-center flex-row"
                onPress={saveAndContinue}
              >
                <Text className="text-white font-bold  ml-4 text-[1.1rem]">
                  {isUploading ? "Uploading " : "Save & Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case RecordingState.Completed:
        return (
          <TouchableOpacity
            className="bg-green-500 text-white  mt-8 rounded-xl min-h-[50px] justify-center items-center flex-row"
            onPress={startRecording}
          >
            <View>
              <Mic color="white" />
            </View>
            <Text className="text-white font-bold ml-4 text-[1.1rem]">
              Record New Session
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };
  return (
    <SafeAreaView className="p-7 mt-[-1rem] bg-white h-[100vh]">
      <View>
        <FormField
          title="Patient Name"
          value={form.patientName}
          handleChangeText={(e) => setForm({ ...form, patientName: e })}
          otherStyles="mt-2"
          placeholder="Enter Patient Name"
        />

        <Text className="mt-7">Clinical Template</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={templates}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select Template" : "..."}
          searchPlaceholder="Search..."
          value={form.template}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item: Template) => {
            setForm({ ...form, template: item.value });
            setIsFocus(false);
          }}
        />

        <Text className="mt-5">Date</Text>
        <TouchableOpacity onPress={toggleDatePicker}>
          <TextInput
            style={styles.dropdown}
            value={formatDate(form.date)}
            placeholder="Select Date"
            editable={false}
            onPressIn={toggleDatePicker}
          />
        </TouchableOpacity>

        {showPicker && Platform.OS === "ios" && (
          <View className="bg-white rounded-t-xl  ">
            <View className="flex-row justify-between px-4 py-2 border-b border-gray-200">
              <TouchableOpacity onPress={toggleDatePicker}>
                <Text className="text-blue-500 text-base">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmIOS}>
                <Text className="text-blue-500 font-semibold text-base">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              mode="date"
              display="spinner"
              value={form.date}
              onChange={onChangeDate}
              maximumDate={new Date()}
              className="h-[120px] "
            />
          </View>
        )}

        {showPicker && Platform.OS === "android" && (
          <DateTimePicker
            mode="date"
            display="default"
            value={form.date}
            onChange={onChangeDate}
            maximumDate={new Date()}
            className="h-[120px] mt-[-10]"
          />
        )}
        {recordingState !== "initial" ? null : (
          <View className="mt-5 flex flex-col gap-3">
            <Text className="font-bold text-xl">Instructions</Text>
            <Text>1. Enter patient name and select template</Text>
            <Text>
              2 .Click record and start dictating or speaking with patient
            </Text>
            <Text>3. Stop recording to begin processing note</Text>
          </View>
        )}

        <ProcessingOverlay
          uploading={isUploading}
          recordingState={recordingState}
        />
        {renderRecordingButton()}
        {recordingState !== "initial" && recordingState !== "completed" && (
          <Text className="mt-4 text-center font-medium text-xl">
            Recording Duration: {recordingDuration}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#533483",
    padding: 16,
    justifyContent: "center",
    alignContent: "center",
  },
  dropdown: {
    height: 50,
    borderColor: "#d1d5db",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
