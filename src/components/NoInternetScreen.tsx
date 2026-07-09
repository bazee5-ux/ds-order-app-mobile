import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../theme/colors';
import { useApp } from '../context/AppContext';

interface NoInternetScreenProps {
  onDismiss?: () => void;
}

export const NoInternetScreen: React.FC<NoInternetScreenProps> = ({ onDismiss }) => {
  const { triggerOfflineCheck } = useApp();
  const [checking, setChecking] = useState(false);

  const handleRetry = async () => {
    setChecking(true);
    // Add artificial delay for UX feel
    setTimeout(async () => {
      const offline = await triggerOfflineCheck();
      setChecking(false);
      if (!offline && onDismiss) {
        onDismiss();
      }
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-offline" size={64} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Connection Lost</Text>
        <Text style={styles.description}>
          It seems you are offline. You can continue to browse our PPE & Safety product catalog offline, but you will need internet access to place purchase enquiries.
        </Text>
        
        {checking ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.checkingText}>Reconnecting...</Text>
          </View>
        ) : (
          <View style={styles.btnContainer}>
            <TouchableOpacity 
              style={styles.retryBtn} 
              onPress={handleRetry}
              activeOpacity={0.7}
            >
              <Text style={styles.retryBtnText}>Try Reconnecting</Text>
            </TouchableOpacity>
            
            {onDismiss && (
              <TouchableOpacity 
                style={styles.browseBtn} 
                onPress={onDismiss}
                activeOpacity={0.7}
              >
                <Text style={styles.browseBtnText}>Browse Offline</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 91, 172, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  btnContainer: {
    width: '100%',
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginBottom: 12,
    ...SHADOWS.soft,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  browseBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  browseBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  checkingText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
