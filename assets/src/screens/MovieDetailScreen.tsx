import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { colors, fontFamily, fontSize } from '@/theme';
import { MovieRow } from '@/components/MovieRow';
import { MovieBanner } from '@/components/MovieBanner';
import { CountdownLeader } from '@/components/CountdownLeader';
import { moviesApi } from '@/api/movies';
import { useLibrary } from '@/store/LibraryContext';
import { useCart } from '@/store/CartContext';
import type { RootStackParamList } from '@/navigation/types';
import type { Movie } from '@/api/types';

type Route = RouteProp<RootStackParamList, 'MovieDetail'>;

export function MovieDetailScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const { isOwned, markPurchased } = useLibrary();
  const { isInCart, addToCart } = useCart();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    moviesApi.getMovie(params.movieId).then(setMovie).catch(console.error);
    moviesApi.getSimilar(params.movieId).then(setSimilar).catch(console.error);
  }, [params.movieId]);

  async function handleBuy() {
    if (!movie) return;
    setPurchasing(true);
    try {
      await moviesApi.purchase(movie.id);
    } catch (err) {
      console.error(err);
      setPurchasing(false);
    }
  }

  function onLeaderComplete() {
    if (!movie) return;
    markPurchased(movie.id);
    setPurchasing(false);
  }

  if (!movie) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.marquee} />
      </View>
    );
  }

  const owned = isOwned(movie.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <MovieBanner accentColor={movie.accentColor} />
        <LinearGradient
          colors={['rgba(16,12,9,0)', 'rgba(16,12,9,0.25)', colors.ink]}
          locations={[0, 0.65, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.stub, fontSize: 18 }}>‹</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.genre}>
          {movie.genre} · {movie.country} · {movie.year}
        </Text>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.meta}>
          {movie.runtimeMinutes} นาที · เสียงต้นฉบับ+ซับไทย
        </Text>
        <Text style={styles.desc}>{movie.synopsis}</Text>

        {purchasing ? (
          <CountdownLeader onComplete={onLeaderComplete} />
        ) : (
          <View style={styles.stubPanel}>
            <View style={styles.stubRow}>
              <View>
                <Text style={styles.stubLabel}>ราคาซื้อขาด</Text>
                <Text style={styles.stubPrice}>
                  {owned ? 'เป็นของคุณแล้ว' : `฿${movie.priceTHB}`}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.stubLabel}>รูปแบบ</Text>
                <Text style={styles.stubFormat}>HD · ดาวน์โหลดได้</Text>
              </View>
            </View>
            <Pressable
              style={[styles.buyBtn, owned && { backgroundColor: colors.reel }]}
              onPress={owned ? () => {} : handleBuy}
            >
              <Text style={styles.buyBtnText}>
                {owned ? 'ดูเลย' : `ซื้อตั๋วเรื่องนี้  ฿${movie.priceTHB}`}
              </Text>
            </Pressable>

            {!owned && (
              <Pressable
                style={styles.cartAltBtn}
                onPress={() => addToCart(movie).catch(console.error)}
              >
                <Text style={styles.cartAltBtnText}>
                  {isInCart(movie.id) ? '✓ อยู่ในตะกร้าแล้ว' : '+ ใส่ตะกร้าไว้ก่อน'}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {similar.length > 0 && (
          <MovieRow
            title="เรื่องที่คล้ายกัน"
            movies={similar}
            onSelectMovie={(m) => navigation.navigate('MovieDetail' as never, { movieId: m.id } as never)}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  loading: { flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  hero: { height: 320 },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16,12,9,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 22, paddingTop: 12 },
  genre: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.eyebrow,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.marquee,
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamily.displayItalic,
    fontSize: fontSize.detailTitle,
    color: colors.stub,
    marginBottom: 10,
  },
  meta: {
    fontFamily: fontFamily.mono,
    fontSize: 10.5,
    color: colors.ash,
    marginBottom: 16,
  },
  desc: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    lineHeight: 22,
    color: colors.ash,
    marginBottom: 20,
  },
  stubPanel: {
    backgroundColor: colors.ink3,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  stubRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  stubLabel: {
    fontFamily: fontFamily.mono,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.ash2,
  },
  stubPrice: {
    fontFamily: fontFamily.display,
    fontSize: 19,
    color: colors.stub,
    marginTop: 2,
  },
  stubFormat: {
    fontFamily: fontFamily.mono,
    fontSize: 12,
    color: colors.stub,
    marginTop: 2,
  },
  buyBtn: {
    backgroundColor: colors.velvet,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyBtnText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.body,
    color: colors.stub,
  },
  cartAltBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  cartAltBtnText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.body,
    color: colors.ash,
  },
});
