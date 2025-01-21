import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Play, Pause } from "lucide-react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";

type AudioRecording = {
  sound: Audio.Sound;
  duration: string;
  file: string;
};
type AudioProgressControlProps = {
  audioRecording: AudioRecording;
};

const AudioProgressControl: React.FC<AudioProgressControlProps> = ({
  audioRecording,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioRecording.file },
          { shouldPlay: false }
        );
        soundRef.current = sound;
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
        }
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);

            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        });
      } catch (error) {
        console.error("Error setting up audio", error);
      }

      return () => {
        if (soundRef.current) {
          soundRef.current.unloadAsync();
        }
      };
    };

    setupAudio();
  }, [audioRecording]);

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const onSliderValueChange = async (value: number) => {
    if (!soundRef.current) return;

    await soundRef.current.setPositionAsync(value);
    setPosition(value);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlContainer}>
        <TouchableOpacity
          onPress={togglePlayPause}
          style={styles.playPauseButton}
        >
          {isPlaying ? (
            <Pause color="white" size={24} />
          ) : (
            <Play color="white" size={24} />
          )}
        </TouchableOpacity>

        <View style={styles.sliderContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={onSliderValueChange}
            minimumTrackTintColor="#4630eb"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#4630eb"
          />

          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 16,
  },
  controlContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playPauseButton: {
    backgroundColor: "#4630eb",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
});

export default AudioProgressControl;
