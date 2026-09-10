import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, fontSize } from '@/theme';
import { MovieBanner } from '@/components/MovieBanner';
import type { Movie } from '@/api/types';

interface HeroBannerProps {
  movie: Movie;
  owned: boolean;
  onPlay: () => void;
  onBuy: () => void;
}

export function HeroBanner({ movie, owned, onPlay, onBuy }: HeroBannerProps) {
  return (
    <View style={styles.container}>
      <MovieBanner accentColor={movie.accentColor} />
      <LinearGradient
        colors={['rgba(16,12,9,0)', 'rgba(16,12,9,0.2)', colors.ink]}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>✦ ฉายจำกัดสัปดาห์นี้</Text>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.meta}>
          {movie.genre}  ·  {movie.runtimeMinutes} นาที  ·  {movie.country}
        </Text>
        <View style={styles.ctaRow}>
          {movie.trailerUrl && (
            <Pressable style={[styles.btn, styles.btnPlay]} onPress={onPlay}>
              <Text style={styles.btnPlayText}>▶ ดูตัวอย่าง</Text>
            </Pressable>
          )}
          <Pressable style={[styles.btn, styles.btnBuy]} onPress={onBuy}>
            <Text style={styles.btnBuyText}>
              {owned ? 'ดูเลย' : `ซื้อ ฿${movie.priceTHB}`}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 420, justifyContent: 'flex-end' },
  content: { padding: 22, gap: 10 },
  eyebrow: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.eyebrow,
    letterSpacing: 1.5,
    color: colors.marquee,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fontFamily.displayItalic,
    fontSize: fontSize.heroTitle,
    color: colors.stub,
    maxWidth: 280,
  },
  meta: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.caption,
    color: colors.ash,
  },
  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  btn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPlay: { backgroundColor: colors.stub },
  btnPlayText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.body,
    color: colors.ink,
  },
  btnBuy: { backgroundColor: 'rgba(234,224,200,0.14)' },
  btnBuyText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.body,
    color: colors.stub,
  },
});
