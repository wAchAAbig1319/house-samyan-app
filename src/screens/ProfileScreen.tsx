import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, fontFamily } from '@/theme';
import { useAuth } from '@/store/AuthContext';
import { useLibrary } from '@/store/LibraryContext';
import { useLanguage } from '@/store/LanguageContext';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuth();
  const { all, refresh } = useLibrary();
  const { language, setLanguage, t } = useLanguage();

  // เหมือน LibraryScreen — refresh ทุกครั้งที่กลับมาโฟกัสแท็บนี้ ไม่ใช่แค่ตอน mount
  // ครั้งแรก ไม่งั้นซื้อหนังจากหน้าอื่นแล้วมาดูโปรไฟล์จะเห็นตัวเลขสถิติเก่า
  useFocusEffect(
    useCallback(() => {
      refresh().catch(console.error);
    }, [refresh]),
  );

  const watchedCount = all.filter((m) => m.watched).length;
  const initial = (user?.name?.trim()?.[0] ?? '?').toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>{t('profileTitle')}</Text>
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
            <Text style={styles.statLabel}>{t('statPurchased')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>{watchedCount}</Text>
            <Text style={styles.statLabel}>{t('statWatched')}</Text>
          </View>
        </View>
      </View>

      {/* สลับภาษา TH/EN — เก็บ state ไว้ใน LanguageContext ทั้งแอป */}
      <View style={styles.langCard}>
        <Text style={styles.langLabel}>{t('languageLabel')}</Text>
        <View style={styles.langSwitch}>
          <Pressable
            onPress={() => setLanguage('th')}
            style={[styles.langOption, language === 'th' && styles.langOptionActive]}
          >
            <Text style={[styles.langOptionText, language === 'th' && styles.langOptionTextActive]}>
              ไทย
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setLanguage('en')}
            style={[styles.langOption, language === 'en' && styles.langOptionActive]}
          >
            <Text style={[styles.langOptionText, language === 'en' && styles.langOptionTextActive]}>
              English
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.menu}>
        <Pressable style={styles.menuItem} onPress={() => navigation.navigate('Tabs', { screen: 'Library' })}>
          <Text style={styles.menuText}>{t('menuLibrary')}</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => navigation.navigate('PurchaseHistory')}>
          <Text style={styles.menuText}>{t('menuPurchaseHistory')}</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
        <Pressable style={[styles.menuItem, styles.danger]} onPress={logout}>
          <Text style={[styles.menuText, styles.dangerText]}>{t('menuLogout')}</Text>
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
  stats: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 34, backgroundColor: colors.line },
  statNum: { fontFamily: fontFamily.display, fontSize: 22, color: colors.marquee },
  statLabel: {
    fontFamily: fontFamily.mono,
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.ash2,
    marginTop: 4,
  },
  langCard: {
    marginHorizontal: 22,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langLabel: {
    fontFamily: fontFamily.mono,
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.ash2,
  },
  langSwitch: {
    flexDirection: 'row',
    backgroundColor: colors.ink3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 3,
    gap: 2,
  },
  langOption: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6 },
  langOptionActive: { backgroundColor: colors.marquee },
  langOptionText: { fontFamily: fontFamily.body, fontSize: 12, color: colors.ash },
  langOptionTextActive: { color: colors.ink, fontFamily: fontFamily.bodyMedium },
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
