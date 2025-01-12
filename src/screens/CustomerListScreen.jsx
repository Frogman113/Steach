import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CustomerListScreen({ navigation }) {
  const openCustomerSetup = () => {
    navigation.navigate('CustomerSetup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>상담 일지</Text>
      <TouchableOpacity style={styles.addButton} onPress={openCustomerSetup}>
        <Text style={styles.addButtonText}>고객 카드 추가</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#0000FF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
