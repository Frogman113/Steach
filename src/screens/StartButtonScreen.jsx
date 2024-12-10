import React from 'react';
import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function StartButtonScreen() {
  const [isRequire, setIsRequrie] = useState(false);

  return (
    <View style={styles.StartButtonContainer}>
      <TouchableOpacity>
        <MaterialIcons name="multitrack-audio" size={100} color="black" />
      </TouchableOpacity>
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
