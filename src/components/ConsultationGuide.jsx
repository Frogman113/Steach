import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

export default function ConsultationGuide({ customerInfo }) {
  return (
    <View style={styles.guideContainer}>
      <View style={styles.guideCard}>
        <Text style={styles.guideTitle}>상담 가이드</Text>
        <GuideTip text='상담 전 녹음 버튼을 눌러 고객의 말을 음성을 녹음하세요' />
        <GuideTip text='음성 인식 후 AI가 알맞은 답변을 알려드립니다.' />
        <GuideTip text='고객 정보를 바탕으로 맞춤형 답변이 제공됩니다.' />
      </View>
      {customerInfo && <GuideCustomerInfo customerInfo={customerInfo} />}
    </View>
  );
}

const GuideTip = ({ text }) => {
  return (
    <View style={styles.guideTipContainer}>
      <View style={styles.guideTipBullet} />
      <Text style={styles.guideTip}>{text}</Text>
    </View>
  );
};

const GuideCustomerInfo = ({ customerInfo }) => {
  return (
    <View style={styles.guideCustomerInfoGuideCard}>
      <Text style={styles.guideTitle}>고객 정보 요약</Text>
      <GuideCustomerInfoField
        label='영업 분야'
        value={customerInfo.salesField}
      />
      <GuideCustomerInfoField
        label='연령대'
        value={customerInfo.customerDetails?.age}
      />
      <GuideCustomerInfoField
        label='구매 목적'
        value={customerInfo.customerDetails?.purpose}
      />
      <GuideCustomerInfoField
        label='예산'
        value={customerInfo.customerDetails?.budget}
      />
      <GuideCustomerInfoField
        label='선호 스타일'
        value={customerInfo.customerDetails?.preference}
      />
    </View>
  );
};

const GuideCustomerInfoField = ({ label, value }) => {
  if (!value) return null;
  return (
    <Text style={styles.guideCustomerInfoGuideText}>
      <Text style={styles.guideCustomerInfoGuideLabel}>{label}:</Text> {value}
    </Text>
  );
};

ConsultationGuide.propTypes = {
  customerInfo: PropTypes.shape({
    salesField: PropTypes.string,
    customerDetails: PropTypes.shape({
      age: PropTypes.string,
      purpose: PropTypes.string,
      budget: PropTypes.string,
      preference: PropTypes.string,
    }),
  }),
};

GuideTip.propTypes = {
  text: PropTypes.string.isRequired,
};

GuideCustomerInfo.propTypes = {
  customerInfo: PropTypes.shape({
    salesField: PropTypes.string,
    customerDetails: PropTypes.shape({
      age: PropTypes.string,
      purpose: PropTypes.string,
      budget: PropTypes.string,
      preference: PropTypes.string,
    }),
  }).isRequired,
};

GuideCustomerInfoField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const styles = StyleSheet.create({
  guideContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  guideCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  guideTipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guideTipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3D3A3C',
    marginTop: 6,
    marginRight: 10,
  },
  guideTip: {
    flex: 1,
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
  },
  guideCustomerInfoGuideCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  guideCustomerInfoGuideText: {
    fontSize: 15,
    color: '#444444',
    marginBottom: 8,
    lineHeight: 20,
  },
  guideCustomerInfoGuideLabel: {
    fontWeight: '600',
    color: '#333333',
  },
});
