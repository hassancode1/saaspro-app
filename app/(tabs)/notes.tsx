import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Search, Calendar, FileText } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import moment from "moment";
import { getNotes } from "@/hooks/services";
import SkeletonLoader from "@/components/SkeletonLoader";
import NoteDetailModal from "@/components/NotesComponent";

interface Note {
  notes: VisitNote[];
}

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

function Notes() {
  const [showPicker, setShowPicker] = useState(false);
  const [notes, setNotes] = useState<Note | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    return moment().format("YYYY-MM-DD");
  });

  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<VisitNote | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openNoteModal = (note: VisitNote) => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  useEffect(() => {
    loadNotes();
  }, [selectedDate]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes(selectedDate);
      setNotes(data);
    } finally {
      setLoading(false);
    }
  };

  const toggleDatePicker = () => {
    setShowPicker((currentState) => !currentState);
  };
  const onChangeDate = (event: { type: string }, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      toggleDatePicker();
      if (event.type === "set" && selectedDate) {
        setDate(selectedDate);
        setSelectedDate(moment(selectedDate).format("YYYY-MM-DD"));
      }
    } else {
      if (event.type === "set" && selectedDate) {
        setTempDate(selectedDate); // Only update temp date for iOS
      }
    }
  };

  const handleConfirmIOS = () => {
    setDate(tempDate);
    setSelectedDate(moment(tempDate).format("YYYY-MM-DD"));
    toggleDatePicker();
  };

  const EmptyState = () => (
    <View className="flex items-center justify-center mt-20 mx-auto">
      <FileText size={64} color="#9CA3AF" />
      <Text className="text-xl font-semibold text-gray-700 mt-4">
        No recordings found
      </Text>
      <Text className="text-gray-500 text-center mt-2 max-w-xs">
        There are no recordings for the selected date. Try selecting a different
        date or create a new recording.
      </Text>
    </View>
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1  bg-white h-[100%]">
      <ScrollView className="flex-1 mt-[2rem]">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <View className="px-8 pb-20">
            <Text className="text-2xl font-semibold">Recordings</Text>

            <View className="space-y-2 mt-3">
              <View className="flex-row gap-2">
                <View className="flex-1 bg-gray-100 h-16 px-4 rounded-2xl items-center flex-row-reverse">
                  <TextInput
                    className="flex-1 text-black font-semibold text-large"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search Recordings"
                    placeholderTextColor="#7b7b8b"
                  />
                  <Search color="gray" />
                </View>

                <TouchableOpacity
                  className="bg-gray-100 h-16 w-16 rounded-2xl items-center justify-center"
                  onPress={toggleDatePicker}
                >
                  <Calendar color="gray" />
                </TouchableOpacity>
              </View>

              <Text className="text-gray-500 text-sm mt-">
                Showing results for {formatDate(selectedDate)}
              </Text>
            </View>

            {showPicker && Platform.OS === "ios" && (
              <View className="bg-white rounded-t-xl absolute z-[1000px] p-5 top-[100px] left-0 right-0">
                <View className="flex-row justify-between px-4 py-2 b">
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
                  value={date}
                  onChange={onChangeDate}
                  maximumDate={new Date()}
                  className="h-[120px]"
                />
              </View>
            )}

            {showPicker && Platform.OS === "android" && (
              <DateTimePicker
                mode="date"
                display="default"
                value={date}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            {notes?.notes.length === 0 ? (
              <EmptyState />
            ) : (
              <View className="h-full mb-[100px]">
                {notes?.notes.map((note) => (
                  <TouchableOpacity
                    key={note.visits_note_id}
                    onPress={() => openNoteModal(note)}
                    className="border border-gray-300 rounded-lg p-5 mt-9  flex flex-col gap-3"
                  >
                    <View className="flex-row justify-betwreen items-start">
                      <View>
                        <Text className="font-semibold text-lg">
                          {note.patient_id}
                        </Text>
                        <Text className="text-gray-400 text-sm mt-1">
                          {formatDate(note.visit_date)}
                        </Text>
                      </View>

                      <View
                        className={`
                        px-3 py-1 rounded-full
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

                    <Text className="text-gray-500">
                      {note.transcript.slice(0, 200) || "N/A"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <NoteDetailModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        note={selectedNote}
      />
    </SafeAreaView>
  );
}

export default Notes;
