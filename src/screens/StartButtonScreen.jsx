import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { CLOVA_SECRET_KEY } from '@env';

export default function StartButtonScreen() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [convertedText, setconvertedText] = useState('');
  const [loading, setLoading] = useState(false);

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
      alert('녹음을 시작할 수 없습니다: ' + error.message);
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

      const audioresponse = await fetch(audioUri);
      const audioBinaryData = await audioresponse.arrayBuffer();

      const clovaApiResponse = await fetch(
        'https://clovaspeech-gw.ncloud.com/recog/v1/stt?lang=Kor',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'X-CLOVASPEECH-API-KEY': CLOVA_SECRET_KEY,
            'X-CLOVASPEECH-LANGUAGE': 'ko',
          },
          body: audioBinaryData,
        },
      );

      const convertedTextResult = await clovaApiResponse.json();

      if (clovaApiResponse.ok && convertedTextResult.text) {
        setconvertedText(convertedTextResult.text);
      } else {
        alert('텍스트 변환 실패');
      }
    } catch (error) {
      alert('텍스트 변환 중 오류: ', error.message);
    } finally {
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  convertedTextShow: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});
