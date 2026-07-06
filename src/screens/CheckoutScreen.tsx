import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../theme/colors';
import { useApp } from '../context/AppContext';

// Resolve host machine API URL based on emulator platform
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { cart, profile, saveProfile, clearCart, isOffline, triggerOfflineCheck } = useApp();

  const [name, setName] = useState(profile.name || '');
  const [company, setCompany] = useState(profile.company || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [email, setEmail] = useState(profile.email || '');
  const [address, setAddress] = useState(profile.address || '');
  const [remarks, setRemarks] = useState(profile.remarks || '');
  const [submitting, setSubmitting] = useState(false);

  // Load profile values once loaded from AsyncStorage
  useEffect(() => {
    setName(profile.name);
    setCompany(profile.company);
    setPhone(profile.phone);
    setEmail(profile.email);
    setAddress(profile.address);
    setRemarks(profile.remarks);
  }, [profile]);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter your Name.');
      return false;
    }
    if (!company.trim()) {
      Alert.alert('Required Field', 'Please enter your Company Name.');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Required Field', 'Please enter your Mobile Number.');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Required Field', 'Please enter your Delivery Address.');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    // Check connectivity first
    const offline = await triggerOfflineCheck();
    if (offline) {
      Alert.alert(
        'Offline Mode',
        'You need an active internet connection to submit purchase enquiries. Please connect to the internet and try again.'
      );
      return;
    }

    setSubmitting(true);

    try {
      // 1. Generate Order ID: e.g. DS00025
      const randomNum = Math.floor(10 + Math.random() * 99900);
      const formattedNum = String(randomNum).padStart(5, '0');
      const orderId = `DS${formattedNum}`;

      // 2. Format Date and Time
      const now = new Date();
      const orderDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const orderTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

      // 3. Format Products Payload
      const orderedProducts = cart.map(item => ({
        id: item.product.id,
        category: item.product.category,
        brand: item.product.brand,
        model: item.product.model,
        quantity: item.quantity
      }));

      const payload = {
        orderId,
        date: orderDate,
        time: orderTime,
        customerDetails: {
          name: name.trim(),
          company: company.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          remarks: remarks.trim()
        },
        products: orderedProducts
      };

      // 4. Send POST to Backend API
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Server returned an error.');
      }

      // 5. Save customer details locally for future pre-filling
      await saveProfile({
        name: name.trim(),
        company: company.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        remarks: '' // Reset remarks for the next order
      });

      // 6. Clear cart & navigate to success screen
      clearCart();
      setSubmitting(false);
      navigation.replace('OrderSuccess', { orderId });

    } catch (error) {
      setSubmitting(false);
      console.error('Error submitting order:', error);
      Alert.alert(
        'Submission Failed',
        'Could not send your safety enquiry to the server. Please check if the backend is running and try again.',
        [
          { text: 'OK' }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Contact & Delivery Information</Text>
            <Text style={styles.sectionSub}>These details will be saved locally for your convenience on future orders.</Text>
            
            {/* Customer Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Name *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>

            {/* Company Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Name *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="business-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your company name"
                  value={company}
                  onChangeText={setCompany}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address (Optional)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>

            {/* Delivery Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delivery Address *</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Ionicons name="pin-outline" size={20} color={COLORS.textMuted} style={[styles.inputIcon, { marginTop: 12 }]} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter delivery site address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>

            {/* Remarks */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enquiry Remarks (Optional)</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <Ionicons name="chatbox-ellipses-outline" size={20} color={COLORS.textMuted} style={[styles.inputIcon, { marginTop: 12 }]} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="e.g. Urgent requirement, customization needed, brand alternatives"
                  value={remarks}
                  onChangeText={setRemarks}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Place Order Panel */}
        <View style={styles.bottomPanel}>
          {submitting ? (
            <View style={styles.submittingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.submittingText}>Submitting Safety Enquiry...</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={handlePlaceOrder}
              activeOpacity={0.8}
            >
              <Text style={styles.submitBtnText}>Place Purchase Enquiry</Text>
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 120, // Space to scroll past the fixed button
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    ...SHADOWS.soft,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 20,
    lineHeight: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    height: '100%',
  },
  textAreaContainer: {
    height: 100,
    alignItems: 'flex-start',
  },
  textArea: {
    height: '100%',
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.medium,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.soft,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  submittingContainer: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    opacity: 0.8,
  },
  submittingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
