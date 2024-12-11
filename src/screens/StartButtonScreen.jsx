import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

export default function StartButtonScreen() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      const permissionCheck = await Audio.requestPermissionsAsync();
      if (permissionCheck.status !== 'granted') {
        alert('마이크 권한이 필요합니다.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const createRecording = new Audio.Recording();
      await createRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.LOW_QUALITY,
      );
      await createRecording.startAsync();

      setRecording(createRecording);
      setIsRecording(true);
    } catch (error) {
      alert('녹음을 시작 불가', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        return;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setRecording(null);
      setIsRecording(false);
    } catch (error) {
      alert('녹음 중지 불가능');
    }
  };

  const onRecordButton = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.StartButtonContainer}>
      <TouchableOpacity onPress={onRecordButton}>
        <MaterialIcons
          name="multitrack-audio"
          size={100}
          color={isRecording ? 'red' : 'black'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  StartButtonContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  StartButtonContainerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
