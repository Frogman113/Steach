import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

export default function CustomerSetupScreen({ navigation, route }) {
  const editMode = route.params?.editMode || false;
  const cardToEdit = route.params?.cardToEdit;

  const [salesField, setSalesField] = useState(
    editMode ? cardToEdit.salesField : '',
  );
  const [age, setAge] = useState(
    editMode ? cardToEdit.customerDetails.age : '',
  );
  const [purpose, setPurpose] = useState(
    editMode ? cardToEdit.customerDetails.purpose : '',
  );
  const [budget, setBudget] = useState(
    editMode ? cardToEdit.customerDetails.budget : '',
  );
  const [preference, setPreference] = useState(
    editMode ? cardToEdit.customerDetails.preference : '',
  );

  const handleSavedCustomerInfo = () => {
    if (!salesField.trim()) {
      alert('영업 분야를 입력해주세요');
      return;
    }

    const customerCardData = {
      salesField,
      customerDetails: {
        age: age.trim(),
        purpose: purpose.trim(),
        budget: budget.trim(),
        preference: preference.trim(),
      },
    };

    if (editMode) {
      customerCardData.id = cardToEdit.id;
    }

    navigation.navigate('Start', {
      newCustomer: customerCardData,
      isEdit: editMode,
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {editMode ? '고객 정보 수정' : '고객 카드 설정'}
        </Text>
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
        <TouchableOpacity
          style={styles.button}
          onPress={handleSavedCustomerInfo}
        >
          <Text style={styles.buttonText}>{editMode ? '수정' : '등록'}</Text>
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
    backgroundColor: '#3D3A3C',
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
