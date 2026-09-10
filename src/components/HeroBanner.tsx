import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, fontSize } from '@/theme';
import { MovieBanner } from '@/components/MovieBanner';
import { useLanguage } from '@/store/LanguageContext';
import { localizedTitle, localizedGenreList, localizedCountry } from '@/i18n/movieLabels';
import type { Movie } from '@/api/types';

interface HeroBannerProps {
  movie: Movie;
  owned: boolean;
  onPlay: () => void;
  onBuy: () => void;
}

export function HeroBanner({ movie, owned, onPlay, onBuy }: HeroBannerProps) {
  const { language, t } = useLanguage();
  return (
    <View style={styles.container}>
      <MovieBanner accentColor={movie.accentColor} bannerUrl={movie.bannerUrl} />
      <LinearGradient
        colors={['rgba(16,12,9,0)', 'rgba(16,12,9,0.2)', colors.ink]}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{t('homeHeroEyebrow')}</Text>
        <Text style={styles.title}>{localizedTitle(movie, language)}</Text>
        <Text style={styles.meta}>
          {localizedGenreList(movie.genre, language)}  ·  {movie.runtimeMinutes} {t('minutesShort')}  ·  {localizedCountry(movie.country, language)}
        </Text>
        <View style={styles.ctaRow}>
          {movie.trailerUrl && (
            <Pressable style={[styles.btn, styles.btnPlay]} onPress={onPlay}>
              <Text style={styles.btnPlayText}>{t('watchTrailer')}</Text>
            </Pressable>
          )}
          <Pressable style={[styles.btn, styles.btnBuy]} onPress={owned ? onPlay : onBuy}>
            <Text style={styles.btnBuyText}>
              {owned ? t('watchNow') : `${t('buyShort')} ฿${movie.priceTHB}`}
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
