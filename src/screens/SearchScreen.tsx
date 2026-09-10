import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, fontFamily, fontSize } from '@/theme';
import { moviesApi } from '@/api/movies';
import { CartFAB } from '@/components/CartFAB';
import { MoviePoster } from '@/components/MoviePoster';
import { useLanguage } from '@/store/LanguageContext';
import { localizedTitle, localizedGenreTag, localizedGenreList, localizedCountry } from '@/i18n/movieLabels';
import type { RootStackParamList } from '@/navigation/types';
import type { Movie } from '@/api/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// ค้นหา + กรองในคลัง mock data ทั้งหมด (ชื่อเรื่อง / แนวหนัง / ประเทศ / ช่วงราคา)
// ดู moviesApi.searchAdvanced, moviesApi.getGenres, moviesApi.getPriceBounds
export function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const { language, t } = useLanguage();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [searched, setSearched] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [allSubGenres, setAllSubGenres] = useState<string[]>([]);
  const [selectedSubGenres, setSelectedSubGenres] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // โหลดรายชื่อแนวหนัง/แนวย่อยทั้งหมดมาแสดงเป็น chip ตอนเปิดหน้าครั้งแรก
  useEffect(() => {
    moviesApi.getGenres().then(setAllGenres).catch(console.error);
    moviesApi.getSubGenres().then(setAllSubGenres).catch(console.error);
  }, []);

  const filtersActive =
    selectedGenres.length > 0 ||
    selectedSubGenres.length > 0 ||
    minPrice.trim() !== '' ||
    maxPrice.trim() !== '';

  useEffect(() => {
    const hasQuery = query.trim().length > 0;
    if (!hasQuery && !filtersActive) {
      setResults([]);
      setSearched(false);
      return;
    }
    let cancelled = false;
    setSearched(true);
    const min = minPrice.trim() ? Number(minPrice) : undefined;
    const max = maxPrice.trim() ? Number(maxPrice) : undefined;
    moviesApi
      .searchAdvanced({
        query,
        genres: selectedGenres,
        subGenres: selectedSubGenres,
        minPrice: Number.isFinite(min) ? min : undefined,
        maxPrice: Number.isFinite(max) ? max : undefined,
      })
      .then((res) => {
        if (!cancelled) setResults(res);
      });
    return () => {
      cancelled = true;
    };
  }, [query, selectedGenres, selectedSubGenres, minPrice, maxPrice]);

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
    setMinPrice('');
    setMaxPrice('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{t('searchTitle')}</Text>
        <Pressable
          onPress={() => setShowFilters((v) => !v)}
          style={[styles.filterToggle, filtersActive && styles.filterToggleActive]}
        >
          <Text
            style={[styles.filterToggleText, filtersActive && styles.filterToggleTextActive]}
          >
            {t('filters')}{filtersActive ? ` · ${selectedGenres.length + selectedSubGenres.length + (minPrice || maxPrice ? 1 : 0)}` : ''}
          </Text>
        </Pressable>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('searchPlaceholder')}
        placeholderTextColor={colors.ash2}
        style={styles.input}
      />

      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterLabel}>{t('genreLabel')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {allGenres.map((genre) => {
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

          {allSubGenres.length > 0 && (
            <>
              <Text style={[styles.filterLabel, { marginTop: 14 }]}>{t('subGenreLabel')}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {allSubGenres.map((subGenre) => {
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

          <Text style={[styles.filterLabel, { marginTop: 14 }]}>{t('priceRangeLabel')}</Text>
          <View style={styles.priceRow}>
            <TextInput
              value={minPrice}
              onChangeText={setMinPrice}
              placeholder={t('priceMin')}
              placeholderTextColor={colors.ash2}
              keyboardType="number-pad"
              style={[styles.input, styles.priceInput]}
            />
            <Text style={styles.priceDash}>—</Text>
            <TextInput
              value={maxPrice}
              onChangeText={setMaxPrice}
              placeholder={t('priceMax')}
              placeholderTextColor={colors.ash2}
              keyboardType="number-pad"
              style={[styles.input, styles.priceInput]}
            />
          </View>

          {filtersActive && (
            <Pressable onPress={clearFilters} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>{t('clearFilters')}</Text>
            </Pressable>
          )}
        </View>
      )}

      {!searched && (
        <Text style={styles.hint}>{t('searchHintIdle')}</Text>
      )}
      {searched && results.length === 0 && (
        <Text style={styles.hint}>{t('searchHintEmpty')}</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 18, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('MovieDetail', { movieId: item.id })}
          >
            <View style={styles.art}>
              <MoviePoster
                title={localizedTitle(item, language)}
                genre={localizedGenreList(item.genre, language)}
                year={item.year}
                accentColor={item.accentColor}
                posterUrl={item.posterUrl}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {localizedTitle(item, language)}
              </Text>
              <Text style={styles.rowSub}>
                {localizedGenreList(item.genre, language)} · {localizedCountry(item.country, language)} · {item.year}
              </Text>
              <Text style={styles.rowPrice}>฿{item.priceTHB}</Text>
            </View>
          </Pressable>
        )}
      />

      <CartFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink, padding: 22, paddingTop: 60 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontFamily: fontFamily.display, fontSize: 23, color: colors.stub },
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
  input: {
    backgroundColor: colors.ink2,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.stub,
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
  },
  filterPanel: {
    marginTop: 16,
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
  chipRow: { gap: 8, paddingRight: 8 },
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
  priceInput: { flex: 1, paddingVertical: 10 },
  priceDash: { color: colors.ash2, fontFamily: fontFamily.mono },
  clearBtn: { alignSelf: 'flex-start', marginTop: 12 },
  clearBtnText: {
    fontFamily: fontFamily.mono,
    fontSize: 10.5,
    color: colors.velvetBright,
    textDecorationLine: 'underline',
  },
  hint: {
    fontFamily: fontFamily.mono,
    fontSize: 11,
    color: colors.ash2,
    textAlign: 'center',
    marginTop: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  art: { width: 44, height: 64, borderRadius: 6, overflow: 'hidden', backgroundColor: colors.ink3 },
  rowTitle: { fontFamily: fontFamily.bodyMedium, fontSize: fontSize.body, color: colors.stub },
  rowSub: { fontFamily: fontFamily.mono, fontSize: 9.5, color: colors.ash2, marginTop: 3 },
  rowPrice: { fontFamily: fontFamily.mono, fontSize: 10.5, color: colors.marquee, marginTop: 3 },
});
