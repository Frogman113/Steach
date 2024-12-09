import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LightIconScreen() {
  return (
    <View style={styles.LightIconContainer}>
      <Text style={styles.LightIconText}>안내 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  LightIconContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LightIconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
