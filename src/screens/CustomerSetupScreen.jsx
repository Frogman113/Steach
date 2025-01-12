import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

export default function CustomerSetupScreen({ navigation }) {
  const [salesField, setSalesField] = useState('');
  const [age, setAge] = useState('');
  const [purpose, setPurpose] = useState('');
  const [budget, setBudget] = useState('');
  const [preference, setPreference] = useState('');

  const openRecordingScreen = () => {
    const customerInfo = {
      salesField,
      customerDetails: {
        age: age,
        purpose: purpose,
        budget: budget,
        preference: preference,
      },
    };
    navigation.navigate('Recording', { customerInfo });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>고객 정보 설정</Text>
      <TextInput
        style={styles.input}
        placeholder="영업 분야 (예: 자동차, 가전제품)"
        value={salesField}
        onChangeText={setSalesField}
      />
      <TextInput
        style={styles.input}
        placeholder="연령대 (예: 20대, 30대 중반)"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="구매 목적"
        value={purpose}
        onChangeText={setPurpose}
      />
      <TextInput
        style={styles.input}
        placeholder="예산 범위 (예: 800만원, 2200만원)"
        value={budget}
        onChangeText={setBudget}
      />
      <TextInput
        style={styles.input}
        placeholder="선호 스타일"
        value={preference}
        onChangeText={setPreference}
      />
      <TouchableOpacity style={styles.button} onPress={openRecordingScreen}>
        <Text style={styles.buttonText}>다음</Text>
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
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
  },
  button: {
    backgroundColor: '#0000FF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
