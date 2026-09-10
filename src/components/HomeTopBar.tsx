import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// แถบบนสุดของหน้า Home ลอยทับ Hero banner แบบ Netflix — โลโก้ชิดซ้าย
// ปุ่มโปรไฟล์ชิดขวา ไม่มีพื้นหลังของตัวเอง ให้ภาพหนังด้านหลังโชว์ทะลุ
export function HomeTopBar() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  return (
    <View style={[styles.bar, { top: insets.top + 8 }]} pointerEvents="box-none">
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Pressable
        hitSlop={10}
        style={styles.profileBtn}
        onPress={() => navigation.navigate('Tabs', { screen: 'Profile' })}
      >
        <Ionicons name="person-circle-outline" size={26} color={colors.stub} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logo: { width: 92, height: 27 },
  profileBtn: { padding: 2 },
});
