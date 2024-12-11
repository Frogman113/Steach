import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

export default function StartButtonScreen() {
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
    } catch (error) {
      alert('마이크 권한이 없습니다', error);
    }
  };

  return (
    <View style={styles.StartButtonContainer}>
      <TouchableOpacity onPress={startRecording}>
        <MaterialIcons name="multitrack-audio" size={100} color="black" />
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
