import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import useCustomerStore from '../stores/CustomerStore';

export default function CustomerListScreen({ navigation, route }) {
  const { customerCards, addCustomer } = useCustomerStore();
  const [selectedCardId, setSelectedCardId] = useState(null);

  useEffect(() => {
    if (route.params?.newCustomer) {
      addCustomer(route.params.newCustomer);
      navigation.setParams({ newCustomer: null });
    }
  }, [route.params?.newCustomer]);

  const cardPressAction = (cardId) => {
    setSelectedCardId(selectedCardId === cardId ? null : cardId);
  };

  const addNewCustomer = () => {
    navigation.navigate('CustomerSetup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>고객 정보 카드</Text>
        <ScrollView
          style={styles.customerCardList}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {customerCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.customerCard}
              onPress={() => cardPressAction(card.id)}
            >
              <Text style={styles.customerCardTitle}>{card.salesField}</Text>
              <View style={styles.customerCardContent}>
                <Text style={styles.customerCardText}>
                  연령대: {card.customerDetails.age}
                </Text>
                <Text style={styles.customerCardText}>
                  구매 목적: {card.customerDetails.purpose}
                </Text>
                <Text style={styles.customerCardText}>
                  예산: {card.customerDetails.budget}
                </Text>
                <Text style={styles.customerCardText}>
                  선호 스타일: {card.customerDetails.preference}
                </Text>
              </View>

              {selectedCardId === card.id && (
                <View style={styles.cardTouchActions}>
                  <TouchableOpacity
                    style={[
                      styles.touchActionButton,
                      styles.deleteActionButton,
                    ]}
                  >
                    <Text style={styles.actionButtonText}>삭제</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.touchActionButton, styles.editActionButton]}
                  >
                    <Text style={styles.actionButtonText}>정보 수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.touchActionButton, styles.startActionButton]}
                  >
                    <Text style={styles.actionButtonText}>상담 시작</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.actionFooter}>
          <TouchableOpacity style={styles.addButton} onPress={addNewCustomer}>
            <Text style={styles.addButtonText}>고객 카드 추가</Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
  cardTouchActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  touchActionButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteActionButton: {
    backgroundColor: '#FF3B30',
  },
  editActionButton: {
    backgroundColor: '#007AFF',
  },
  startActionButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  actionFooter: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
