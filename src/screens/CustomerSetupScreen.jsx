import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

export default function CustomerSetupScreen({ navigation }) {
  const [salesField, setSalesField] = useState('');
  const [age, setAge] = useState('');
  const [purpose, setPurpose] = useState('');
  const [budget, setBudget] = useState('');
  const [preference, setPreference] = useState('');

  const savedCustomerInfo = () => {
    if (!salesField.trim()) {
      alert('영업 분야를 입력해주세요');
      return;
    }

    const newCustomer = {
      salesField,
      customerDetails: {
        age: age.trim(),
        purpose: purpose.trim(),
        budget: budget.trim(),
        preference: preference.trim(),
      },
    };

    navigation.navigate('Start', {
      newCustomer: newCustomer,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>고객 카드 설정</Text>
        <TextInput
          style={styles.input}
          placeholder="영업 분야 (예: 자동차, 가전제품)"
          value={salesField}
          onChangeText={setSalesField}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="연령대 (예: 20대, 30대 중반)"
          value={age}
          onChangeText={setAge}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="구매 목적"
          value={purpose}
          onChangeText={setPurpose}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="예산 범위 (예: 800만원, 2200만원)"
          value={budget}
          onChangeText={setBudget}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="선호 스타일"
          value={preference}
          onChangeText={setPreference}
          returnKeyType="next"
        />
        <TouchableOpacity style={styles.button} onPress={savedCustomerInfo}>
          <Text style={styles.buttonText}>등록</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    backgroundColor: '#007AFF',
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
