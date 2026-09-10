import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, fontFamily, fontSize } from '@/theme';
import { useLibrary } from '@/store/LibraryContext';
import { useResponsive } from '@/hooks/useResponsive';
import { MoviePoster } from '@/components/MoviePoster';
import { MovieBanner } from '@/components/MovieBanner';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type WatchedFilter = 'all' | 'watched' | 'unwatched';

export function LibraryScreen() {
  const navigation = useNavigation<Nav>();
  const { continueWatching, all, refresh } = useLibrary();
  const { gridColumns } = useResponsive();

  // ใช้ useFocusEffect แทน useEffect ธรรมดา เพราะแท็บใน Bottom Tab Navigator
  // จะไม่ unmount ตอนสลับแท็บ — useEffect ตัวเดียวจะรันแค่ครั้งแรกที่เข้าหน้านี้
  // ทำให้ซื้อหนังจากที่อื่น (เช่นตะกร้า) แล้วสลับมาดูกล่องฟิล์มไม่เห็นข้อมูลใหม่
  // useFocusEffect รันทุกครั้งที่กลับมาโฟกัสแท็บนี้ จึงเห็นของที่เพิ่งซื้อเสมอ
  useFocusEffect(
    useCallback(() => {
      refresh().catch(console.error);
    }, [refresh]),
  );

  // ----- ตัวกรอง: กรองเฉพาะกริด "ทั้งหมดที่เก็บไว้" ไม่แตะแถว "ดูค้างไว้" -----
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [watchedFilter, setWatchedFilter] = useState<WatchedFilter>('all');

  // ตัวเลือกแนวหนังมาจากสิ่งที่ "เก็บไว้จริง" เท่านั้น (ไม่ใช่ทั้งคลัง) เพราะกรอง
  // ในหน้านี้คือกรองของที่เรามีอยู่แล้ว ไม่ใช่เรียกดูคลังทั้งหมดแบบหน้าค้นหา
  const availableGenres = useMemo(
    () => Array.from(new Set(all.map((m) => m.genre))).sort(),
    [all],
  );

  const filtersActive =
    selectedGenres.length > 0 ||
    minPrice.trim() !== '' ||
    maxPrice.trim() !== '' ||
    watchedFilter !== 'all';
  const activeFilterCount =
    selectedGenres.length +
    (minPrice.trim() || maxPrice.trim() ? 1 : 0) +
    (watchedFilter !== 'all' ? 1 : 0);

  const filteredAll = useMemo(() => {
    const min = minPrice.trim() ? Number(minPrice) : undefined;
    const max = maxPrice.trim() ? Number(maxPrice) : undefined;
    return all.filter((m) => {
      if (selectedGenres.length > 0 && !selectedGenres.includes(m.genre)) return false;
      if (Number.isFinite(min) && m.priceTHB < (min as number)) return false;
      if (Number.isFinite(max) && m.priceTHB > (max as number)) return false;
      if (watchedFilter === 'watched' && !m.watched) return false;
      if (watchedFilter === 'unwatched' && m.watched) return false;
      return true;
    });
  }, [all, selectedGenres, minPrice, maxPrice, watchedFilter]);

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  }
  function clearFilters() {
    setSelectedGenres([]);
    setMinPrice('');
    setMaxPrice('');
    setWatchedFilter('all');
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topRow}>
          <Text style={styles.title}>กล่องฟิล์มของฉัน</Text>
          {all.length > 0 && (
            <Pressable
              onPress={() => setShowFilters((v) => !v)}
              style={[styles.filterToggle, filtersActive && styles.filterToggleActive]}
            >
              <Text
                style={[
                  styles.filterToggleText,
                  filtersActive && styles.filterToggleTextActive,
                ]}
              >
                ตัวกรอง{filtersActive ? ` · ${activeFilterCount}` : ''}
              </Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.sub}>
          {filtersActive
            ? `พบ ${filteredAll.length} จาก ${all.length} เรื่อง`
            : `เก็บไว้แล้ว ${all.length} เรื่อง`}
        </Text>

        {showFilters && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterLabel}>สถานะการดู</Text>
            <View style={styles.chipRow}>
              {(
                [
                  { key: 'all', label: 'ทั้งหมด' },
                  { key: 'watched', label: 'ดูแล้ว' },
                  { key: 'unwatched', label: 'ยังไม่ดู' },
                ] as { key: WatchedFilter; label: string }[]
              ).map((opt) => {
                const active = watchedFilter === opt.key;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => setWatchedFilter(opt.key)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.filterLabel, { marginTop: 14 }]}>แนวหนัง</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {availableGenres.map((genre) => {
                const active = selectedGenres.includes(genre);
                return (
                  <Pressable
                    key={genre}
                    onPress={() => toggleGenre(genre)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {genre}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={[styles.filterLabel, { marginTop: 14 }]}>ช่วงราคา (บาท)</Text>
            <View style={styles.priceRow}>
              <TextInput
                value={minPrice}
                onChangeText={setMinPrice}
                placeholder="ต่ำสุด"
                placeholderTextColor={colors.ash2}
                keyboardType="number-pad"
                style={styles.priceInput}
              />
              <Text style={styles.priceDash}>—</Text>
              <TextInput
                value={maxPrice}
                onChangeText={setMaxPrice}
                placeholder="สูงสุด"
                placeholderTextColor={colors.ash2}
                keyboardType="number-pad"
                style={styles.priceInput}
              />
            </View>

            {filtersActive && (
              <Pressable onPress={clearFilters} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>ล้างตัวกรองทั้งหมด</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={filteredAll}
        keyExtractor={(item) => item.id}
        numColumns={gridColumns}
        key={gridColumns} // บังคับ re-layout เมื่อจำนวนคอลัมน์เปลี่ยน (หมุนจอ)
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={styles.gridContent}
        ListHeaderComponent={
          continueWatching.length > 0 && !filtersActive ? (
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.rowTitle}>ดูค้างไว้</Text>
              <FlatList
                horizontal
                data={continueWatching}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 11 }} />}
                renderItem={({ item }) => {
                  const progress = item.progressSeconds / item.durationSeconds;
                  return (
                    <View style={{ width: 150 }}>
                      <View style={styles.cwArt}>
                        <MovieBanner accentColor={item.accentColor} />
                        <View style={styles.cwBarTrack}>
                          <View style={[styles.cwBarFill, { width: `${progress * 100}%` }]} />
                        </View>
                      </View>
                      <Text style={styles.cwTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                    </View>
                  );
                }}
              />
              <Text style={[styles.rowTitle, { marginTop: 20 }]}>ทั้งหมดที่เก็บไว้</Text>
            </View>
          ) : filteredAll.length > 0 ? (
            <Text style={styles.rowTitle}>
              {filtersActive ? 'ผลลัพธ์ตามตัวกรอง' : 'ทั้งหมดที่เก็บไว้'}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.gridItem, { flex: 1 / gridColumns }]}>
            <View style={styles.gridArt}>
              <MoviePoster
                title={item.title}
                genre={item.genre}
                year={item.year}
                accentColor={item.accentColor}
              />
              {item.watched && (
                <View style={styles.checkBadge}>
                  <Text style={{ color: colors.ink, fontSize: 9, fontWeight: '700' }}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.gridTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.gridSub} numberOfLines={1}>
              {item.genre} · {item.country}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {all.length === 0
              ? 'ยังไม่มีหนังในกล่องฟิล์ม — ไปเลือกซื้อเรื่องแรกกันเลย'
              : 'ไม่พบหนังที่เก็บไว้ตามเงื่อนไขที่เลือก'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  top: { paddingHorizontal: 22, paddingTop: 60, paddingBottom: 4 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: fontFamily.display, fontSize: 23, color: colors.stub },
  sub: { fontFamily: fontFamily.body, fontSize: 12, color: colors.ash2, marginTop: 4 },
  filterToggle: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  filterToggleActive: { backgroundColor: colors.marquee, borderColor: colors.marquee },
  filterToggleText: { fontFamily: fontFamily.mono, fontSize: 10.5, color: colors.ash },
  filterToggleTextActive: { color: colors.ink },
  filterPanel: {
    marginTop: 14,
    padding: 14,
    backgroundColor: colors.ink3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  filterLabel: {
    fontFamily: fontFamily.mono,
    fontSize: 9.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.ash2,
    marginBottom: 8,
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  chipActive: { backgroundColor: colors.marquee, borderColor: colors.marquee },
  chipText: { fontFamily: fontFamily.body, fontSize: 12, color: colors.stub },
  chipTextActive: { color: colors.ink, fontFamily: fontFamily.bodyMedium },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  priceInput: {
    flex: 1,
    backgroundColor: colors.ink2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.stub,
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
  },
  priceDash: { color: colors.ash2, fontFamily: fontFamily.mono },
  clearBtn: { alignSelf: 'flex-start', marginTop: 12 },
  clearBtnText: {
    fontFamily: fontFamily.mono,
    fontSize: 10.5,
    color: colors.velvetBright,
    textDecorationLine: 'underline',
  },
  gridContent: { padding: 22, gap: 10 },
  rowTitle: { fontFamily: fontFamily.display, fontSize: 14, color: colors.stub, marginBottom: 12 },
  gridItem: { gap: 6 },
  gridArt: { aspectRatio: 2 / 3, borderRadius: 8, overflow: 'hidden', backgroundColor: colors.ink3 },
  gridTitle: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.caption,
    color: colors.stub,
    lineHeight: 15,
  },
  gridSub: {
    fontFamily: fontFamily.mono,
    fontSize: 8.5,
    color: colors.ash2,
  },
  checkBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.reel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cwArt: { height: 88, borderRadius: 9, overflow: 'hidden', backgroundColor: colors.ink3, marginBottom: 7 },
  cwBarTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(234,224,200,0.2)',
  },
  cwBarFill: { height: '100%', backgroundColor: colors.marquee },
  cwTitle: { fontFamily: fontFamily.bodyMedium, fontSize: 11, color: colors.stub },
  empty: {
    fontFamily: fontFamily.body,
    fontSize: 13,
    color: colors.ash2,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 30,
  },
});
