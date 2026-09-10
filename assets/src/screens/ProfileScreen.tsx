import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, fontFamily } from '@/theme';
import { useAuth } from '@/store/AuthContext';
import { useLibrary } from '@/store/LibraryContext';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuth();
  const { all, refresh } = useLibrary();

  // เหมือน LibraryScreen — refresh ทุกครั้งที่กลับมาโฟกัสแท็บนี้ ไม่ใช่แค่ตอน mount
  // ครั้งแรก ไม่งั้นซื้อหนังจากหน้าอื่นแล้วมาดูโปรไฟล์จะเห็นตัวเลข "ใช้จ่ายรวม" เก่า
  useFocusEffect(
    useCallback(() => {
      refresh().catch(console.error);
    }, [refresh]),
  );

  const watchedCount = all.filter((m) => m.watched).length;
  const totalSpent = all.reduce((sum, m) => sum + m.priceTHB, 0);
  const initial = (user?.name?.trim()?.[0] ?? '?').toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>โปรไฟล์</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.profileHead}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.pName}>{user?.name}</Text>
            <Text style={styles.pEmail}>{user?.email}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{all.length}</Text>
            <Text style={styles.statLabel}>เรื่องที่ซื้อ</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{watchedCount}</Text>
            <Text style={styles.statLabel}>ดูจบแล้ว</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>฿{totalSpent}</Text>
            <Text style={styles.statLabel}>ใช้จ่ายรวม</Text>
          </View>
        </View>
      </View>

      <View style={styles.menu}>
        <Pressable style={styles.menuItem} onPress={() => navigation.navigate('Tabs', { screen: 'Library' })}>
          <Text style={styles.menuText}>กล่องฟิล์มของฉัน</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
        <Pressable style={[styles.menuItem, styles.danger]} onPress={logout}>
          <Text style={[styles.menuText, styles.dangerText]}>ออกจากระบบ</Text>
          <Text style={[styles.arrow, styles.dangerText]}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  top: { padding: 22, paddingTop: 60, paddingBottom: 0 },
  title: { fontFamily: fontFamily.display, fontSize: 23, color: colors.stub },
  profileCard: {
    margin: 22,
    backgroundColor: colors.ink3,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 22,
  },
  profileHead: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.marquee,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fontFamily.display, fontSize: 20, color: colors.ink },
  pName: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.stub },
  pEmail: { fontFamily: fontFamily.mono, fontSize: 10.5, color: colors.ash2, marginTop: 3 },
  divider: { borderTopWidth: 1.5, borderTopColor: colors.line, borderStyle: 'dashed', marginVertical: 16 },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'flex-start' },
  statNum: { fontFamily: fontFamily.display, fontSize: 22, color: colors.marquee },
  statLabel: {
    fontFamily: fontFamily.mono,
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.ash2,
    marginTop: 4,
  },
  menu: { marginHorizontal: 22 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  menuText: { fontFamily: fontFamily.body, fontSize: 13.5, color: colors.stub },
  arrow: { fontFamily: fontFamily.mono, color: colors.ash2 },
  danger: {},
  dangerText: { color: colors.velvetBright },
});
