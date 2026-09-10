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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontFamily, fontSize } from '@/theme';
import { MovieRow } from '@/components/MovieRow';
import { MovieBanner } from '@/components/MovieBanner';
import { PriceTag } from '@/components/PriceTag';
import { CountdownLeader } from '@/components/CountdownLeader';
import { PaymentSheet } from '@/components/PaymentSheet';
import { moviesApi } from '@/api/movies';
import { useLibrary } from '@/store/LibraryContext';
import { useCart } from '@/store/CartContext';
import { useLanguage } from '@/store/LanguageContext';
import {
  localizedTitle,
  localizedDescription,
  localizedGenreList,
  localizedCountry,
  localizedSubtitle,
} from '@/i18n/movieLabels';
import type { RootStackParamList } from '@/navigation/types';
import type { Movie } from '@/api/types';
import type { Language } from '@/i18n/translations';

type Route = RouteProp<RootStackParamList, 'MovieDetail'>;

function formatReleaseDate(iso: string, lang: Language): string {
  const date = new Date(iso);
  return date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'th-TH', {
    day: 'numeric',
    month: 'short',
  });
}

export function MovieDetailScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { isOwned, markPurchased } = useLibrary();
  const { isInCart, addToCart } = useCart();
  const { language, t } = useLanguage();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [purchasing, setPurchasing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

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

  function handlePaymentConfirm() {
    setShowPayment(false);
    handleBuy();
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
  const hasDiscount =
    !owned && typeof movie.originalPriceTHB === 'number' && movie.originalPriceTHB > movie.priceTHB;

  return (
    <>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <MovieBanner accentColor={movie.accentColor} bannerUrl={movie.bannerUrl} />
        <LinearGradient
          colors={['rgba(16,12,9,0)', 'rgba(16,12,9,0.25)', colors.ink]}
          locations={[0, 0.65, 1]}
          style={StyleSheet.absoluteFill}
        />
        <Pressable
          style={[styles.back, { top: insets.top + 14 }]}
          onPress={() => navigation.goBack()}
          hitSlop={8}
        >
          <Text style={{ color: colors.stub, fontSize: 18 }}>‹</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {movie.status === 'suspended' && (
          <View style={styles.suspendedBanner}>
            <Text style={styles.suspendedText}>{t('suspendedBanner')}</Text>
          </View>
        )}

        <View style={styles.genreRow}>
          <Text style={styles.genre}>
            {[
              localizedGenreList(movie.genre, language),
              ...(movie.subGenre.length > 0 ? [localizedGenreList(movie.subGenre, language)] : []),
            ].join(' · ')}{' '}
            · {localizedCountry(movie.country, language)} · {movie.year}
          </Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>{movie.rating}</Text>
          </View>
        </View>
        <Text style={styles.title}>{localizedTitle(movie, language)}</Text>
        <Text style={styles.meta}>
          {movie.runtimeMinutes} {t('minutesShort')} · {localizedSubtitle(movie.subtitleLanguage, language)}
        </Text>
        <Text style={styles.releaseWindow}>
          {t('releasePrefix')} {formatReleaseDate(movie.startRelease, language)} –{' '}
          {formatReleaseDate(movie.endRelease, language)}
        </Text>

        {(movie.voucherEligible || movie.giftVoucherEligible) && (
          <View style={styles.voucherRow}>
            {movie.voucherEligible && (
              <View style={styles.voucherChip}>
                <Text style={styles.voucherChipText}>{t('voucherEligible')}</Text>
              </View>
            )}
            {movie.giftVoucherEligible && (
              <View style={styles.voucherChip}>
                <Text style={styles.voucherChipText}>{t('giftVoucherEligible')}</Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.desc}>{localizedDescription(movie, language)}</Text>

        {purchasing ? (
          <CountdownLeader onComplete={onLeaderComplete} />
        ) : (
          <>
            {hasDiscount && (
              <View style={styles.promoBanner}>
                <Text style={styles.promoBannerText}>
                  {t('promoDiscount', { percent: movie.discountPercent ?? 0 })}
                </Text>
              </View>
            )}
            <View style={styles.stubPanel}>
            <View style={styles.stubRow}>
              <View>
                <Text style={styles.stubLabel}>{t('priceLabel')}</Text>
                {owned ? (
                  <Text style={styles.stubPrice}>{t('ownedAlready')}</Text>
                ) : (
                  <View style={{ marginTop: 2 }}>
                    <PriceTag movie={movie} size="large" />
                  </View>
                )}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.stubLabel}>{t('formatLabel')}</Text>
                <Text style={styles.stubFormat}>{t('formatValue')}</Text>
              </View>
            </View>
            <Pressable
              style={[
                styles.buyBtn,
                owned && { backgroundColor: colors.reel },
                movie.status === 'suspended' && !owned && styles.buyBtnDisabled,
              ]}
              disabled={movie.status === 'suspended' && !owned}
              onPress={
                owned
                  ? () => navigation.navigate('Player' as never, { movieId: movie.id } as never)
                  : () => setShowPayment(true)
              }
            >
              <Text style={styles.buyBtnText}>
                {owned
                  ? t('watchNow')
                  : movie.status === 'suspended'
                    ? t('suspendedBuyDisabled')
                    : `${t('buyTicket')}  ฿${movie.priceTHB}`}
              </Text>
            </Pressable>

            {!owned && (
              <Pressable
                style={styles.cartAltBtn}
                onPress={() => addToCart(movie).catch(console.error)}
              >
                <Text style={styles.cartAltBtnText}>
                  {isInCart(movie.id) ? t('inCartAlready') : t('addToCart')}
                </Text>
              </Pressable>
            )}
          </View>
          </>
        )}

        {similar.length > 0 && (
          <MovieRow
            title={t('similarMovies')}
            movies={similar}
            onSelectMovie={(m) => navigation.navigate('MovieDetail' as never, { movieId: m.id } as never)}
          />
        )}
      </View>
    </ScrollView>

    <PaymentSheet
      visible={showPayment}
      amount={movie.priceTHB}
      onClose={() => setShowPayment(false)}
      onConfirm={handlePaymentConfirm}
    />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  loading: { flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  hero: { height: 320 },
  back: {
    position: 'absolute',
    left: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(16,12,9,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  body: { padding: 22, paddingTop: 12 },
  suspendedBanner: {
    backgroundColor: 'rgba(122,46,55,0.25)',
    borderWidth: 1,
    borderColor: colors.velvetBright,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  suspendedText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.caption,
    color: colors.velvetBright,
  },
  genreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  genre: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.eyebrow,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.marquee,
  },
  ratingBadge: {
    borderWidth: 1,
    borderColor: colors.ash2,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingBadgeText: {
    fontFamily: fontFamily.mono,
    fontSize: 9.5,
    color: colors.ash,
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
    marginBottom: 4,
  },
  releaseWindow: {
    fontFamily: fontFamily.mono,
    fontSize: 10.5,
    color: colors.ash2,
    marginBottom: 12,
  },
  voucherRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  voucherChip: {
    backgroundColor: 'rgba(217,164,65,0.12)',
    borderWidth: 1,
    borderColor: colors.marqueeDim,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  voucherChipText: {
    fontFamily: fontFamily.mono,
    fontSize: 9.5,
    color: colors.marquee,
  },
  desc: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    lineHeight: 22,
    color: colors.ash,
    marginBottom: 20,
  },
  promoBanner: {
    alignSelf: 'flex-start',
    backgroundColor: colors.velvet,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  promoBannerText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: fontSize.caption,
    color: colors.stub,
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
  buyBtnDisabled: {
    backgroundColor: colors.ink2,
    opacity: 0.6,
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
