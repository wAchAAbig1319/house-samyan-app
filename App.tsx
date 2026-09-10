import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { colors, loadAppFonts } from '@/theme';
import { AuthProvider, useAuth } from '@/store/AuthContext';
import { LanguageProvider } from '@/store/LanguageContext';
import { LibraryProvider } from '@/store/LibraryContext';
import { CartProvider } from '@/store/CartContext';
import { SavedCardProvider } from '@/store/SavedCardContext';
import { RootNavigator } from '@/navigation/RootNavigator';
import { AuthNavigator } from '@/navigation/AuthNavigator';

// เกตหน้าล็อกอิน: ยังไม่ล็อกอินให้เห็น AuthNavigator (Login/Register), ล็อกอิน
// แล้วค่อยเข้าแอปจริง สถานะล็อกอินอยู่ใน AuthContext (mock, เก็บใน memory) —
// ดู src/api/auth.ts
function AuthGate() {
  const { user } = useAuth();
  if (!user) return <AuthNavigator />;
  return (
    <LibraryProvider>
      <CartProvider>
        <SavedCardProvider>
          <RootNavigator />
        </SavedCardProvider>
      </CartProvider>
    </LibraryProvider>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadAppFonts()
      .then(() => setFontsLoaded(true))
      .catch((err) => {
        console.error('Font load failed:', err);
        setFontsLoaded(true); // ให้แอปรันต่อได้แม้ฟอนต์โหลดพลาด (fallback เป็นฟอนต์ระบบ)
      });
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.marquee} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <AuthGate />
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
