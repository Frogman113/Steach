import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default function ConsultationHeader({ customerInfo }) {
  const headerCustomerCardInfo = () => {
    return [
      customerInfo.salesField,
      customerInfo.customerDetails?.age,
      customerInfo.customerDetails?.purpose,
      customerInfo.customerDetails?.budget,
      customerInfo.customerDetails?.preference,
    ]
      .filter(Boolean)
      .join(' / ');
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>영업 상담</Text>
      <Text style={styles.headerCustomerInfo}>{headerCustomerCardInfo()}</Text>
    </View>
  );
}

ConsultationHeader.propTypes = {
  customerInfo: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#3D3A3C',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerCustomerInfo: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
  },
});
