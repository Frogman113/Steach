import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RecordWaveButton } from './RecordWaveButton';
import PropTypes from 'prop-types';

export default function RecordControl({ isRecording, onRecordPress }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startRecordingTimer();
    } else {
      stopRecordingTimer();
    }

    return () => stopRecordingTimer();
  }, [isRecording]);

  const startRecordingTimer = () => {
    setElapsedTime(0);
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.recordControlContainer}>
      <TouchableOpacity
        onPress={onRecordPress}
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
                {formatTime(elapsedTime)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Text style={styles.recordingInfoText}>
        {isRecording ? '탭하여 녹음 중지' : '탭하여 녹음 시작'}
      </Text>
    </View>
  );
}

RecordControl.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  onRecordPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
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
});
