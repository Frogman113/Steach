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
import { WS_SERVER } from '@env';

export default function RecordingScreen({ route }) {
  const customerInfo = route.params?.customerInfo;

  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [clovaSttText, setClovaSttText] = useState('');
  const [openaiContext, setOpenaiContext] = useState('');
  const [loading, setLoading] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_SERVER);

    ws.current.onopen = () => {
      if (customerInfo) {
        ws.current.send(
          JSON.stringify({
            type: 'customerCardContext',
            customerInfo: customerInfo,
          }),
        );
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.clovaApiResult && response.openaiApiResult) {
          setClovaSttText(response.clovaApiResult);
          setOpenaiContext(response.openaiApiResult);

          if (response.audioData) {
            voicePlayResponse(response.audioData);
          }
        } else if (response.error) {
          alert('텍스트 변환 실패');
        }
      } catch (error) {
        alert('텍스트 변환 오류');
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
  }, [customerInfo]);

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
      alert('녹음 시작 불가');
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
      alert('녹음 중지 불가');
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
      alert('텍스트 변환 중 오류');
      setLoading(false);
    }
  };

  const voicePlayResponse = async (base64Audio) => {
    try {
      const voiceAudioUri = `data:audio/mp3;base64,${base64Audio}`;
      const voiceSound = new Audio.Sound();
      await voiceSound.loadAsync({ uri: voiceAudioUri });
      await voiceSound.playAsync();
    } catch (error) {
      alert('음성 재생 오류');
    }
  };

  return (
    <View style={styles.recordingContainer}>
      <TouchableOpacity onPress={handleRecordButton}>
        <MaterialIcons
          name="multitrack-audio"
          size={100}
          color={isRecording ? 'red' : 'black'}
        />
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="black" />}
      {clovaSttText ? (
        <View style={styles.textContainer}>
          <Text style={styles.label}>음성 인식 결과</Text>
          <Text style={styles.resultText}>{clovaSttText}</Text>
        </View>
      ) : null}
      {openaiContext ? (
        <View style={styles.textContainer}>
          <Text style={styles.label}>AI 답변</Text>
          <Text style={styles.resultText}>{openaiContext}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  recordingContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 30,
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  label: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: 'orange',
  },
  resultText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
