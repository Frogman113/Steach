import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { WS_SERVER } from '@env';
import { RecordWaveButton } from '../components/RecordWaveButton';
import ConsultationHeader from '../components/ConsultationHeader';

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
    if (isRecording) {
      startRecordingTimer();
    } else {
      stopRecordingTimer();
    }

    return () => stopRecordingTimer();
  }, [isRecording]);

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
        <View style={styles.recordControlContainer}>
          <TouchableOpacity
            onPress={handleRecordButton}
            style={[
              styles.recordButtonContainer,
              isRecording ? styles.recordingActive : null,
            ]}
          >
            <View style={styles.recordButton}>
              <RecordWaveButton isRecording={isRecording} />
              {isRecording && (
                <View style={styles.recordingTimerStatus}>
                  <View style={styles.recordingIndicator} />
                  <Text style={styles.recordingTime}>
                    {formatDuration(recordDuration)}
                  </Text>
                </View>
              )}
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
          <View style={styles.guideContainer}>
            <View style={styles.guideCard}>
              <Text style={styles.guideTitle}>상담 가이드</Text>
              <View style={styles.guideTipContainer}>
                <View style={styles.guideTipBullet} />
                <Text style={styles.guideTip}>
                  상담 전 녹음 버튼을 눌러 고객의 말을 음성을 녹음하세요
                </Text>
              </View>
              <View style={styles.guideTipContainer}>
                <View style={styles.guideTipBullet} />
                <Text style={styles.guideTip}>
                  음성 인식 후 AI가 알맞은 답변을 알려드립니다.
                </Text>
              </View>
              <View style={styles.guideTipContainer}>
                <View style={styles.guideTipBullet} />
                <Text style={styles.guideTip}>
                  고객 정보를 바탕으로 맞춤형 상담 답변이 제공됩니다.
                </Text>
              </View>
            </View>
            {customerInfo && (
              <View style={styles.guideCustomerInfoGuideCard}>
                <Text style={styles.guideTitle}>고객 정보 요약</Text>
                {customerInfo.salesField && (
                  <Text style={styles.guideCustomerInfoGuideText}>
                    <Text style={styles.guideCustomerInfoGuideLabel}>
                      영업 분야:
                    </Text>{' '}
                    {customerInfo.salesField}
                  </Text>
                )}
                {customerInfo.customerDetails?.age && (
                  <Text style={styles.guideCustomerInfoGuideText}>
                    <Text style={styles.guideCustomerInfoGuideLabel}>
                      연령대:
                    </Text>{' '}
                    {customerInfo.customerDetails.age}
                  </Text>
                )}
                {customerInfo.customerDetails?.purpose && (
                  <Text style={styles.guideCustomerInfoGuideText}>
                    <Text style={styles.guideCustomerInfoGuideLabel}>
                      구매 목적:
                    </Text>{' '}
                    {customerInfo.customerDetails.purpose}
                  </Text>
                )}
                {customerInfo.customerDetails?.budget && (
                  <Text style={styles.guideCustomerInfoGuideText}>
                    <Text style={styles.guideCustomerInfoGuideLabel}>
                      예산:
                    </Text>{' '}
                    {customerInfo.customerDetails.budget}
                  </Text>
                )}
                {customerInfo.customerDetails?.preference && (
                  <Text style={styles.guideCustomerInfoGuideText}>
                    <Text style={styles.guideCustomerInfoGuideLabel}>
                      선호 스타일:
                    </Text>{' '}
                    {customerInfo.customerDetails.preference}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={styles.newConsultationButton}
            onPress={handleNewConsultation}
          >
            <Text style={styles.newConsultationButtonText}>새 상담</Text>
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
  recordControlContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  recordingTimerStatus: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF00001A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 10,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
    marginRight: 5,
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
    position: 'relative',
  },
  recordingInfoText: {
    marginTop: 30,
    fontSize: 14,
    color: '#666666',
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
  newConsultationButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  newConsultationButtonText: {
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
  guideContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  guideCard: {
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
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  guideTipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guideTipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3D3A3C',
    marginTop: 6,
    marginRight: 10,
  },
  guideTip: {
    flex: 1,
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
  },
  guideCustomerInfoGuideCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  guideCustomerInfoGuideText: {
    fontSize: 15,
    color: '#444444',
    marginBottom: 8,
    lineHeight: 20,
  },
  guideCustomerInfoGuideLabel: {
    fontWeight: '600',
    color: '#333333',
  },
});
