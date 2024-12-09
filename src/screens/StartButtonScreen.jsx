import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StartButtonScreen() {
  return (
    <View style={styles.StartButtonContainer}>
      <Text style={styles.StartButtonContainerText}>사용 화면</Text>
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
