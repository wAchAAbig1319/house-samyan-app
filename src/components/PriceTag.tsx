import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontFamily } from '@/theme';
import type { Movie } from '@/api/types';

interface PriceTagProps {
  movie: Pick<Movie, 'priceTHB' | 'originalPriceTHB' | 'discountPercent'>;
  size?: 'small' | 'large';
}

// โชว์ราคาแบบมีโปรโมชั่น: ราคาเต็มขีดฆ่า + ราคาใหม่ + ป้าย "-20%"
// ถ้าหนังเรื่องนั้นไม่มี originalPriceTHB ก็โชว์แค่ราคาปกติเฉยๆ
export function PriceTag({ movie, size = 'large' }: PriceTagProps) {
  const hasDiscount =
    typeof movie.originalPriceTHB === 'number' && movie.originalPriceTHB > movie.priceTHB;

  if (!hasDiscount) {
    return (
      <Text style={size === 'large' ? styles.priceLarge : styles.priceSmall}>
        ฿{movie.priceTHB}
      </Text>
    );
  }

  return (
    <View style={styles.row}>
      <View style={size === 'large' ? styles.stack : styles.rowInline}>
        <Text style={size === 'large' ? styles.originalLarge : styles.originalSmall}>
          ฿{movie.originalPriceTHB}
        </Text>
        <Text style={size === 'large' ? styles.priceLarge : styles.priceSmall}>
          ฿{movie.priceTHB}
        </Text>
      </View>
      {typeof movie.discountPercent === 'number' && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgeText}>-{movie.discountPercent}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stack: { gap: 1 },
  rowInline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  originalLarge: {
    fontFamily: fontFamily.mono,
    fontSize: 12,
    color: colors.ash2,
    textDecorationLine: 'line-through',
  },
  originalSmall: {
    fontFamily: fontFamily.mono,
    fontSize: 8.5,
    color: colors.ash2,
    textDecorationLine: 'line-through',
  },
  priceLarge: {
    fontFamily: fontFamily.display,
    fontSize: 19,
    color: colors.stub,
  },
  priceSmall: {
    fontFamily: fontFamily.mono,
    fontSize: 8.5,
    color: colors.marquee,
  },
  discountBadge: {
    backgroundColor: colors.velvet,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountBadgeText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 10,
    color: colors.stub,
  },
});
