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
  const [recordDuration, setRecordDuration] = useState(0);

  const ws = useRef(null);
  const timerRef = useRef(null);
  const scrollViewRef = useRef(null);

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

          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
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
      stopRecordingTimer();

      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [customerInfo]);

  useEffect(() => {
    if (isRecording) {
      startRecordingTimer();
    } else {
      stopRecordingTimer();
    }

    return () => stopRecordingTimer();
  }, [isRecording]);

  const getCustomerSummary = () => {
    if (!customerInfo) {
      return '고객 정보 없음';
    }
    const details = [
      customerInfo.salesField,
      customerInfo.customerDetails?.age,
      customerInfo.customerDetails?.purpose,
      customerInfo.customerDetails?.budget,
      customerInfo.customerDetails?.preference,
    ].filter(Boolean);

    return details.length > 0 ? details.join(' / ') : '고객 정보 없음';
  };

  const startRecordingTimer = () => {
    setRecordDuration(0);
    timerRef.current = setInterval(() => {
      setRecordDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

  const handleNewSession = () => {
    setWhisperSttText('');
    setOpenaiContext('');
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
          <Text style={styles.headerTitle}>영업 상담</Text>
          <Text style={styles.customerInfo}>{getCustomerSummary()}</Text>
        </View>
        <View style={styles.recordControlContainer}>
          {isRecording && (
            <View style={styles.recordingStatus}>
              <View style={styles.recordingIndicator} />
              <Text style={styles.recordingTime}>
                {formatDuration(recordDuration)}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={handleRecordButton}
            style={[
              styles.recordButtonContainer,
              isRecording ? styles.recordingActive : null,
            ]}
          >
            <View style={styles.recordButton}>
              <RecordWaveButton isRecording={isRecording} />
            </View>
          </TouchableOpacity>
          <Text style={styles.recordingInfoText}>
            {isRecording ? '탭하여 녹음 중지' : '탭하여 녹음 시작'}
          </Text>
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>처리 중...</Text>
          </View>
        )}
        <ScrollView
          ref={scrollViewRef}
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
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={styles.newSessionButton}
            onPress={handleNewSession}
          >
            <Text style={styles.newSessionButtonText}>새 세션</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endButton} onPress={handleEndButton}>
            <Text style={styles.endButtonText}>상담 종료</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#3D3A3C',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  customerInfo: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  recordControlContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#FF00001A',
    borderRadius: 20,
  },
  recordingIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
    marginRight: 8,
  },
  recordingTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF0000',
  },
  recordButtonContainer: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 65,
    backgroundColor: '#F8F8F8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordingActive: {
    backgroundColor: '#FFF0F0',
  },
  recordButton: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInfoText: {
    marginTop: 30,
    fontSize: 14,
    color: '#666666',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000B3',
    zIndex: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  bottomButtonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    justifyContent: 'space-between',
  },
  newSessionButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  newSessionButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '500',
  },
  endButton: {
    flex: 1,
    backgroundColor: '#3D3A3C',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  endButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
