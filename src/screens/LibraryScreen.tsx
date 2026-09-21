import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, fontFamily, fontSize } from '@/theme';
import { useLibrary } from '@/store/LibraryContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useLanguage } from '@/store/LanguageContext';
import { localizedTitle, localizedGenreTag, localizedGenreList, localizedCountry } from '@/i18n/movieLabels';
import { MoviePoster } from '@/components/MoviePoster';
import { MovieBanner } from '@/components/MovieBanner';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type WatchedFilter = 'all' | 'watched' | 'unwatched';

export function LibraryScreen() {
  const navigation = useNavigation<Nav>();
  const { continueWatching, all, refresh } = useLibrary();
  const { gridColumns } = useResponsive();
  const { language, t } = useLanguage();

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
  const [selectedSubGenres, setSelectedSubGenres] = useState<string[]>([]);
  const [watchedFilter, setWatchedFilter] = useState<WatchedFilter>('all');

  // ตัวเลือกแนวหนังมาจากสิ่งที่ "เก็บไว้จริง" เท่านั้น (ไม่ใช่ทั้งคลัง) เพราะกรอง
  // ในหน้านี้คือกรองของที่เรามีอยู่แล้ว ไม่ใช่เรียกดูคลังทั้งหมดแบบหน้าค้นหา
  // หนังแต่ละเรื่องมีได้สูงสุด 2 genre/subGenre เลย flatMap ก่อนหา unique ค่า
  const availableGenres = useMemo(
    () => Array.from(new Set(all.flatMap((m) => m.genre))).sort(),
    [all],
  );
  const availableSubGenres = useMemo(
    () => Array.from(new Set(all.flatMap((m) => m.subGenre))).sort(),
    [all],
  );

  const filtersActive =
    selectedGenres.length > 0 || selectedSubGenres.length > 0 || watchedFilter !== 'all';
  const activeFilterCount =
    selectedGenres.length + selectedSubGenres.length + (watchedFilter !== 'all' ? 1 : 0);

  const filteredAll = useMemo(() => {
    return all.filter((m) => {
      // เลือกไว้หลาย genre ได้ — ผ่านตัวกรองถ้าเรื่องนี้มี genre ตรงกับที่เลือก
      // "อย่างน้อยหนึ่ง" อัน (ไม่ใช่ต้องตรงครบทุกอันที่เลือก)
      if (selectedGenres.length > 0 && !selectedGenres.some((g) => m.genre.includes(g))) {
        return false;
      }
      if (
        selectedSubGenres.length > 0 &&
        !selectedSubGenres.some((g) => m.subGenre.includes(g))
      ) {
        return false;
      }
      if (watchedFilter === 'watched' && !m.watched) return false;
      if (watchedFilter === 'unwatched' && m.watched) return false;
      return true;
    });
  }, [all, selectedGenres, selectedSubGenres, watchedFilter]);

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  }
  function toggleSubGenre(subGenre: string) {
    setSelectedSubGenres((prev) =>
      prev.includes(subGenre) ? prev.filter((g) => g !== subGenre) : [...prev, subGenre],
    );
  }
  function clearFilters() {
    setSelectedGenres([]);
    setSelectedSubGenres([]);
    setWatchedFilter('all');
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{t('libraryTitle')}</Text>
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
                {t('filters')}{filtersActive ? ` · ${activeFilterCount}` : ''}
              </Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.sub}>
          {filtersActive
            ? t('libraryFilteredCount', { count: filteredAll.length, total: all.length })
            : t('libraryCountSuffix', { count: all.length })}
        </Text>

        {showFilters && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterLabel}>{t('watchStatusLabel')}</Text>
            <View style={styles.chipRow}>
              {(
                [
                  { key: 'all', label: t('watchStatusAll') },
                  { key: 'watched', label: t('watchStatusWatched') },
                  { key: 'unwatched', label: t('watchStatusUnwatched') },
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

            <Text style={[styles.filterLabel, { marginTop: 14 }]}>{t('genreLabel')}</Text>
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
                      {localizedGenreTag(genre, language)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {availableSubGenres.length > 0 && (
              <>
                <Text style={[styles.filterLabel, { marginTop: 14 }]}>{t('subGenreLabel')}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipRow}
                >
                  {availableSubGenres.map((subGenre) => {
                    const active = selectedSubGenres.includes(subGenre);
                    return (
                      <Pressable
                        key={subGenre}
                        onPress={() => toggleSubGenre(subGenre)}
                        style={[styles.chip, active && styles.chipActive]}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                          {localizedGenreTag(subGenre, language)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </>
            )}

            {filtersActive && (
              <Pressable onPress={clearFilters} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>{t('clearFilters')}</Text>
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
              <Text style={styles.rowTitle}>{t('continueWatching')}</Text>
              <FlatList
                horizontal
                data={continueWatching}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 11 }} />}
                renderItem={({ item }) => {
                  const progress = item.progressSeconds / item.durationSeconds;
                  return (
                    <Pressable
                      style={{ width: 150 }}
                      onPress={() => navigation.navigate('Player', { movieId: item.id })}
                    >
                      <View style={styles.cwArt}>
                        <MovieBanner accentColor={item.accentColor} bannerUrl={item.bannerUrl} />
                        <View style={styles.cwBarTrack}>
                          <View style={[styles.cwBarFill, { width: `${progress * 100}%` }]} />
                        </View>
                      </View>
                      <Text style={styles.cwTitle} numberOfLines={1}>
                        {localizedTitle(item, language)}
                      </Text>
                    </Pressable>
                  );
                }}
              />
              <Text style={[styles.rowTitle, { marginTop: 20 }]}>{t('allSaved')}</Text>
            </View>
          ) : filteredAll.length > 0 ? (
            <Text style={styles.rowTitle}>
              {filtersActive ? t('filteredResults') : t('allSaved')}
            </Text>
          ) : null
        }
        renderItem={({ item }) => {
          const inProgress = !item.watched && item.progressSeconds > 0;
          const gridProgress = inProgress ? item.progressSeconds / item.durationSeconds : 0;
          return (
            <Pressable
              style={[styles.gridItem, { flex: 1 / gridColumns }]}
              onPress={() => navigation.navigate('Player', { movieId: item.id })}
            >
              <View style={styles.gridArt}>
                <MoviePoster
                  title={localizedTitle(item, language)}
                  genre={localizedGenreList(item.genre, language)}
                  year={item.year}
                  accentColor={item.accentColor}
                  posterUrl={item.posterUrl}
                />
                {item.watched && (
                  <View style={styles.checkBadge}>
                    <Text style={{ color: colors.ink, fontSize: 9, fontWeight: '700' }}>✓</Text>
                  </View>
                )}
                {inProgress && (
                  <View style={styles.cwBarTrack}>
                    <View style={[styles.cwBarFill, { width: `${gridProgress * 100}%` }]} />
                  </View>
                )}
              </View>
              <Text style={styles.gridTitle} numberOfLines={2}>
                {localizedTitle(item, language)}
              </Text>
              <Text style={styles.gridSub} numberOfLines={1}>
                {localizedGenreList(item.genre, language)} · {localizedCountry(item.country, language)}
              </Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {all.length === 0 ? t('libraryEmpty') : t('libraryEmptyFiltered')}
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
