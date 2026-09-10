import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '@/theme';
import type { AuthStackParamList } from './types';
import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

// ธีมเดียวกับ RootNavigator (ดู RootNavigator.tsx) — แยกไฟล์กันเพราะ
// AuthNavigator กับ RootNavigator ไม่เคยเรนเดอร์พร้อมกัน (ดู App.tsx: สลับกัน
// ตามสถานะล็อกอิน) เลยมี NavigationContainer ของตัวเองได้อิสระต่อกัน
const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.ink,
    card: colors.ink2,
    border: colors.line,
    primary: colors.marquee,
    text: colors.stub,
  },
};

export function AuthNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
