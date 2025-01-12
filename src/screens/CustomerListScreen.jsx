import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function CustomerListScreen({ navigation, route }) {
  const [customerCards, setCustomerCards] = useState([]);
  const [currentId, setCurrentId] = useState(1);

  useEffect(() => {
    if (route.params?.newCustomer) {
      setCustomerCards((prevCards) => [
        ...prevCards,
        {
          id: currentId,
          ...route.params.newCustomer,
        },
      ]);

      setCurrentId((prevId) => prevId + 1);
      navigation.setParams({ newCustomer: null });
    }
  }, [route.params?.newCustomer]);

  const addNewCustomer = () => {
    navigation.navigate('CustomerSetup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>고객 정보 카드</Text>

        <View style={styles.content}>
          <ScrollView style={styles.customerCardList}>
            {customerCards.map((card) => (
              <View key={card.id} style={styles.customerCard}>
                <Text style={styles.customerCardTitle}>{card.salesField}</Text>
                <View style={styles.customerCardContent}>
                  <Text style={styles.customerCardText}>
                    연령대: {card.customerDetails.age}
                  </Text>
                  <Text style={styles.customerCardText}>
                    목적: {card.customerDetails.purpose}
                  </Text>
                  <Text style={styles.customerCardText}>
                    예산: {card.customerDetails.budget}
                  </Text>
                  <Text style={styles.customerCardText}>
                    선호도: {card.customerDetails.preference}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.addButton} onPress={addNewCustomer}>
            <Text style={styles.addButtonText}>새 고객 정보 추가</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  customerCardList: {
    flex: 1,
    marginBottom: 20,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customerCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  customerCardContent: {
    gap: 8,
  },
  customerCardText: {
    fontSize: 14,
    color: '#666666',
  },
  addButton: {
    backgroundColor: '#0000FF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
