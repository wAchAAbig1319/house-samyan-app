import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '@/theme';
import { HeroBanner } from '@/components/HeroBanner';
import { MovieRow } from '@/components/MovieRow';
import { CartFAB } from '@/components/CartFAB';
import { HomeTopBar } from '@/components/HomeTopBar';
import { moviesApi } from '@/api/movies';
import { useLibrary } from '@/store/LibraryContext';
import { useLanguage } from '@/store/LanguageContext';
import type { RootStackParamList } from '@/navigation/types';
import type { Movie } from '@/api/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { isOwned, refresh } = useLibrary();
  const { language } = useLanguage();
  const [feed, setFeed] = useState<{
    hero: Movie;
    rows: { title: string; titleEn: string; movies: Movie[] }[];
  } | null>(null);

  useEffect(() => {
    moviesApi.getHomeFeed().then(setFeed).catch(console.error);
    refresh().catch(console.error);
  }, [refresh]);

  function openMovie(movie: Movie) {
    navigation.navigate('MovieDetail', { movieId: movie.id });
  }

  if (!feed) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.marquee} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HomeTopBar />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <HeroBanner
          movie={feed.hero}
          owned={isOwned(feed.hero.id)}
          onPlay={() =>
            isOwned(feed.hero.id)
              ? navigation.navigate('Player', { movieId: feed.hero.id })
              : openMovie(feed.hero)
          }
          onBuy={() => openMovie(feed.hero)}
        />
        {feed.rows.map((row) => (
          <MovieRow
            key={row.title}
            title={language === 'en' ? row.titleEn : row.title}
            movies={row.movies}
            onSelectMovie={openMovie}
          />
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
      <CartFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  container: { flex: 1 },
  loading: { flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
});
