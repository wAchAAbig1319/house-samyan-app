import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, fontFamily, fontSize } from '@/theme';
import { MovieCard } from './MovieCard';
import { useResponsive } from '@/hooks/useResponsive';
import { useLibrary } from '@/store/LibraryContext';
import { useCart } from '@/store/CartContext';
import type { Movie } from '@/api/types';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export function MovieRow({ title, movies, onSelectMovie }: MovieRowProps) {
  const { posterWidth } = useResponsive();
  const { isOwned } = useLibrary();
  const { isInCart, addToCart } = useCart();

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.more}>ดูทั้งหมด</Text>
      </View>
      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 11 }} />}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            owned={isOwned(item.id)}
            inCart={isInCart(item.id)}
            width={posterWidth}
            onPress={onSelectMovie}
            onAddToCart={(movie) => addToCart(movie).catch(console.error)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 22 },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 22,
    marginBottom: 12,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.title,
    color: colors.stub,
  },
  more: {
    fontFamily: fontFamily.mono,
    fontSize: 9.5,
    color: colors.ash2,
    textTransform: 'uppercase',
  },
  listContent: { paddingHorizontal: 22 },
});
