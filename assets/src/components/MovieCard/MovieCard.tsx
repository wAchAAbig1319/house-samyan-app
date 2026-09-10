import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fontFamily, fontSize } from '@/theme';
import { MoviePoster } from '@/components/MoviePoster';
import type { MovieCardProps } from './MovieCard.types';

// เวอร์ชันมือถือ/แท็บเล็ต — ควบคุมด้วยการแตะจอ (touch)
export function MovieCard({ movie, owned, inCart, width, onPress, onAddToCart }: MovieCardProps) {
  return (
    <Pressable
      onPress={() => onPress(movie)}
      style={({ pressed }) => [
        styles.container,
        { width, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <View style={[styles.art, { width, height: width * 1.44 }]}>
        <MoviePoster
          title={movie.title}
          genre={movie.genre}
          year={movie.year}
          accentColor={movie.accentColor}
        />
        {owned ? (
          <View style={styles.badgeOwned}>
            <Text style={styles.badgeOwnedText}>เก็บแล้ว</Text>
          </View>
        ) : (
          <>
            <View style={styles.badgePrice}>
              <Text style={styles.badgePriceText}>฿{movie.priceTHB}</Text>
            </View>
            {/* ปุ่มหยิบใส่ตะกร้าด่วน แบบเดียวกับ Shopee — กดแล้วไม่ต้องเข้าหน้ารายละเอียด */}
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onAddToCart(movie);
              }}
              style={[styles.cartBtn, inCart && styles.cartBtnActive]}
              hitSlop={8}
            >
              <Text style={styles.cartBtnText}>{inCart ? '✓' : '+'}</Text>
            </Pressable>
          </>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={styles.sub} numberOfLines={1}>
        {movie.genre} · {movie.country}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { gap: 7 },
  art: {
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: colors.ink3,
  },
  badgeOwned: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.reel,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  badgeOwnedText: {
    fontFamily: fontFamily.mono,
    fontSize: 7.5,
    color: colors.ink,
  },
  badgePrice: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(16,12,9,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  badgePriceText: {
    fontFamily: fontFamily.mono,
    fontSize: 8.5,
    color: colors.marquee,
  },
  title: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.caption,
    color: colors.stub,
  },
  sub: {
    fontFamily: fontFamily.mono,
    fontSize: 8.5,
    color: colors.ash2,
  },
  cartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.velvet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtnActive: {
    backgroundColor: colors.reel,
  },
  cartBtnText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 13,
    color: colors.stub,
    lineHeight: 15,
  },
});
