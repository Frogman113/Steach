import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Audio } from 'expo-av';
import { WS_SERVER } from '@env';
import { RecordWaveButton } from '../components/RecordWaveButton';

export default function RecordingScreen({ navigation, route }) {
  const customerInfo = route.params?.customerInfo;

  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [whisperSttText, setWhisperSttText] = useState('');
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

        if (response.openaiApiResult) {
          setWhisperSttText(response.sttText);
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
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
          sampleRate: 16000,
          numberOfChannels: 1,
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
      alert('녹음 시작 불가: ' + error.message);
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

  const handleEndButton = () => {
    navigation.navigate('Start');
  };

  const convertSpeechToText = async (audioUri) => {
    try {
      setLoading(true);

      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket 미연결');
      }

      const audioResponse = await fetch(audioUri);
      const audioBinaryData = await audioResponse.arrayBuffer();

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.recordingContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleRecordButton}>
            <View style={styles.recordButton}>
              <RecordWaveButton isRecording={isRecording} />
            </View>
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        )}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          {whisperSttText ? (
            <View style={styles.resultCard}>
              <Text style={styles.textLabel}>음성 인식 결과</Text>
              <Text style={styles.resultText}>{whisperSttText}</Text>
            </View>
          ) : null}
          {openaiContext ? (
            <View style={styles.resultCard}>
              <Text style={styles.textLabel}>AI 답변</Text>
              <Text style={styles.resultText}>{openaiContext}</Text>
            </View>
          ) : null}
          <View style={styles.scrollBottomPadding} />
        </ScrollView>
        <TouchableOpacity style={styles.endButton} onPress={handleEndButton}>
          <Text style={styles.endButtonText}>상담 종료</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  recordingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    zIndex: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    zIndex: 20,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 80,
  },
  scrollBottomPadding: {
    height: 20,
  },
  resultCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  resultText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  },
  recordButton: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: '#3D3A3C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  endButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
