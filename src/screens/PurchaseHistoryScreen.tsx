import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { colors, fontFamily } from '@/theme';
import { useLibrary } from '@/store/LibraryContext';
import { useLanguage } from '@/store/LanguageContext';
import { localizedTitle } from '@/i18n/movieLabels';
import type { RootStackParamList } from '@/navigation/types';
import type { OwnedMovie } from '@/api/types';
import type { Language } from '@/i18n/translations';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatPurchaseDate(iso: string, lang: Language): string {
  const date = new Date(iso);
  return date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function PurchaseHistoryScreen() {
  const navigation = useNavigation<Nav>();
  const { all, refresh } = useLibrary();
  const { language, t } = useLanguage();

  // เหมือนหน้าอื่นๆ ที่อ่านจาก LibraryContext — refresh ทุกครั้งที่กลับมาโฟกัสหน้านี้
  useFocusEffect(
    useCallback(() => {
      refresh().catch(console.error);
    }, [refresh]),
  );

  // เรียงจากซื้อล่าสุดไปเก่าสุด
  const history = useMemo(
    () =>
      [...all].sort(
        (a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime(),
      ),
    [all],
  );

  const renderItem = ({ item }: { item: OwnedMovie }) => (
    <Pressable
      style={styles.row}
      onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
    >
      <View style={styles.rowMain}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {localizedTitle(item, language)}
        </Text>
        <Text style={styles.rowDate}>{formatPurchaseDate(item.purchasedAt, language)}</Text>
      </View>
      <Text style={styles.rowPrice}>฿{item.priceTHB}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.stub} />
        </Pressable>
        <Text style={styles.title}>{t('purchaseHistoryTitle')}</Text>
      </View>

      {history.length > 0 && (
        <Text style={styles.summaryLabel}>
          {t('purchaseHistorySummary', { count: history.length })}
        </Text>
      )}

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.empty}>{t('purchaseHistoryEmpty')}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 22,
    paddingTop: 60,
    paddingBottom: 10,
  },
  backBtn: { padding: 2 },
  title: { fontFamily: fontFamily.display, fontSize: 23, color: colors.stub },
  summaryLabel: {
    fontFamily: fontFamily.body,
    fontSize: 12,
    color: colors.ash2,
    marginHorizontal: 22,
    marginBottom: 10,
  },
  listContent: { paddingHorizontal: 22, paddingBottom: 30 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowMain: { flex: 1, marginRight: 12 },
  rowTitle: { fontFamily: fontFamily.bodyMedium, fontSize: 13.5, color: colors.stub },
  rowDate: { fontFamily: fontFamily.mono, fontSize: 10, color: colors.ash2, marginTop: 3 },
  rowPrice: { fontFamily: fontFamily.display, fontSize: 15, color: colors.stub },
  separator: { borderTopWidth: 1, borderTopColor: colors.line },
  empty: {
    fontFamily: fontFamily.body,
    fontSize: 13,
    color: colors.ash2,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 30,
  },
});
