import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

export default function ConsultationBottom({
  onNewConsultationPress,
  onEndPress,
}) {
  return (
    <View style={styles.bottomButtonsContainer}>
      <TouchableOpacity
        style={styles.newConsultationButton}
        onPress={onNewConsultationPress}
      >
        <Text style={styles.newConsultationButtonText}>새 상담</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.endButton} onPress={onEndPress}>
        <Text style={styles.endButtonText}>상담 종료</Text>
      </TouchableOpacity>
    </View>
  );
}

ConsultationBottom.propTypes = {
  onNewConsultationPress: PropTypes.func.isRequired,
  onEndPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
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
});
