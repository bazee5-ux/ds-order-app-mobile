import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CheckCircle } from 'lucide-react-native';
import { COLORS, FONTS, BORDER_RADIUS, SHADOWS } from '../theme/colors';

export const OrderSuccessScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const orderId = route.params?.orderId || 'DS00000';

  const handleContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color={COLORS.success} />
        </View>

        <Text style={styles.title}>Enquiry Submitted Successfully</Text>
        
        <View style={styles.orderIdCard}>
          <Text style={styles.orderIdLabel}>ENQUIRY REFERENCE ID</Text>
          <Text style={styles.orderIdText}>{orderId}</Text>
        </View>

        <Text style={styles.thankYou}>Thank you for choosing DS Engineering Enterprises.</Text>
        <Text style={styles.subtext}>Our sales and engineering team will review your product enquiry and contact you shortly with a quotation.</Text>

        <TouchableOpacity 
          style={styles.btn} 
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Continue Browsing</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    ...SHADOWS.medium,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.extraBold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  orderIdCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  orderIdLabel: {
    fontSize: 10,
    fontFamily: FONTS.extraBold,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  orderIdText: {
    fontSize: 22,
    fontFamily: FONTS.extraBold,
    color: COLORS.primary,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  thankYou: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 36,
    paddingHorizontal: 8,
  },
  btn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    width: '100%',
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.soft,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
});
