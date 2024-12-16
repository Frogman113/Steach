import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

export default function StartButtonScreen() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [convertedText, setConvertedText] = useState('');
  const [loading, setLoading] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.31.68:3000');

    ws.current.onopen = () => {};

    ws.current.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.text) {
          setConvertedText(response.text);
        } else if (response.error) {
          alert('텍스트 변환 실패');
        }
      } catch (error) {
        alert('텍스트 변환 오류 ', error);
      }
      setLoading(false);
    };

    ws.current.onerror = () => {
      setLoading(false);
    };

    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const permissionCheck = await Audio.requestPermissionsAsync();
      if (permissionCheck.status !== 'granted') {
        alert('마이크 권한이 필요');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const createRecording = new Audio.Recording();
      await createRecording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WAV,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          numberOfChannels: 1,
          sampleRate: 16000,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          numberOfChannels: 1,
          sampleRate: 16000,
        },
      });
      await createRecording.startAsync();

      setRecording(createRecording);
      setIsRecording(true);
    } catch (error) {
      alert('녹음 시작 불가 ', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        return;
      }

      await recording.stopAndUnloadAsync();
      const audioUri = recording.getURI();

      setRecording(null);
      setIsRecording(false);

      if (audioUri) {
        convertSpeechToText(audioUri);
      }
    } catch (error) {
      alert('녹음 중지 불가능');
    }
  };

  const handleRecordButton = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const convertSpeechToText = async (audioUri) => {
    try {
      setLoading(true);

      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket 미연결');
      }

      const audioresponse = await fetch(audioUri);
      const audioBinaryData = await audioresponse.arrayBuffer();

      ws.current.send(audioBinaryData);
    } catch (error) {
      alert('텍스트 변환 중 오류 ', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.startButtonContainer}>
      <TouchableOpacity onPress={handleRecordButton}>
        <MaterialIcons
          name="multitrack-audio"
          size={100}
          color={isRecording ? 'red' : 'black'}
        />
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="black" />}
      {convertedText ? (
        <Text style={styles.convertedTextShow}>{convertedText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  startButtonContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertedTextShow: {
    marginTop: 20,
    fontSize: 18,
    color: 'black',
  },
});
