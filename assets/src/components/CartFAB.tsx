import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, fontFamily } from '@/theme';
import { useCart } from '@/store/CartContext';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// ปุ่มตะกร้าลอย แบบเดียวกับ Shopee — ลอยมุมล่างขวา อยู่คงที่ไม่หายตอน scroll
// ใช้ในหน้า browse เท่านั้น (Home / Search / MovieDetail) ไม่ใช้ในหน้า Library เพราะเป็นของที่ซื้อแล้ว
export function CartFAB() {
  const navigation = useNavigation<Nav>();
  const { itemCount } = useCart();

  if (itemCount === 0) return null;

  return (
    <Pressable
      style={styles.fab}
      onPress={() => navigation.navigate('Cart')}
      focusable // จำเป็นสำหรับ TV ให้รีโมทโฟกัสมาที่ปุ่มนี้ได้
    >
      <Text style={styles.icon}>🎬</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.velvet,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    zIndex: 20,
  },
  icon: { fontSize: 22 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: colors.marquee,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.ink,
  },
  badgeText: {
    fontFamily: fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.ink,
  },
});
