import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { WS_SERVER } from '@env';
import ConsultationHeader from '../components/ConsultationHeader';
import RecordControl from '../components/RecordControl';
import ConsultationBottom from '../components/ConsultationBottom';
import ConsultationGuide from '../components/ConsultationGuide';

export default function RecordingScreen({ navigation, route }) {
  const customerInfo = route.params?.customerInfo;

  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [whisperSttText, setWhisperSttText] = useState('');
  const [openaiContext, setOpenaiContext] = useState('');
  const [loading, setLoading] = useState(false);

  const ws = useRef(null);
  const timerRef = useRef(null);
  const scrollViewRef = useRef(null);
  const fadeMotion = useRef(new Animated.Value(0)).current;
  const slideMotion = useRef(new Animated.Value(50)).current;
  const soundRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        stopTtsSound();
      };
    }, []),
  );

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
      stopTtsSound();

      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [customerInfo]);

  useEffect(() => {
    if (whisperSttText || openaiContext) {
      Animated.parallel([
        Animated.timing(fadeMotion, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideMotion, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [whisperSttText, openaiContext]);

  const stopRecordingTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopTtsSound = () => {
    if (soundRef.current) {
      try {
        soundRef.current.stopAsync().catch(() => {});
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      } catch (error) {
        alert('TTS 재생 중지 오류' + error.message);
      }
    }
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
      alert('녹음 시작 불가' + error.message);
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
    stopTtsSound();
    navigation.navigate('Start');
  };

  const handleNewConsultation = () => {
    stopTtsSound();
    setWhisperSttText('');
    setOpenaiContext('');
    fadeMotion.setValue(0);
    slideMotion.setValue(50);
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
      stopTtsSound();
      const voiceAudioUri = `data:audio/mp3;base64,${base64Audio}`;
      const voiceSound = new Audio.Sound();

      await voiceSound.loadAsync({ uri: voiceAudioUri });
      soundRef.current = voiceSound;
      await voiceSound.playAsync();
    } catch (error) {
      alert('음성 재생 오류' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.recordingContainer}>
        <ConsultationHeader customerInfo={customerInfo} />
        <RecordControl
          isRecording={isRecording}
          onRecordPress={handleRecordButton}
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#FFFFFF' />
            <Text style={styles.loadingText}>처리 중...</Text>
          </View>
        )}
        {whisperSttText || openaiContext ? (
          <Animated.View
            style={[
              styles.resultsContainer,
              {
                opacity: fadeMotion,
                transform: [{ translateY: slideMotion }],
              },
            ]}
          >
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
          </Animated.View>
        ) : (
          <ConsultationGuide customerInfo={customerInfo} />
        )}
        <ConsultationBottom
          onNewConsultationPress={handleNewConsultation}
          onEndPress={handleEndButton}
        />
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
  resultsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
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
});
