import React from 'react';
import { StyleSheet, View, Text, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider, useApp } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { COLORS } from './src/theme/colors';

function AppContent() {
  const { isOffline } = useApp();

  return (
    <View style={styles.container}>
      {/* Subtle App-wide Offline Banner */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline Mode: Browsing Local Product Catalogue</Text>
        </View>
      )}
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  offlineBanner: {
    backgroundColor: COLORS.warning,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  offlineText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
