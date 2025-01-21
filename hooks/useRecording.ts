import { useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { Audio } from "expo-av";
import { API_URL } from "@/context/AuthContext";
import * as FileSystem from "expo-file-system";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AVPlaybackStatus } from "expo-av";
import "react-native-get-random-values";
import { Buffer } from "buffer";
import axios from "axios";

enum RecordingState {
  Initial = "initial",
  Recording = "recording",
  Paused = "paused",
  Review = "review",
}
type AudioRecording = {
  sound: Audio.Sound;
  duration: string;
  file: string;
};
interface UploadAudioParams {
  file: {
    type: string;
    uri: string | undefined;
    name: string;
  };
  patientId: string;
  visitDate: Date;
}

interface AudioApiPayload {
  visit_date: Date;
  patient_id: string;
  filename: string;
}

interface AudioStatus extends Omit<AVPlaybackStatus, "isLoaded"> {
  durationMillis: number;
  isLoaded: true;
}
const useRecording = () => {
  const [isUploading, setIsUploading] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>(
    RecordingState.Initial
  );
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<AudioRecording | null>(
    null
  );
  const [recordingDuration, setRecordingDuration] = useState<string>("0:00");
  const [audioIntensity, setAudioIntensity] = useState(0);
  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "Permission Denied",
          text1: "Sorry, we need microphone permissions to record.",
        });
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = newRecording.recording;
      setRecording(newRecording.recording);
      setRecordingState(RecordingState.Recording);

      newRecording.recording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording) {
          const normalizedIntensity = status.metering
            ? Math.min(Math.max((status.metering + 160) / 160, 0), 1)
            : 0;
          setAudioIntensity(normalizedIntensity);
          setRecordingDuration(
            getDurationFormatted(status.durationMillis || 0)
          );
        }
      });
    } catch (err) {
      console.error("Failed to start recording", err);
      Toast.show({
        type: "Recording Error",
        text1: "Could not start recording",
      });
    }
  }

  async function pauseRecording() {
    try {
      if (recording) {
        await recording.pauseAsync();
        setRecordingState(RecordingState.Paused);
      }
    } catch (err) {
      console.error("Failed to pause recording", err);
    }
  }

  async function resumeRecording() {
    try {
      if (recording) {
        await recording.startAsync();
        setRecordingState(RecordingState.Recording);
      }
    } catch (err) {
      console.error("Failed to resume recording", err);
    }
  }

  async function stopRecording() {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();

      const { sound, status } = await recording.createNewLoadedSoundAsync();

      const audioStatus = status as AudioStatus;

      const audioRecording: AudioRecording = {
        sound: sound,
        duration: getDurationFormatted(audioStatus.durationMillis || 0),
        file: recording?.getURI() || "",
      };

      setRecordedAudio(audioRecording);
      setRecording(null);
      setRecordingState(RecordingState.Review);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  }
  function getDurationFormatted(milliseconds: number) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  }

  const awsRegion = process.env.EXPO_PUBLIC_AWS_REGION;
  const awsAccessKeyId = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID as string;
  const awsSecretAccessKey = process.env
    .EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY as string;
  const uploadAudio = async ({
    file,
    patientId,
    visitDate,
  }: UploadAudioParams): Promise<void> => {
    const s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });
    setIsUploading(true);

    try {
      const fileContent = await FileSystem.readAsStringAsync(
        file.uri as string,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      const command = new PutObjectCommand({
        Bucket: "scribeaudios",
        Key: file.name,
        Body: Buffer.from(fileContent, "base64"),
        ContentType: "audio/mp4",
      });
      const response = await s3Client.send(command);
      const apiPayload: AudioApiPayload = {
        visit_date: visitDate,
        patient_id: patientId,
        filename: file.name,
      };
      const res = await axios.post(`${API_URL}/audio`, apiPayload);
      Toast.show({
        type: "success",
        text1: "Audio uploaded succesfully",
      });
    } catch (error) {
      console.error("Error uploading file or calling API:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    startRecording,
    stopRecording,
    resumeRecording,
    pauseRecording,
    audioIntensity,
    recordedAudio,
    recordingState,
    recordingDuration,
    uploadAudio,
    isUploading,
  };
};

export default useRecording;
